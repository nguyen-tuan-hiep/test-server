import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import IconButton from "@mui/joy/IconButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import Typography from "@mui/joy/Typography";

// Icons
import DeleteForever from "@mui/icons-material/DeleteForever";
import Edit from "@mui/icons-material/Edit";
import MoreVert from "@mui/icons-material/MoreVert";

// Custom
import { useSnackbar } from "notistack";
import { useState } from "react";
import tableApi from "../../api/tableApi";
import AlertDialog from "../../components/AlertDialog";
import status from "../../constants/status";
import TableDialogEdit from "./TableDialogEdit";

export default function Table({
    id,
    numberOfSeats,
    tableStatus,
    statusColor,
    setLoading,
    fetchData,
}) {
    const { enqueueSnackbar } = useSnackbar();
    const [openEdit, setOpenEdit] = useState(false);
    const [openAlert, setOpenAlert] = useState(false);
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
        const fetch = async () => {
            setLoading(true);
            try {
                const response = await tableApi.deleteTableById(id);

                if (response?.data?.type === status.success) {
                    fetchData();
                    setLoading(false);
                    enqueueSnackbar(response.data.message, {
                        variant: "success",
                    });
                }
            } catch (err) {
                setLoading(false);
                enqueueSnackbar(err.response.data.message, {
                    variant: "error",
                });
            }
        };

        fetch();
    };

    return (
        <Card
            variant="outlined"
            sx={{
                "--Card-radius": (theme) => theme.vars.radius.sm,
                boxShadow: "none",
            }}
        >
            <CardOverflow
                sx={{
                    borderBottom: "1px solid",
                    borderColor: "neutral.outlinedBorder",
                }}
            >
                <AspectRatio ratio="2" color="primary">
                    <Typography
                        level="h3"
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "primary.plainColor",
                        }}
                    >
                        {id}
                    </Typography>
                </AspectRatio>
            </CardOverflow>
            <Box sx={{ pt: 2, display: "flex", alignItems: "center" }}>
                <Box sx={{ flex: 1 }}>
                    <Typography>Seats: {numberOfSeats}</Typography>
                    <Typography color={statusColor}>{tableStatus}</Typography>
                </Box>
                <Box>
                    <IconButton
                        id="positioned-button"
                        aria-controls={openMore ? "positioned-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={openMore ? "true" : undefined}
                        variant="plain"
                        color="neutral"
                        onClick={handleMoreClick}
                    >
                        <MoreVert />
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
                            Edit table
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
                            Delete table
                        </MenuItem>
                    </Menu>
                </Box>
                <TableDialogEdit
                    id={id}
                    key={{ id }}
                    numberOfSeats={numberOfSeats}
                    tableStatus={tableStatus}
                    open={openEdit}
                    setOpen={setOpenEdit}
                    setLoading={setLoading}
                    fetchData={fetchData}
                />
                <AlertDialog
                    title="Confirmation"
                    content={`Are you sure you want to delete table ${id}?`}
                    dangerText="Delete"
                    normalText="Cancel"
                    open={openAlert}
                    setOpen={setOpenAlert}
                    handleConfirm={(e) => handleDelete(e)}
                />
            </Box>
        </Card>
    );
}
