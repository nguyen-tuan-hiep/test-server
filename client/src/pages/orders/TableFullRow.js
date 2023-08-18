import Box from "@mui/joy/Box";
import CircularProgress from "@mui/joy/CircularProgress";
import IconButton from "@mui/joy/IconButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

// Icons
import DeleteForever from "@mui/icons-material/DeleteForever";
import Edit from "@mui/icons-material/Edit";
import MoreVert from "@mui/icons-material/MoreVert";

// Custom
import moment from "moment";
import { useSnackbar } from "notistack";
import { useState } from "react";
import orderApi from "../../api/orderApi";
import AlertDialog from "../../components/AlertDialog";
import status from "../../constants/status";
import OrderDialogEdit from "./OrderDialogEdit";

export default function TableFullRow({ data, setLoading, fetchData }) {
  const { enqueueSnackbar } = useSnackbar();
  const [openEdit, setOpenEdit] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [progressIcon, setProgressIcon] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMore = Boolean(anchorEl);

  const order_date = moment.utc(data.order_date).format("DD/MM/YYYY");

  const handleMoreClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    const remove = async () => {
      setProgressIcon(true);
      try {
        const response = await orderApi.delete(data.order_id);
        if (response.status === 200) {
          setProgressIcon(false);
          fetchData();
          enqueueSnackbar(response.data?.message, {
            variant: "success",
          });
        }
      } catch (err) {
        setProgressIcon(false);
        enqueueSnackbar(err.response.data?.message, {
          variant: "error",
        });
      }
    };
    remove();
  };

  return (
    <>
      <Stack justifyContent="center">
        <Typography level="body2">{order_date}</Typography>
      </Stack>
      <Stack justifyContent="center">
        <Typography level="body2">{data.order_time}</Typography>
      </Stack>
      <Stack justifyContent="center">
        <Typography level="body2">{data.name || "Anonymous"}</Typography>
      </Stack>
      <Stack justifyContent="center">
        <Typography level="body2">{data.phone}</Typography>
      </Stack>
      <Stack justifyContent="center">
        <Typography level="body2">${data.total_price}</Typography>
      </Stack>
      <Stack justifyContent="center">
        <Typography level="body2">${data.final_price}</Typography>
      </Stack>
      <Box>
        <IconButton
          id="positioned-button"
          aria-controls={openMore ? "positioned-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openMore ? "true" : undefined}
          variant="plain"
          color="neutral"
          onClick={(e) => !progressIcon && handleMoreClick(e)}
        >
          {progressIcon && <CircularProgress size="sm" color="primary" />}
          {!progressIcon && <MoreVert />}
        </IconButton>
        <Menu
          id="positioned-menu"
          anchorEl={anchorEl}
          open={openMore}
          onClose={handleMoreClose}
          aria-labelledby="positioned-button"
          placement="bottom-end"
        >
          <MenuItem onClick={() => setOpenEdit(true)}>
            <ListItemDecorator>
              <Edit />
            </ListItemDecorator>
            Edit order
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpenAlert(true);
            }}
            variant="soft"
            color="danger"
          >
            <ListItemDecorator sx={{ color: "inherit" }}>
              <DeleteForever />
            </ListItemDecorator>
            Delete order
          </MenuItem>
        </Menu>
        {openEdit && (
          <OrderDialogEdit
            id={data.order_id}
            open={openEdit}
            setOpen={setOpenEdit}
            setLoading={setLoading}
            fetchData={fetchData}
          />
        )}
        <AlertDialog
          title="Confirmation"
          content={`Are you sure you want to delete?`}
          dangerText="Delete"
          normalText="Cancel"
          open={openAlert}
          setOpen={setOpenAlert}
          handleConfirm={(e) => handleDelete(e)}
        />
      </Box>
    </>
  );
}
