function saveLocalStorage(){
    localStorage.setItem('account', this.state.account);
    localStorage.setItem('login',this.state.login);
    console.log("saved state to LocalStorage successfully...");
}

export default saveLocalStorage;