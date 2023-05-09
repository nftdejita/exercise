import React, { useState } from "react";

// Mainコンポーネント：寄付と引き出しの機能を提供
const Main = ({ contract, account, updateLog, web3, balance }) => {
  // donationAmount：寄付金額を管理するステート
  const [donationAmount, setDonationAmount] = useState("0.2");

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
    <div className="main">
      {/* 現在のコントラクトの残高を表示 */}
      <h2>Charity ({balance} ETH)</h2>
      <div>
        {/* 寄付金額を入力するフォーム */}
        <input
          type="number"
          value={donationAmount}
          onChange={(e) => setDonationAmount(e.target.value)}
          min="0.1"
          step="0.1"
        />
        {/* 寄付ボタン */}
        <button onClick={donate}>募金</button>
      </div>
      {/* 引き出しボタン */}
      <button onClick={withdraw}>引き出し</button>
    </div>
  );
};

export default Main;
