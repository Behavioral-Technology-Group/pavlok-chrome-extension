import enter_on_sign_in from './enterOnSignIn';
import showOptions from './showOptions';
import lsGet from './lsGet';
import lsSet from './lsSet';
import toggleOverlay from '../optionsTools/toggleOverlay';
import userInfo from './userInfo';
import enableCoach from '../optionsTools/enableCoach';
import enableTodoist from '../optionsTools/enableTodoist';
import removeInlineStyle from './removeInlineStyle';
import confirmUpdate from './confirmUpdate';
import blackListTable from './blackListTable';
import interfaceListeners from './interfaceListeners';


const optionsCommandsOnReady = () => {
    enter_on_sign_in();
    showOptions(lsGet("accessToken"));
    if (lsGet("logged") == 'true') {
        toggleOverlay("options");
        $(".onlyLogged").css('visibility', 'visible');
        $(".onlyUnlogged").css('display', 'none');
        $("#signOutX").attr('title', 'Sign Out');
        $("#testPairingX").show();
    }
    else {
        // toggleOverlay("hide");
        $(".onlyLogged").css('visibility', 'hidden');
        $("#signOutX").attr('title', 'Sign In');
        $("#testPairingX").hide();
    }

    // Fill user Data
    if (!lsGet("userName")) {
        userInfo(lsGet("accessToken"))
    }

    if (lsGet("userName") == undefined) { lsSet("userName", ' '); }
    else {
        $('#userEmailSettings').html(lsGet("userEmail"));
        $('#userName').html(" " + lsGet("userName"));
    }
    if ($('#blackListDaily_tagsinput').length > 0) { return }
    enableCoach();
    enableTodoist();

    const elementList = [
        "#blackList_tagsinput",
        "#whiteList_tagsinput",
        "#blackListDaily_tagsinput",
        "#whiteListDaily_tagsinput"
    ];
    elementList.forEach(removeInlineStyle);

    $("body").on('change', '.pavSetting', function () {
        confirmUpdate(notifyUpdate);
    });

    blackListTable.create(lsGet('blackList', 'parse'), 'blackList');
    blackListTable.listenClicks();

    interfaceListeners("options");
}

export default optionsCommandsOnReady;

//------------------------------------------------------