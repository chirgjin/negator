//$.noConflict();

function runCode() {
    const obj = window.location.hostname.match(/facebook\.com/i) ? new Facebook : null;
    
    console.log(obj);
}

jQuery(document).ready(() => {
    runCode();
});