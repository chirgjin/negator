    
$(".slider").on('input', function () {
    $('.percentage').html(this.value+'%');
    port.postMessage({
    	type : "set",
    	hate_speech_percentage : this.value
    })
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
 port.postMessage({ type : "get" });
 port.onMessage.addListener(function(msg) {
     console.log(msg);
     $(".slider").val(msg).trigger('input');
 });
