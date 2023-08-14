import { useRoutes } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Tables from "./pages/tables";
import Menu from "./pages/menu";
import Orders from "./pages/orders";
import Events from "./pages/events";
import Members from "./pages/members";
import Report from "./pages/report";

export default function Router() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "home",
      element: <Home />,
    },
    {
      path: "login",
      element: <Login />,
    },
    {
      path: "tables",
      element: <Tables />,
    },
    {
      path: "menu",
      element: <Menu />,
    },
    {
      path: "orders",
      element: <Orders />,
    },
    {
      path: "events",
      element: <Events />,
    },
    {
      path: "members",
      element: <Members />,
    },
    {
      path: "report",
      element: <Report />,
    },
  ]);

  return routes;
}
