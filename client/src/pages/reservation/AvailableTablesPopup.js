import React from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Button from "@mui/joy/Button";

export default function AvailableTablesPopup({ open, setOpen, data }) {
	return (
		<Modal open={open}>
			<ModalDialog
				sx={{
					maxWidth: "100vw",
					minWidth: 400,
					maxHeight: "95vh",
					borderRadius: "md",
					p: 3,
					boxShadow: "lg",
				}}>
				<Typography
					component="h2"
					level="inherit"
					fontSize="1.25em"
					mb="0.8em"
					textAlign="center">
					Available Tables
				</Typography>

				<Sheet
					variant="outlined"
					sx={{
						maxHeight: "500px",
						overflow: "auto",
						borderRadius: "sm",
						gridColumn: "1/-1",
						display: { xs: "none", sm: "grid" },
						gridTemplateColumns: "minmax(80px, 1fr) minmax(80px, 1fr)",
						"& > *": {
							p: 2,
							[`&:nth-of-type(n)`]: {
								borderBottom: "1px solid",
								borderColor: "divider",
							},
						},
					}}>
					<Typography
						level="body2"
						fontWeight="md"
						textAlign="center">
						Table ID
					</Typography>
					<Typography
						level="body2"
						fontWeight="md"
						textAlign="center">
						Capacity
					</Typography>

					{data.map((item) => (
						<React.Fragment key={item.table_id}>
							<Typography
								level="body2"
								fontWeight="md"
								textAlign="center">
								{item.table_id}
							</Typography>
							<Typography
								level="body2"
								fontWeight="md"
								textAlign="center">
								{item.capacity}
							</Typography>
						</React.Fragment>
					))}
				</Sheet>

				<Box
					mt={3}
					display="flex"
					justifyContent="flex-end">
					<Button
						variant="outlined"
						onClick={() => setOpen(false)}>
						Close
					</Button>
				</Box>
			</ModalDialog>
		</Modal>
	);
}
