var d = new Date();
var formattedDate = d.toLocaleString();

// Function to add hours to the current date
function addHoursToDate(hours) {
    var newDate = new Date();
    newDate.setHours(newDate.getHours() + hours);
    return newDate;
}

// Function to minus hours to the current date
function minusHoursToDate(hours) {
    var newDate = new Date();
    newDate.setHours(newDate.getHours() - hours);
    return newDate;
}

// ADD HOURS
function addTimezone(cyberpunk, original, timeZone, difference) {
    var adjustedDate = addHoursToDate(difference);
    var formattedDate = adjustedDate.toLocaleString();

    alert(`${cyberpunk}, ${original} - Est. Curr. Time: ${formattedDate}, ${timeZone}`);
}

// MINUS HOURS
function minusTimezone(cyberpunk, original, timeZone, difference) {
    var adjustedDate = minusHoursToDate(difference);
    var formattedDate = adjustedDate.toLocaleString();

    alert(`${cyberpunk}, ${original} - Est. Curr. Time: ${formattedDate}, ${timeZone}`);
}