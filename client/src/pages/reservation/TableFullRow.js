import Box from "@mui/joy/Box";
import CircularProgress from "@mui/joy/CircularProgress";
import IconButton from "@mui/joy/IconButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import moment from "moment";

// Icons
import DeleteForever from "@mui/icons-material/DeleteForever";
import Edit from "@mui/icons-material/Edit";
import MoreVert from "@mui/icons-material/MoreVert";

// Custom
import { useSnackbar } from "notistack";
import { useState } from "react";
// import customerApi from "../../api/customerApi";
import reservationApi from "../../api/reservationApi";
import AlertDialog from "../../components/AlertDialog";

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
        const response = await reservationApi.deleteReservationById(
          data.res_id
        );

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
        <Typography level="body2">{data.phone}</Typography>
      </Stack>
      <Stack justifyContent="center">
        <Typography level="body2">{data.table_id}</Typography>
      </Stack>
      <Stack justifyContent="center">
        <Typography level="body2">
          {moment(data.res_date).local().format("DD-MM-YYYY")}
        </Typography>
      </Stack>
      <Stack justifyContent="center">
        <Typography level="body2">{data.res_time_start}</Typography>
      </Stack>
      <Stack justifyContent="center">
        <Typography level="body2">{data.res_time_end}</Typography>
      </Stack>
      {/* <Stack justifyContent="center">
        <Typography
          level="body2"
          color={rankColors.find((item) => item.mem_type === data.mem_type).color}
        >
          {data.mem_type}
        </Typography>
      </Stack> */}
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
          {/* <MenuItem onClick={() => setOpenEdit(true)}>
            <ListItemDecorator>
              <Edit />
            </ListItemDecorator>
            Edit member
          </MenuItem> */}
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
            Delete reservation
          </MenuItem>
        </Menu>
        {/* <MemberDialogEdit
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
        /> */}
        <AlertDialog
          title="Confirmation"
          content={`Are you sure you want to delete this reservation"?`}
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
