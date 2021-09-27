import lsGet from './lsGet';
import isValid from './isValid';

function toggleSignInOut() {
    var token = lsGet('accessToken');
    if (isValid(token)) {
        $("#signIn").addClass("noDisplay");
        $("#signOut").removeClass("noDisplay");
    }
    else {
        $("#signIn").removeClass("noDisplay");
        $("#signOut").addClass("noDisplay");
    }
}

export default toggleSignInOut;