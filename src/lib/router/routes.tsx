import type { PathRouteProps } from "react-router-dom";

import Dashboard from "lib/pages/dashboard";
import Dapps from "lib/pages/dapps";
import Blockchains from "lib/pages/blockchains";
import Nodes from "lib/pages/nodes";
import Assets from "lib/pages/assets";
import Pioneers from "lib/pages/pioneers";
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
    element: <Blockchains />,
  },
  {
    path: "/assets",
    element: <Assets />,
  },
  {
    path: "/nodes",
    element: <Nodes />,
  },
  {
    path: "/pioneers",
    element: <Pioneers />,
  },
];
