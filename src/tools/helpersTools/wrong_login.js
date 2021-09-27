function wrong_login() {
    $("#unloggedMessage").effect("highlight", { color: 'white' }, 400);
    $("#unloggedMessage").text("Invalid password and email combination");
}

export default wrong_login;