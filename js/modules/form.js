// Form functions
const collectFormData = (form) => {
    const data = {};
    form.find('input, select').each(function() {
        if ($(this).attr('type') == 'checkbox') {
            data[$(this).attr('name')] = $(this).is(':checked') ? 1 : 0;
            return;
        }
        data[$(this).attr('name')] = $(this).val().trim();
    });

    return data;
}

export {
    collectFormData
}