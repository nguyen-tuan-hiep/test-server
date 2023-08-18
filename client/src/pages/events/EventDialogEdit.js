import AspectRatio from "@mui/joy/AspectRatio";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import TextField from "@mui/joy/TextField";
import Textarea from "@mui/joy/Textarea";
import Typography from "@mui/joy/Typography";

// Icons
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

// Custom
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import dishApi from "../../api/dishApi";
import eventApi from "../../api/eventApi";
import EventListSelected from "./EventListSelected";
import EventList from "./EventList";

export default function EventDialogEdit(props) {
  const { id, open, setOpen, setLoading, fetchData } = props;
  const [name, setName] = useState(props.name);
  const [description, setDescription] = useState(props.description);
  const [poster, setPoster] = useState(props.poster);
  const initialDate = new Date(props.beginTime);
  initialDate.setDate(initialDate.getDate() + 1);
  const [beginTime, setBeginTime] = useState(
    initialDate.toISOString().split("T")[0]
  );
  const initialCloseTime = new Date(props.closeTime);
  initialCloseTime.setDate(initialCloseTime.getDate() + 1);
  const [closeTime, setEndTime] = useState(
    initialCloseTime.toISOString().split("T")[0]
  );
  const [posterChanged, setPosterChanged] = useState(false);
  const [preview, setPreview] = useState();

  const [dishList, setDishList] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [dishSearch, setDishSearch] = useState("");
  const [dishSearchProgress, setDishProgress] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [openDishListModal, setOpenDishListModal] = useState(false);
  const [openSelectedListModal, setOpenSelectedListModal] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetch = async () => {
      setDishProgress(true);
      try {
        const response = await dishApi.search(dishSearch);
        if (response?.status >= 200 && response?.status < 400) {
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

  useEffect(() => {
    const fetch = async () => {
      setLoadingEdit(true);
      try {
        const response = await eventApi.getFreeDishes(id);
        console.log(response);
        if (response?.status === 200) {
          const newSelected = response.data.map((item) => ({
            id: item.dish_id,
            name: item.dish_name,
            price: +item.price,
            quantity: +item.quantity,
          }));
          setSelectedDishes(newSelected);
          // setSelectedDishes(response.data);
        }
      } catch (err) {
        console.log("Reseting selected dishes for id: ", id);
        setSelectedDishes([]);
      }
      setLoadingEdit(false);
    };
    fetch();
  }, [id, open]);

  useEffect(() => {
    setPreview(poster);
    // eslint-disable-next-line
  }, []);

  const onSelectFile = (e) => {
    setPosterChanged(true);
    if (!e.target.files || e.target.files.length === 0) {
      setPoster(undefined);
      return;
    }
    // I've kept this example simple by using the first poster instead of multiple
    setPoster(e.target.files[0]);
    const objectUrl = URL.createObjectURL(e.target.files[0]);
    setPreview(objectUrl);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const save = async () => {
      setLoading(true);
      try {
        const data = posterChanged
          ? {
              name,
              description,
              beginTime,
              closeTime,
              poster: URL.createObjectURL(poster),
              dishes: selectedDishes.filter((item) => item.quantity !== 0),
            }
          : {
              name,
              description,
              beginTime,
              closeTime,
              poster: poster,
              dishes: selectedDishes.filter((item) => item.quantity !== 0),
            };
        console.log(data);
        const response = await eventApi.update(id, data);
        if (response?.status === 200) {
          fetchData();
          enqueueSnackbar(response?.data?.message, {
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

    save();
    setOpen(() => false);
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
          Edit event #{id}
        </Typography>
        <Stack component="form">
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
                  label="Begin Time"
                  type="date"
                  value={beginTime}
                  onChange={(e) => setBeginTime(e.target.value)}
                  sx={{ display: { xs: "flex", sm: "none" } }}
                />
                <TextField
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
                <TextField
                  label="Begin Time"
                  type="date"
                  value={beginTime}
                  onChange={(e) => setBeginTime(e.target.value)}
                  sx={{ display: { sx: "none", sm: "flex" } }}
                />
                <TextField
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
              sx={{ display: { xs: "none", md: "flex" } }}
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
              type="button"
              onClick={(e) => handleSave(e)}
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
