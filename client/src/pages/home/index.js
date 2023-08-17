import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

// Custom
import { useContext } from "react";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import SideBar from "../../components/SideBar";
import SideDrawer, { SideDrawerContext } from "../../components/SideDrawer";

export default function Home() {
  const { drawerOpen } = useContext(SideDrawerContext);
  return (
    <>
      {drawerOpen && <SideDrawer />}
      <Layout.Root
        sx={{
          ...(drawerOpen && {
            height: "100vh",
            overflow: "hidden",
          }),
        }}
      >
        <Header />
        <Layout.SideNav>
          <SideBar />
        </Layout.SideNav>
        <Layout.Main
          sx={{
            bgcolor: "background.surface",
          }}
        >
          <Stack spacing={2}>
            <Typography fontWeight="bold" level="h3" component="h1">
              Welcome to RMS!
            </Typography>
            <img
              src="/responsive-design.png"
              alt=""
              loading="lazy"
              style={{ maxWidth: 500 }}
            />
            {/* </Stack> */}
            <Typography fontWeight="bold" level="h5" component="h2">
              INTRODUCTION
            </Typography>
            <Stack>
              <Box>
                What is RMS? A restaurant management system is a type of
                point-of-sale (POS) software specifically designed for
                restaurants, bars, food trucks and others in the food service
                industry. Unlike a POS system, RMS encompasses all back-end
                needs, such as inventory and staff management. This RMS prepares
                your website for use on all devices. Responsive websites
                dynamically resizes content and images for all different screen
                sizes for use on any device. With more than 50% of internet
                traffic coming from devices other than laptops and desktops, a
                site which isn’t responsive potentially loses half of its
                customers.
              </Box>
              <ul style={{ marginTop: 10 }}>
                <li>
                  We make sure your site is responsive across devices of all
                  types.
                </li>
                <li>
                  The code of your responsive website design makes sure that
                  your site functions on future mobile web platforms.
                </li>
                <li>Your website is not one-size-fits-all.</li>
              </ul>
            </Stack>
          </Stack>
        </Layout.Main>
      </Layout.Root>
    </>
  );
}
