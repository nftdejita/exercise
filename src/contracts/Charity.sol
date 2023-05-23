// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

contract Charity {
    address public owner;
    event Donate(address sender, uint value);
    event Withdraw(address sender, uint value);

    constructor() {
        owner = msg.sender;
    }
    
    function donate() public payable {
        require(msg.value >= 0.1 ether,"Sorry, minimum amount is 0.1 ether");
        emit Donate(msg.sender, msg.value);

    }

    function withdraw() public {
        uint amount = address(this).balance;

        (bool sent, ) = owner.call{value: amount}("");
        require(sent, "Failed to send Ethers");
        emit Withdraw(msg.sender, amount);
    }
}
