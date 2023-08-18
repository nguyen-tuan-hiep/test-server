import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

// Custom
import React from "react";
import Dish from "./Dish";

export default function DishGroup({ category, dishes, fetchData, setLoading }) {
  return (
    <>
      <Box
        sx={{
          pt: 2,
          bgcolor: "background.surface",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography fontWeight="bold" level="h4" component="h2">
          {category}
        </Typography>
      </Box>
      <Box
        sx={{
          my: 3,
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(auto-fill, minmax(160px, 1fr))",
            sm: "repeat(auto-fill, minmax(180px, 1fr))",
            md: "repeat(auto-fill, minmax(200px, 1fr))",
          },
          gap: 3,
        }}
      >
        {dishes.map((dish) => {
          if (dish.menu_name === category)
            return (
              <React.Fragment key={dish.dish_id}>
                <Dish
                  id={dish.dish_id}
                  name={dish.dish_name}
                  description={dish.description}
                  price={dish.price}
                  // image={dish.image}
                  category={category}
                  fetchData={fetchData}
                  setLoading={setLoading}
                />
              </React.Fragment>
            );
          else return <React.Fragment key={dish.dish_id}></React.Fragment>;
        })}
      </Box>
    </>
  );
}
