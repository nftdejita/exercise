import "./styles.css";
import React, { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import Header from "./components/Header";
import Main from "./components/Main";
import LogArea from "./components/LogArea";
import CharityContract from "./contracts/Charity.json";

const App = () => {
  // ステート変数の定義
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [contractBalance, setContractBalance] = useState("");
  const [contract, setContract] = useState(null);
  const [logs, setLogs] = useState([]);
  const CONTRACT_ADDRESS = "0xCAd10907975a9314B07d9719023B654B2b1612F0";

  // アカウント残高の取得
  const getAccountBalance = async (account) => {
    if (web3) {
      const balance = await web3.eth.getBalance(account);
      setAccountBalance(web3.utils.fromWei(balance, "ether"));
    }
  };

  // コントラクト残高の取得
  const getContractBalance = async (web3Instance) => {
    if (web3Instance) {
      const balance = await web3Instance.eth.getBalance(CONTRACT_ADDRESS);
      setContractBalance(web3Instance.utils.fromWei(balance, "ether"));
    }
  };

  // アカウントの変更、残高更新時に残高を取得する
  useEffect(() => {
    if (account) {
      getAccountBalance(account);
    }
  }, [account, getAccountBalance]);

  // 画面ロード時の初期化処理
  useEffect(() => {
    let donateSubscription;
    let withdrawSubscription;

    // 初期処理
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(() => web3Instance);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(() => accounts[0]);
        getAccountBalance(accounts[0]);
        const contractInstance = new web3Instance.eth.Contract(
          CharityContract.abi,
          CONTRACT_ADDRESS,
          {
            gasLimit: "1000000",
          }
        );
        setContract(contractInstance);
        getContractBalance(web3Instance);

        // コントラクトのイベント発生時に呼び出される処理を登録する
        donateSubscription = contractInstance.events.Donate(
          {},
          (err, event) => {
            getAccountBalance(accounts[0]);
            getContractBalance(web3Instance);
          }
        );
        withdrawSubscription = contractInstance.events.Withdraw(
          {},
          (err, event) => {
            getAccountBalance(accounts[0]);
            getContractBalance(web3Instance);
          }
        );
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

      ethereum.on("chainChanged", (chainId) => {
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
      if (donateSubscription) {
        donateSubscription.unsubscribe();
      }
      if (withdrawSubscription) {
        withdrawSubscription.unsubscribe();
      }
    };
  }, []);

  // ログの更新
  const updateLog = (newLog) => {
    setLogs((prevLogs) => [...prevLogs, newLog]);
  };

  if (!web3 || !account || !contract) {
    return <div>Loading...</div>;
  }

  // web3、アカウント、コントラクトがまだロードされていない場合
  return (
    <div className="container">
      <Header account={account} balance={accountBalance} />
      <Main
        contract={contract}
        account={account}
        balance={contractBalance}
        updateLog={updateLog}
        web3={web3}
      />
      <LogArea logs={logs} />
    </div>
  );
};

export default App;
