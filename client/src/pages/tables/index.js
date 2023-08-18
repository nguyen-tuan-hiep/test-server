import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

// Icons
import Add from "@mui/icons-material/Add";

// Custom
import { useSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react";
import tableApi from "../../api/tableApi";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import SelectFilter from "../../components/SelectFilter";
import SideBar from "../../components/SideBar";
import SideDrawer, { SideDrawerContext } from "../../components/SideDrawer";
import Table from "./Table";
import TableDialogAdd from "./TableDialogAdd";

export const filterObjs = [
  { table_status: 0, renderText: "Available", color: "success" },
  { table_status: 1, renderText: "Reserved", color: "neutral" },
  { table_status: 2, renderText: "Occupied", color: "primary" },
  { table_status: 3, renderText: "Out of Order", color: "danger" },
];

export const filterOpts = filterObjs.map((filterObj) => filterObj.table_status);
export const renderOpts = filterObjs.map((filterObj) => filterObj.renderText);

export default function Tables() {
  const { drawerOpen } = useContext(SideDrawerContext);
  const [openAdd, setOpenAdd] = useState(false);
  const [filterOpt, setFilterOpt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tables, setTables] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await tableApi.getTableList();
      
      console.log(response?.data?.data);
      
      if (response.status === 200) {
        setTables(response?.data?.data);
      }
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message, {
        variant: "error",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

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
          <Box
            sx={{
              pt: 1,
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
                Tables
              </Typography>
            </Box>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              sx={{ my: 2, gap: 2 }}
            >
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <SelectFilter
                  filterOpt={filterOpt}
                  setFilterOpt={setFilterOpt}
                  filterOpts={filterOpts}
                  renderOpts={renderOpts}
                />
              </Stack>
              <Stack direction="row" spacing={{ xs: 1.5, sm: 2, md: 2 }}>
                <Button
                  startDecorator={<Add />}
                  onClick={() => setOpenAdd(true)}
                >
                  Add table
                </Button>
                <TableDialogAdd
                  open={openAdd}
                  setOpen={setOpenAdd}
                  setLoading={setLoading}
                  fetchData={fetchData}
                />
              </Stack>
            </Stack>
            <Divider />
          </Box>
          {loading && <Loading />}
          <Box
            sx={{
              mt: 3,
              px: 0.25,
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(auto-fill, minmax(200px, 1fr))",
                sm: "repeat(auto-fill, minmax(220px, 1fr))",
                md: "repeat(auto-fill, minmax(240px, 1fr))",
              },
              gap: 3,
            }}
          >
            {!loading &&
              tables
                .filter((table) =>
                  filterOpt !== null ? table.table_status === filterOpt : true
                )
                .map((table) => (
                  <div key={table.table_id}>
                    <Table
                      id={table.table_id}
                      numberOfSeats={table.capacity}
                      tableStatus={table.table_status}
                      statusColor={
                        filterObjs.find(
                          (item) => item.table_status === table.table_status
                        )?.color
                      }
                      setLoading={setLoading}
                      fetchData={fetchData}
                    />
                  </div>
                ))}
          </Box>
        </Layout.Main>
      </Layout.Root>
    </>
  );
}
