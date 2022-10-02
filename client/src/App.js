// import { ConnectButton } from '@web3modal/react'
import Web3Modal from "web3modal"
import ArgentLogin from "@argent/login";
import {ethers} from "ethers"
import './App.css';
import { Buffer } from "buffer";
import { useState } from "react";
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
  const connectButton = async() => {
    try{
      let web3modal =new Web3Modal({
        cacheProvider:false,
        providerOptions
      })
      let web3modalInstance = await web3modal.connect();
      let web3modalProvider = new ethers.providers.Web3Provider(web3modalInstance)
      console.log(web3modalProvider)
      console.log(web3modalProvider.getSigner())
      if(web3modalProvider){
        setWeb3Provider(web3modalProvider)
      }

    }catch(err){
      console.log(err)
    }
  }

  const handleDisconnect = async () => {
    localStorage.removeItem("walletconnect"); 
    setWeb3Provider(null);
  };
  return (
    <div className="App">
        <div className="App-header">
         
          {
            web3Provider == null ?(
              <button onClick={connectButton} className="button">Connect</button>
            ):(
          <>
          <p></p>
          <button onClick={handleDisconnect} className="disconnect">Disconnect</button>
          <p>Address is : {web3Provider.provider.accounts[0]}</p>
          </>
            )
          }
        </div>
    </div>
  );
}

export default App;
