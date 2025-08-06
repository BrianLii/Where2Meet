import { useState } from "react";

// route
import { useRouter } from "next/navigation";

import Diversity1RoundedIcon from "@mui/icons-material/Diversity1Rounded";
import FavoriteIcon from "@mui/icons-material/Favorite";
// Icons
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SentimentVeryDissatisfiedRoundedIcon from "@mui/icons-material/SentimentVeryDissatisfiedRounded";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";

import { StyledMenu } from "./StyledMenu";

export default function CustomizedMenus() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const open = Boolean(anchorEl);
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <button
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
        }}
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        className="mr-2 p-0"
      >
        <MenuRoundedIcon color="primary" sx={{ fontSize: "2rem" }} />
      </button>

      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            router.push("/pairs");
          }}
          disableRipple
          sx={{ my: 0.5 }}
        >
          <Diversity1RoundedIcon sx={{ color: "#f472b6" }} />
          My Pairs
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            router.push("/likes");
            handleClose();
          }}
          disableRipple
          sx={{ my: 0.5 }}
        >
          <FavoriteIcon sx={{ color: "#e11d48" }} />
          My Likes
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            router.push("/dislikes");
          }}
          disableRipple
          sx={{ my: 0.5 }}
        >
          <SentimentVeryDissatisfiedRoundedIcon sx={{ color: "#15803d" }} />
          My Dislikes
        </MenuItem>
      </StyledMenu>
    </div>
  );
}
