import React, { useState } from "react";

const Main = ({ contract, account, updateLog, web3 }) => {
  const [donationAmount, setDonationAmount] = useState("");

  const donate = async () => {
    try {
      const result = await contract.methods.donate().send({
        from: account,
        value: web3.utils.toWei(donationAmount, "ether")
      });
      updateLog(`Donated ${donationAmount} Ether: ${result.transactionHash}`);
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
    <div>
      <h2>{contract.options.address}</h2>
      <input
        type="number"
        value={donationAmount}
        onChange={(e) => setDonationAmount(e.target.value)}
        min="0.1"
        step="0.1"
      />
      <button onClick={donate}>Donate</button>
      <button onClick={withdraw}>Withdraw</button>
    </div>
  );
};

export default Main;
