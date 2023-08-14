import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";

// Icons
import AddRoundedIcon from "@mui/icons-material/AddRounded";

// Custom
import React from "react";

export default function ComboDiskList({
    diskList,
    setSelectedDisks,
    selectedDisks,
}) {
    return (
        <Stack py={2} spacing={2}>
            {diskList.map((diskItem, index) => (
                <React.Fragment key={index}>
                    <FormControl>
                        <Stack
                            direction={"row"}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            sx={{
                                borderBottom: "1px solid",
                                borderColor: "background.level2",
                            }}
                        >
                            <Stack>
                                <FormLabel>{diskItem.disk_name}</FormLabel>
                                <Typography level="body3">
                                    Price: {diskItem.price.toLocaleString()}đ
                                </Typography>
                            </Stack>
                            <Stack
                                direction="row"
                                alignItems="end"
                                spacing={1}
                                marginRight={"12px"}
                                marginBottom={"4px"}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 2,
                                        alignItems: "center",
                                        pt: 1,
                                    }}
                                >
                                    <IconButton
                                        size="sm"
                                        variant="outlined"
                                        onClick={() => {
                                            const itemIndex =
                                                selectedDisks.findIndex(
                                                    (item) =>
                                                        item.id ===
                                                        diskItem.disk_id
                                                );

                                            if (itemIndex === -1) {
                                                setSelectedDisks((prev) => [
                                                    ...prev,
                                                    {
                                                        id: diskItem.disk_id,
                                                        name: diskItem.disk_name,
                                                        quantity: 1,
                                                        price: diskItem.price,
                                                    },
                                                ]);
                                            } else {
                                                setSelectedDisks((prev) => {
                                                    prev[
                                                        itemIndex
                                                    ].quantity += 1;
                                                    return [...prev];
                                                });
                                            }
                                        }}
                                    >
                                        <AddRoundedIcon />
                                    </IconButton>
                                </Box>
                            </Stack>
                        </Stack>
                    </FormControl>
                </React.Fragment>
            ))}
        </Stack>
    );
}
