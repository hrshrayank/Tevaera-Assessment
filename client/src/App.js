// import { ConnectButton } from '@web3modal/react'
import Web3Modal from "web3modal"
import ArgentLogin from "@argent/login";
import {ethers} from "ethers"
import './App.css';
import { Buffer } from "buffer";
import { useState,useEffect } from "react";
window.Buffer = Buffer;

const providerOptions ={
  argent: {
    package: ArgentLogin,
    options: {
      chainId: 280,
      rpcUrl: "https://zksync2-testnet.zksync.dev",
    },
  },
  

}

function App() {
  const [web3Provider,setWeb3Provider] =useState(null)
  const [timer, setTimer] = useState(0);
  const [address, setAddress] = useState();

  const [toggle, setToggle] = useState(false);
  const endTime=40;
  const notificationTime=20;


  const connectButton = async() => {
    try{
      let web3modal =new Web3Modal({
        cacheProvider:false,
        providerOptions
      })
      let web3modalInstance = await web3modal.connect();
      let web3modalProvider = new ethers.providers.Web3Provider(web3modalInstance)
      const signer= web3modalProvider.getSigner()
      setAddress(await signer.getAddress())
      // console.log(web3modalProvider)
      // console.log(web3modalProvider.getSigner())
      if(web3modalProvider){
        setWeb3Provider(web3modalProvider)
      }
      setToggle(true)

    }catch(err){
      console.log(err)
    }
  }

  const handleDisconnect = async () => {
    localStorage.removeItem("walletconnect"); 
    setWeb3Provider(null);
    setTimer(0);
    setToggle(false);
  };
  const handleReset = () => {
    setTimer(0);
    setToggle(true);
  };

  useEffect(() => {
    let counter;
    if (toggle) {
      counter = setInterval(() => setTimer(timer => timer + 1), 1000);  
    }
    if(timer>endTime){
      handleDisconnect()
    }
    return () => {
      clearInterval(counter);
    };
  }, [toggle,timer]);


  return (
    <div className="App">
        <div className="App-header">
         
          {
            web3Provider == null ?
            (
              <button onClick={connectButton} className="button">Connect</button>
            )
          :(
          <>
          <button onClick={handleDisconnect} className="disconnect">Disconnect</button>
          <p>Address is : {address}</p>
          {
            (timer<endTime)&&
            <p className="expire">Login expires in = {endTime-timer} sec</p>
            
          }
          
          {(timer >notificationTime ) &&
          <div className="extend">
          <p>Please extend for another {endTime} seconds of login </p>
          <button onClick={handleReset} className="disconnect">Extend</button>
          </div>
          }
          </>
            )
          }
        </div>
    </div>
  );
}

export default App;
