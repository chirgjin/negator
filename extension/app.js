    
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

let _password;

$("#unlock_negator").click(function (e) {
    const msg = $("#unlock_msg")
    if(!_password) {
        return msg.html("Wait 2-3 seconds before retrying")
    }

    const password = $("#negator_password").val()

    if(md5(password) == _password) {
        $("#password-overlay").remove()
    }
    else {
        msg.html("Incorrect password")
    }
})

let pwState = 0

$("#change_password").on("submit", function (e) {
    e.preventDefault()

    let rand = pwState = Math.random()

    const pw = $("#new_pass").val()

    port.postMessage({
        type : "set",
        key : "password_hash",
        value : md5(pw)
    })

    const btn = $(this).find(".btn").html(pw == '' ? "Password Removed" : "Password Changed")
    $("#new_pass").val('')

    setTimeout(() => {
        if(pwState == rand) {
            btn.html("Change Password")
        }
    }, 2500)
})

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

    _password = msg.password_hash || md5('')

    if(!_password) {

    }
 });