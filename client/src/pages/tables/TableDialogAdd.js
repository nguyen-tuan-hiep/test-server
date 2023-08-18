import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { useSnackbar } from "notistack";

// Icons
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

// Custom
import { useState } from "react";
import { filterOpts } from ".";
import tableApi from "../../api/tableApi";
import { renderOpts } from ".";

export default function TableDialogAdd({
	open,
	setOpen,
	setLoading,
	fetchData,
}) {
	const [id, setId] = useState("");
	const [numberOfSeats, setNumberOfSeats] = useState("");
	const [tableStatus, setTableStatus] = useState(filterOpts[0]);
	const { enqueueSnackbar } = useSnackbar();

	const handleSubmit = () => {
		const submit = async () => {
			setLoading(true);
			try {
				const response = await tableApi.createTable({
					table_id: id,
					capacity: numberOfSeats,
					table_status: tableStatus,
				});
				if (response.status === 200) {
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
			setId("");
			setNumberOfSeats("");
			setTableStatus(filterOpts[0]);
		};

		submit();
	};

	return (
		<>
			<Modal
				open={open}
				onClose={() => setOpen(false)}>
				<ModalDialog
					sx={{
						maxWidth: 500,
						borderRadius: "md",
						p: 3,
						boxShadow: "lg",
					}}>
					<ModalClose />
					<Typography
						component="h2"
						level="inherit"
						fontSize="1.25em"
						mb="0.25em">
						Add new table
					</Typography>
					<Stack
						component="form"
						onSubmit={(e) => {
							e.preventDefault();
							handleSubmit();
							setOpen(false);
						}}>
						<Stack spacing={2}>
							{/* <FormControl required>
                                <FormLabel>ID</FormLabel>
                                <Input
                                    autoFocus
                                    name="id"
                                    placeholder="ID"
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                />
                            </FormControl> */}
							<FormControl required>
								<FormLabel>Capacity</FormLabel>
								<Input
									name="capacity"
									placeholder="Number of seats"
									value={numberOfSeats}
									onChange={(e) => setNumberOfSeats(e.target.value)}
								/>
							</FormControl>
							<FormControl>
								<FormLabel>Status</FormLabel>
								<Select
									value={tableStatus}
									onChange={(e, newTableStatus) => {
										setTableStatus(newTableStatus);
									}}>
									{filterOpts.map((filterOpt, index) => (
										<Option
											key={filterOpt}
											value={filterOpt}>
											{renderOpts[index]}
										</Option>
									))}
								</Select>
							</FormControl>
						</Stack>
						<Box
							mt={3}
							display="flex"
							gap={2}
							sx={{ width: "100%" }}>
							<Button
								type="submit"
								startDecorator={<SaveRoundedIcon />}
								sx={{ flex: 1 }}>
								Save
							</Button>
							<Button
								type="button"
								variant="soft"
								onClick={() => setOpen(false)}
								color="danger"
								sx={{ flex: 1 }}>
								Cancel
							</Button>
						</Box>
					</Stack>
				</ModalDialog>
			</Modal>
		</>
	);
}
