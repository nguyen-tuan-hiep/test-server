import CssBaseline from "@mui/joy/CssBaseline";
import { CssVarsProvider } from "@mui/joy/styles";
import { deepmerge } from "@mui/utils";
import { useContext, useEffect, useState } from "react";
import "./App.css";
import { SideDrawerContext } from "./components/SideDrawer";
import Router from "./routes";
import joyTheme from "./themes/joyTheme";
import muiTheme from "./themes/muiTheme";
import Loading from "./components/Loading";
import employeeApi from "./api/employeeApi";
import authentication from "./utils/authentication";
import status from "./constants/status";
import { Backdrop } from "@mui/material";
import { AuthContextProvider } from "./contexts/AuthContext";

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  return (
    <>
      <div className="app">
        <AuthContextProvider>
          <CssVarsProvider
            disableTransitionOnChange
            theme={deepmerge(muiTheme, joyTheme)}
          >
            <SideDrawerContext.Provider value={{ drawerOpen, setDrawerOpen }}>
              <CssBaseline />
              {loading && (
                <Backdrop
                  open={true}
                  sx={{
                    color: "transparent",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                >
                  <Loading />
                </Backdrop>
              )}
              {!loading && <Router />}
            </SideDrawerContext.Provider>
          </CssVarsProvider>
        </AuthContextProvider>
      </div>
    </>
  );
}

export default App;
