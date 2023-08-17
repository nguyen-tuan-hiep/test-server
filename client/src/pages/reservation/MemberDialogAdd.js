import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import SelectFilter from "../../components/SelectFilter";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { useSnackbar } from "notistack";

// Custom
import { useState } from "react";
import { filterOpts } from ".";
import customerApi from "../../api/customerApi";
import status from "../../constants/status";

export default function MemberDialogAdd({
  open,
  setOpen,
  setLoading,
  fetchData,
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAdress] = useState("");
  const [gender, setGender] = useState("");
  const [point, setPoint] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const filterOpts = ["Female", "Male"];

  const handleSubmit = (e) => {
    e.preventDefault();
    const submit = async () => {
      setLoading(true);
      try {
        const data = {
          name,
          phone,
          address,
          point,
          gender
        };

        const response = await customerApi.create(data);
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
    submit();
    setOpen(false);
    setName("");
    setPhone("");
    setAdress("");
    setGender("");
    setPoint("");
    // setRank(filterOpts[0]);
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog
        sx={{
          width: 350,
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
          Add new reservation
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack>
            <Stack spacing={2}>
              <FormControl required>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl required>
                <FormLabel>Phone</FormLabel>
                <Input
                  name="phone"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Gender</FormLabel>
                <SelectFilter
                  filterOpt={gender}
                  setFilterOpt={setGender}
                  filterOpts={filterOpts}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Address</FormLabel>
                <Input
                  name="address"
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAdress(e.target.value)}
                />
              </FormControl>
              <FormControl required>
                <FormLabel>Point</FormLabel>
                <Input
                  name="point"
                  placeholder="Point"
                  value={point}
                  onChange={(e) => setPoint(e.target.value)}
                />
              </FormControl>
            </Stack>
            <Box mt={3} display="flex" gap={2} sx={{ width: "100%" }}>
              <Button type="submit" sx={{ flex: 1 }}>
                Save
              </Button>
            </Box>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
}
