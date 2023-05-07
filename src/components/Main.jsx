import React, { useState } from "react";

const Main = ({ contract, account, updateLog, web3, donation }) => {
  const [donationAmount, setDonationAmount] = useState("");

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
      <div className="contract-info">
        <h1>Charity</h1>
        <p>{contract.options.address}</p>
        <p>{donation} ETH</p>
      </div>
      <div className="form-control">
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
    </div>
  );
};

export default Main;
