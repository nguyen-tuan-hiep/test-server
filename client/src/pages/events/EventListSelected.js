import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

// Icons
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";

// Custom
import React from "react";

export default function EventListSelected({ dishList, setDishList }) {
  console.log("EventListSelected", dishList);
  const handleIncrease = (id, list, setList) => {
    setList((prev) => {
      const index = list.findIndex((item) => item.id === id);
      prev[index].quantity += 1;
      return [...prev];
    });
  };

  const handleDecrease = (id, list, setList) => {
    setList((prev) => {
      const index = list.findIndex((item) => item.id === id);
      if (prev[index].quantity !== 0) {
        prev[index].quantity -= 1;
      }
      if (prev[index].quantity === 0) {
        prev.splice(index, 1);
      }
      return [...prev];
    });
  };

  return (
    <Stack spacing={2}>
      {dishList?.length <= 0 && (
        <>
          <Typography level="h6" fontWeight="bold" textColor="text.secondary">
            Selected
          </Typography>
          <Typography mt={1}>You haven't selected any dishes yet.</Typography>
        </>
      )}
      {dishList?.length > 0 && (
        <>
          <Typography level="h6" fontWeight="bold" textColor="text.secondary">
            Dish{dishList?.length > 1 ? "es" : ""}
          </Typography>
          {dishList.map((item) => (
            <React.Fragment key={item.id}>
              <FormControl>
                <FormLabel>{item.name}</FormLabel>
                <Typography level="body3">
                  Price: {item.price.toLocaleString()}đ
                </Typography>
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
                >
                  <IconButton
                    size="sm"
                    variant="outlined"
                    onClick={() =>
                      handleDecrease(item.id, dishList, setDishList)
                    }
                  >
                    <Remove />
                  </IconButton>
                  <Typography fontWeight="md" textColor="text.secondary">
                    {item.quantity}
                  </Typography>
                  <IconButton
                    size="sm"
                    variant="outlined"
                    onClick={() =>
                      handleIncrease(item.id, dishList, setDishList)
                    }
                  >
                    <Add />
                  </IconButton>
                </Box>
              </FormControl>
            </React.Fragment>
          ))}
        </>
      )}
    </Stack>
  );
}
