import { getUserData, deleteUser, activateUser, deactivateUser, editUser, addUser } from './modules/user.js'
import { collectFormData } from './modules/form.js'
import showWarning from './modules/warning.js'

$(document).ready(function () {

  // Save user id 
  const tmpData = {
    id: null,
    action: null
  }

  // Activate all ckeckboxes
  $('#all-items').click(function () {
    if ($(this).is(':checked')) {
      $('.check-box').prop('checked', true);
      return;
    } 

    $('.check-box').prop('checked', false);
  });

  $('.check-box').click(function () {
    let allSelected = true;

    $('.check-box').each(function() {
      if (!$(this).is(':checked')) {
        allSelected = false;
      } 
    });

    if (allSelected) {
      $('#all-items').prop('checked', true);
      return;
    }

    $('#all-items').prop('checked', false);
  });

  // Deleting one user with confirmation
  $('#deleteUserConfirmationModal').one('show.bs.modal', function (event) {
    const modalConfirmation = $(this);
    const userId = $(event.relatedTarget).data('userid');
    const userData = getUserData(userId);

    modalConfirmation.find('.modal-body').text(`Do you really want to delete ${userData['firstname']} ${userData['lastname']}?`);

    modalConfirmation.find('#confirm').click(() => {

      $.ajax({
        url: 'server.php',
        type: 'POST',
        data: { usersId: [userId], action: 'delete' },
        success: () => deleteUser(userId)
      })

    })
  })

  // Ajax submitting form
  $('.multiple-user-form').submit(function (event) {
    event.preventDefault();

    const action = $(this).find('.form-user-action').val();

    const checkboxes = [];
    $('input:checkbox:checked').each(function () {
      checkboxes.push($(this).data('userid'));
    });

    // Checking for empty checkboxes
    if (checkboxes.length <= 0) {
      showWarningu('No users selected');
      return;
    }
    // Checking for selected action
    if (!action) {
      showWarning('Please select action');
      return;
    }

    $.ajax({
      url: 'server.php',
      type: 'POST',
      data: { usersId: checkboxes, action: action },
      success: () => {
        $('input:checkbox').prop('checked', false);
        switch (action) {
          case 'delete':
            checkboxes.forEach(id => deleteUser(id));
            break;
          case 'activate':
            checkboxes.forEach(id => activateUser(id));
            break;
          case 'deactivate':
            checkboxes.forEach(id => deactivateUser(id));
            break;
          default: return;
        }
      }
    })
  })

  // Add and edite user form
  $('#user-form-modal').on('show.bs.modal', function (event) {
    tmpData.id = $(event.relatedTarget).data('userid');
    tmpData.action = $(event.relatedTarget).data('type');

    const modal = $(this);
    const form = modal.find('form');
    const data = getUserData(tmpData.id);
    const switchStatus = $(this).find('.switch');
    
    // Cleaning form
    modal.find('.error-place').html('');
    modal.find('form')[0].reset();

    switch (tmpData.action) {
      case 'edit':
        modal.find('#UserModalLabel').text('Edit user');
        modal.find('#first-name').val(data['firstname']);
        modal.find('#last-name').val(data['lastname']);

        if (data['status']) {
          switchStatus.prop('checked', true);
        }
        else switchStatus.prop('checked', false);

        if (data['role']) {
          modal.find('#role option[value="1"]').prop('selected', true);
        }

        break;
      case 'add':
        modal.find('#UserModalLabel').text('Add user');
        break;
      default: return;
    }

    // Getting data from form after submiting
    modal.find('#save-btn').click(function (e) {
      
      e.stopImmediatePropagation();

      // Collecting data from form
      const data = collectFormData(form);
      const status = form.find('.switch').is(':checked') ? 1 : 0;

      $.ajax({
        url: 'server.php',
        type: 'POST',
        data: { 
          id: tmpData.id,
          firstName: data['firstName'],
          lastName: data['lastName'],
          status: status,
          role: data['role'],
          action: tmpData.action
        },
        cache: false,
        success: (data) => {
          const response = JSON.parse(data);

          if (!response['status']) {
            modal.find('.error-place').html(`<div class="error">${response['error']['message']}</div>`);
            return;
          }

          $("#user-form-modal [data-dismiss=modal]").trigger({ type: "click" });

          switch (tmpData.action) {
            case 'edit':
              editUser(response['user']['id'], response['user']);
              break;
            case 'add':
              addUser(response['user']);
              break;
            default: return;
          }
        }
      })

    });
  })

})
