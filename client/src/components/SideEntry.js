import Chip from "@mui/joy/Chip";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import { NavLink } from "react-router-dom";

export default function SideEntry({ text, path, isBeta, icon: ListItemIcon }) {
  return (
    <NavLink to={path} style={{ textDecoration: "none" }}>
      {({ isActive }) =>
        isActive ? (
          <ListItem>
            <ListItemButton variant="soft" color="primary">
              <ListItemDecorator sx={{ color: "inherit" }}>
                <ListItemIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>{text}</ListItemContent>
              {isBeta && (
                <Chip
                  variant="soft"
                  color="info"
                  size="sm"
                  sx={{ borderRadius: "sm" }}
                >
                  Beta
                </Chip>
              )}
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem>
            <ListItemButton>
              <ListItemDecorator sx={{ color: "neutral.500" }}>
                <ListItemIcon fontSize="small" />
              </ListItemDecorator>
              <ListItemContent>{text}</ListItemContent>
              {isBeta && (
                <Chip
                  variant="soft"
                  color="info"
                  size="sm"
                  sx={{ borderRadius: "sm" }}
                >
                  Beta
                </Chip>
              )}
            </ListItemButton>
          </ListItem>
        )
      }
    </NavLink>
  );
}
