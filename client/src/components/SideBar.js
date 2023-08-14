import IconButton from "@mui/joy/IconButton";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListSubheader from "@mui/joy/ListSubheader";

// Icons
import AssignmentIndRoundedIcon from "@mui/icons-material/AssignmentIndRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

// Custom
import SideEntry from "./SideEntry";
import { useState } from "react";

export default function SideBar() {
  // TODO: Support global state
  const [open1, setOpen1] = useState(true);
  const [open2, setOpen2] = useState(true);

  return (
    <List
      size="sm"
      sx={{
        "--List-item-radius": "8px",
        "--List-gap": "4px",
        position: "sticky",
        top: 64, // TODO: Fix hard code
        zIndex: 1100,
      }}
    >
      <ListItem nested>
        <ListSubheader>
          Main
          <IconButton
            size="sm"
            variant="plain"
            color="primary"
            onClick={() => setOpen1(!open1)}
            sx={{ "--IconButton-size": "24px", ml: "auto" }}
          >
            <KeyboardArrowDownRoundedIcon
              fontSize="small"
              color="primary"
              sx={{ transform: open1 ? "initial" : "rotate(-90deg)" }}
            />
          </IconButton>
        </ListSubheader>
        {open1 && (
          <List
            aria-labelledby="nav-list-browse"
            sx={{
              "& .JoyListItemButton-root": { p: "8px" },
            }}
          >
            <SideEntry
              text="Tables"
              path="/tables"
              icon={AssignmentIndRoundedIcon}
            />
            <SideEntry
              text="Menu"
              path="/menu"
              icon={AssignmentIndRoundedIcon}
            />
            <SideEntry
              text="Orders"
              path="/orders"
              icon={AssignmentIndRoundedIcon}
            />
          </List>
        )}
      </ListItem>
      <ListItem nested sx={{ mt: 2 }}>
        <ListSubheader>
          Others
          <IconButton
            size="sm"
            variant="plain"
            color="primary"
            onClick={() => setOpen2(!open2)}
            sx={{ "--IconButton-size": "24px", ml: "auto" }}
          >
            <KeyboardArrowDownRoundedIcon
              fontSize="small"
              color="primary"
              sx={{ transform: open2 ? "initial" : "rotate(-90deg)" }}
            />
          </IconButton>
        </ListSubheader>
        {open2 && (
          <List
            aria-labelledby="nav-list-browse"
            sx={{
              "& .JoyListItemButton-root": { p: "8px" },
            }}
          >
            <SideEntry
              text="Events"
              path="/events"
              icon={AssignmentIndRoundedIcon}
            />
            <SideEntry
              text="Members"
              path="/members"
              icon={AssignmentIndRoundedIcon}
            />
            <SideEntry
              text="Report"
              path="/report"
              isBeta
              icon={AssignmentIndRoundedIcon}
            />
          </List>
        )}
      </ListItem>
    </List>
  );
}
