import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import TextField from "@mui/material/TextField";
import ModalDialog from "@mui/joy/ModalDialog";
import SelectFilter from "../../components/SelectFilter";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { useSnackbar } from "notistack";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Custom
import { useState } from "react";
import reservationApi from "../../api/reservationApi";
import AvailableTablesPopup from "./AvailableTablesPopup";

export default function MemberDialogAdd({
	open,
	setOpen,
	setLoading,
	fetchData,
}) {
	const [openAdd, setOpenAdd] = useState(false);
	const [table, setTable] = useState(0);
	const [capacity, setCapacity] = useState(0);
	const [phone, setPhone] = useState("");
	const [res_date, setRes_date] = useState(new Date());
	const [res_time_start, setRes_time_start] = useState(new Date().getTime());
	const { enqueueSnackbar } = useSnackbar();
	const [data, setData] = useState([]);

	const filterOpts = [
		"09:00:00",
		"11:00:00",
		"13:00:00",
		"15:00:00",
		"17:00:00",
		"19:00:00",
		"21:00:00",
	];

	const handleGetAvailableTables = async () => {

		try {
			const response = await reservationApi.getAvailableTables({
				capacity,
				res_date,
				res_time_start,
			});
			if (response?.status === 200) {
				setOpenAdd(true);
				setData(response.data);
			}
		} catch (err) {
			setData([]);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const submit = async () => {
			setLoading(true);
			try {
				const data = {
					phone,
					table_id: table,
					res_date,
					res_time_start,
				};

				const response = await reservationApi.createReservation(data);
				if (response?.status === 200) {
					fetchData();
					enqueueSnackbar(response?.data?.message, {
						variant: "success",
					});
				}
			} catch (err) {
				setLoading(false);
				enqueueSnackbar(err.response?.data?.message, {
					variant: "error",
				});
			}
		};
		submit();
		setOpen(false);
		setPhone("");
		setTable(0);
		setCapacity(0);
		setRes_date(new Date());
		setRes_time_start(new Date().getTime());
	};

	return (
		<Modal
			open={open}
			onClose={() => setOpen(false)}>
			<ModalDialog
				sx={{
					position: "relative",
					width: 350,
					borderRadius: "md",
					p: 3,
					boxShadow: "lg",
					zIndex: 1000,
				}}>
				<ModalClose />
				<Typography
					component="h2"
					level="inherit"
					fontSize="1.25em"
					mb="0.25em">
					Add new reservation
				</Typography>
				<form onSubmit={handleSubmit}>
					<Stack>
						<Stack spacing={2}>
							<FormControl required>
								<FormLabel>Phone</FormLabel>
								<Input
									name="phone"
									placeholder="Phone"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
								/>
							</FormControl>
							<FormControl required>
								<FormLabel>Capacity</FormLabel>
								<Input
									name="capacity"
									placeholder="Capacity"
									value={capacity}
									onChange={(e) => setCapacity(e.target.value)}
								/>
							</FormControl>

							<FormControl>
								<FormLabel>Table</FormLabel>
								<Input
									name="table"
									placeholder="Table"
									value={table}
									onChange={(e) => setTable(e.target.value)}
								/>
							</FormControl>
							<FormControl required>
								<FormLabel>Reservation Date</FormLabel>
								<LocalizationProvider
									dateAdapter={AdapterDateFns}
									className="px-2">
									<DatePicker
										value={res_date}
										onChange={(newValue) => {
											setRes_date(newValue);
										}}
										textField={(params) => <TextField {...params} />}
										format="dd/MM/yyyy"
										minDate={new Date()}
										DialogProps={{
											style: { zIndex: 99999 }, // it should be more than 1200
										}}
									/>
								</LocalizationProvider>
							</FormControl>
							<FormControl>
								<FormLabel>Reservation Time</FormLabel>
								<SelectFilter
									filterOpt={res_time_start}
									setFilterOpt={setRes_time_start}
									filterOpts={filterOpts}
								/>
							</FormControl>
						</Stack>
						<Box
							mt={3}
							display="flex"
							gap={2}
							sx={{ width: "100%" }}>
							<Button
								type="submit"
								sx={{ flex: 1 }}>
								Save
							</Button>
							<Button
								// type="submit"
								onClick={handleGetAvailableTables}
								sx={{ flex: 1 }}>
								Show available tables
							</Button>
							<AvailableTablesPopup
								// data={response}
								data={data}
								open={openAdd}
								setOpen={setOpenAdd}
								// setLoading={setLoading}
							/>
						</Box>
					</Stack>
				</form>
			</ModalDialog>
		</Modal>
	);
}
