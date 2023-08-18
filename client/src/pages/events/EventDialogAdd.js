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

  const [dishList, setDishList] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [dishSearch, setDishSearch] = useState("");
  const [dishSearchProgress, setDishProgress] = useState(false);
  const [openDishListModal, setOpenDishListModal] = useState(false);
  const [openSelectedListModal, setOpenSelectedListModal] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetch = async () => {
      setDishProgress(true);
      try {
        const response = await dishApi.search(dishSearch);
        if (response.data.message === "success") {
          const dishes = response.data.data.map((item) => ({
            id: item.dish_id,
            name: item.dish_name,
            price: item.price,
          }));
          setDishList(dishes);
        }
      } catch (err) {
        setDishList([]);
      }
      setDishProgress(false);
    };
    fetch();
  }, [dishSearch]);

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
    setSelectedDishes([]);
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
          poster: poster && URL.createObjectURL(poster),
          dishes: selectedDishes.filter((item) => item.quantity !== 0),
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
        console.log(err);
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
          maxWidth: "100vw",
          maxHeight: "95vh",
          overflow: "auto",
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
                    maxRows={2}
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
                  // sx={{ display: { xs: "flex", sm: "none" } }}
                />
                <TextField
                  required
                  label="Close Time"
                  type="date"
                  value={closeTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  // sx={{ display: { xs: "flex", sm: "none" } }}
                />
                <FormControl
                // sx={{ display: { xs: "flex", sm: "none" } }}
                >
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

                <FormControl sx={{ display: { xs: "flex", sm: "none" } }}>
                  <FormLabel>Dishes</FormLabel>
                  <Button
                    variant="outlined"
                    onClick={() => setOpenDishListModal(true)}
                  >
                    Select dishes
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
                    onClick={() => setOpenSelectedListModal(true)}
                  >
                    Edit selected
                  </Button>
                </FormControl>
              </Stack>
            </Stack>

            <Stack
              className="col-2"
              gap={2}
              sx={{
                display: {
                  xs: "none",
                  lg: "flex",
                },
              }}
            >
              <EventViewSelected
                dishList={selectedDishes}
                setDishList={setSelectedDishes}
              />
            </Stack>

            <Stack
              className="col-3"
              sx={{ display: { xs: "none", sm: "flex" } }}
            >
              <EventSelector
                field={"Dish"}
                search={dishSearch}
                setSearch={setDishSearch}
                progressIcon={dishSearchProgress}
                list={dishList}
                setList={setDishList}
                selectedList={selectedDishes}
                setSelectedList={setSelectedDishes}
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

          <Modal
            open={openSelectedListModal}
            onClose={() => setOpenSelectedListModal(false)}
          >
            <ModalDialog
              sx={{
                maxWidth: "100vw",
                maxHeight: "95vh",
                overflow: "auto",
                borderRadius: "md",
                p: 3,
                boxShadow: "lg",
              }}
            >
              <ModalClose />
              <Typography component="h2" fontSize="1.25em">
                Edit selected
              </Typography>
              <EventViewSelected
                dishList={selectedDishes}
                setDishList={setSelectedDishes}
              />
            </ModalDialog>
          </Modal>

          <Modal
            open={openDishListModal}
            onClose={() => setOpenDishListModal(false)}
          >
            <ModalDialog
              sx={{
                maxWidth: "100vw",
                maxHeight: "95vh",
                overflow: "auto",
                borderRadius: "md",
                p: 3,
                boxShadow: "lg",
              }}
            >
              <ModalClose />
              <Typography component="h2" fontSize="1.25em">
                Select dishes
              </Typography>
              <EventSelector
                field={"Dish"}
                search={dishSearch}
                setSearch={setDishSearch}
                progressIcon={dishSearchProgress}
                list={dishList}
                setList={setDishList}
                selectedList={selectedDishes}
                setSelectedList={setSelectedDishes}
              />
            </ModalDialog>
          </Modal>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}

function EventViewSelected({ dishList, setDishList }) {
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
      <EventListSelected dishList={dishList} setDishList={setDishList} />
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
