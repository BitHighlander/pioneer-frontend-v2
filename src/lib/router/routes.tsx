import type { PathRouteProps } from "react-router-dom";

import Dashboard from "lib/pages/dashboard";
import Dapps from "lib/pages/dapps";
import Home from "lib/pages/home";
import Login from "lib/pages/login";

export const routes: Array<PathRouteProps> = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];

export const privateRoutes: Array<PathRouteProps> = [
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/dapps",
    element: <Dapps />,
  },
  {
    path: "/blockchains",
    element: <Dapps />,
  },
  {
    path: "/assets",
    element: <Dapps />,
  },
  {
    path: "/nodes",
    element: <Dapps />,
  },
];
