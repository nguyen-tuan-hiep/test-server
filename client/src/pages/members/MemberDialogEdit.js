import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Option from '@mui/joy/Option';
import Select from '@mui/joy/Select';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';

// Icons
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';

// Custom
import { useState } from 'react';
import { filterOpts } from '.';
import { useSnackbar } from 'notistack';
import customerApi from '../../api/customerApi';
import status from '../../constants/status';
import { MenuItem } from '@mui/material';

export default function MemberDialogEdit(props) {
  const { id, open, setOpen, setLoading, fetchData } = props;
  const [name, setName] = useState(props.name);
  const [phone, setPhone] = useState(props.phone);
  const [gender, setGender] = useState(props.gender);
  const [address, setAdress] = useState(props.address);
  const [point, setPoint] = useState(props.point);
  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = (e, id) => {
    e.preventDefault();
    const remove = async () => {
      try {
        const response = await customerApi.deleteCustomerById(id);
        if (response?.status === 200) {
          fetchData();
          enqueueSnackbar(response.data.message, {
            variant: 'success',
          });
        }
      } catch (err) {
        enqueueSnackbar(err.response.data?.message, {
          variant: 'error',
        });
      }
    };
    remove();
  };

  const handleSave = (e) => {
    e.preventDefault();
    const save = async () => {
      setLoading(true);
      try {
        const data = {
          name,
          phone,
          gender,
          address,
          point,
        };
        const response = await customerApi.updateCustomerById(id, data);
        if (response?.status === 200) {
          fetchData();
          enqueueSnackbar(response?.data?.message, {
            variant: 'success',
          });
        }
      } catch (err) {
        setLoading(false);
        enqueueSnackbar(err.response?.data?.message, {
          variant: 'error',
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
          width: 350,
          borderRadius: 'md',
          p: 3,
          boxShadow: 'lg',
        }}
      >
        <ModalClose />
        <Typography
          component="h2"
          level="inherit"
          fontSize="1.25em"
          mb="0.25em"
        >
          Edit member
        </Typography>
        <Stack component="form">
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
              <FormLabel>Gender</FormLabel>
              <Input
                name="gender"
                placeholder="Gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              />
              {/* <Select
                value={gender}
                defaultValue="Male"
                onChange={(e) => setGender(e.target.value)}
              >
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
              </Select> */}
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

          <Box mt={3} display="flex" gap={2} sx={{ width: '100%' }}>
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
              onClick={(e) => setOpen(false)}
              sx={{
                flex: 1,
                display: {
                  xs: 'none',
                  sm: 'flex',
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="soft"
              color="danger"
              onClick={(e) => handleDelete(e)}
              startDecorator={<DeleteForeverRoundedIcon />}
              sx={{
                flex: 1,
                display: {
                  xs: 'flex',
                  sm: 'none',
                },
              }}
            >
              Delete
            </Button>
          </Box>
        </Stack>
      </ModalDialog>
    </Modal>
  );
}
