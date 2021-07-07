autosize(document.querySelectorAll('#textboxPost'));


function popupResult(result) {
    var html;
    if (result.html) {
        html = result.html;
    }
    if (result.src) {
        html = '<img src="' + result.src + '" />';
    }
    swal({
        title: '',
        html: true,
        text: html,
        allowOutsideClick: true
    });
    setTimeout(function() {
        $('.sweet-alert').css('margin', function() {
            var top = -1 * ($(this).height() / 2),
                left = -1 * ($(this).width() / 2);

            return top + 'px 0 0 ' + left + 'px';
        });
    }, 1);
}

var basic = $('#demo-basic').croppie({
    viewport: {
        width: 150,
        height: 200
    }
});