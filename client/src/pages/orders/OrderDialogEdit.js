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
import { SelectEvent } from "./SelectEvent";
import { useDebounce } from "../../hooks";

export default function OrderDialogEdit(props) {
  const { id, open, setOpen, setLoading, fetchData } = props;
  const [customer, setCustomer] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [usedPoint, setUsedPoint] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [table, setTable] = useState(0);
  const [event, setEvent] = useState(null);
  const [reservedTime, setReservedTime] = useState("2002-11-29 00:00:00");
  const [order, setOrder] = useState(null);

  const [dishList, setDishList] = useState([]);
  const [prevDishList, setPrevDishList] = useState([]);
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [dishSearch, setDishSearch] = useState("");
  const [dishSearchProgress, setDishProgress] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [openDishListModal, setOpenDishListModal] = useState(false);
  const [openSelectedListModal, setOpenSelectedListModal] = useState(false);

  const debounceValue = useDebounce(phone, 500);
  const { enqueueSnackbar } = useSnackbar();

  let beforeCost = 0;
  beforeCost += selectedDishes?.reduce((s, i) => s + +i.price * +i.quantity, 0);
  let afterCost = beforeCost - usedPoint || 0;

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await orderApi.getOrderById(id);
        if (response.status === 200) {
          const order = response.data.data;
          console.log("order", order);
          setOrder(order);
          setCustomerId(order.customer_id);
          setUsedPoint(order.used_point);
          setTable(order.table);
          setEvent(order.event);
          const newTime = new Date(
            `${order.order_date.slice(0, 10)}T${order.order_time.slice(0, 5)}`
          );
          newTime.setHours(newTime.getHours() + 31);
          setReservedTime(newTime.toISOString().slice(0, 16));
        }

        const newRes = await orderApi.getDishesByOrderId(id);
        if (newRes.status === 200) {
          const dishes = newRes.data.data.map((item) => ({
            id: item.dish_id,
            name: item.dish_name,
            price: +item.price,
            quantity: +item.quantity,
          }));
          setSelectedDishes([...selectedDishes, ...dishes]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetch();
  }, [id]);

  useEffect(() => {
    // Get user by customer_id
    const fetch = async () => {
      try {
        const response = await customerApi.getCustomerById(customerId);
        console.log("by cus id", response);
        if (response.status === 200) {
          setCustomer(response.data);
        }
      } catch (err) {}
    };
    fetch();
  }, [customerId]);

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
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const save = async () => {
      setLoadingEdit(true);
      try {
        // Fix time delayed 7 hours
        const newTime = new Date(reservedTime);
        newTime.setHours(newTime.getHours() + 7);
        const response = await orderApi.update(id, {
          phone: order.phone,
          customer_id: order.customer_id,
          event_id: event ? event.id : null,
          order_date: newTime.toISOString().slice(0, 10),
          order_time: newTime.toISOString().slice(11, 19),
          order_status: 1, // success
          total_price: afterCost,
          dishes: selectedDishes.map((item) => ({
            dish_id: item.id,
            quantity: item.quantity,
          })),
          used_point: usedPoint,
        });
        console.log("update", response);
        if (response.status === 200) {
          enqueueSnackbar("Update order successfully", { variant: "success" });
          fetchData();
        }
      } catch (err) {
        console.log(err);
        enqueueSnackbar("Update order failed", { variant: "error" });
      }
      setLoadingEdit(false);

      // Update customer point
      if (customer && usedPoint > 0) {
        try {
          const response = await customerApi.updateCustomerById(customerId, {
            ...customer,
            point: customer.point - usedPoint + afterCost * 0.1,
          });
          if (response.status === 200) {
            enqueueSnackbar("Update customer point successfully", {
              variant: "success",
            });
          }
        } catch (err) {
          console.log(err);
          enqueueSnackbar("Update customer point failed", {
            variant: "error",
          });
        }
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
                  <FormControl required>
                    <FormLabel>Phone</FormLabel>
                    <Input
                      disabled
                      name="phone"
                      placeholder="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.trimStart())}
                    />
                  </FormControl>
                  {customer ? (
                    <>
                      <Typography level="h3" fontSize="1em">
                        {customer.name}: {customer.point}
                      </Typography>
                      <FormControl>
                        <FormLabel>Points to Use</FormLabel>
                        <Input
                          name="point"
                          placeholder="Points to use"
                          value={usedPoint}
                          onChange={(e) => {
                            setUsedPoint(e.target.value);
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
                    onChange={(e) => {
                      console.log("reservedTime", e.target.value);
                      console.log("e.target.value", e.target.value);
                      return setReservedTime(e.target.value);
                    }}
                  />
                  <FormControl
                    sx={{
                      display: {
                        xs: "flex",
                        sm: "none",
                      },
                    }}
                  >
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

                  <Typography level="h3" fontSize="1.1em" mt={1}>
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
                  <FormLabel>Dishes</FormLabel>
                  <Button
                    variant="outlined"
                    onClick={() => setOpenDishListModal(true)}
                  >
                    Select dishes
                  </Button>
                </FormControl>

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
        )}
      </ModalDialog>
    </Modal>
  );
}

function OrderViewSelected({ comboList, setComboList, dishList, setDishList }) {
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
        dishList={dishList}
        setDishList={setDishList}
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
