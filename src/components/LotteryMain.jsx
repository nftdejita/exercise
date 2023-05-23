import React, { useState } from "react";
import {
  Button,
  Input,
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const LotteryMain = ({ contract, account, updateLog, web3 }) => {
  async function ticketBuy() {
    try {
      const amount = web3.utils.toWei("0.01", "ether");
      await contract.methods.ticketbuy().send({ from: account, value: amount });
      updateLog(`Buy Ticket ${web3.utils.fromWei(amount, "ether")} ether.`);
    } catch (error) {
      updateLog(`Error: ${error.message}`);
    }
  }

  async function drawWinner() {
    try {
      const result = await contract.methods
        .drawWinner()
        .send({ from: account });
      updateLog(`drawWinner `);
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
          Lottery
        </Typography>
        <contents>
          <Button variant="contained" onClick={ticketBuy}>
            宝くじ購入
          </Button>
          　
          <Button variant="contained" onClick={drawWinner}>
            抽選
          </Button>
        </contents>
      </CardContent>
    </Card>
  );
};

export default LotteryMain;
