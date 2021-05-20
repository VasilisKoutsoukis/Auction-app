import React, { Component } from "react";
import AuctionContract from "./contracts/Auction.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { highestBid: 0, highestBidder: 0, web3: null, accounts: null, contract: null, bid: 0, my_balance: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = AuctionContract.networks[networkId];
      const instance = new web3.eth.Contract(
        AuctionContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      const response_hbid = await instance.methods.highestBid().call();
      const response_hbidder = await instance.methods.highestBidder().call();
      const response_mybal = await instance.methods.userBalances(accounts[0]).call();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3: web3,accounts: accounts, contract: instance, highestBid: response_hbid,
                      highestBidder: response_hbidder, my_balance: response_mybal});
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  myChangeHandler = (event) => {
    this.setState({bid: event.target.value});
  }
  myChangeHandler2 = (event) => {
    this.setState({bid: event.target.value});
  }


  bid = async () => {
      const { accounts, contract } = this.state;

      await contract.methods.bid().send({from: accounts[0], value: this.state.bid});

      const response_hbid = await contract.methods.highestBid().call();
      const response_hbidder = await contract.methods.highestBidder().call();
      const response_mybal = await contract.methods.userBalances(accounts[0]).call();

      // Update state with the result.
      this.setState({ highestBid: response_hbid, highestBidder: response_hbidder, my_balance: response_mybal});
  };

  withdraw = async () => {
      const {accounts, contract } = this.state;


      await contract.methods.withdraw().send({from: accounts[0]});

      const response_hbid = await contract.methods.highestBid().call();
      const response_hbidder = await contract.methods.highestBidder().call();
      const response_mybal = await contract.methods.userBalances(accounts[0]).call();

      // Update state with the result.
      this.setState({ highestBid: response_hbid, highestBidder: response_hbidder, my_balance: response_mybal});
  };

  myChangeHandler = (event) => {
    this.setState({bid: event.target.value});
  }


  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Auction Contract</h1>
        <div><b>Highest Bid: </b>{this.state.highestBid}</div>
        <div><b>Highest Bidder: </b>{this.state.highestBidder}</div>
        <div><b>My balance into the auction: </b>{this.state.my_balance}</div>
        <p></p>
        <b>Bid value: </b>
        <input type="text" onChange={this.myChangeHandler}/>
        <button onClick={this.bid}>Bid</button>
        <div></div>
        <b>Click to withdraw: </b>
        <button onClick={this.withdraw}>Withdraw</button>
      </div>
    );
  }
}

export default App;
