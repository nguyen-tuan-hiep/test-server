import DarkModeRoundedIcon from "@mui/icons-material/DarkModeRounded";
import LightModeRoundedIcon from "@mui/icons-material/LightModeRounded";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Checkbox from "@mui/joy/Checkbox";
import CircularProgress from "@mui/joy/CircularProgress";
import CssBaseline from "@mui/joy/CssBaseline";
import FormControl from "@mui/joy/FormControl";
import FormLabel, { formLabelClasses } from "@mui/joy/FormLabel";
import GlobalStyles from "@mui/joy/GlobalStyles";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Link from "@mui/joy/Link";
import Stack from "@mui/joy/Stack";
import { useColorScheme } from "@mui/joy/styles";
import Typography from "@mui/joy/Typography";
import * as React from "react";

// Custom
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import employeeApi from "../../api/employeeApi";
import status from "../../constants/status";
import { UserContext } from "../../contexts/UserProvider";
import authentication from "../../utils/authentication";

export default function Login() {
  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      setError("Email or password is empty!");
      return;
    }

    setLoading(true);
    try {
      const response = await employeeApi.login({ email, password });
      if (response?.data?.type === status.success) {
        authentication.login(response?.data?.employee.employee_id);
        setUser(response?.data?.employee);
        setLoading(false);
        navigate("/home");
      }
    } catch (err) {
      if (err.response?.data?.type === status.error) {
        setError(err.response?.data?.message);
      }
      setLoading(false);
    }
  };

  const handleLoginEnter = (e) => {
    if (e.key === "Enter") login();
  };

  const handleLogin = () => {
    login();
  };

  return (
    <>
      <CssBaseline />
      <GlobalStyles
        styles={{
          ":root": {
            "--Collapsed-breakpoint": "769px", // form will stretch when viewport is below `769px`
            "--Cover-width": "40vw", // must be `vw` only
            "--Form-maxWidth": "700px",
            "--Transition-duration": "0.4s", // set to `none` to disable transition
          },
        }}
      />
      <div onKeyDown={handleLoginEnter}>
        <Box
          sx={(theme) => ({
            width:
              "clamp(100vw - var(--Cover-width), (var(--Collapsed-breakpoint) - 100vw) * 999, 100vw)",
            transition: "width var(--Transition-duration)",
            transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
            position: "relative",
            zIndex: 1,
            display: "flex",
            justifyContent: "flex-end",
            backdropFilter: "blur(4px)",
            backgroundColor: "rgba(255 255 255 / 0.6)",
            [theme.getColorSchemeSelector("dark")]: {
              backgroundColor: "rgba(19 19 24 / 0.4)",
            },
          })}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100dvh",
              width:
                "clamp(var(--Form-maxWidth), (var(--Collapsed-breakpoint) - 100vw) * 999, 100%)",
              maxWidth: "100%",
              px: 2,
            }}
          >
            <Box
              component="header"
              sx={{
                py: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography
                fontWeight="lg"
                startDecorator={
                  <Box
                    component="span"
                    sx={{
                      width: 24,
                      height: 24,
                      background: (theme) =>
                        `linear-gradient(45deg, ${theme.vars.palette.primary.solidBg}, ${theme.vars.palette.primary.solidBg} 30%, ${theme.vars.palette.primary.softBg})`,
                      borderRadius: "50%",
                      boxShadow: (theme) => theme.shadow.md,
                      "--joy-shadowChannel": (theme) =>
                        theme.vars.palette.primary.mainChannel,
                    }}
                  />
                }
              >
                RMS
              </Typography>
              <ColorSchemeToggle />
            </Box>
            <Box
              component="main"
              sx={{
                my: "auto",
                py: 2,
                pb: 5,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: 400,
                maxWidth: "100%",
                mx: "auto",
                borderRadius: "sm",
                "& form": {
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                },
                [`& .${formLabelClasses.asterisk}`]: {
                  visibility: "hidden",
                },
              }}
            >
              <div>
                <Typography component="h2" fontSize="xl2" fontWeight="lg">
                  Welcome back
                </Typography>
                <Typography level="body2" sx={{ my: 1, mb: 3 }}>
                  Let&apos;s get started! Please enter your details.
                </Typography>
              </div>
              <FormControl required>
                <FormLabel>Email</FormLabel>
                <Input
                  placeholder="Enter your email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <FormControl required>
                <FormLabel>Password</FormLabel>
                <Input
                  placeholder="•••••••"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Checkbox size="sm" label="Remember me" name="persistent" />
                <Link fontSize="sm" href="#" fontWeight="lg">
                  Forgot password
                </Link>
              </Box>
              {error && <span className="text-red-600">{error}</span>}
              <Button onClick={() => handleLogin()} fullWidth>
                Sign in
              </Button>
              <Stack alignItems="center">
                <CircularProgress
                  variant="soft"
                  sx={{
                    visibility: loading ? "visible" : "hidden",
                  }}
                />
              </Stack>
            </Box>
            <Box component="footer" sx={{ py: 3 }}>
              <Typography level="body3" textAlign="center">
                © RMS {new Date().getFullYear()}
              </Typography>
            </Box>
          </Box>
        </Box>
      </div>
      <Box
        sx={(theme) => ({
          height: "100%",
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          left: "clamp(0px, (100vw - var(--Collapsed-breakpoint)) * 999, 100vw - var(--Cover-width))",
          transition:
            "background-image var(--Transition-duration), left var(--Transition-duration) !important",
          transitionDelay: "calc(var(--Transition-duration) + 0.1s)",
          backgroundColor: "background.level1",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage:
            "url(https://images.unsplash.com/photo-1440492248262-6895f9da82fc)",
          [theme.getColorSchemeSelector("dark")]: {
            backgroundImage:
              "url(https://images.unsplash.com/photo-1551632436-cbf8dd35adfa)",
          },
        })}
      />
    </>
  );
}

function ColorSchemeToggle({ onClick, ...props }) {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return <IconButton size="sm" variant="plain" color="neutral" disabled />;
  }
  return (
    <IconButton
      id="toggle-mode"
      size="sm"
      variant="outlined"
      color="neutral"
      {...props}
      onClick={(event) => {
        if (mode === "light") {
          setMode("dark");
        } else {
          setMode("light");
        }
        onClick?.(event);
      }}
    >
      {mode === "light" ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
    </IconButton>
  );
}
