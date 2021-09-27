import stimuli from '../helpersTools/stimuli';

const testBeepInt = () => {
    stimuli("beep", defInt, defAT, "Incoming Beep. You should receive a notification on your phone, followed by a beep");
};

export default testBeepInt;