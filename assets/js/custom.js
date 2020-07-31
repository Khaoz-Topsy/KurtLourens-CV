$(function () {
    function formError(data) {
        $('#success_message').hide();
        $('#error_message').show();

        //reverse the response on the button
        $form.find('input#submit').each(function () {
            $btn = $(this);
            label = $btn.prop('orig_label');
            if (label) {
                $btn.prop('disabled', false);
                $btn.val(label);
                $btn.prop('orig_label', '');
            }
        });
    }

    function formSuccess(data) {
        if (data.result == 'success') {
            $('form#contact-form').hide();
            $('#success_message').show();
            $('#error_message').hide();
        }
        else {
            formError(data);
        }
    }

    $('#success_message').hide();
    $('#error_message').hide();
    $('#contact_form').submit(function (e) {
        e.preventDefault();

        $form = $(this);
        $form.find('input#submit').each(function () {
            $btn = $(this);
            $btn.prop('orig_label', $btn.val());
            $btn.prop('disabled', true);
            $btn.val('Sending ...');
        });

        var formObj = {
            name: $form[0][0]?.value || '',
            email: $form[0][1]?.value || '',
            message: $form[0][2]?.value || ''
        };

        $.ajax({
            type: "POST",
            url: 'https://api.assistantapps.com/contact',
            // url: 'http://localhost:55555/contact',
            data: JSON.stringify(formObj),
            success: formSuccess,
            error: formError,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
        });
    });
});