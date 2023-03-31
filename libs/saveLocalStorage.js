function saveLocalStorage(){
    console.log("saving to localStorage");
    localStorage.setItem('account', this.state.account);
    localStorage.setItem('login',this.state.login);
    console.log("saved successfully...");
    console.log(this.state);
}

export default saveLocalStorage;