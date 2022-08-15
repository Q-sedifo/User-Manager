// Showing warning modal window
const showWarning = (text) => {
    const modal = $('#warningModal');
    modal.modal('show');
    modal.find('.modal-body').text(text);
}

export default showWarning