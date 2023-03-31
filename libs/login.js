import networkConfig from "../config/network.json";

async function connectToMetamask() {
    try {
  
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      console.log(account +" has connected to the platform");
  
      await window.ethereum.request(
        {
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${networkConfig.chainId.toString(16)}`,
              chainName: 'Goerli test network',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: [networkConfig.rpcUrl],
              blockExplorerUrls: ["https://goerli.etherscan.io"],
            },
          ],
        }
      ).then(async () => {
        console.log("network switched successfully");
      });
      return account;
    } catch (error) {
      throw error;
    }
  }

  export default connectToMetamask;