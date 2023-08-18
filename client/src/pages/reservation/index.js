import React from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";

// Icons
import Add from "@mui/icons-material/Add";

// Custom
import { Input, Stack } from "@mui/joy";
import { useContext, useEffect, useState } from "react";
import reservationApi from "../../api/reservationApi";
import Header from "../../components/Header";
import Layout from "../../components/Layout";
import Loading from "../../components/Loading";
import SideBar from "../../components/SideBar";
import SideDrawer, { SideDrawerContext } from "../../components/SideDrawer";
import { useDebounce } from "../../hooks";
import MemberDialogAdd from "./MemberDialogAdd";
import TableView from "./TableView";

export default function Reservation() {
	const { drawerOpen } = useContext(SideDrawerContext);
	const [openAdd, setOpenAdd] = useState(false);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState("");

	const fetchData = async () => {
		setLoading(true);
		try {
			// const rankIndex = filterOpts.findIndex((item) => item === currentOpt);
			const response = await reservationApi.searchByPhone({
				phone: debounceValue,
			});
			console.log(response);

			if (response?.status === 200) {
				setData(response.data);
				console.log(response.data);
			}
		} catch (err) {
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
					...(drawerOpen && {
						height: "100vh",
						overflow: "hidden",
					}),
				}}>
				<Header />
				<Layout.SideNav>
					<SideBar />
				</Layout.SideNav>
				<Layout.Main
					sx={{
						bgcolor: "background.surface",
					}}>
					<Box
						sx={{
							pt: 1,
							pb: 0.5,
							bgcolor: "background.surface",
							position: "sticky",
							top: 64, // TODO: Fix hard code
							zIndex: 1100,
						}}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
							}}>
							<Typography
								fontWeight="bold"
								level="h3"
								component="h1">
								Reservations
							</Typography>
						</Box>
						<Stack
							direction={{ xs: "column", md: "row" }}
							justifyContent="space-between"
							sx={{ my: 2, gap: 2 }}>
							<Stack
								direction={{ xs: "column", sm: "row" }}
								spacing={1.5}>
								<Input
									name="search"
									placeholder="Phone"
									value={search}
									onChange={(e) => setSearch(e.target.value.trimStart())}
									startDecorator={<SearchRoundedIcon />}
									sx={{ width: { md: 165 } }}
								/>
							</Stack>
							<Stack
								direction="row"
								spacing={{ xs: 1.5, sm: 2, md: 2 }}>
								<Button
									startDecorator={<Add />}
									onClick={() => setOpenAdd(true)}>
									Add reservation
								</Button>
							</Stack>
							<MemberDialogAdd
								open={openAdd}
								setOpen={setOpenAdd}
								setLoading={setLoading}
								fetchData={fetchData}
							/>
						</Stack>
					</Box>
					{loading && <Loading />}
					{!loading && (
						<>
							{data.length === 0 ? (
								"No reservation!"
							) : (
								<TableView
									data={data}
									setLoading={setLoading}
									fetchData={fetchData}
								/>
							)}
						</>
					)}
				</Layout.Main>
			</Layout.Root>
		</>
	);
}
