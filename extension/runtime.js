$.noConflict();

function runCode() {
    const fb = new Facebook(jQuery);

    setTimeout(() => {
        fb.sendRequest( fb.getContent() ).then(console.log);
    },10 * 1000);
}

jQuery(document).ready(() => {
    runCode();
});
