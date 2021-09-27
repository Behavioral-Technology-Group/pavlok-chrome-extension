const dateParser = (string) => {

    if (typeof string === 'string') {
        let colonPosition = string.indexOf(":");
        if (colonPosition == -1) { return console.log("not a valid time string.") }

        if (colonPosition != -1) {
            let hour = string.slice(colonPosition - 2, colonPosition);
            if (hour === "") { hour = string.slice(colonPosition - 1, colonPosition); }

            let minutes = string.slice(colonPosition + 1, colonPosition + 3);
            let dayTurn = string.slice(-2);

            let parsedHour = Number(hour);
            let parsedMinutes = Number(minutes);

            if (dayTurn == "pm" || dayTurn == "PM" || dayTurn == "Pm") { parsedHour += 12 }

            let date = new Date();
            date.setHours(parsedHour);
            date.setMinutes(parsedMinutes);
            date.setSeconds(0);

            return date;
        }
    } else {
        return ("not a valid string");
    }

};

export default dateParser;