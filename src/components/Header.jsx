import React from "react";

const Header = ({ account, balance }) => {
  return (
    <div className="header">
      <div className="header-item">
        <p>{account.slice(0, 10)}...</p>
        <p>{balance.slice(0, 8)}</p>
      </div>
    </div>
  );
};

export default Header;
