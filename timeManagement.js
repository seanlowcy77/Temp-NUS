// Variable to check if Temperature for AM / PM has been submitted
var submitAm = false;
var submitPm = false;

// Variable that indicates to the script that it is time to reset and start giving alerts again
var resetted = false;

const noonHour = 12;
const startHour = 8;
const midnightHour = 0;

// Arbitrary time to reset the notifcations
const resetNotifHour = 16;

// Listener for various events
chrome.browserAction.onClicked.addListener(buttonClicked);
chrome.tabs.onUpdated.addListener(tabUpdated);
chrome.tabs.onUpdated.addListener(resetTime);
chrome.tabs.onUpdated.addListener(checkTimeForNotif);

// Function that resets the boolean variables
function resetTime() {
    // console.log(submitAm);
    // console.log(submitPm);

    var currDate = new Date();
    var currHour = currDate.getHours();
    // Resets all the variables on a new day
    if (!resetted && currHour >= midnightHour && currHour < resetNotifHour) {
        submitAm = false;
        submitPm = false;
        resetted = true;
    }

    // Ensures that the submit status may be resetted the following day
    else if (submitAm && submitPm && currHour >= resetNotifHour) {
        resetted = false;
    }
}

function updateSubmitStatus(date, both) {
    if (both) {
        submitAm = true;
        submitPm = false;
    } else if (date.getHours() >= noonHour) {
        submitPm = true;
    } else {
        submitAm = true;
    }
}

function tabUpdated(tabId, changeInfo, tab) {
    // console.log(tab.url);
    // console.log(changeInfo);
    // console.log(tabId);

    // If the tab has been loaded and the current page is the temperature submission page submit the temperature and update submit status
    if (
        changeInfo.status === "complete" &&
        tab.url.includes("https://myaces.nus.edu.sg/htd/htd?")
    ) {
        var date = new Date();
        // If both AM and PM temperatures has not been submitted, send message to submit both
        if (!submitPm && !submitAm) {
            send(tabId, "updateBoth");
            updateSubmitStatus(date, true);
        } else if (submitPm || submitAm) {
            send(tabId, "updateSingle");
            updateSubmitStatus(date, false);
        }
    }
}

function buttonClicked() {
    // Update the current tab to the temperature taking page if AM or PM temperature has not been submitted
    if (!submitPm || !submitAm) {
        chrome.tabs.update({
            url: "https://myaces.nus.edu.sg/htd/htd"
        });
    } else {
        // Inform user that temperature has already been submitted
        alert("You have submitted all temperatures for today!");
    }
}

function send(id, message) {
    // Sends the message to content.js for the listener to pick up
    chrome.tabs.sendMessage(id, message);
}

function checkTimeForNotif(tabId, changeInfo, tab) {
    var currDate = new Date();

    // Gives a reminder from 8am to 12pm if morning temperature is not submitted
    if (submitAm == false && submitPm === false) {
        timeNotif(changeInfo, "Am & PM");
    } else if (
        currDate.getHours() < noonHour &&
        currDate.getHours() >= startHour &&
        submitAm === false
    ) {
        timeNotif(changeInfo, "AM");

        // Gives a reminder from 12pm to midnight if morning temperature is not submitted
    } else if (currDate.getHours() >= noonHour && submitPm === false) {
        timeNotif(changeInfo, "PM");
    }
}

function timeNotif(changeInfo, time) {
    var tempMessage =
        "Temperature time! Your " +
        time +
        " temperature has not been submitted. Click the icon to submit your temperature!";

    // Sends the alert only when a new tab has completely loaded
    if (changeInfo.status === "complete") {
        alert(tempMessage);
    }
}
