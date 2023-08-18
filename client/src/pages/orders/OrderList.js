import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

// Icons
import Add from "@mui/icons-material/Add";

// Custom
import React from "react";

export default function OrderList({ list, selectedList, setSelectedList }) {
  return (
    <Stack py={2} spacing={2}>
      {list.map((item) => (
        <React.Fragment key={item.id}>
          <Stack
            direction="row"
            justifyContent={"space-between"}
            paddingRight={2}
          >
            <FormControl>
              <FormLabel>{item.name}</FormLabel>
              <Typography level="body3">Price: ${item.price}</Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  pt: 1,
                  pr: 2,
                  mr: 3,
                  borderTop: "1px solid",
                  borderColor: "background.level2",
                }}
              ></Box>
            </FormControl>
            <IconButton
              sx={{ height: "80%", aspectRatio: "1/1" }}
              size="sm"
              variant="outlined"
              onClick={() => {
                const indexFound = selectedList.findIndex(
                  (i) => i.id === item.id
                );
                if (indexFound === -1) {
                  setSelectedList((prev) => [
                    ...prev,
                    {
                      id: item.id,
                      quantity: 1,
                      name: item.name,
                      price: item.price,
                    },
                  ]);
                } else {
                  setSelectedList((prev) => {
                    prev[indexFound].quantity += 1;
                    return [...prev];
                  });
                }
              }}
            >
              <Add />
            </IconButton>
          </Stack>
        </React.Fragment>
      ))}
    </Stack>
  );
}
