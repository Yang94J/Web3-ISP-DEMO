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

import Donations from './profile_donations';
import DevRegisterDialog from './profile_registerDialog';
import UserInfo from './profile_userInfo';

import { Container } from '@mui/material';

import styles from "../../styles/Profile.module.css";

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

  this.setState({
      login : true,
      account : acc,
      header : await this.userInfoUpdate(acc),
      donationNum : await this.platform.methods.user2DonationTimes(acc).call(),
  },this.saveLocalStorage);
}

async function devRegister(){
  console.log("register dev for "+ this.state.account);
  await this.platform.methods.devRegister().send({from:this.state.account});
}

async function getUser() {
  console.log("getting user info for "+this.state.account);
  return await this.platform.methods.addr2UserMapping(this.state.account).call();
}

async function getDonation(ind){
  const donationId = await this.platform.methods.user2DonationInd(this.state.account,ind).call();
  return await this.platform.methods.donations(donationId).call();
}

async function getNFTAddress(projAddr){
  return (await this.platform.methods.projAddr2ProjFundingMapping(projAddr).call()).nftAddress;
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
      donationNum : 0,
    }
    
    this.bind();
  }

  bind(){
    this.refreshRender = refreshRender.bind(this);
    this.connectionManagement = connectionManagement.bind(this);
    this.saveLocalStorage = saveLocalStorage.bind(this);
    this.userInfoUpdate = userInfoUpdate.bind(this);
    this.devRegister = devRegister.bind(this);
    this.getUser = getUser.bind(this);
    this.getDonation = getDonation.bind(this);
    this.getNFTAddress = getNFTAddress.bind(this);
    this.cbs = {
      getDonation : this.getDonation,
      getNFTAddress : this.getNFTAddress,
    };
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
          <title>Interest Sharing Platform-Profile</title>
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
              <Container >
                <UserInfo  cb={this.getUser} />
                <DevRegisterDialog  state={this.state} cb={this.devRegister} />
                <Donations  totalDonations = {this.state.donationNum} cbs={this.cbs}/>
              </Container>
            )
          }

        </Layout>
      </>


    );
  }
}
