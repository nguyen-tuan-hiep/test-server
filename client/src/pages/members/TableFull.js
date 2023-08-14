import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";

// Custom
import * as React from "react";
import TableFullRow from "./TableFullRow";

export default function TableFull({ rows, cols, setLoading, fetchData }) {
    return (
        <Sheet
            variant="outlined"
            sx={{
                overflow: "auto",
                borderRadius: "sm",
                gridColumn: "1/-1",
                display: { xs: "none", sm: "grid" },
                gridTemplateColumns:
                    "minmax(140px, 1fr) minmax(115px, 1fr) minmax(115px, 1fr) minmax(115px, 1fr) minmax(75px, 1fr) minmax(100px, 1fr) 75px",
                "& > *": {
                    p: 2,
                    [`&:nth-of-type(n)`]: {
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    },
                },
            }}
        >
            {cols.map((col, i) => (
                <React.Fragment key={i}>
                    <Typography level="body2" fontWeight="md">
                        {col.headerName}
                    </Typography>
                </React.Fragment>
            ))}

            {rows.map((row, i) => (
                <React.Fragment key={i}>
                    <TableFullRow
                        data={row}
                        setLoading={setLoading}
                        fetchData={fetchData}
                    />
                </React.Fragment>
            ))}
        </Sheet>
    );
}
