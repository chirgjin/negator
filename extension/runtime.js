$.noConflict();

function runCode() {
    const fb = new Facebook(jQuery);

    setTimeout(() => {
        fb.sendRequest( fb.content ).then(console.log);
    },5 * 1000);
}

jQuery(document).ready(() => {
    runCode();
});
