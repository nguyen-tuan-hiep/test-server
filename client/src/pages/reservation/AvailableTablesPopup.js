import React from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";

export default function AvailableTablesPopup({ open, setOpen, data }) {
	return (
		<Modal open={open}>
			<ModalDialog>
				<Typography
					component="h2"
					level="inherit"
					fontSize="1.25em"
					mb="0.25em">
					Available Tables
				</Typography>

				{/* show available tables */}
				{data.map((item) => (
					<Typography
						key={item.table_id}
						component="h2"
						level="inherit"
						fontSize="1.25em"
						mb="0.25em">
            TABLE {item.table_id} - CAPACITY {item.capacity}
					</Typography>
				))}

				<Box
					mt={3}
					display="flex"
					justifyContent="flex-end">
					<Button
						variant="contained"
						color="error"
						onClick={() => setOpen(false)}>
						Close
					</Button>
				</Box>
			</ModalDialog>
		</Modal>
	);
}
