import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

const Header = ({ account, balance }) => {
  return (
    <AppBar position="relative">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" color="inherit" noWrap>
          {account}
        </Typography>
        <Typography variant="h6">{balance.slice(0, 8)}</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
