import React, { useState } from "react";
import {
  Button,
  Input,
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const Main = ({ contract, account, updateLog, web3, donation }) => {
  const [donationAmount, setDonationAmount] = useState("0.2");

  const donate = async () => {
    try {
      const amount = web3.utils.toWei(donationAmount, "ether");
      await contract.methods.donate().send({ from: account, value: amount });
      updateLog(`Donated ${web3.utils.fromWei(amount, "ether")} ether.`);
    } catch (error) {
      updateLog(`Error: ${error.message}`);
    }
  };

  const withdraw = async () => {
    try {
      const result = await contract.methods.withdraw().send({ from: account });
      updateLog(
        `Withdrew ${result.events.Withdraw.returnValues.value} Ether: ${result.transactionHash}`
      );
    } catch (error) {
      updateLog(`Error: ${error.message}`);
    }
  };

  return (
    <Card>
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography variant="h3" color="inherit" noWrap>
          Charity ({donation} ETH)
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Input
            type="number"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            min="0.1"
            step="0.1"
          />
          <Button variant="contained" onClick={donate}>
            募金
          </Button>
        </Box>
        <Button variant="contained" onClick={withdraw}>
          引き出し
        </Button>
      </CardContent>
    </Card>
  );
};

export default Main;
