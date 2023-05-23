// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
    // 定数として宝くじの金額 0.01 etherを設定します
    uint public constant TICKET_PRICE = 1e16; // 0.01 ether
    // ステート変数としてチケット購入者の配列を設定します
    address[] public tickets;
    // ステート変数として宝くじの当選者を設定します
    address public winner;
    // Event登録
    event Ticketbuy(address sender);
    event DrawWinner(address sender, uint value);
    

    // 宝くじを販売します
    function ticketbuy() payable public {
        // 指定された価格が送金されているかチェックします
        require(msg.value == TICKET_PRICE,"Price is only 0.01eth"); 
        // 購入者を配列に加えます
        tickets.push(msg.sender);
        emit Ticketbuy(msg.sender);
    }

    // 宝くじの抽選を行います
    function drawWinner() public {
        // 乱数を使って宝くじに当選したアカウントを一つ決定します
        uint rand = uint(keccak256(abi.encodePacked(block.timestamp,msg.sender)));
        winner = tickets[uint(rand) % tickets.length];
        // 全額を取得します
        uint payout = address(this).balance;
        // 送金します
        payable(winner).transfer(payout);

        emit DrawWinner(winner, payout);
    }
}
