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

import UserApplication from "./admin_userApplication";
import DevApplication from './admin_devApplication';
import ProjApplication from "./admin_projApplication";
import { Container } from '@mui/material';

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

  const userNum = (await this.platform.methods.getUserApplication().call()).length;
  const devNum = (await this.platform.methods.getDevApplication().call()).length;
  const projNum = (await this.platform.methods.getProjApplication().call()).length;

  this.setState({
      login : true,
      account : acc,
      header : await this.userInfoUpdate(acc),
      applicationInfo : {
        user : userNum,
        dev : devNum,
        proj : projNum,
      },
  },this.saveLocalStorage);
}

async function getList(str){
  switch (str){
    case 'user':
      return await this.platform.methods.getUserApplication().call();
    case 'dev':
      return await this.platform.methods.getDevApplication().call();
    case 'proj':
      return await this.platform.methods.getProjApplication().call();
  }
  return [];
}

async function getDetail(str,address){
  switch (str){
    case 'user':
      return await this.platform.methods.addr2UserMapping(address).call();
    case 'dev':
      return await this.platform.methods.addr2UserMapping(address).call();
    case 'proj':
      const proj = {
        info : await this.platform.methods.projAddr2ProjMapping(address).call(),
        funding : await this.platform.methods.projAddr2ProjFundingMapping(address).call(),
      };
      return proj;
  }
  return {};
}

async function approve(str,index,address,bool){
  switch (str){
    case 'user':
      await this.platform.methods.approveUserRegister(index,address,bool).send({from:this.state.account});
      break;
    case 'dev':
      await this.platform.methods.approveDevRegister(index,address,bool).send({from:this.state.account});
      break;
    case 'proj':
      await this.platform.methods.projectApprove(index,address,bool).send({from:this.state.account});
      break;
  }
}

export default class Admin extends React.Component{

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
      applicationInfo : {
        user : 0,
        dev : 0,
        proj : 0,
      },
    }

    this.bind();
  }

  bind() {
    this.refreshRender = refreshRender.bind(this);
    this.connectionManagement = connectionManagement.bind(this);
    this.saveLocalStorage = saveLocalStorage.bind(this);
    this.userInfoUpdate = userInfoUpdate.bind(this);
    this.getList = getList.bind(this);
    this.getDetail = getDetail.bind(this);
    this.approve = approve.bind(this);
    this.cbs = {
      getList : this.getList,
      getDetail : this.getDetail,
      approve : this.approve,
      reRender : this.refreshRender,
    }
  }

  async componentDidMount() {
    console.log("mounting...")
    const login = localStorage.getItem('login') == 'null' || localStorage.getItem('login') == 'false' ? false : Boolean(localStorage.getItem('login'));
    const addr = localStorage.getItem('account') == 'null' ? null :  localStorage.getItem('account');
    if (login == true){
      console.log("fetching data...")
      await this.refreshRender(addr);
    }
  }

  render() {
    
    return (
      <>
        <Head>
          <title>Interest Sharing Platform-Admin</title>
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
              <Container>
                <UserApplication num={this.state.applicationInfo.user} cbs={this.cbs} acc={this.state.account}/>
                <DevApplication num={this.state.applicationInfo.dev} cbs={this.cbs} acc={this.state.account}/>
                <ProjApplication num={this.state.applicationInfo.proj} cbs={this.cbs} acc={this.state.account}/>
              </Container>
            )
          }

        </Layout>
      </>


    );
}


}