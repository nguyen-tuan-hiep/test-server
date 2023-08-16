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

// Icons
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

// Custom
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import eventApi from "../../api/eventApi";

export default function EventDialogEdit(props) {
  const { id, open, setOpen, setLoading, fetchData } = props;
  const [name, setName] = useState(props.name);
  const [description, setDescription] = useState(props.description);
  const [poster, setPoster] = useState(props.poster);
  const initialDate = new Date(props.beginTime);
  initialDate.setDate(initialDate.getDate() + 1);
  const [beginTime, setBeginTime] = useState(initialDate.toISOString().split("T")[0]);
  const initialCloseTime = new Date(props.closeTime);
  initialCloseTime.setDate(initialCloseTime.getDate() + 1);
  const [closeTime, setEndTime] = useState(initialCloseTime.toISOString().split("T")[0]);
  const [posterChanged, setPosterChanged] = useState(false);
  const [preview, setPreview] = useState();
  const { enqueueSnackbar } = useSnackbar();
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
              poster: poster,
            }
          : {
              name,
              description,
              beginTime,
              closeTime,
              poster: poster,
            };
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
        <Stack component="form">
          <Stack direction="row" spacing={3}>
            <Stack className="col-1" flex={1}>
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
                <FormControl
                  sx={{ display: { xs: "flex", sm: "none" } }}
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
              </Stack>
            </Stack>

            <Stack
              className="col-2"
              sx={{ display: { xs: "none", sm: "flex" } }}
              flex={1}
              gap={2}
            >
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
              <FormControl
                sx={{ display: { sx: "none", sm: "flex" } }}
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
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
