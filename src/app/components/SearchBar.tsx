import * as React from "react";
import { type SetStateAction, type Dispatch } from "react";

import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";

function SearchBar({
  setKeyword,
}: {
  setKeyword: Dispatch<SetStateAction<string>>;
}) {
  const [bufferedKeyword, setBufferedKeyword] = React.useState("");
  return (
    <div className="mt-3">
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          width: "100%",
          margin: "auto",
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search user..."
          value={bufferedKeyword}
          onChange={(e) => setBufferedKeyword(e.target.value)}
        />
        <IconButton
          type="button"
          sx={{ p: "10px" }}
          aria-label="search"
          onClick={() => setKeyword(bufferedKeyword)}
        >
          <SearchIcon />
        </IconButton>
      </Paper>
    </div>
  );
}

export default SearchBar;
