import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import Textarea from "@mui/joy/Textarea";
import TextField from "@mui/joy/TextField";
import Typography from "@mui/joy/Typography";
import { CircularProgress } from "@mui/joy";

// Icons
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

// Custom
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import eventApi from "../../api/eventApi";
import dishApi from "../../api/dishApi";
import EventListSelected from "./EventListSelected";
import EventList from "./EventList";

export default function EventDialogAdd({
  open,
  setOpen,
  fetchData,
  setLoading,
}) {
  // let today = new Date();
  // today.setUTCHours(0, 0, 0, 0);
  // today = today.toISOString().replace(/:\d{2}.\d{3}Z$/, "");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [poster, setPoster] = useState("");
  const [preview, setPreview] = useState(undefined);
  const [beginTime, setBeginTime] = useState("");
  const [closeTime, setEndTime] = useState("");
  const [diskList, setDiskList] = useState([]);
  const [selectedDisks, setSelectedDisks] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState([]);
  const [diskSearch, setDiskSearch] = useState("");
  const [diskSearchProgress, setDiskProgress] = useState(false);
  const [openDiskListModal, setOpenDiskListModal] = useState(false);
  const [openSelectedListModal, setOpenSelectedListModal] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetch = async () => {
      setDiskProgress(true);
      try {
        const response = await dishApi.search(diskSearch);
        if (response?.status === 200) {
          const disks = response.data.disks.map((item) => ({
            id: item.disk_id,
            name: item.disk_name,
            price: item.price,
          }));
          setDiskList(disks);
        }
      } catch (err) {
        setDiskList([]);
      }
      setDiskProgress(false);
    };
    fetch();
  }, [diskSearch]);

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!poster) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(poster);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [poster]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setPoster(undefined);
      return;
    }
    // I've kept this example simple by using the first poster instead of multiple
    setPoster(e.target.files[0]);
  };

  const handleClose = () => {
      setOpen(false);
      setName("");
      setDescription("");
      setPoster("");
      setBeginTime("");
      setEndTime("");
      setSelectedCombos([]);
      setSelectedDisks([]);
  };

  const handleSubmit = () => {
    const submit = async () => {
      setLoading(true);
      try {
        const data = {
          name,
          description,
          beginTime,
          closeTime,
          poster: URL.createObjectURL(poster),
          disks: selectedDisks.filter((item) => item.quantity !== 0),
        };
        const response = await eventApi.create(data);
        if (response?.status === 200) {
          fetchData();
          enqueueSnackbar(response.data?.message, {
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
    setName("");
    setDescription("");
    setBeginTime("");
    setEndTime("");
    setPoster("");
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog
        sx={{
          width: "95%",
          maxWidth: 550,
          maxHeight: "95vh",
          overflowY: "auto",
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        <ModalClose />
        <Typography
          component="h2"
          level="inherit"
          fontSize="1.25em"
          mb="0.25em"
        >
          Add new event
        </Typography>
        <Stack
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
            setOpen(false);
          }}
        >
          <Stack direction="row" spacing={2.5}>
            <Stack className="col-1" width={250} flex={1}>
              <Stack spacing={2}>
                <FormControl required>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name="name"
                    placeholder="Name"
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    minRows={2}
                    maxRows={5}
                    placeholder="This is an event featuring..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </FormControl>
                <TextField
                  required
                  label="Begin Time"
                  type="date"
                  value={beginTime}
                  onChange={(e) => setBeginTime(e.target.value)}
                  sx={{ display: { xs: "flex", sm: "none" } }}
                />
                <TextField
                  required
                  label="Close Time"
                  type="date"
                  value={closeTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  sx={{ display: { xs: "flex", sm: "none" } }}
                />
                <FormControl sx={{ display: { xs: "flex", sm: "none" } }}>
                  <FormLabel>Poster</FormLabel>
                  <IconButton component="label">
                    <AddPhotoAlternateRoundedIcon />
                    <input type="file" hidden onChange={onSelectFile} />
                  </IconButton>
                  {poster && (
                    <AspectRatio
                      ratio="4 / 3"
                      maxHeight={175}
                      objectFit="cover"
                      sx={{ marginTop: 1 }}
                    >
                      <img src={preview} alt="Preview" />
                    </AspectRatio>
                  )}
                </FormControl>

                <FormControl
                    sx={{ display: { xs: "flex", sm: "none" } }}
                >
                    <FormLabel>Disks</FormLabel>
                    <Button
                        variant="outlined"
                        onClick={() =>
                            setOpenDiskListModal(true)
                        }
                    >
                        Select disks
                    </Button>
                </FormControl>

                <FormControl
                    sx={{
                        display: {
                            xs: "flex",
                            md: "flex",
                            lg: "none",
                        },
                    }}
                >
                    <FormLabel>Selected</FormLabel>
                    <Button
                        variant="outlined"
                        onClick={() =>
                            setOpenSelectedListModal(true)
                        }
                    >
                        Edit selected
                    </Button>
                </FormControl>
              </Stack>
            </Stack>

            <Stack
              className="col-2"
              sx={{ display: { xs: "none", sm: "flex" } }}
              flex={1}
              gap={2}
            >
              <TextField
                required
                label="Begin Time"
                type="date"
                value={beginTime}
                onChange={(e) => setBeginTime(e.target.value)}
                sx={{ display: { sx: "none", sm: "flex" } }}
              />
              <TextField
                required
                label="Close Time"
                type="date"
                value={closeTime}
                onChange={(e) => setEndTime(e.target.value)}
                sx={{ display: { sx: "none", sm: "flex" } }}
              />
              <FormControl sx={{ display: { sx: "none", sm: "flex" } }}>
                <FormLabel>Poster</FormLabel>
                <IconButton component="label">
                  <AddPhotoAlternateRoundedIcon />
                  <input type="file" hidden onChange={onSelectFile} />
                </IconButton>
                {poster && (
                  <AspectRatio
                    ratio="4 / 3"
                    maxHeight={175}
                    objectFit="cover"
                    sx={{ marginTop: 1 }}
                  >
                    <img src={preview} alt="Preview" />
                  </AspectRatio>
                )}
              </FormControl>
            </Stack>

          <Stack
              className="col-2"
              gap={2}
              sx={{
                  display: {
                      xs: "none",
                      sm: "flex",
                      md: "none",
                      lg: "flex",
                  },
              }}
          >
              <FormControl
                  sx={{
                      display: {
                          xs: "none",
                          sm: "flex",
                          md: "none",
                      },
                  }}
              >
                  <FormLabel>Disks</FormLabel>
                  <Button
                      variant="outlined"
                      onClick={() => setOpenDiskListModal(true)}
                  >
                      Select disks
                  </Button>
              </FormControl>

              <EventViewSelected
                  diskList={selectedDisks}
                  setDiskList={setSelectedDisks}
              />
          </Stack>

          </Stack>

          <Box mt={3} display="flex" gap={2} sx={{ width: "100%" }}>
            <Button
              type="submit"
              startDecorator={<SaveRoundedIcon />}
              sx={{ flex: 1 }}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="soft"
              color="danger"
              onClick={() => setOpen(false)}
              sx={{ flex: 1 }}
            >
              Cancel
            </Button>
          </Box>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}

function EventViewSelected({ comboList, setComboList, diskList, setDiskList }) {
    return (
        <Stack
            flexBasis={0}
            flexGrow={1}
            sx={{
                pb: 2,
                width: 250,
                maxHeight: { xs: "100%" },
                overflowY: "auto",
            }}
        >
            <EventListSelected
                diskList={diskList}
                setDiskList={setDiskList}
            />
        </Stack>
    );
}

function EventSelector({
    field,
    search,
    setSearch,
    progressIcon,
    list,
    selectedList,
    setSelectedList,
}) {
    return (
        <>
            <Box width={250}>
                <FormControl>
                    <FormLabel>{field}</FormLabel>
                    <Input
                        name="search"
                        placeholder="Search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value.trimStart())}
                        endDecorator={
                            progressIcon ? (
                                <CircularProgress size="sm" color="primary" />
                            ) : (
                                <SearchRoundedIcon color="neutral" />
                            )
                        }
                        sx={{ width: "95%" }}
                    />
                </FormControl>
            </Box>
            <Stack
                flexBasis={0}
                flexGrow={1}
                sx={{
                    mt: 2,
                    pb: 2,
                    maxHeight: { xs: "100%" },
                    overflow: "auto",
                }}
            >
                <EventList
                    list={list}
                    selectedList={selectedList}
                    setSelectedList={setSelectedList}
                />
            </Stack>
        </>
    );
}
