import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import TextField from "@mui/joy/TextField";
import Typography from "@mui/joy/Typography";

// Icons
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

// Custom
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import comboApi from "../../api/comboApi";
import customerApi from "../../api/customerApi";
import dishApi from "../../api/dishApi";
import eventApi from "../../api/eventApi";
import orderApi from "../../api/orderApi";
import Loading from "../../components/Loading";
import status from "../../constants/status";
import OrderList from "./OrderList";
import OrderListSelected from "./OrderListSelected";
import { SelectCustomer } from "./SelectCustomer";
import { SelectEvent } from "./SelectEvent";

export default function OrderDialogEdit(props) {
  const { id, open, setOpen, setLoading, fetchData } = props;
  const [customer, setCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [customerSearchProgress, setCustomerProgress] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [table, setTable] = useState(0);
  const [event, setEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventSearchProgress, setEventProgress] = useState(false);
  const [reservedTime, setReservedTime] = useState("2002-11-29 00:00:00");
  const [comboList, setComboList] = useState([]);
  const [comboSearch, setComboSearch] = useState("");
  const [comboSearchProgress, setComboProgress] = useState(false);
  const [diskList, setDiskList] = useState([]);
  const [selectedDisks, setSelectedDisks] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState([]);
  const [diskSearch, setDiskSearch] = useState("");
  const [diskSearchProgress, setDiskProgress] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [openComboListModal, setOpenComboListModal] = useState(false);
  const [openDiskListModal, setOpenDiskListModal] = useState(false);
  const [openSelectedListModal, setOpenSelectedListModal] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  let beforeCost = 0;
  beforeCost += selectedCombos.reduce((s, i) => s + i.price * i.quantity, 0);
  beforeCost += selectedDisks.reduce((s, i) => s + i.price * i.quantity, 0);
  const afterCost = beforeCost - (event?.discount || 0);

  useEffect(() => {
    const fetch = async () => {
      setDiskProgress(true);
      try {
        const response = await dishApi.search(diskSearch);
        if (response.data?.type === status.success) {
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

  useEffect(() => {
    const fetch = async () => {
      setComboProgress(true);
      try {
        const response = await comboApi.search(comboSearch);
        if (response.data?.type === status.success) {
          const combos = response.data.combos.map((item) => ({
            id: item.combo_id,
            name: item.combo_name,
            price: item.combo_price,
          }));
          setComboList(combos);
        }
      } catch (err) {
        setComboList([]);
      }
      setComboProgress(false);
    };
    fetch();
  }, [comboSearch]);

  useEffect(() => {
    if (event) {
      if (beforeCost < event?.min_cost) {
        setEvent(null);
      }
    }

    const fetch = async () => {
      setEventProgress(true);
      try {
        const response = await eventApi.searchEvent("", beforeCost);
        if (response.data?.type === status.success) {
          setEvents(response.data?.events);
        }
      } catch (err) {
        setEvents([]);
      }
      setEventProgress(false);
    };
    fetch();
    // eslint-disable-next-line
  }, [beforeCost]);

  useEffect(() => {
    const fetch = async () => {
      setCustomerProgress(true);
      try {
        const response = await customerApi.searchByNameOrRank({
          name: "",
        });
        if (response.data?.type === status.success) {
          const customers = response.data.customers.map((item) => ({
            id: item.id,
            name: item.name,
            phone: item.phone,
          }));
          setCustomers(customers);
        }
      } catch (err) {
        setCustomers([]);
      }
      setCustomerProgress(false);
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoadingEdit(true);
      try {
        const response = await orderApi.getOrderById(id);
        if (response.data?.type === status.success) {
          const order = response.data.order;
          setName(order.customer_name);
          setPhone(order.phone);
          setTable(order.table_id);
          setReservedTime(
            new Date(order.reserved_time)
              .toISOString()
              .replace(/:\d{2}.\d{3}Z$/, "")
          );
          setOrderStatus(order.status);
          if (order.event_id) {
            const eventRes = await eventApi.getEventById(order.event_id);
            if (eventRes.data?.type === status.success) {
              setEvent(eventRes.data?.event);
            }
          }
        }
      } catch (err) {
        enqueueSnackbar(err.response.data?.message, {
          variant: "error",
        });
      }
      setLoadingEdit(false);
    };
    fetch();
  }, [id, enqueueSnackbar]);

  useEffect(() => {
    const fetch = async () => {
      setLoadingEdit(true);
      try {
        const response = await orderApi.getComboAndDisk(id);
        if (response.data?.type === status.success) {
          setSelectedDisks(response.data?.disks);
          setSelectedCombos(response.data?.combos);
        }
      } catch (err) {
        setSelectedDisks([]);
        setSelectedCombos([]);
      }
      setLoadingEdit(false);
    };
    fetch();
  }, [id]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const save = async () => {
      try {
        const data = {
          tableId: table,
          reservedTime,
          disks: selectedDisks.filter((item) => item.quantity !== 0),
          combos: selectedCombos.filter((item) => item.quantity !== 0),
          beforeCost,
          afterCost,
          status: orderStatus,
        };

        if (customer) {
          data.customerId = customer.id;
        } else {
          data.customerId = null;
          data.customerName = name;
          data.phone = phone;
        }
        if (event) {
          data.eventId = event.event_id;
        } else {
          data.eventId = null;
        }

        setLoading(true);
        const response = await orderApi.update(id, data);
        if (response.data?.type === status.success) {
          fetchData();
          enqueueSnackbar(response.data?.message, {
            variant: "success",
          });
        }
      } catch (err) {
        setLoading(false);
        enqueueSnackbar(err.response.data?.message, {
          variant: "error",
        });
      }
    };
    save();
    setOpen(() => false);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <ModalDialog
        sx={{
          maxWidth: "100vw",
          maxHeight: "95vh",
          // minWidth: "70vw",
          // minHeight: "70vh",
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
          Edit order
        </Typography>
        {loadingEdit && (
          <Stack
            mb={16}
            minWidth="65vw"
            minHeight="65vh"
            justifyContent="center"
          >
            <Loading />
          </Stack>
        )}
        {!loadingEdit && (
          <Stack
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
              handleClose();
            }}
          >
            <Stack direction="row" spacing={2.5}>
              <Stack className="col-1" width={250} flex={1}>
                <Stack spacing={2}>
                  <FormControl>
                    <FormLabel>Customer name</FormLabel>
                    <SelectCustomer
                      customer={customer}
                      setCustomer={setCustomer}
                      customers={customers}
                      name={name}
                      setName={setName}
                      setPhone={setPhone}
                      loading={customerSearchProgress}
                    />
                  </FormControl>
                  <FormControl required>
                    <FormLabel>Phone</FormLabel>
                    <Input
                      name="phone"
                      placeholder="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.trimStart())}
                    />
                  </FormControl>
                  <FormControl required>
                    <FormLabel>Table</FormLabel>
                    <Input
                      type="number"
                      name="table"
                      placeholder="Table"
                      value={table}
                      onChange={(e) => setTable(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Input
                      name="status"
                      placeholder="Status"
                      value={orderStatus}
                      onChange={(e) => setOrderStatus(e.target.value)}
                    />
                  </FormControl>
                  <TextField
                    required
                    label="Reserved At"
                    type="datetime-local"
                    value={reservedTime}
                    onChange={(e) => setReservedTime(e.target.value)}
                  />
                  <FormControl>
                    <FormLabel>
                      Event{" "}
                      {`(Discount: ${(event?.discount || 0).toLocaleString()})`}
                    </FormLabel>
                    <SelectEvent
                      event={event}
                      setEvent={setEvent}
                      events={events}
                      loading={eventSearchProgress}
                    />
                  </FormControl>

                  <FormControl
                    sx={{
                      display: {
                        xs: "flex",
                        sm: "none",
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

                  <FormControl
                    sx={{
                      display: {
                        xs: "flex",
                        sm: "none",
                      },
                    }}
                  >
                    <FormLabel>Combos</FormLabel>
                    <Button
                      variant="outlined"
                      onClick={() => setOpenComboListModal(true)}
                    >
                      Select combos
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

                  <Typography level="h3" fontSize="1.1em" mt={1}>
                    {"Total: "}
                    {beforeCost === afterCost
                      ? `${beforeCost.toLocaleString()}`
                      : `${beforeCost.toLocaleString()} → ${afterCost.toLocaleString()}`}
                  </Typography>
                </Stack>
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

                <FormControl
                  sx={{
                    display: {
                      xs: "none",
                      sm: "flex",
                      md: "none",
                    },
                  }}
                >
                  <FormLabel>Combos</FormLabel>
                  <Button
                    variant="outlined"
                    onClick={() => setOpenComboListModal(true)}
                  >
                    Select combos
                  </Button>
                </FormControl>

                <OrderViewSelected
                  comboList={selectedCombos}
                  setComboList={setSelectedCombos}
                  diskList={selectedDisks}
                  setDiskList={setSelectedDisks}
                />
              </Stack>

              <Stack
                className="col-3"
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <OrderSelector
                  field={"Combo"}
                  search={comboSearch}
                  setSearch={setComboSearch}
                  progressIcon={comboSearchProgress}
                  list={comboList}
                  setList={setComboList}
                  selectedList={selectedCombos}
                  setSelectedList={setSelectedCombos}
                />
              </Stack>

              <Stack
                className="col-4"
                sx={{ display: { xs: "none", md: "flex" } }}
              >
                <OrderSelector
                  field={"Disk"}
                  search={diskSearch}
                  setSearch={setDiskSearch}
                  progressIcon={diskSearchProgress}
                  list={diskList}
                  setList={setDiskList}
                  selectedList={selectedDisks}
                  setSelectedList={setSelectedDisks}
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
                onClick={(e) => setOpen(false)}
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
                <OrderViewSelected
                  comboList={selectedCombos}
                  setComboList={setSelectedCombos}
                  diskList={selectedDisks}
                  setDiskList={setSelectedDisks}
                />
              </ModalDialog>
            </Modal>

            <Modal
              open={openComboListModal}
              onClose={() => setOpenComboListModal(false)}
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
                  Select combos
                </Typography>
                <OrderSelector
                  field={"Combo"}
                  search={comboSearch}
                  setSearch={setComboSearch}
                  progressIcon={comboSearchProgress}
                  list={comboList}
                  setList={setComboList}
                  selectedList={selectedCombos}
                  setSelectedList={setSelectedCombos}
                />
              </ModalDialog>
            </Modal>

            <Modal
              open={openDiskListModal}
              onClose={() => setOpenDiskListModal(false)}
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
                  Select disks
                </Typography>
                <OrderSelector
                  field={"Disk"}
                  search={diskSearch}
                  setSearch={setDiskSearch}
                  progressIcon={diskSearchProgress}
                  list={diskList}
                  setList={setDiskList}
                  selectedList={selectedDisks}
                  setSelectedList={setSelectedDisks}
                />
              </ModalDialog>
            </Modal>
          </Stack>
        )}
      </ModalDialog>
    </Modal>
  );
}

function OrderViewSelected({ comboList, setComboList, diskList, setDiskList }) {
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
      <OrderListSelected
        comboList={comboList}
        setComboList={setComboList}
        diskList={diskList}
        setDiskList={setDiskList}
      />
    </Stack>
  );
}

function OrderSelector({
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
        <OrderList
          list={list}
          selectedList={selectedList}
          setSelectedList={setSelectedList}
        />
      </Stack>
    </>
  );
}
