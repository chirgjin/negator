    
$(".slider").on('input', function () {
    $('.percentage').html(this.value+'%')
});

$(".search").change(function () {
    // chrome.storage.local.set( {this.value}, function () {});
})

$('.search').keypress(function(e) {
    if (e.which == '13') {
       e.preventDefault();
       console.log(this.value)
     }

});


