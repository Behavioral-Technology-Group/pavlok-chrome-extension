import log from './log';
import lsDel from './lsDel';
import msgInterfaces from './msgInterfaces';

function maybeEndUserSession() {
    // var baseAddress = "https://app.pavlok.com/";
    var baseAddress = "https://pavlok-mvp.herokuapp.com/";
    var apiAddress = "users/";
    var signOut = "sign_out"
    var parameters = "?token=" + lsGet("accessToken");

    var target = baseAddress + apiAddress + signOut + parameters;

    $.get(target)
        .done(function (data) {
            log("done");
            log(data);
            lsDel("accessToken");
            msgInterfaces({ action: "logged", token: 'not logged' });
        })
        .fail(function () {
            log("failed");
        });
}

export default maybeEndUserSession;