import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { LoginProvider } from "./context/UserContext.tsx";
import { GeoProvider } from "./context/GeoContext.tsx";
import { Toaster } from "sonner";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";

import Loading from "./pages/front-office/Loading.tsx";
import App from "./App.tsx";
import Welcome from "./pages/front-office/Welcome.tsx";
import Reservation from "./pages/front-office/Reservation.tsx";
import ReservationDetails from "./pages/front-office/ReservationDetails.tsx";
import Login from "./pages/auth/Login.tsx";
import LoginRecovery from "./pages/auth/LoginRecovery.tsx";
import EmailVerified from "./pages/auth/EmailVerified.tsx";
import Profile from "./pages/front-office/Profile.tsx";
import ProfileOverview from "./components/profile/ProfileOverview.tsx";
import ProfileContacts from "./components/profile/ProfileContacts.tsx";
import ProfileDietaryPreferences from "./components/profile/ProfileDietaryPreferences.tsx";
import ProfileFavorites from "./components/profile/ProfileFavorites.tsx";
import ProfilePaymentMethod from "./components/profile/ProfilePaymentMethod.tsx";
import ProfileInformations from "./components/profile/ProfileInformations.tsx";
import ProfileOffers from "./components/profile/ProfilOffers.tsx";
import ProfileNotifications from "./components/profile/ProfileNotifications.tsx";
import ProfileLegals from "./components/profile/ProfileLegals.tsx";
import ProfileSupport from "./components/profile/ProfileSupport.tsx";
import GlobalRestaurantMap from "./pages/front-office/GlobalRestaurantMap.tsx";
import RestaurantList from "./pages/front-office/RestaurantList.tsx";
import NewReservation from "./pages/front-office/NewReservation.tsx";
import EarlyCommand from "./pages/front-office/EarlyCommand.tsx";
import NewReservationConfirmation from "./pages/front-office/NewReservationConfirmation.tsx";
import GuestInvitationConfirmation from "./pages/front-office/GuestInvitationComfirmation.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/welcome",
    element: <Loading />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/reset-password",
    element: <LoginRecovery />,
  },
  {
    path: "/email/verified",
    element: <EmailVerified />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Welcome />,
      },
      {
        path: "/restaurants",
        element: <RestaurantList />,
      },
      {
        path: "/map",
        element: <GlobalRestaurantMap />,
      },
      {
        path: "/my-reservation",
        element: <Reservation />,
      },
      {
        path: "/my-reservation/:id",
        element: <ReservationDetails />,
      },
      {
        path: "/profil",
        element: <Profile />,
        children: [
          { index: true, element: <ProfileOverview /> },
          { path: "contacts", element: <ProfileContacts /> },
          { path: "payment-method", element: <ProfilePaymentMethod /> },
          { path: "favorites", element: <ProfileFavorites /> },
          { path: "informations", element: <ProfileInformations /> },
          { path: "diet", element: <ProfileDietaryPreferences /> },
          { path: "offers", element: <ProfileOffers /> },
          { path: "notifications", element: <ProfileNotifications /> },
          { path: "support", element: <ProfileSupport /> },
          { path: "legals", element: <ProfileLegals /> },
        ],
      },
      {
        path: "/restaurant/:id/new-reservation",
        element: <NewReservation />,
      },
      {
        path: "/restaurant/:id/new-reservation-confirmation",
        element: <NewReservationConfirmation />,
      },
      {
        path: "/command/:id/early-command",
        element: <EarlyCommand />,
      },
      {
        path: "/command/:id/guest-confirmation",
        element: <GuestInvitationConfirmation />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}

createRoot(rootElement).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <QueryClientProvider client={queryClient}>
        <LoginProvider>
          <GeoProvider>
            <RouterProvider router={router} />
            <Toaster position="top-right" />
          </GeoProvider>
        </LoginProvider>
      </QueryClientProvider>
    </Auth0Provider>
  </StrictMode>,
);
