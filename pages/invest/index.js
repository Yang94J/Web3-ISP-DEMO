import * as React from 'react';
import Head from 'next/head'
import Layout from '@/components/Layout';

import Web3 from "web3";

import tokenURL from '@/libs/tokenURL';
import platform from "@/libs/platform";
import connectToMetamask from "@/libs/login";
import disconnectFromMetamask from "@/libs/logout";
import userInfoUpdate from "@/libs/userInfoUpdate";
import saveLocalStorage from "@/libs/saveLocalStorage";
import Custom403 from '../error/403';

import InvestProjs from './invest_proj';
import Token from '@/libs/erc20';


async function connectionManagement(){
  if (!this.state.login){
    const account = await connectToMetamask();
    await this.refreshRender(account);
  }else{
    await disconnectFromMetamask();
    this.setState({
      header : await this.userInfoUpdate(null),
      login : false,
      account : null,
    },this.saveLocalStorage);
  }
}

async function refreshRender(acc) {

  this.web3 = new Web3(window.ethereum);
  this.platform = platform(this.web3);

  const totalProj = await this.platform.methods.projNum().call();
  console.log(totalProj);

  this.setState({
      login : true,
      account : acc,
      header : await this.userInfoUpdate(acc),
      totalProj: totalProj,
  },this.saveLocalStorage);

  console.log("state changed due to rerendering");
}

async function getProj(projAddrInd) {

  const projAddr = await this.platform.methods.projInd2ProjAddrMapping(projAddrInd).call();

  const proj = {
    info : await this.platform.methods.projAddr2ProjMapping(projAddr).call(),
    funding : await this.platform.methods.projAddr2ProjFundingMapping(projAddr).call(),
  }
  return proj;
}


async function invest(projDetail, amount) {
  if (!projDetail.funding.requireETH){
    await (Token(this.web3,projDetail.funding.erc20Address).methods.approve(this.platform._address,amount).send({from:this.state.account}));
  }
  const url = await tokenURL(projDetail.info.projName,this.state.account,amount,projDetail.funding.requireAmount);
  await this.platform.methods.donate(projDetail.info.projAddr,amount,url).send({from:this.state.account, value:amount});
}

export default class Profile extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      account: null,
      login : false,
      header : {
        isDev : false,
        isAdmin : false,
        isUser : false,
        buttonContent : null,
      },
      totalProj : 0,
    }
    
    this.bind();
  }

  bind(){
    this.refreshRender = refreshRender.bind(this);
    this.connectionManagement = connectionManagement.bind(this);
    this.saveLocalStorage = saveLocalStorage.bind(this);
    this.userInfoUpdate = userInfoUpdate.bind(this);
    this.getProj = getProj.bind(this);
    this.invest = invest.bind(this);
    this.cbs = {
      getProj : this.getProj,
      invest : this.invest,
    }
  }

  async componentDidMount() {
    console.log("mounting...")
    const login = Boolean(localStorage.getItem('login'));
    const addr = localStorage.getItem('account') === 'null' ? null :  localStorage.getItem('account');

    console.log(login);
    console.log(login==false);

    if (login){
      console.log("fetching data...")
      await this.refreshRender(addr);
    }
  }

  render() {
    
    return (
      <>
        <Head>
          <title>Interest Sharing Platform-Invest</title>
            <meta name="description" content="Web3 interest sharing Entrance" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout connect={this.connectionManagement} header={this.state.header}>
          {
            !this.state.login
            &&
            (
              <Custom403 />
            )
          }
          {
            this.state.login
            &&
            (
              <div>
                <InvestProjs totalProj={this.state.totalProj} cbs={this.cbs}/>
              </div>
            )
          }
        </Layout>
      </>
    )
  }
}
