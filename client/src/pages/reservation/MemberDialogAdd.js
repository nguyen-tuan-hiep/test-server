import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import TextField from "@mui/material/TextField";
import ModalDialog from "@mui/joy/ModalDialog";
import SelectFilter from "../../components/SelectFilter";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { useSnackbar } from "notistack";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

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
  const [table, setTable] = useState(0);
  const [phone, setPhone] = useState("");
  const [address, setAdress] = useState("");
  const [gender, setGender] = useState("");
  const [res_date, setRes_date] = useState(new Date());
  const [res_time_start, setRes_time_start] = useState(new Date().getTime());
  const [point, setPoint] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  const filterOpts = [7, 9, 11, 13, 15, 17, 19, 21];

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
          position: "relative",
          width: 350,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
          zIndex: 1000,
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
              {/* <FormControl required>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl> */}
              <FormControl required>
                <FormLabel>Phone</FormLabel>
                <Input
                  name="phone"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </FormControl>
              {/* <FormControl>
                <FormLabel>Table</FormLabel>
                <SelectFilter
                  filterOpt={table}
                  setFilterOpt={setTable}
                  filterOpts={filterOpts}
                />
              </FormControl> */}
              <FormControl>
                <FormLabel>Table</FormLabel>
                <Input
                  name="table"
                  placeholder="Table"
                  value={table}
                  onChange={(e) => setTable(e.target.value)}
                />
              </FormControl>
              <FormControl required>
                <FormLabel>Reservation Date</FormLabel>
                <LocalizationProvider dateAdapter={AdapterDateFns} className="px-2">
          <DatePicker
            label="Check-in"
            value={res_date}
            onChange={(newValue) => {
              setRes_date(newValue);
            }}
            textField={(params) => <TextField {...params} />}
            format="dd/MM/yyyy"
            minDate={new Date()}
            maxDate={
              res_date ? new Date(String(res_date)) : new Date('2099-12-31')
            }

          />
              </LocalizationProvider>

              </FormControl>
              <FormControl>
                <FormLabel>Reservation Time</FormLabel>
                <SelectFilter
                  filterOpt={res_time_start}
                  setFilterOpt={setRes_time_start}
                  filterOpts={filterOpts}
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
