import React, { useState } from "react";

const Main = ({ contract, account, updateLog, web3, balance }) => {
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
    <div className="main">
      <h2>Charity ({balance} ETH)</h2>
      <div>
        <input
          type="number"
          value={donationAmount}
          onChange={(e) => setDonationAmount(e.target.value)}
          min="0.1"
          step="0.1"
        />
        <button onClick={donate}>募金</button>
      </div>
      <button onClick={withdraw}>引き出し</button>
    </div>
  );
};

export default Main;
