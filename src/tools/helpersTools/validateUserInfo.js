function validateUserInfo(info) {
    var email = info.userName;
    var pass = info.password;

    var problems = [];

    var hasAt = email.indexOf("@") > 0;
    var hasDot = email.indexOf(".") > 0;

    var user;
    if (hasAt && hasDot) { user = true }
    else { user = false }

    var hasPass = pass.length > 0;

    if (user && pass) { return true }
    else { return false }
}

export default validateUserInfo;