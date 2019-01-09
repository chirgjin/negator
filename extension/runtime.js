//$.noConflict();

function runCode() {

    chrome.storage.local.get(['disabledDomains'], (data) => {
        
        if(data.disabledDomains && data.disabledDomains.indexOf(location.hostname) > -1) {
            return ;
        }

        const obj = window.location.hostname.match(/facebook\.com/i) ? new Facebook : new WP;
        
        console.log(obj);
    });
}

jQuery(document).ready(() => {
    runCode();
});