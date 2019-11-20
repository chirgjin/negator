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

function set (prop, val) {
    chrome.storage.local.set({
        [prop]: val,
        //disabledDomains : disabledDomains
    }, function() {
        console.log('setted up the data');
    });
}

function get () {
    return new Promise( resolve => {
        chrome.storage.local.get(['disabledDomains', 'hate_speech_percentage', 'password_hash'], data => {
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
                        port.postMessage(data);
                    });
                }
                else if(msg.type == 'set') {

                    if(msg.key == 'disabledDomains') {
                        get().then(data => {
                            let doms = data.disabledDomains || [];
                            if(doms.indexOf(msg.value) == -1)
                                doms.push(msg.value)
                            
                            set('disabledDomains', doms);
                        })
                    }
                    else if(msg.key == 'enableDomain') {
                        get().then(data => {
                            let doms = data.disabledDomains || [];
                            
                            let index = doms.indexOf(msg.value);

                            doms.splice(index,1);

                            set('disabledDomains', doms);
                        })
                    }
                    else set(msg.key, msg.value);
                }
           }
      });
 });