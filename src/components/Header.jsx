import React from "react";

const Header = ({ account, balance }) => {
  return (
    <div className="header">
      <div className="account-info">
        <h3>Account: {account}</h3>
        <h4>Balance: {balance} Ether</h4>
      </div>
    </div>
  );
};

export default Header;
