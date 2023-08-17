import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Stack from "@mui/joy/Stack";
import TextField from "@mui/joy/TextField";
import Typography from "@mui/joy/Typography";
import moment from "moment";
// Icons
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

// Custom
import { useSnackbar } from "notistack";
import { createRef, useContext, useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    BarChart, 
    Bar,
} from "recharts";
// import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import SideBar from "../../components/SideBar";
import Loading from "../../components/Loading";
import SideDrawer, { SideDrawerContext } from "../../components/SideDrawer";
import orderApi from "../../api/orderApi";
import status from "../../constants/status";

export default function Report() {
    let today = new Date();
    let lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    today.setUTCHours(0, 0, 0, 0);
    lastMonth.setUTCHours(0, 0, 0, 0);
    today = today.toISOString().replace(/T.*$/, "");
    lastMonth = lastMonth.toISOString().replace(/T.*$/, "");
    const { drawerOpen } = useContext(SideDrawerContext);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [orders, setOrders] = useState([]);
    const [beginDate, setBeginDate] = useState('2022-09-25');
    const [endDate, setEndDate] = useState(today);
    const { enqueueSnackbar } = useSnackbar();
    const csvLinkEl = createRef();
    const [totalEarned, setTotalEarned] = useState(0);
    // const yAxisFormatter = (value) => `${value.toLocaleString(undefined, { minimumFractionDigits: 3 })} VND`;
    // const yAxisFormatter = (value) => {
    //     const formattedValue = value.toLocaleString(undefined, { minimumFractionDigits: 0 });
    //     const paddedValue = formattedValue.padStart(6, '0'); // Assuming maximum value is 999,999
    //     return `${paddedValue} VND`;
    // };
    const yAxisFormatter = (value) => {
        const formattedValue = value.toLocaleString(undefined, { minimumFractionDigits: 0 });
        return `${formattedValue},000`;
    };
    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const response = await orderApi.getStatistic({
                    beginDate,
                    endDate,
                });
                console.log(response)
                if (response.status === 200) {
                    const orders = response.data?.orders.map((item) => ({
                        Date: moment
                            .utc(item.date)
                            .add(1, "d")
                            .format("DD-MM-YYYY"),
                        Earned: parseFloat(item.earned),
                    }));
                    setData(orders);
                }
            } catch (err) {
                console.log(err.response);
                setData([]);
            }
            setLoading(false);
        };
        fetch();
    }, [beginDate, endDate]);

    useEffect(() => {
        if (orders.length > 0) {
            csvLinkEl.current.link.click();
            setOrders([]);
        }
    }, [csvLinkEl, orders]);

    useEffect(() => {
        if (data.length > 0) {
            let total = 0;
            data.forEach((item) => {
                total += item.Earned;
            });
            setTotalEarned(total);
        }
    }, [data]);

    const handleExport = () => {
        const getOrders = async () => {
            setLoading(true);
            try {
                const response = await orderApi.getOrdersBetweenDate({
                    beginDate,
                    endDate,
                });
                if (response.data?.type === status.success) {
                    setOrders(response.data?.orders);
                }
            } catch (err) {
                enqueueSnackbar(err.response.data?.message, {
                    variant: "error",
                });
            }
            setLoading(false);
        };
        getOrders();
    };

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
                            <Typography
                                fontWeight="bold"
                                level="h3"
                                component="h1"
                            >
                                Report
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                my: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Stack
                                component="form"
                                noValidate
                                direction={{ xs: "column", sm: "row" }}
                                spacing={1.5}
                            >
                                <TextField
                                    type="date"
                                    value={beginDate}
                                    onChange={(e) =>
                                        setBeginDate(e.target.value)
                                    }
                                />
                                <TextField
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </Stack>
                            <Button
                                startDecorator={<FileDownloadOutlinedIcon />}
                                onClick={(e) => handleExport(e)}
                            >
                                Export report (.csv)
                            </Button>
                            <CSVLink
                                data={orders}
                                filename={`report-${beginDate}-${endDate}.csv`}
                                style={{ display: "none" }}
                                ref={csvLinkEl}
                            />
                        </Box>
                        <Divider />
                    </Box>
                    {loading && <Loading />}
                    {!loading && (
                        <>
                            {data.length > 0 ? (
                                <Stack mt={2.5} spacing={3}>
                                    <Typography
                                        fontWeight="bold"
                                        level="h5"
                                        component="h2"
                                    >
                                        Total Earned: {totalEarned.toLocaleString()},000 VND
                                    </Typography>
                                    <Box height={350}>
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <BarChart
                                                width={500}
                                                height={300}
                                                data={data}
                                                margin={{
                                                    top: 5,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="Date" />
                                                <YAxis tickFormatter={yAxisFormatter} />
                                                <Tooltip />
                                                <Legend />
                                                <Bar    
                                                    dataKey="Earned"
                                                    fill="#8884d8"                                                    
                                                    name="Earned"
                                                    unit=",000 VND" 
                                                />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Box>
                                </Stack>
                            ) : (
                                <Typography
                                    mt={2}
                                    fontWeight="bold"
                                    level="h5"
                                    component="h2"
                                >
                                    No records found!
                                </Typography>
                            )}
                        </>
                    )}
                    <Divider />
                    <Box>
                    {/* top 5 trending between date */}
                    <Divider />
                    </Box>
                    <Box>
                        
                    </Box>
                </Layout.Main>
            </Layout.Root>
        </>
    );
}
