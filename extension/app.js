document.addEventListener('load', function () {
    chrome.tabs.query({
        active: true,
    }, function (tabs) {
        chrome.tabs.executeScript(tabs[0].id, {
            code:  "console.log('lol')"
        });
    });
});

window.onload = function () {
    console.log('lol');
}