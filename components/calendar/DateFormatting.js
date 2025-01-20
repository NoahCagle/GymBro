function getMonthName(month) {
    switch (month) {
        case 1:
            return "January";
        case 2:
            return "February";
        case 3:
            return "March";
        case 4:
            return "April";
        case 5:
            return "May";
        case 6:
            return "June"
        case 7:
            return "July";
        case 8:
            return "August";
        case 9:
            return "September";
        case 10:
            return "October";
        case 11:
            return "November";
        case 12:
            return "December"
    }
}

function getMaxDays(month, year) {
    switch (month) {
        case 1:
            return 31;
        case 2:
            return (year % 4 == 0 ? 29 : 28);
        case 3:
            return 31;
        case 4:
            return 30;
        case 5:
            return 31;
        case 6:
            return 30;
        case 7:
            return 31;
        case 8:
            return 31;
        case 9:
            return 30;
        case 10:
            return 31;
        case 11:
            return 30;
        case 12:
            return 31;
    }
}

function getDayName(day) {
    switch (day) {
        case 0:
            return "Monday";
        case 1:
            return "Tuesday";
        case 2:
            return "Wednesday";
        case 3:
            return "Thursday";
        case 4:
            return "Friday";
        case 5:
            return "Saturday";
        case 6:
            return "Sunday";
    }
}

// Converts number value to MM string
// Example: 1 -> 01
function numberToDD(num) {
    let str = "" + num;
    switch (str.length) {
        case 1:
            return '0' + str;
        case 2:
            return str;
    }
}

// Split date formatted as mm/dd/year and returns value of mm as a number
function parseMonth(date) {
    let split = date.split('/');
    return parseInt(split[0]);
}

// Split date formatted as mm/dd/year and returns value of dd as a number
function parseDate(date) {
    let split = date.split('/');
    return parseInt(split[1]);
}


// Split date formatted as mm/dd/year and returns value of year as a number
function parseYear(date) {
    let split = date.split('/');
    return parseInt(split[2]);
}

function fullDateName(date) {
    let month = getMonthName(parseMonth(date));
    let day = parseDate(date);
    let year = parseYear(date);
    if (day % 10 == 1) {
        day = day + 'st';
    } else if (day % 10 == 2) {
        day = day + 'nd';
    } else if (day % 10 == 3) {
        day = day + 'rd'
    } else day = day + 'th';
    return month + ' ' + day + ', ' + year
}

export { getMonthName, getDayName, getMaxDays, parseMonth, parseDate, parseYear, numberToDD, fullDateName }