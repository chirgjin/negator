//$.noConflict();

function runCode() {
    const fb = new Twitter(jQuery);
    fb.getContent();
}

jQuery(document).ready(() => {
    runCode();
});