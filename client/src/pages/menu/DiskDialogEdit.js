import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import Stack from "@mui/joy/Stack";
import Textarea from "@mui/joy/Textarea";
import Typography from "@mui/joy/Typography";

// Icons
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

// Custom
import { AspectRatio } from "@mui/joy";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { diskOpts } from ".";
import diskApi from "../../api/diskApi";
import status from "../../constants/status";

export default function DiskDialogEdit(props) {
    const { id, open, setOpen, fetchData, setLoading } = props;
    const [name, setName] = useState(props.name);
    const [description, setDescription] = useState(props.description);
    const [price, setPrice] = useState(props.price);
    const [image, setImage] = useState(props.image);
    const [category, setCategory] = useState(props.category);
    const [preview, setPreview] = useState();
    const { enqueueSnackbar } = useSnackbar();

    // create a preview as a side effect, whenever selected file is changed
    useEffect(() => {
        setPreview(image);
        // eslint-disable-next-line
    }, []);

    const onSelectFile = (e) => {
        if (!e.target.files || e.target.files.length === 0) {
            setImage(undefined);
            return;
        }
        // I've kept this example simple by using the first image instead of multiple
        setImage(e.target.files[0]);
        const objectUrl = URL.createObjectURL(e.target.files[0]);
        setPreview(objectUrl);
    };

    const handleSave = (e) => {
        e.preventDefault();
        const save = async () => {
            setLoading(true);
            try {
                const response = await diskApi.update(id, {
                    name,
                    image,
                    description,
                    price,
                    categoryId:
                        diskOpts.findIndex((item) => item === category) + 1,
                });

                if (response?.data?.type === status.success) {
                    fetchData();
                    enqueueSnackbar(response.data.message, {
                        variant: "success",
                    });
                }
            } catch (err) {
                enqueueSnackbar(err.response.data?.message, {
                    variant: "error",
                });
                setLoading(false);
            }
        };
        save();
        setOpen(() => false);
    };

    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <ModalDialog
                sx={{
                    width: "90%",
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
                    Edit disk
                </Typography>
                <form>
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
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Desc.</FormLabel>
                                    <Textarea
                                        name="description"
                                        minRows={2}
                                        maxRows={2}
                                        placeholder="This is a disk made with..."
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                    />
                                </FormControl>
                                <FormControl required>
                                    <FormLabel>Price</FormLabel>
                                    <Input
                                        name="price"
                                        placeholder="Price"
                                        value={price}
                                        onChange={(e) =>
                                            setPrice(e.target.value)
                                        }
                                    />
                                </FormControl>
                                <FormControl
                                    required
                                    sx={{ display: { xs: "flex", sm: "none" } }}
                                >
                                    <FormLabel>Image</FormLabel>
                                    <IconButton component="label">
                                        <AddPhotoAlternateRoundedIcon />
                                        <input
                                            type="file"
                                            hidden
                                            onChange={onSelectFile}
                                        />
                                    </IconButton>
                                    {image && (
                                        <AspectRatio
                                            ratio="4 / 3"
                                            objectFit="cover"
                                            sx={{ marginTop: 1 }}
                                        >
                                            <img src={preview} alt="Preview" />
                                        </AspectRatio>
                                    )}
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        value={category}
                                        onChange={(e, newCategory) =>
                                            setCategory(newCategory)
                                        }
                                    >
                                        {diskOpts.map((filterOpt) => (
                                            <Option
                                                key={filterOpt}
                                                value={filterOpt}
                                            >
                                                {filterOpt}
                                            </Option>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Stack>
                        </Stack>

                        <Stack
                            className="col-2"
                            sx={{ display: { xs: "none", sm: "flex" } }}
                            flex={1}
                        >
                            <FormControl required>
                                <FormLabel>Image</FormLabel>
                                <IconButton component="label">
                                    <AddPhotoAlternateRoundedIcon />
                                    <input
                                        type="file"
                                        hidden
                                        onChange={onSelectFile}
                                    />
                                </IconButton>
                                {image && (
                                    <AspectRatio
                                        ratio="4 / 3"
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
                </form>
            </ModalDialog>
        </Modal>
    );
}
