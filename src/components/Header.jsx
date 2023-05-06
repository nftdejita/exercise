import React from "react";

const Header = ({ account, balance }) => {
  return (
    <div className="header">
      <div className="account-info">
        <p>Account: {account}</p>
        <p>Balance: {balance} Ether</p>
      </div>
    </div>
  );
};

export default Header;
