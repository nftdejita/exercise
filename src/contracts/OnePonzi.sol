// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract OnePonzi {
    // 枠の保有者をステート変数investorとして宣言します
    address payable public investor;
    // 最低投資金額をステート変数investmentとして宣言し、初期値を0.01ethにします
    uint public investment = 1e16;
    // Event登録
    event Invest(address sender, uint value);


    constructor() {
        // 初回の枠はコントラクトの作成者が所有します
        investor = payable(msg.sender);
    }
    
    function invest() payable public {
        // 送金金額は最低投資金額以上とする必要があります
        require(msg.value >= investment,"The investment amount is not enough.");

        // 枠の所有者に投資金額の全額を送金します
        investor.transfer(msg.value);
        // 枠の所有者を交代します
        investor = payable(msg.sender);
        // 次回の最低投資金額を設定します
        investment = msg.value * 11 / 10;

        emit Invest(msg.sender, investment);

    }
}