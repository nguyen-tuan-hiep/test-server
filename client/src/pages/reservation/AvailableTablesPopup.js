import React from "react";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";

export default function AvailableTablesPopup({ open, setOpen, data }) {
  return (
    <Modal open={open}>
      <ModalDialog
        sx={{
          maxWidth: "100vw",
          minWidth: 450,
          maxHeight: "95vh",
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        <Typography
          component="h2"
          level="inherit"
          fontSize="1.25em"
          mb="0.25em"
        >
          Available Tables
        </Typography>

        {/* show available tables */}
        <Box
          sx={{
            maxWidth: "100vw",
            maxHeight: "75vh",
            overflow: "auto",
            borderRadius: "md",
            p: 3,
          }}
        >
          {data.map((item) => (
            <Typography
              key={item.table_id}
              component="p"
              level="inherit"
              mb="0.25em"
            >
              TABLE {item.table_id} - CAPACITY {item.capacity}
            </Typography>
          ))}
        </Box>

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            variant="outlined"
            // variant="outlined"
            // color="error"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
