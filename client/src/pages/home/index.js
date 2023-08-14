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
              <Typography fontWeight="bold" level="h5" component="h2">
                RESPONSIVE DESIGN: THE SITE FITS ALL DEVICES
              </Typography>
              <Box>
                As a consumer, you expect responsive website design when you go
                online. Responsive design means your single website will adapt
                to the device of every unique visitor. Whether your potential
                customers are on a desktop or on their phones, you want your
                site to look beautiful across all devices. RMS considers the
                responsiveness of your website in our complete website
                development process. We make sure your site not only functions,
                but also looks great, on every device.
              </Box>
            </Stack>
          </Stack>
        </Layout.Main>
      </Layout.Root>
    </>
  );
}
