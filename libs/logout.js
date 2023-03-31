async function disconnectFromMetamask() {
    await window.ethereum.request({
        method: "eth_requestAccounts",
        params: [
          {
            eth_accounts: {}
          }
        ]
      });
}

export default disconnectFromMetamask;