import React from "react";

const Header = ({ account, balance }) => {
  return (
    <div className="header">
      <p>Account: {account}</p>
      <p>Balance: {balance} Ether</p>
    </div>
  );
};

export default Header;
