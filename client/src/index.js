import { StyledEngineProvider } from "@mui/joy";
import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
// import UserProvider from "./contexts/UserProvider";
import App from "./App";
import "./index.css";
import { AuthContextProvider } from "./contexts/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <StyledEngineProvider injectFirst>
      <BrowserRouter>
        <SnackbarProvider maxSnack={5}>
          <App />
        </SnackbarProvider>
      </BrowserRouter>
    </StyledEngineProvider>
  </AuthContextProvider>
);
