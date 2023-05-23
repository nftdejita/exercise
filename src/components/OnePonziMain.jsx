import React, { useState } from "react";
import {
  Button,
  Input,
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const OnePonziMain = ({ contract, account, updateLog, web3 }) => {
  const [donationAmount, setDonationAmount] = useState("0.1");

  async function invest() {
    try {
      const amount = web3.utils.toWei(donationAmount, "ether");
      await contract.methods.donate().send({ from: account, value: amount });
      updateLog(`Donated ${web3.utils.fromWei(amount, "ether")} ether.`);
    } catch (error) {
      updateLog(`Error: ${error.message}`);
    }
  }

  return (
    <Card sx={{ margin: "6px" }}>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="h4" color="inherit" noWrap>
          OnePonzi
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Input
            type="number"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            min="0.1"
            step="0.1"
          />
          <Button variant="contained" onClick={invest}>
            投資
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OnePonziMain;
