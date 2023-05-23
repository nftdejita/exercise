import "./styles.css";
import React, { useState, useEffect } from "react";
import Web3 from "web3";
import CharityMain from "./components/CharityMain";
import OnePonziMain from "./components/OnePonziMain";
import SomePonziMain from "./components/SomePonziMain";
import LotteryMain from "./components/LotteryMain";
import RouletteMain from "./components/RouletteMain";
import LogArea from "./components/LogArea";
import CharityContract from "./contracts/Charity.json";
import OnePonziContract from "./contracts/OnePonzi.json";
import SomePonziContract from "./contracts/SomePonzi.json";
import LotteryContract from "./contracts/Lottery.json";
import RouletteContract from "./contracts/Roulette.json";
import BlockchainExplorer from "./components/BlockchainExplorer";

const App = () => {
  // ステート変数の定義
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [logs, setLogs] = useState([]);

  const viewCharity = true;
  const viewOnePonzi = false;
  const viewSomePonzi = false;
  const viewLottery = false;
  const viewRoulette = false;
  const [charityContract, setCharityContract] = useState(null);
  const [onePonziContract, setOnePonziContract] = useState(null);
  const [somePonziContract, setSomePonziContract] = useState(null);
  const [lotteryContract, setLotteryContract] = useState(null);
  const [rouletteContract, setRouletteContract] = useState(null);
  const CONTRACT_CHARITY = "";
  const CONTRACT_ONE_PONZI = "";
  const CONTRACT_SOME_PONZI = "";
  const CONTRACT_LOTTERY = "";
  const CONTRACT_ROULETTE = "";

  // 画面ロード時の初期化処理
  useEffect(() => {
    // 初期処理
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(() => web3Instance);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(() => accounts[0]);
        // コントラクトの設定
        const charityInstance = new web3Instance.eth.Contract(
          CharityContract.abi,
          CONTRACT_CHARITY
        );
        setCharityContract(charityInstance);

        const onePonziInstance = new web3Instance.eth.Contract(
          OnePonziContract.abi,
          CONTRACT_ONE_PONZI
        );
        setOnePonziContract(onePonziInstance);

        const somePonziInstance = new web3Instance.eth.Contract(
          SomePonziContract.abi,
          CONTRACT_SOME_PONZI
        );
        setSomePonziContract(somePonziInstance);

        const lotteryInstance = new web3Instance.eth.Contract(
          LotteryContract.abi,
          CONTRACT_LOTTERY
        );
        setLotteryContract(lotteryInstance);

        const rouletteInstance = new web3Instance.eth.Contract(
          RouletteContract.abi,
          CONTRACT_ROULETTE
        );
        setRouletteContract(rouletteInstance);
      } else {
        alert("Please install MetaMask.");
      }
    };

    // アカウント変更とネットワーク変更のリスナーを登録する
    const ethereum = window.ethereum;
    if (ethereum) {
      ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0]);
      });

      ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }

    init();

    // コンポーネントがアンマウントされる際にイベントリスナーを削除する
    return () => {
      if (ethereum) {
        ethereum.removeListener("accountsChanged", setAccount);
        ethereum.removeListener("chainChanged", () => window.location.reload());
      }
    };
  }, []);

  // ログの更新
  const updateLog = (newLog) => {
    setLogs((prevLogs) => [...prevLogs, newLog]);
  };

  if (!web3 || !account) {
    // web3、アカウント、がまだロードされていない場合
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      {viewCharity && (
        <CharityMain
          contract={charityContract}
          account={account}
          updateLog={updateLog}
          web3={web3}
        />
      )}
      {viewOnePonzi && (
        <OnePonziMain
          contract={onePonziContract}
          account={account}
          updateLog={updateLog}
          web3={web3}
        />
      )}
      {viewSomePonzi && (
        <SomePonziMain
          contract={somePonziContract}
          account={account}
          updateLog={updateLog}
          web3={web3}
        />
      )}
      {viewLottery && (
        <LotteryMain
          contract={lotteryContract}
          account={account}
          updateLog={updateLog}
          web3={web3}
        />
      )}
      {viewRoulette && (
        <RouletteMain
          contract={rouletteContract}
          account={account}
          updateLog={updateLog}
          web3={web3}
        />
      )}
      <LogArea logs={logs} />
      <BlockchainExplorer />
    </div>
  );
};

export default App;
