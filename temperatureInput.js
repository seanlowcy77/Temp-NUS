chrome.runtime.onMessage.addListener(gotMessage);

function gotMessage(message, sender, sendResponse) {
    console.log(message);
    if (message === "updateSingle") {
        // https://developer.mozilla.org/en-US/docs/Web/API/Document
        inputTemperature();
    } else if (message === "updateBoth") {
        inputTemperatureBoth();
    }
}

// Inputs Temperature for only AM or PM
function inputTemperature() {
    elements = document.getElementsByTagName("input");
    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
    for (ele of elements) {
        if (ele.value === "N") {
            ele.click();
        } else if (ele.id === "temperature") {
            ele.value = (36.0 + Math.random()).toFixed(1);
        } else if (ele.value === "Submit") {
            ele.click();
        }
    }
}

// Inputs Temperature for PM and AM should user forget to input AM temperature
function inputTemperatureBoth() {
    optionElements = document.getElementsByTagName("option");
    for (opt of optionElements) {
        if (opt.value === "A") {
            opt.selected = true;
        }
    }

    inputElements = document.getElementsByTagName("input");
    for (ele of inputElements) {
        if (ele.value === "N") {
            ele.click();
        } else if (ele.id === "temperature") {
            ele.value = (36.0 + Math.random()).toFixed(1);
        } else if (ele.value === "Submit") {
            ele.click();
        }
    }
}
