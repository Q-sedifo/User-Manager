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

  // Deleting user with confirmation
  const deleteUserConfirmation = $('#deleteUserConfirmationModal');

  deleteUserConfirmation.on('show.bs.modal', function(event) {
    const userId = $(event.relatedTarget).data('userid');
    const userData = getUserData(userId);

    tmpData.id = userId;

    $(this).find('.modal-body').text(`
      Do you really want to delete ${userData['firstname']} ${userData['lastname']}?
    `);
  })

  deleteUserConfirmation.find('button.confirm').on('click', function(event) {
    const userId = tmpData.id;
    
    $.ajax({
      url: 'server.php',
      type: 'POST',
      data: { usersId: [userId], action: 'delete' }
    })
    .done(() => {
      deleteUser(userId)
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
      showWarning('No users selected');
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
      data: { usersId: checkboxes, action: action }
    })
    .done(() => {
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
    })
  })

  // Add and edite user form
  $('#user-form-modal').on('show.bs.modal', function (event) {
    const modal = $('#user-form-modal');
    const target = $(event.relatedTarget);
    const userId = target.data('userid')
    const action = target.data('type');

    tmpData.action = action;

    // Cleaning form
    modal.find('.error-place').html('');
    modal.find('form')[0].reset();
    
    
    switch (action) {
      case 'add':
        modal.find('#UserModalLabel').text('Add user');
        break;
      case 'edit':
        const userData = getUserData(userId);

        tmpData.id = userId;
        
        modal.find('#UserModalLabel').text('Edit user');
        modal.find('#first-name').val(userData['firstname']);
        modal.find('#last-name').val(userData['lastname']);

        if (+userData['status']) modal.find('input#switch').prop('checked', true);
        if (+userData['role']) modal.find('#role option[value="1"]').prop('selected', true);
        
        break; 
    }
    
  })

  $('#save-btn').on('click', function(event) {
    const form = $('#user-form-modal').find('form');
    const userData = collectFormData(form);

    userData['id'] = tmpData.id;
    userData['action'] = tmpData.action;

    $.ajax({
      url: 'server.php',
      type: 'POST',
      data: userData
    })
    .done((data) => {
      const response = JSON.parse(data);
      
      if (response['status']) {
        switch (tmpData.action) {
          case 'add':
            addUser(response['user']);
            break;
          case'edit':
            editUser(response['user']['id'], response['user']);
            break;
        }
        // Close modal window if success
        $("#user-form-modal [data-dismiss=modal]").trigger({ type: "click" });
        return
      } 

      $('#user-form-modal').find('.error-place').html(`<div class="error">${response['error']['message']}</div>`);
    })
  })

})
