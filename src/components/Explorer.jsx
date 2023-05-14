import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

function BlockchainExplorer() {
  const [latestBlock, setLatestBlock] = useState(null);
  const [transactions, setTransactions] = useState([]);
  
  useEffect(() => {
    const web3 = new Web3('https://ganache.nst-tsutsuji.com); // GanacheのURLとポート

    const intervalId = setInterval(async () => {
      const blockNumber = await web3.eth.getBlockNumber();
      const block = await web3.eth.getBlock(blockNumber);
      setLatestBlock(block);
      
      // トランザクションを取得して分析
      const txs = await Promise.all(block.transactions.map(txHash => web3.eth.getTransaction(txHash)));
      const analyzedTxs = txs.map(tx => {
        // 'input'フィールドが'0x'または空でない場合、スマートコントラクトの呼び出しと見なす
        const isContractCall = tx.input && tx.input !== '0x';
        return {
          ...tx,
          isContractCall,
        };
      });
      setTransactions(prevTransactions => [...prevTransactions, ...analyzedTxs].slice(-5));  // 保持するトランザクション数を5つに制限
    }, 5000); // 5秒ごとに最新のブロックを取得

    // クリーンアップ関数
    return () => clearInterval(intervalId);
  }, []); // 空の依存配列 => 一度だけ実行

  return (
    <div>
      <h1>Latest Block</h1>
      {latestBlock && (
        <div>
          <p>Block Number: {latestBlock.number}</p>
          <p>Timestamp: {new Date(latestBlock.timestamp * 1000).toLocaleString()}</p>
          {/* 他のブロックの詳細もここに表示できます */}
        </div>
      )}
      <h2>Latest 5 Transactions</h2>
      <div style={{maxHeight: '300px', overflowY: 'auto', whiteSpace: 'nowrap', fontFamily: 'monospace', backgroundColor: '#000', color: '#0f0'}}>
        {transactions.map(tx => (
          <div key={tx.hash}>
            <p>{`[${new Date().toLocaleTimeString()}] Transaction: ${tx.hash} | From: ${tx.from} | To: ${tx.to} | Value: ${web3.utils.fromWei(tx.value, 'ether')} Ether | Type: ${tx.isContractCall ? 'Contract Call' : 'Ether Transfer'}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlockchainExplorer;
