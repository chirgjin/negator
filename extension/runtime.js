//$.noConflict();

function runCode() {

    chrome.storage.local.get(['disabledDomains'], (data) => {
        
        if(data.disabledDomains && data.disabledDomains.indexOf(location.hostname) > -1) {
            return ;
        }

        let obj;
        
        if(window.location.hostname.match(/facebook\.com/i)) {
            obj = new Facebook
        }
        else if(window.location.hostname.match(/steamcommunity\.com/i)) {
            obj = new SteamCommunity
        }
        else {
            obj = new WP
        }
        
        console.log(obj);
    });
}

jQuery(document).ready(() => {
    runCode();
});