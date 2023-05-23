// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Lottery {
    // 定数として宝くじの金額 0.01 etherを設定します
    uint public constant TICKET_PRICE = 1e16; // 0.01 ether
    // ステート変数としてチケット購入者の配列を設定します
    address[] public tickets;
    // ステート変数として宝くじの当選者を設定します
    address public winner;
    // ステート変数として宝くじの販売終了時刻を設定します
    uint public ticketingCloses;
    // ステート変数としてオーナーを設定します
    address public owner;
    // Event登録
    event Ticketbuy(address sender);
    event DrawWinner(address sender);
    event Withdraw(address sender, uint value);
    
    constructor () {
        // 現在のブロックタイムスタンプに 3秒足します
        ticketingCloses = block.timestamp + 3 seconds;
        // 宝くじコントラクトの所有者を設定します
        owner = msg.sender;
 
    }

    // 宝くじを販売します
    function ticketbuy() payable public {
        // 指定された価格が送金されているかチェックします
        require(msg.value == TICKET_PRICE,"Price is only 0.01eth"); 
        // 宝くじの販売期限を過ぎていないかチェックします
        require(block.timestamp < ticketingCloses,"Sorry, lottery closed");
        // 購入者を配列に加えます
        tickets.push(msg.sender);
        emit Ticketbuy(msg.sender);
    }

    // 宝くじの抽選を行います
    function drawWinner() public {
        // 販売期間が終了していることが条件です
        require(block.timestamp > ticketingCloses,"Sorry, tickets are on sale");
        // 誰も当選していないことが条件です（二度目はエラーとなります）
        require(winner == address(0),"lottery was over");
        // 乱数を使って宝くじに当選したアカウントを一つ決定します
        uint rand = uint(keccak256(abi.encodePacked(block.timestamp,msg.sender)));
        winner = tickets[uint(rand) % tickets.length];
        emit DrawWinner(winner);
    }

    // 当選者は宝くじの全額を取得できます
    function withdraw() public {
        // 当選者のみ引き出すことができます
        require(msg.sender == winner,"Sorry, only winner");
        // 全額を取得します
        uint payout = address(this).balance;
        // 送金します
        payable(msg.sender).transfer(payout);

        emit Withdraw(msg.sender, payout);
    }
}
