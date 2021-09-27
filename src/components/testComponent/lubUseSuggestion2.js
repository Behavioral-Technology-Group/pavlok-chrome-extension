const stimulusPaths = {
    vibrate: "/api/v1/vibrate",
    beep: "/api/v1/beep",
    zap: "/api/v1/shock"
}
const v1Stimulus = async (accessToken, type, value, message) => {
    // v1 Stimulus removes duplication for each type
    // const host = "https://pavlok-mvp.herokuapp.com";
    const host = "https://app.pavlok.com/";
    const url = `${host}${stimulusPaths[type]}/${value}`;
    const body = JSON.stringify({
        "access_token": accessToken,
        "reason": message
    });
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    // no await, as that might or might not be desirable
    return fetch(url, {
        method: "POST",
        headers: headers,
        body: body,
        redirect: "follow"
    });
}
export const Pavlok = {
    // client to keep token
    client: (accessToken) => {
        return {
            vibrate: (value, message) => v1Stimulus(accessToken, "vibrate", value, message),
            beep: (value, message) => v1Stimulus(accessToken, "beep", value, message),
            zap: (value, message) => v1Stimulus(accessToken, "zap", value, message)
        }
    },
    // independent stimuli
    vibrate: (accessToken, value, message) => v1Stimulus(accessToken, "vibrate", value, message),
    beep: (accessToken, value, message) => v1Stimulus(accessToken, "beep", value, message),
    zap: (accessToken, value, message) => v1Stimulus(accessToken, "zap", value, message)
}

export default Pavlok;