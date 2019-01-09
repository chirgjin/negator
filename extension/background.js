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

function set (categories, hateSpeechPercentage) {
    chrome.storage.local.set({
        'categories': categories,
        'hate_speech_percentage': hateSpeechPercentage
    }, function() {
        console.log('setted up the data');
    });
}

function get () {
    return new Promise( resolve => {
        chrome.storage.local.get(['categories', 'hate_speech_percentage'], data => {
            console.log(data);
            resolve(data);
        });
    })
}

 chrome.extension.onConnect.addListener(function(port) {
      
      port.onMessage.addListener(function(msg) {
           console.log(msg);
           if(typeof msg == 'object') {
                if(msg.type == 'get') {

                    get().then(data => {
                        port.postMessage(data.hate_speech_percentage);
                    });
                }
                else if(msg.type == 'set') {

                    set([], msg.hate_speech_percentage);
                }
           }
      });
 })