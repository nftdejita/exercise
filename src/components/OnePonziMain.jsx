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
  const [investAmount, setInvestAmount] = useState("0.1");

  async function invest() {
    try {
      const amount = web3.utils.toWei(investAmount, "ether");
      await contract.methods.invest().send({ from: account, value: amount });
      updateLog(`Invest ${web3.utils.fromWei(amount, "ether")} ether.`);
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
            value={investAmount}
            onChange={(e) => setInvestAmount(e.target.value)}
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
