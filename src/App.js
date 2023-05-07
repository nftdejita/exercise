import "./styles.css";
import React, { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import Header from "./components/Header";
import Main from "./components/Main";
import LogArea from "./components/LogArea";
import CharityContract from "./contracts/Charity.json";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [donation, setDonation] = useState("");
  const [contract, setContract] = useState(null);
  const [logs, setLogs] = useState([]);

  // Get account balance
  const getBalance = useCallback(
    async (account) => {
      if (web3) {
        const balance = await web3.eth.getBalance(account);
        setBalance(web3.utils.fromWei(balance, "ether"));
      }
    },
    [web3]
  );

  // Get contract balance
  const getDonateBalance = async (web3Instance) => {
    console.log("call getDonateBalance");
    if (web3Instance) {
      console.log("call getDonateBalance2");
      const balance = await web3Instance.eth.getBalance(
        "0xCAd10907975a9314B07d9719023B654B2b1612F0"
      );
      setDonation(web3Instance.utils.fromWei(balance, "ether"));
    }
  };

  useEffect(() => {
    if (account) {
      //setLogs((prevLogs) => [...prevLogs, "Call getBalance"]);
      getBalance(account);
    }
  }, [account, getBalance]);

  useEffect(() => {
    let donateSubscription;

    // Initialize web3, account and contract
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(() => web3Instance);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(() => accounts[0]);
        getBalance(accounts[0]);
        const contractInstance = new web3Instance.eth.Contract(
          CharityContract.abi,
          "0xCAd10907975a9314B07d9719023B654B2b1612F0",
          {
            gasLimit: "1000000",
          }
        );
        setContract(contractInstance);
        getDonateBalance(web3Instance);

        // イベント登録
        donateSubscription = contractInstance.events.Donate(
          {},
          (err, event) => {
            getBalance(accounts[0]);
            getDonateBalance(web3Instance);
            //updateLog(web3Instance.utils.fromWei(event.returnValues.value));
          }
        );
      } else {
        alert("Please install MetaMask.");
      }
    };

    // Listen for account change and network change
    const ethereum = window.ethereum;
    if (ethereum) {
      ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0]);
        getBalance(accounts[0]);
      });

      ethereum.on("chainChanged", (chainId) => {
        window.location.reload();
      });
    }

    init();

    // Remove event listeners when component unmounts
    return () => {
      if (ethereum) {
        ethereum.removeListener("accountsChanged", setAccount);
        ethereum.removeListener("chainChanged", () => window.location.reload());
      }
      if (donateSubscription) {
        donateSubscription.unsubscribe();
      }
    };
  }, []);

  const updateLog = (newLog) => {
    setLogs((prevLogs) => [...prevLogs, newLog]);
  };

  if (!web3 || !account || !contract) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <Header account={account} balance={balance} />
      <Main
        contract={contract}
        account={account}
        donation={donation}
        updateLog={updateLog}
        web3={web3}
      />
      <LogArea logs={logs} />
    </div>
  );
};

export default App;
