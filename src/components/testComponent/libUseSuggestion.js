//this is the original suggested code 

export const vibrate = async (access_token, value, message) => {

}

export const beep = async (access_token, value, message) => {

}

export const zap = async (access_token, value, message) => {

}

export const createClient = (access_token) => {
    return {
        vibrate: async (value, message) => vibrate(access_token, value, message),
        beep: async (value, message) => beep(access_token, value, message),
        zap: async (value, message) => zap(access_token, value, message),
    }
}

vibrate(user.access_token, value, message);

client = createClient(access_token);
client.vibrate(value, message);
