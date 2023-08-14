import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

// Custom
import React from "react";
import Combo from "./Combo";

export default function ComboGroup({ combos, fetchData, setLoading }) {
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
                    Combo
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
                {combos.map((combo) => (
                    <React.Fragment key={combo.combo_id}>
                        <Combo
                            id={combo.combo_id}
                            name={combo.combo_name}
                            description={combo.description}
                            price={combo.combo_price}
                            image={combo.image}
                            disks={combo.disks}
                            fetchData={fetchData}
                            setLoading={setLoading}
                        />
                    </React.Fragment>
                ))}
            </Box>
        </>
    );
}
