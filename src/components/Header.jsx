import React from "react";

const Header = ({ account, balance }) => {
  return (
    <div>
      <h3>Account: {account}</h3>
      <h4>Balance: {balance} Ether</h4>
    </div>
  );
};

export default Header;
