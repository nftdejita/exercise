import React, { useState } from "react";
import {
  Button,
  Input,
  TextField,
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

const RouletteMain = ({ contract, account, updateLog, web3 }) => {
  const [investAmount, setInvestAmount] = useState("0.1");
  const [betAmount, setBetAmount] = useState("0.1");
  const [betType, setBetType] = useState("1");
  const [betChoice, setBetChoice] = useState("1");

  async function start() {
    try {
      await contract.methods.startRoulette().send({ from: account });
      updateLog(`Start Roulette.`);
    } catch (error) {
      updateLog(`Error: ${error.message}`);
    }
  }

  async function stop() {
    try {
      await contract.methods.stopRoulette().send({ from: account });
      updateLog(`Stop Roulette.`);
    } catch (error) {
      updateLog(`Error: ${error.message}`);
    }
  }
  async function invest() {
    try {
      const amount = web3.utils.toWei(investAmount, "ether");
      await contract.methods.fund().send({ from: account, value: amount });
      updateLog(`Invest ${web3.utils.fromWei(amount, "ether")} ether.`);
    } catch (error) {
      updateLog(`Error: ${error.message}`);
    }
  }

  async function withdrow() {
    try {
      const result = await contract.methods.withdrow().send({ from: account });
      updateLog(`withdrow ${result.transactionHash}`);
    } catch (error) {
      updateLog(`Error: ${error.message}`);
    }
  }

  async function wager() {
    try {
      const amount = web3.utils.toWei(betAmount, "ether");
      await contract.methods.wager(betType, betChoice).send({
        from: account,
        value: amount,
      });
      updateLog(`wager  ${result.transactionHash}`);
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
          Roulette
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Input
            type="number"
            placeholder="投資金額"
            value={investAmount}
            onChange={(e) => setInvestAmount(e.target.value)}
            min="0.1"
            step="0.1"
          />
          <Button variant="contained" onClick={invest}>
            投資
          </Button>
          <Button variant="contained" onClick={withdrow}>
            回収
          </Button>
          <Button variant="contained" onClick={start}>
            開始
          </Button>
          <Button variant="contained" onClick={stop}>
            終了
          </Button>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            label="type"
            value={betType}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            onChange={(e) => setBetType(e.target.value)}
          />
          <TextField
            label="choice"
            value={betChoice}
            inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
            onChange={(e) => setBetChoice(e.target.value)}
          />
          <Input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            placeholder="1.0"
            step="0.01"
            min="0"
            max="10"
          />

          <Button variant="contained" onClick={wager}>
            賭ける
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RouletteMain;
