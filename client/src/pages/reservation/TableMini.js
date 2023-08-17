import Divider from "@mui/joy/Divider";
import List from "@mui/joy/List";
import Sheet from "@mui/joy/Sheet";

// Custom
import * as React from "react";
import TableMiniRow from "./TableMiniRow";

export default function TableMini({ rows, cols }) {
  return (
    <Sheet
      variant="outlined"
      sx={{
        display: { xs: "inherit", sm: "none" },
        borderRadius: "sm",
        overflow: "auto",
      }}
    >
      <List
        aria-labelledby="table-in-list"
        sx={{
          "& .JoyListItemButton-root": { p: "0px" },
        }}
      >
        {rows.map((row, i) => (
          <React.Fragment key={i}>
            {i === rows.length - 1 ? (
              <TableMiniRow data={row} />
            ) : (
              <>
                <TableMiniRow data={row} />
                <Divider />
              </>
            )}
          </React.Fragment>
        ))}
      </List>
    </Sheet>
  );
}
