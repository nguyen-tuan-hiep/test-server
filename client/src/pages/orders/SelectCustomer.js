import Autocomplete from "@mui/joy/Autocomplete";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import CircularProgress from "@mui/joy/CircularProgress";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";

export function SelectCustomer({
  customer,
  setCustomer,
  customers,
  loading,
  name,
  setName,
  setPhone,
}) {
  return (
    <Autocomplete
      placeholder="Search customer"
      value={customer}
      onOpen={(e) => {
        e.preventDefault();
      }}
      onClose={(e) => {
        e.preventDefault();
      }}
      onChange={(e, newValue) => {
        setCustomer(newValue);
        if (newValue) {
          setName(newValue.name);
          setPhone(newValue.phone);
        } else {
          setName("");
          setPhone("");
        }
      }}
      inputValue={name}
      onInputChange={(e) => setName(e.target.value)}
      freeSolo
      slotProps={{
        input: {
          autoComplete: "new-password", // disable autocomplete and autofill
        },
      }}
      options={customers}
      autoHighlight
      getOptionLabel={(option) => option?.name || ""}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={loading}
      endDecorator={
        loading ? (
          <CircularProgress size="sm" sx={{ bgcolor: "background.surface" }} />
        ) : null
      }
      renderOption={(props, option) => (
        <AutocompleteOption {...props}>
          <ListItemContent sx={{ fontSize: "sm" }}>
            {option.name}
            <Typography level="body3">Phone: {option.phone}</Typography>
          </ListItemContent>
        </AutocompleteOption>
      )}
    />
  );
}
