async function headUpdate(acc) {

    let headerTmp;

    if (acc!=null){
        headerTmp = {
            isDev : await this.platform.methods.isDevCheck(acc).call(),
            isAdmin : ((await this.platform.methods
                        .owner().call()).toUpperCase() == acc.toUpperCase()),
            isUser : await this.platform.methods.isUserCheck(acc).call(),
            buttonContent : acc,
          };
    }else{
        headerTmp = {
            isDev : false,
            isAdmin : false,
            isUser : false,
            buttonContent : null,
          };
    }

    return headerTmp;
}

export default headUpdate;