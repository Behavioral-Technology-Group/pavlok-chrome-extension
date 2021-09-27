import log from './log';

function isValid(token) {

    // Temporary workaround
    // console.log("dentro do isValid");
    // console.log(token);

    if (!localStorage.accessToken) { return false }
    else if (localStorage.accessToken.length == 64) { return true }
    else { return false }

    // // Tries the code against API
    // // log(localStorage.baseAddress + 'api/v1/me?access_token=' + localStorage.accessToken);
    // log(localStorage.baseAddress + 'api/v1/me?access_token=' + token);

    // var response;
    // $.get(localStorage.baseAddress + 'api/v1/me?access_token=' + localStorage.accessToken)
    //     // $.get(localStorage.baseAddress + 'api/v1/me?access_token=' + token)
    //     .done(function (data) {
    //         log(data);
    //         log("GOOD token. Works on API.");
    //         console.log("GOOD token. Works on API....");
    //         response = true;
    //         // return true;
    //     })
    //     .fail(function () {
    //         log("BAD token. Fails on API.");
    //         console.log("BAD token. Fails on API.----");
    //         response = false;
    //         // return false;
    //     });

    // console.error(response);

    // return response;
}

export default isValid;