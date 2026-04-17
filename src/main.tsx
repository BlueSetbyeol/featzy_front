import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import { LoginProvider } from "./context/UserContext.tsx";
import "./index.css";

import Loading from "./pages/front-office/Loading.tsx";
import App from "./App.tsx";
import Welcome from "./pages/front-office/Welcome.tsx";
import Reservation from "./pages/front-office/Reservation.tsx";
import Profile from "./pages/front-office/Profile.tsx";
import ProfileOverview from "./components/profile/ProfileOverview.tsx";
import ProfileSettings from "./components/profile/ProfileSettings.tsx";
import ProfileContacts from "./components/profile/ProfileContacts.tsx";
import ProfileDietaryPreferences from "./components/profile/ProfileDietaryPreferences.tsx";
import ProfileFavorites from "./components/profile/ProfileFavorites.tsx";
import Restaurant from "./pages/front-office/Restaurant.tsx";
import GlobalRestaurantMap from "./pages/front-office/GlobalRestaurantMap.tsx";
import RestaurantList from "./pages/front-office/RestaurantList.tsx";

const router = createBrowserRouter([
  {
    path: "/welcome",
    element: <Loading />,
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
        path: "/reservation",
        element: <Reservation />,
      },
      {
        path: "/map",
        element: <GlobalRestaurantMap />,
      },
      {
        path: "/profil",
        element: <Profile />,
        children: [
          { index: true, element: <ProfileOverview /> },
          { path: "settings", element: <ProfileSettings /> },
          { path: "contacts", element: <ProfileContacts /> },
          { path: "diet", element: <ProfileDietaryPreferences /> },
          { path: "favorites", element: <ProfileFavorites /> },
        ],
      },
      {
        path: "/restaurants",
        element: <RestaurantList />,
      },
      {
        path: "/restaurant",
        // path: "/restaurant/{id}",
        element: <Restaurant />,
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
    <LoginProvider>
      <RouterProvider router={router} />
    </LoginProvider>
  </StrictMode>,
);
