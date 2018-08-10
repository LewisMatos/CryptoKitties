import React, { Component } from 'react';
import { object } from 'prop-types';
import Web3 from 'web3';
import KittyCoreABI from '../contracts/KittyCoreABI.json';
import Moment from 'react-moment';
import { CONTRACT_NAME, CONTRACT_ADDRESS } from '../config';

class Browser extends Component {
  constructor(props, context) {
    super(props);
    this.drizzle = context.drizzle;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      inputid: '',
      kittyid: '',
      result: {},
    };
  }

  componentDidMount() {
    const web3 = new Web3(window.web3.currentProvider);
    // Initialize the contract instance
    const kittyContract = new web3.eth.Contract(
      KittyCoreABI, // import the contracts's ABI and use it here
      CONTRACT_ADDRESS,
    );
    // Add the contract to the drizzle store
    this.context.drizzle.addContract({
      contractName: CONTRACT_NAME,
      web3Contract: kittyContract,
    });
  }

  async getKitty(id) {
    let resp = await this.drizzle.contracts.CryptoKitties.methods.getKitty(id).call();
    if (resp) {
      this.setState({ result: resp, kittyid: id });
    }
  }

  handleSubmit(evt) {
    evt.preventDefault();
    this.getKitty(this.state.inputid);
    this.setState({ inputid: '' });
  }

  handleChange(evt) {
    this.setState({ inputid: evt.target.value });
  }

  renderDate() {
    let birthTime = this.state.result.birthTime;
    if (birthTime) {
      return (
        <Moment unix format="MMMM DD YYYY">
          {birthTime}
        </Moment>
      );
    }
  }

  renderImage() {
    let kittyid = this.state.kittyid;
    if (kittyid) {
      return (
        <div className="kitty-image">
          <img
            alt=""
            src={`https://storage.googleapis.com/ck-kitty-image/0x06012c8cf97bead5deae237070f9587f8e7a266d/${kittyid}.svg`}
          />
        </div>
      );
    }
  }

  render() {
    let birthTime = this.state.result.birthTime;
    let generation = this.state.result.generation;
    let genes = this.state.result.genes;

    return (
      <div className="browser">
        <h1>Kitty Browser</h1>

        <div className="form-kitty-id">
          <form onSubmit={this.handleSubmit}>
            <label>
              <div>
                <strong>Kitty ID:</strong>
              </div>
              <div className="submit">
                <input
                  className="inputid"
                  type="number"
                  value={this.state.inputid}
                  pattern="[0-9]"
                  onChange={this.handleChange}
                />
                <button className="submitid" type="submit">
                  FIND KITTY
                </button>
              </div>
            </label>
          </form>
        </div>

        <div className="results">
          <h3>Genes</h3>
          <p>{genes}</p>
          <h3>Generation</h3>
          <p>{generation}</p>
          <h3>Birth Time</h3>
          {this.renderDate()}
          {this.renderImage()}
        </div>
      </div>
    );
  }
}

Browser.contextTypes = {
  drizzle: object,
};

export default Browser;
