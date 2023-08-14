import { createContext, useContext } from "react";
import Layout from "./Layout";
import SideBar from "./SideBar";

export const SideDrawerContext = createContext();

export default function SideDrawer() {
  const { drawerOpen, setDrawerOpen } = useContext(SideDrawerContext);
  return (
    <>
      {drawerOpen && (
        <Layout.SideDrawer onClose={() => setDrawerOpen(false)}>
          <SideBar />
        </Layout.SideDrawer>
      )}
    </>
  );
}
