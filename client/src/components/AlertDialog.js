import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";

// Icons
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

export default function AlertDialog({
  title,
  content,
  dangerText,
  normalText,
  open,
  setOpen,
  handleConfirm,
}) {
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog variant="outlined" role="alertdialog">
        <Typography
          component="h2"
          level="inherit"
          fontSize="1.25em"
          mb="0.25em"
          startDecorator={<WarningRoundedIcon />}
        >
          {title}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography textColor="text.tertiary" mb={3}>
          {content}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button
            variant="plain"
            color="neutral"
            onClick={() => setOpen(false)}
          >
            {normalText}
          </Button>
          <Button
            variant="solid"
            color="danger"
            onClick={(e) => {
              setOpen(false);
              handleConfirm(e);
            }}
          >
            {dangerText}
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
