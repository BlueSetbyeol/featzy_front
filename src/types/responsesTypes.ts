export type listResponse<T> = {
  message: string;
  success: boolean;
  data: {
    data: T[];
  };
};

export type uniqueResponse<T> = {
  message: string;
  success: boolean;
  data: T;
};
