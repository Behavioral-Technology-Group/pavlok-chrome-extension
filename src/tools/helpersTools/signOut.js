import lsDel from './lsDel';
import msgInterfaces from './msgInterfaces';
import revokeAccessToken from './revokeAccessToken';
import UpdateBadgeOnOff from './updateBadgeOnOff';
import maybeEndUserSession from './maybeEndUserSession';


const signOut = () => {
    revokeAccessToken();
    maybeEndUserSession();
    UpdateBadgeOnOff("Off");
    msgInterfaces({ action: "logged", token: 'not logged' })

    lsSet('logged', 'false');
    lsDel('accessToken');
    // clearCookies();
};
export default signOut;