// Form functions
const collectFormData = (form) => {
    const data = {};
    form.find('input, select').each(function() {
        data[$(this).attr('name')] = $(this).val();
    });

    return data;
}

export {
    collectFormData
}