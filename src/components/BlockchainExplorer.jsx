import React, { useState, useEffect } from "react";
import Web3 from "web3";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { CardContent, Card } from "@mui/material";

function BlockchainExplorer() {
  const [web3, setWeb3] = useState(null);
  const [latestBlock, setLatestBlock] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const init = async () => {
      const web3Instance = new Web3("https://ganache.nst-tsutsuji.com"); // GanacheのURLとポート
      setWeb3(() => web3Instance);

      const intervalId = setInterval(async () => {
        const latestBlockNumber = await web3Instance.eth.getBlockNumber();
        setLatestBlock(await web3Instance.eth.getBlock(latestBlockNumber));

        let transactions = [];
        for (let i = 2; i > -1; i--) {
          const blockNumber = latestBlockNumber - i;
          if (blockNumber < 0) {
            // blockNumberが0以下になった場合はループを抜ける
            break;
          }
          const block = await web3Instance.eth.getBlock(blockNumber);

          const txs = await Promise.all(
            block.transactions.map((txHash) =>
              web3Instance.eth.getTransaction(txHash)
            )
          );
          const analyzedTxs = txs.map((tx) => {
            const isContractCall = tx.input && tx.input !== "0x";
            return {
              ...tx,
              timestamp: block.timestamp,
              isContractCall,
            };
          });
          transactions = [...transactions, ...analyzedTxs];
        }
        setTransactions(transactions);
      }, 5000); // 5秒ごとに最新のブロックを取得

      return () => clearInterval(intervalId);
    };

    init();
  }, []);

  return (
    latestBlock && (
      <Card
        sx={{
          marginTop: "10px",
          backgroundColor: "black",
          color: "white",
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h6" color="inherit" noWrap>
            Blockchain Explorer
          </Typography>
          <Typography variant="h7" color="inherit" noWrap>
            Latest Block: {latestBlock.number} at{" "}
            {new Date(latestBlock.timestamp * 1000).toLocaleString()}
          </Typography>
          <TableContainer
            component={Paper}
            style={{ maxWidth: "100%", overflowX: "scroll" }}
          >
            <Table size="small" aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Transaction</TableCell>
                  <TableCell>From</TableCell>
                  <TableCell>To</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.hash}>
                    <TableCell>
                      {new Date(tx.timestamp * 1000).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {tx.isContractCall ? "Contract Call" : "Ether Transfer"}
                    </TableCell>
                    <TableCell>
                      {web3.utils.fromWei(tx.value, "ether")}
                    </TableCell>
                    <TableCell>{tx.hash}</TableCell>
                    <TableCell>{tx.from}</TableCell>
                    <TableCell>{tx.to}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    )
  );
}

export default BlockchainExplorer;
