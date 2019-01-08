document.getElementById('lol').addEventListener('click', function () {
    chrome.tabs.query({
        active: true,
    }, function (tabs) {
        chrome.tabs.executeScript(tabs[0].id, {
            code:  "document.body.style.backgroundColor = 'red'"
        });
    });
})