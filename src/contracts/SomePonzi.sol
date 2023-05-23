// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract SomePonzi {
    // ステート変数として投資者の配列と投資者のアカウントをキーとした残高マップを設定します
    // 最低投資額を設定します
    address[] public investors;
    mapping (address => uint) public balances;
    uint public constant MINIMUM_INVESTMENT = 1e15;
    // Event登録
    event Invest(address sender, uint value);
    event Withdraw(address sender, uint value);

    constructor () {
    	// コントラクト作成者は無料で投資枠を確保できます
        investors.push(msg.sender);
    }

    function invest() public payable {
    	  // 最低投資額未満はエラーとします
        require(msg.value >= MINIMUM_INVESTMENT);
    	  // 投資は1度のみです
    	  bool out = false;
    	  for (uint i=0; i < investors.length; i++) {
    	      if (investors[i] == msg.sender) out = true;
    	  }
    	  require( !out, "You are already invest");
        // 投資額を均等に枠に加算します
        uint eachInvestorGets = msg.value / investors.length;
        for (uint i=0; i < investors.length; i++) {
            balances[investors[i]] += eachInvestorGets;
        }
        // 投資者を配列に加えます
        investors.push(msg.sender);
        emit Invest(msg.sender, msg.value);
   }

    function withdraw () public payable{
        // 引き出し額を取得します
        uint payout = balances[msg.sender];
        // 引き出し者の残高をクリアします
        balances[msg.sender] = 0;
        // 送金します
        payable(msg.sender).transfer(payout);
        emit Withdraw(msg.sender, payout);
    }
}