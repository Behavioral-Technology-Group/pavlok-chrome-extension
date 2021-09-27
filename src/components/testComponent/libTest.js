export const ClientId = '8d60cc40094ee72ef44df79f9a50308e8fce9ab779aa8f3ea49620cc3912fb2e';

//-----------------------------------------------
const urlBuilder = (stimulus, value) => {
    const host = "https://app.pavlok.com/";
    const path = `/api/v1/${stimulus}/${value}`;
    const url = host + path;
    console.log(url);
    return url;
}

const bodyBuilder = (access_token, message) => {
    const response = JSON.stringify({
        "access_token": access_token,
        "reason": message
    });

    return response;
}

const vibrate = async (access_token, value, message) => {
    const url = urlBuilder('vibration', value);
    const body = bodyBuilder(access_token, message);

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'POST',
        headers: headers,
        body: body,
        redirect: 'follow'
    };
    return await fetch(url, requestOptions);
}

const beep = async (access_token, value, message) => {
    const url = urlBuilder('beep', value);
    const body = bodyBuilder(access_token, message);

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'POST',
        headers: headers,
        body: body,
        redirect: 'follow'
    };
    return await fetch(url, requestOptions);
}

const zap = async (access_token, value, message) => {
    const url = urlBuilder('shock', value);
    const body = bodyBuilder(access_token, message);

    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    var requestOptions = {
        method: 'POST',
        headers: headers,
        body: body,
        redirect: 'follow'
    };
    return await fetch(url, requestOptions);
}

export const createClient = (accessToken) => {
    return {
        vibrate: async (value, message) => vibrate(accessToken, value, message),
        beep: async (value, message) => beep(accessToken, value, message),
        zap: async (value, message) => zap(accessToken, value, message),
    }
}


