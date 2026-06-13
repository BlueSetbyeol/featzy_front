import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

declare module "axios" {
  export interface AxiosRequestConfig {
    /** Désactive la redirection automatique vers /login sur 401 (ex. bootstrap de session) */
    skipAuthRedirect?: boolean;
  }
}

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true, // required for Sanctum session cookies
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/**
 * Fetch the Sanctum CSRF cookie before any state-mutating request.
 * Call this once before login/register.
 */
export async function initCsrf(): Promise<void> {
  await axios.get(`${import.meta.env.VITE_API_URL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
}

// Attaches CSRF token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get("XSRF-TOKEN");
  if (token) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
  }
  return config;
});

// Session expired or not authenticated — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      !error.config?.skipAuthRedirect &&
      window.location.pathname !== "/login"
    ) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

type LaravelErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
  code?: string;
};

export type ApiError = {
  status: number | null;
  message: string;
  errors: Record<string, string[]>;
  code: string | null;
};

/** Extrait le message et les erreurs de validation d'une réponse d'erreur Laravel */
export function extractApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const body = (error.response?.data ?? {}) as LaravelErrorBody;
    return {
      status: error.response?.status ?? null,
      message: body.message ?? "Une erreur est survenue. Réessaie plus tard.",
      errors: body.errors ?? {},
      code: body.code ?? null,
    };
  }
  return {
    status: null,
    message: "Une erreur est survenue. Réessaie plus tard.",
    errors: {},
    code: null,
  };
}

export default api;
