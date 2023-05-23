import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

// Mainコンポーネント：寄付と引き出しの機能を提供
const CharityMain = ({ contract, account, updateLog, web3 }) => {
  // donationAmount：寄付金額を管理するステート
  const [donationAmount, setDonationAmount] = useState("0.1");

  // donate関数：寄付を実行する非同期関数
  async function donate() {
    try {
      // 寄付金額をetherからweiに変換
      const amount = web3.utils.toWei(donationAmount, "ether");
      // コントラクトのdonateメソッドを実行
      await contract.methods.donate().send({ from: account, value: amount });
      // ログに寄付金額を表示
      updateLog(`Donated ${web3.utils.fromWei(amount, "ether")} ether.`);
    } catch (error) {
      // エラーメッセージをログに表示
      updateLog(`Error: ${error.message}`);
    }
  }

  // withdraw関数：引き出しを実行する非同期関数
  async function withdraw() {
    try {
      // コントラクトのwithdrawメソッドを実行
      const result = await contract.methods.withdraw().send({ from: account });
      // 引き出し金額とトランザクションハッシュをログに表示
      updateLog(
        `Withdrew ${result.events.Withdraw.returnValues.value} Ether: ${result.transactionHash}`
      );
    } catch (error) {
      // エラーメッセージをログに表示
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
          Charity
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            label="donate"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
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

export default CharityMain;
