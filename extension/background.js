chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.local.set({color: '#3aa757'}, function () {
        console.log('The color is green.');
    });
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {

        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {
                        schemes: ['http', 'https']
                    },
                })
            ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});


function requestToApi (data) {
    return new Promise (function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://negator.herokuapp.com/api", true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status >= 200 && this.status < 300) {
                    resolve(xhr.response);
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            }
        }

        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        }

        xhr.timeout = 30000
        xhr.ontimeout = function () {
            xhr.send(content);
        }

        xhr.send(content);
    });
}