import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import Typography from "@mui/joy/Typography";

// Icons
import Add from "@mui/icons-material/Add";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

// Custom
import { useContext, useEffect, useState } from "react";
import orderApi from "../../api/orderApi";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import SideBar from "../../components/SideBar";
import SideDrawer, { SideDrawerContext } from "../../components/SideDrawer";
import useDebounce from "../../hooks/useDebounce";
import OrderDialogAdd from "./OrderDialogAdd";
import TableView from "./TableView";

export default function Orders() {
  const { drawerOpen } = useContext(SideDrawerContext);
  const [openAdd, setOpenAdd] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await orderApi.searchByPhone(debounceValue);
      console.log("response", response);
      if (response?.status === 200) {
        setData(response.data);
      }
    } catch (err) {
      console.log("err", err);
      setData([]);
    }
    setLoading(false);
  };

  const debounceValue = useDebounce(search, 500);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [debounceValue]);

  return (
    <>
      {drawerOpen && <SideDrawer />}
      <Layout.Root
        sx={{
          ...(drawerOpen && { height: "100vh", overflow: "hidden" }),
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
              pt: 1,
              pb: 0.5,
              bgcolor: "background.surface",
              position: "sticky",
              top: 64, // TODO: Fix hard code
              zIndex: 1100,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography fontWeight="bold" level="h3" component="h1">
                Orders
              </Typography>
            </Box>
            <Box
              sx={{
                my: 2,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 1,
                justifyContent: "space-between",
              }}
            >
              <Input
                name="search"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value.trimStart())}
                startDecorator={<SearchRoundedIcon />}
                sx={{ width: { md: 300 } }}
              />
              <Button startDecorator={<Add />} onClick={() => setOpenAdd(true)}>
                Add order
              </Button>
              <OrderDialogAdd
                setLoading={setLoading}
                open={openAdd}
                setOpen={setOpenAdd}
                fetchData={fetchData}
              />
            </Box>
          </Box>
          {loading && <Loading />}
          {!loading && (
            <TableView
              data={data}
              setLoading={setLoading}
              fetchData={fetchData}
            />
          )}
        </Layout.Main>
      </Layout.Root>
    </>
  );
}
