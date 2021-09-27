import log from './log';
import msgInterfaces from './msgInterfaces';
import lsDel from './lsDel';

function revokeAccessToken() {
    // var baseAddress = "https://app.pavlok.com/";
    var baseAddress = "https://pavlok-mvp.herokuapp.com/";
    var apiAddress = "api/v1/";
    var signOut = "sign_out"
    var parameters = "?token=" + lsGet("accessToken");

    var target = baseAddress + apiAddress + signOut + parameters;

    lsDel("accessToken");

    $.post(target)
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

export default revokeAccessToken;