import Database from "./Database";
import Identify from "./Identify";
import Verify from "./Verify";
import Home from "./Login";
import Menu from "./Menu";
const routes = [
  {
    path: "/database",
    element: Database,
  },
  {
    path: "/identify",
    element: Identify,
  },
  {
    path: "/verify",
    element: Verify,
  },
  {
    path: "/",
    element: Home,
  },
  {
    path: "/menu",
    element: Menu,
  },
];

export default routes;
