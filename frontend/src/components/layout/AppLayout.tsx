import { Outlet } from "react-router-dom";
import { NavBar } from "./NavBar";

export function AppLayout(): JSX.Element {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}
