const authentication = {
    login(id) {
        localStorage.setItem("login", JSON.stringify(true));
        localStorage.setItem("userId", JSON.stringify(id));
    },
    logout() {
        localStorage.clear();
        localStorage.setItem("login", JSON.stringify(false));
    },
    getUserId() {
        return JSON.parse(localStorage.getItem("userId"));
    },
};

export default authentication;
