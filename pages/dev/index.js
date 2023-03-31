import * as React from 'react';
import Head from 'next/head'
import Layout from '@/components/Layout';

import Web3 from "web3";

import platform from "@/libs/platform";
import connectToMetamask from "@/libs/login";
import disconnectFromMetamask from "@/libs/logout";
import userInfoUpdate from "@/libs/userInfoUpdate";
import saveLocalStorage from "@/libs/saveLocalStorage";
import Custom403 from '../error/403';

import ProjectCreateFlow from './dev_createProjDialog';
import DevProjs from './dev_Proj';

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

  const devProjs = await this.platform.methods.getDevProjList(acc).call();


  this.setState({
      login : true,
      account : acc,
      header : await this.userInfoUpdate(acc),
      devProjs: devProjs,
  },this.saveLocalStorage);

  console.log("state changed due to rerendering");
}

async function registerProj(projAddr,projName,projDesc,requireETH,erc20Addr,amount,duration){
  await this.platform.methods.projectRegister(
    projAddr,projName,projDesc,requireETH,erc20Addr,amount,duration
  ).send({from:this.state.account});
  await this.refreshRender(this.state.account);
}

async function getProj(projAddr) {
  const proj = {
    info : await this.platform.methods.projAddr2ProjMapping(projAddr).call(),
    funding : await this.platform.methods.projAddr2ProjFundingMapping(projAddr).call(),
  }
  return proj;
}

async function submitProj(projAddr){
  await this.platform.methods.projectSubmit(projAddr).send({from:this.state.account});
}

async function refresh(){
  await this.refreshRender(this.state.account);
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
      devProjs : [],
    }
    
    this.bind();
  }

  bind(){
    this.refreshRender = refreshRender.bind(this);
    this.connectionManagement = connectionManagement.bind(this);
    this.saveLocalStorage = saveLocalStorage.bind(this);
    this.userInfoUpdate = userInfoUpdate.bind(this);
    this.registerProj = registerProj.bind(this);
    this.getProj = getProj.bind(this);
    this.submitProj = submitProj.bind(this);
    this.refresh = refresh.bind(this);
    this.cbs = {
      getProj : this.getProj,
      submit : this.submitProj,
      refresh : this.refresh,
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
          <title>Interest Sharing Platform-Dev</title>
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
                <ProjectCreateFlow proj = {this.state.devProjs} cb={this.registerProj}/>
                <DevProjs proj = {this.state.devProjs} cbs={this.cbs}/>
              </div>
            )
          }
        </Layout>
      </>
    )
  }
}
