import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
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
  const [email, setEmail] = useState("");
  const [point, setPoint] = useState("");
  const [rank, setRank] = useState(filterOpts[0]);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (e) => {
    e.preventDefault();
    const submit = async () => {
      setLoading(true);
      try {
        const data = {
          name,
          phone,
          email,
          point,
          rankId: filterOpts.findIndex((item) => item === rank) + 1,
        };

        const response = await customerApi.create(data);
        if (response?.data?.type === status.success) {
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
    setEmail("");
    setPhone("");
    setPoint("");
    setRank(filterOpts[0]);
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
          Add new member
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
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
              <FormControl required>
                <FormLabel>Point</FormLabel>
                <Input
                  name="point"
                  placeholder="Point"
                  value={point}
                  onChange={(e) => setPoint(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Rank</FormLabel>
                <Select
                  value={rank}
                  onChange={(e, newRank) => {
                    setRank(newRank);
                  }}
                >
                  {filterOpts.map((filterOpt) => (
                    <Option key={filterOpt} value={filterOpt}>
                      {filterOpt}
                    </Option>
                  ))}
                </Select>
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
