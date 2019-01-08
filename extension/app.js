document.addEventListener('load', function () {
    chrome.tabs.query({
        active: true,
    }, function (tabs) {
        chrome.tabs.executeScript(tabs[0].id, {
            code:  "console.log('lol')"
        });
    });
});

window.onload = function () {
    console.log('lol');
}


$(".slider").change(function () {
    $('.percentage').html(this.value+'%')
});

$(".search").change(function () {
    chrome.storage.local.set( {this.value}, function () {});
})

$('.search').keypress(function(e) {
    if (e.which == '13') {
       e.preventDefault();
       console.log(this.value)
     }
});