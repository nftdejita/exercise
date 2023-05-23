// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Roulette {

    // 賭け構造体を設置します
    struct BetStruct {
        address payable gambler;                    // ギャンブラーのアカウント
        uint    amount;                     // 掛け金
        uint    btype;                      // 賭けタイプ　0:番号 1:奇数偶数
        uint    choice;                     // 賭ける場所　0,1,2,....36, 37:00  0:偶数  1:奇数
    }
    
    // ステート変数を定義します
    bool public bet_on = false;             // ルーレット回転中を示すフラグ
    address public owner;                   // オーナーのアカウント
    uint public bet_id = 0;                 // 賭けID
    uint private start_id = 0;              // 賭けIDのスタート位置
    uint public roulette_number;            // 出た目
    mapping(uint => BetStruct) public bets; // 賭け構造体の実体

    // Event登録
    event StartRoulette(address sender);
    event Wager(address sender, uint value);
    event StopRoulette(address sender);
    event Fund(address sender, uint value);
    event Withdrow(address sender, uint value);

    constructor () {
        owner = msg.sender;
    }

    // ルーレットスタート
    function startRoulette () public{
        // オーナーのみ実行できます
        require(msg.sender == owner,"only owner");
        // 賭けIDのスタート位置を記録します
        start_id = bet_id;
        // ルーレットの回転フラグをオンにします
        bet_on = true;

        emit StartRoulette(msg.sender);
    }

    // 賭け
    function wager (uint _btype, uint _choice) payable public {
        // ルーレットがスタートしてなければ賭けられません
        require(bet_on,"sorry now close.");
        // 掛け金が必要です
        require(msg.value > 0,"please bet");
        // 賭けタイプに従った場所が必要です
        if (_btype == 0) {
            require(_choice >= 0 && _choice <= 37,"number is 0 to 36 and 00 is 37");
        } else {
            require(_btype == 1 , "type is 0:number, 1:odd-even");
            require(_choice == 0 || _choice == 1,"choice only 0 or 1");
        }
        // 賭けデータを保存します
        bets[bet_id] = BetStruct(payable(msg.sender), msg.value, _btype, _choice);
        // 賭けIDを更新します
        bet_id++;

        emit Wager(msg.sender,msg.value);
    }

    // ルーレットストップ
    function stopRoulette () public{
        // オーナーのみ実行できます
        require(msg.sender == owner,"only owner");
        // ルーレットの回転フラグを止めます
        bet_on = false;

        // 乱数で番号を決めます
        uint x = uint(keccak256(abi.encodePacked(block.timestamp,msg.sender))) % 38;
        // 出た目を記録します（外部参照用）
        roulette_number = x;

        // 賭けデータの配列を必要分読み込んで処理をします
        for ( uint i = start_id; i < bet_id ; i++) {
            // 賭けデータを取り出します
            BetStruct storage bet = bets[i];
            // 当たりの判定を行い、賞金を送金します
            if (bet.btype == 0 && bet.choice == x ) {
                payable(bet.gambler).transfer(bet.amount * 36);
            } else if ( bet.btype == 1 && x != 0 && x != 37 && (x % 2 == bet.choice %2) ) {
                payable(bet.gambler).transfer(bet.amount * 2);
            }
        }
 
        emit StopRoulette(msg.sender);
    }

    // オーナー用の資金投入です
    function fund () public payable {
        require(msg.sender == owner,"only owner");
        emit Fund(msg.sender,msg.value);
    }

    // オーナー用の資金回収です
    function withdrow () public {
        require(msg.sender == owner,"only owner");
        emit Withdrow(msg.sender,address(this).balance);
        payable(msg.sender).transfer(address(this).balance);
    }
}