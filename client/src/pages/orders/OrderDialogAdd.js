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
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";

// Icons
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

// Custom
import OrderList from "./OrderList";
import OrderListSelected from "./OrderListSelected";
import { SelectEvent } from "./SelectEvent";
import dishApi from "../../api/dishApi";
import status from "../../constants/status";
import customerApi from "../../api/customerApi";
import eventApi from "../../api/eventApi";
import orderApi from "../../api/orderApi";
import moment from "moment";
import { useDebounce } from "../../hooks";

export default function OrderDialogAdd({
  open,
  setOpen,
  setLoading,
  fetchData,
}) {
  let today = new moment().local().format("YYYY-MM-DDTHH:mm");
  const [customer, setCustomer] = useState(null);
  const [usedPoint, setUsedPoints] = useState(0);
  const [table, setTable] = useState(0);
  const [event, setEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [eventSearchProgress, setEventProgress] = useState(false);
  const [reservedTime, setReservedTime] = useState(today);

  const [dishList, setDishList] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [dishSearch, setDishSearch] = useState("");
  const [dishSearchProgress, setDishProgress] = useState(false);
  const [openDishListModal, setOpenDishListModal] = useState(false);
  const [openSelectedListModal, setOpenSelectedListModal] = useState(false);

  const debounceValue = useDebounce(phone, 500);
  const { enqueueSnackbar } = useSnackbar();

  let beforeCost = 0;
  beforeCost += selectedDishes.reduce((s, i) => s + i.price * i.quantity, 0);
  let afterCost = beforeCost - usedPoint || 0;

  useEffect(() => {
    // Get user by phone
    const fetch = async () => {
      if (!debounceValue) {
        setCustomer(null);
        return;
      }
      try {
        const response = await customerApi.searchByPhone(debounceValue);
        if (response.status === 200) {
          const customer = response.data;
          setCustomer(customer);
        }
      } catch (err) {
        setCustomer(null);
      }
    };
    fetch();
  }, [debounceValue]);

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

  useEffect(() => {
    const fetch = async () => {
      setEventProgress(true);
      try {
        const response = await eventApi.searchEvent("");
        if (response.status === 200) {
          setEvents(response.data);
        }
      } catch (err) {
        setEvents([]);
      }
      setEventProgress(false);
    };
    fetch();
  }, [beforeCost]);

  useEffect(() => {
    // Add free dishes from event
    const fetch = async () => {
      if (!event) {
        setSelectedDishes(selectedDishes.filter((item) => !item.isFree));
        return;
      }
      try {
        const response = await eventApi.getFreeDishes(event.event_id);
        if (response.status === 200) {
          const dishes = response.data.map((item) => ({
            id: item.dish_id,
            name: item.dish_name,
            price: 0,
            quantity: +item.quantity,
            isFree: true,
          }));
          setSelectedDishes((prev) => [...prev, ...dishes]);
        }
      } catch (err) {
        setSelectedDishes([]);
      }
    };

    fetch();
  }, [event]);

  const handleClose = () => {
    setOpen(false);
    setEvent(null);
    setName("");
    setPhone("");
    setTable(0);
    setReservedTime(today);
    setSelectedDishes([]);
  };

  const handleSubmit = () => {
    const createOrder = async () => {
      const data = {
        phone,
        customer_id: customer.customer_id,
        order_date: reservedTime.slice(0, 10),
        order_time: reservedTime.slice(11, 16),
        order_status: 1, // success
        total_price: afterCost,
        dishes: selectedDishes.filter(
          (item) => item.quantity !== 0 || item.isFree
        ),
        used_point: usedPoint,
      };
      setLoading(true);
      try {
        const response = await orderApi.create(data);
        if (response.status === 200) {
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

    const updateCustomer = async () => {
      if (!customer) {
        return;
      }
      try {
        const response = await customerApi.updateCustomerById(
          customer.customer_id,
          {
            ...customer,
            point: customer.point - usedPoint + afterCost * 0.1,
          }
        );
        if (response.status === 200) {
          enqueueSnackbar(response.data?.message, {
            variant: "success",
          });
        }
      } catch (err) {
        enqueueSnackbar(err.response.data?.message, {
          variant: "error",
        });
      }
    };

    createOrder();
    updateCustomer();
    setName("");
    setPhone("");
    setReservedTime(today);
    setEvent(null);
    setTable(0);
    setCustomer(null);
    setSelectedDishes([]);
  };

  return (
    <Modal open={open} onClose={handleClose}>
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
          Add new order
        </Typography>
        <Stack
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
            handleClose();
          }}
        >
          <Stack direction="row" spacing={2.5}>
            <Stack className="col-1" width={250} flex={1}>
              <Stack spacing={2}>
                <FormControl required>
                  <FormLabel>Phone</FormLabel>
                  <Input
                    name="phone"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.trimStart())}
                  />
                </FormControl>
                {/* Notify found customer */}
                {customer ? (
                  <>
                    <Typography level="h3" fontSize="1em">
                      {customer.name}: {customer.point}
                      {usedPoint > 0 &&
                        ` → ${customer.point - usedPoint + afterCost * 0.1}`}
                    </Typography>
                    <FormControl>
                      <FormLabel>Points to Use</FormLabel>
                      <Input
                        name="point"
                        placeholder="Points to use"
                        value={usedPoint}
                        onChange={(e) => {
                          setUsedPoints(e.target.value);
                        }}
                      />
                    </FormControl>
                  </>
                ) : (
                  <Typography level="p" fontSize="0.85em">
                    Is currently not a member!
                  </Typography>
                )}
                <TextField
                  required
                  label="Reserved At"
                  type="datetime-local"
                  value={reservedTime}
                  onChange={(e) => setReservedTime(e.target.value)}
                />
                <FormControl>
                  <FormLabel>Event</FormLabel>
                  <SelectEvent
                    event={event}
                    setEvent={setEvent}
                    events={events}
                    loading={eventSearchProgress}
                  />
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

                <Typography level="h3" fontSize="1em" mt={1}>
                  {"Total: "}
                  {beforeCost === afterCost
                    ? `${beforeCost}`
                    : `${beforeCost} → ${afterCost}`}
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
                },
              }}
            >
              <OrderViewSelected
                dishList={selectedDishes}
                setDishList={setSelectedDishes}
              />
            </Stack>

            <Stack
              className="col-4"
              sx={{ display: { xs: "none", md: "flex" } }}
            >
              <OrderSelector
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
              onClick={handleClose}
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
              <OrderSelector
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

function OrderViewSelected({ dishList, setDishList }) {
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
      <OrderListSelected dishList={dishList} setDishList={setDishList} />
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
