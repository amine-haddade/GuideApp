import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "../Layouts/GuestLayout";
import ProtectedRoutes from "./ProtectedRoutes";
import NotFoundPage from "../pages/NotFoundPage";
import LnadingPage from "../pages/Home/LnadingPage";
import TestRoute from "../pages/testRoute";

const router = createBrowserRouter([
  {
    element: <GuestLayout />,
    children: [
      { path: "/", element:<LnadingPage/>},
      { path: "/test", element:<TestRoute/>},
      //  { path: "/login", element: <LoginPage /> },
      //  { path: "/register", element: <RegisterPage /> },
    ],
  },
  { element: <ProtectedRoutes />,
    children:[
      {
        element:[
                {
                    //  { path: "/wallets", element: <WalletsPage /> },
                }
            ]
        }
    ]
   },
    { path: "*", element:<NotFoundPage/>},
]);

export default router
