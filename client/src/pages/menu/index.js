import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

// Icons
import Add from "@mui/icons-material/Add";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

// Custom
import { useContext, useEffect, useState } from "react";
import dishApi from "../../api/dishApi";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import SelectFilter from "../../components/SelectFilter";
import SideBar from "../../components/SideBar";
import SideDrawer, { SideDrawerContext } from "../../components/SideDrawer";
import { useDebounce } from "../../hooks";
import DiskDialogAdd from "./DiskDialogAdd";
import DiskGroup from "./DiskGroup";

export const diskOpts = ["Main Menu", "Side Menu", "Dessert Menu", "Beverage Menu"];

export const filterOpts = [...diskOpts];

export default function Menu() {
  const { drawerOpen } = useContext(SideDrawerContext);
  const [openDiskAdd, setOpenDiskAdd] = useState(false);
  const [currentOpt, setCurrentOpt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [disks, setDisks] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await dishApi.search(debounceValue);
      if (response?.status === 200) {
        setDisks(response?.data?.data);
      }
    } catch (err) {
      setDisks([]);
    }
    setLoading(false);
  };

  const debounceValue = useDebounce(search, 500);

  useEffect(() => {
    fetchData();
  }, [debounceValue]);

  return (<>
      {drawerOpen && <SideDrawer />}
      <Layout.Root
        sx={{
          ...(drawerOpen && {
            height: "100vh", overflow: "hidden",
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
          <Box
            sx={{
              pt: 1, bgcolor: "background.surface", position: "sticky", top: 64, zIndex: 1100,
            }}
          >
            <Box
              sx={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
            >
              <Typography fontWeight="bold" level="h3" component="h1">
                Menu
              </Typography>
            </Box>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              sx={{ my: 2, gap: 2 }}
            >
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Input
                  name="search"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  startDecorator={<SearchRoundedIcon />}
                  sx={{ width: { md: 165 } }}
                />
                <SelectFilter
                  filterOpt={currentOpt}
                  setFilterOpt={setCurrentOpt}
                  filterOpts={filterOpts}
                />
              </Stack>
              <Stack direction="row" spacing={{ xs: 1.5, sm: 2, md: 2 }}>
                <Button
                  color="success"
                  startDecorator={<Add />}
                  onClick={() => setOpenDiskAdd(true)}
                >
                  Add dish
                </Button>
                <DiskDialogAdd
                  open={openDiskAdd}
                  setOpen={setOpenDiskAdd}
                  fetchData={fetchData}
                  setLoading={setLoading}
                />
              </Stack>
            </Stack>
            <Divider />
          </Box>

          {loading && <Loading />}
          {!loading && (<Box px={0.25}>
              {currentOpt === null ? (filterOpts.map((filterOpt) => (<DiskGroup
                    key={filterOpt}
                    category={filterOpt}
                    disks={disks}
                    fetchData={fetchData}
                    setLoading={setLoading}
                  />))) : (<DiskGroup
                  key={currentOpt}
                  category={currentOpt}
                  disks={disks}
                  fetchData={fetchData}
                />)}
            </Box>)}
        </Layout.Main>
      </Layout.Root>
    </>);
}
