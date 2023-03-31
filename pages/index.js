import * as React from 'react';
import Head from 'next/head'
import Layout from '@/components/Layout';

import Web3 from "web3";

import platform from '@/libs/platform';
import connectToMetamask from "@/libs/login";
import disconnectFromMetamask from "@/libs/logout";
import userInfoUpdate from "@/libs/userInfoUpdate";
import saveLocalStorage from "@/libs/saveLocalStorage";
import RenderPlatformInfo from "./index_platformInfo";
import RenderRegisterDialog from "./index_userRegisterDialog";

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
  console.log(this.web3);
  this.platform = platform(this.web3);
  console.log(this.platform);

  let platformInfoTmp = {
    owner : await this.platform.methods.owner().call(),
    userNum : await this.platform.methods.userNum().call(),
    devNum : await this.platform.methods.devNum().call(),
    projNum : await this.platform.methods.projNum().call(),
  };

  this.setState({
    login : true,
    account : acc,
    platformInfo : platformInfoTmp,
    header : await this.userInfoUpdate(acc),
  },this.saveLocalStorage);

}

async function userRegister(userDescription){
  console.log("register for "+ this.state.account);
  await this.platform.methods.userRegister(userDescription).send({from:this.state.account});
}


export default class Index extends React.Component{

  constructor(props){
    super(props);

    // init the state
    this.state = {
      account: null,
      login : false,
      header : {
        isDev : false,
        isAdmin : false,
        isUser : false,
        buttonContent : null,
      },
      platformInfo : {
        owner : null,
        userNum : null,
        devNum : null,
        projNum : null,
      }
    }

    this.bind();

  }
  
  bind(){
    this.connectionManagement = connectionManagement.bind(this);
    this.refreshRender = refreshRender.bind(this);
    this.userRegister = userRegister.bind(this);
    this.userInfoUpdate = userInfoUpdate.bind(this);
    this.saveLocalStorage = saveLocalStorage.bind(this);
  }

  async componentDidMount() {
    const login = Boolean(localStorage.getItem('login'));
    const addr = localStorage.getItem('account') === 'null' ? null :  localStorage.getItem('account');
    if (login){
      await this.refreshRender(addr);
    }
  }

  render() {
    return (
      <>
        <Head>
          <title>Interest Sharing Platform-Index</title>
          <meta name="description" content="Web3 interest sharing Entrance" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Layout connect={this.connectionManagement} header={this.state.header}>
          <RenderPlatformInfo  state={this.state} />
          <RenderRegisterDialog state={this.state} cb={this.userRegister} />
        </Layout>
      </>
    )
  }
}