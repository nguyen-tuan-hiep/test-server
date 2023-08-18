import Autocomplete from "@mui/joy/Autocomplete";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import CircularProgress from "@mui/joy/CircularProgress";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";

export function SelectEvent({ event, setEvent, events, loading }) {
  return (
    <Autocomplete
      placeholder="Apply event to order"
      value={event}
      onOpen={(e) => {
        e.preventDefault();
      }}
      onClose={(e) => {
        e.preventDefault();
      }}
      onChange={(e, newValue) => {
        setEvent(newValue);
      }}
      slotProps={{
        input: {
          autoComplete: "new-password", // disable autocomplete and autofill
        },
      }}
      options={events}
      autoHighlight
      getOptionLabel={(option) => option?.event_name || ""}
      isOptionEqualToValue={(option, value) =>
        option.event_id === value.event_id
      }
      loading={loading}
      endDecorator={
        loading ? (
          <CircularProgress size="sm" sx={{ bgcolor: "background.surface" }} />
        ) : null
      }
      renderOption={(props, option) => (
        <AutocompleteOption {...props}>
          <ListItemContent sx={{ fontSize: "sm" }}>
            {option.event_name} # {option.event_id}
            <Typography level="body3">
              {"Time: "}
              {new Date(option.begin_time).toLocaleDateString()}
              {" - "}
              {new Date(option.close_time).toLocaleDateString()}
            </Typography>
          </ListItemContent>
        </AutocompleteOption>
      )}
    />
  );
}
