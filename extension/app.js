    
$(".slider").on('input', function () {
    $('.percentage').html(this.value+'%');
    port.postMessage({
    	type : "set",
        key : 'hate_speech_percentage',
        value : this.value
    })
});

$("#disableDomain").on("change",function () {
    
    getHost().then(host => {
        port.postMessage({
            type : "set",
            key : this.checked ? "disabledDomains" : "enableDomain",
            value : host
        });
    });

});

// $(".search").change(function () {
//     console.log(this.value);
// })

// $('.search').keypress(function(e) {
//     if (e.which == '13') {
//        e.preventDefault();
//        console.log(this.value)
//      }

// });

 var port = chrome.extension.connect({
      name: "Sample Communication"
 });
 
 function getHost() {
    return new Promise(resolve => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            let tab = tabs[0];

            let a = document.createElement("a");
            a.href = tab.url;

            console.log(a.href);

            resolve(a.hostname);
        });
    });
 }
 port.postMessage({ type : "get" });
 port.onMessage.addListener(function(msg) {
    console.log(msg);
    $(".slider").val(msg.hate_speech_percentage).trigger('input');
    
    getHost().then(host => {
        console.log(host);
        $("#disableDomain").prop("checked", msg.disabledDomains.indexOf(host) > -1);
    });
 });