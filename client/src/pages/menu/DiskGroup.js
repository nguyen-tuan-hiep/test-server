import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

// Custom
import React from "react";
import Disk from "./Disk";

export default function DiskGroup({ category, disks, fetchData, setLoading }) {
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
                {disks.map((disk) => {
                    if (disk.category_name === category)
                        return (
                            <React.Fragment key={disk.disk_id}>
                                <Disk
                                    id={disk.disk_id}
                                    name={disk.disk_name}
                                    description={disk.description}
                                    price={disk.price}
                                    image={disk.image}
                                    category={category}
                                    fetchData={fetchData}
                                    setLoading={setLoading}
                                />
                            </React.Fragment>
                        );
                    else
                        return (
                            <React.Fragment key={disk.disk_id}></React.Fragment>
                        );
                })}
            </Box>
        </>
    );
}
