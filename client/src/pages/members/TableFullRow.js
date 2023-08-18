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
import { useSnackbar } from "notistack";
import { useState } from "react";
import customerApi from "../../api/customerApi";
import AlertDialog from "../../components/AlertDialog";
import status from "../../constants/status";
import MemberDialogEdit from "./MemberDialogEdit";
import { rankColors } from "./TableView";

export default function TableFullRow({ data, setLoading, fetchData }) {
  const { enqueueSnackbar } = useSnackbar();
  const [openEdit, setOpenEdit] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [progressIcon, setProgressIcon] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMore = Boolean(anchorEl);

  const handleMoreClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMoreClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    setProgressIcon(true);
    const remove = async () => {
      try {
        const response = await customerApi.deleteCustomerById(data.customer_id);

        if (response?.status === 200) {
          setProgressIcon(false);
          fetchData();
          enqueueSnackbar(response.data.message, {
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
        <Typography level="body2">{data.name}</Typography>
      </Stack>
      <Stack justifyContent="center">
        <Typography level="body2">{data.gender}</Typography>
      </Stack>
      <Stack justifyContent="center">
        <Typography level="body2">{data.phone}</Typography>
      </Stack>
      <Stack justifyContent="center">
        <Typography level="body2">{data.address}</Typography>
      </Stack>
      <Stack justifyContent="center">
        <Typography level="body2">{data.point}</Typography>
      </Stack>
      <Stack justifyContent="center">
        <Typography
          level="body2"
          color={rankColors.find((item) => item.mem_type === data.mem_type).color}
        >
          {data.mem_type}
        </Typography>
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
            Edit customer
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
            Delete customer
          </MenuItem>
        </Menu>
        <MemberDialogEdit
          id={data.customer_id}
          name={data.name}
          phone={data.phone}
          gender={data.gender}
          point={data.point}
          address={data.address}
          open={openEdit}
          setOpen={setOpenEdit}
          setLoading={setLoading}
          fetchData={fetchData}
        />
        <AlertDialog
          title="Confirmation"
          content={`Are you sure you want to delete "${data.name}"?`}
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
