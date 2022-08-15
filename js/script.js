import { getUserData, deleteUser, activateUser, deactivateUser, editUser, addUser } from './modules/user.js'
import { collectFormData } from './modules/form.js'
import showWarning from './modules/warning.js'

$(document).ready(function() {
    
    // Activate all ckeckboxes
    $('#all-items').click(function() {
        if ($(this).is(':checked')) {
          $('.check-box').prop('checked', true);
          return;
        }
        
        $('.check-box').prop('checked', false);
    });
  
    $('.check-box').click(function() {
        if ($(this).is(':checked')) return;
        
        $('#all-items').prop('checked', false);
    });
  
    // Deleting one user with confirmation
    $('#deleteUserConfirmationModal').on('show.bs.modal', function (event) {
      const modalConfirmation = $(this);
      const userId = $(event.relatedTarget).data('userid');
      const userData = getUserData(userId);
      
      modalConfirmation.find('.modal-body').text(`Do you really want to delete ${userData['firstname']} ${userData['lastname']}?`);

      modalConfirmation.find('#confirm').click( () => {

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
        $('input:checkbox:checked').each(function(){
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
        const modal = $(this);
        const userId = $(event.relatedTarget).data('userid');
        const dataType = $(event.relatedTarget).data('type');
        const data = getUserData(userId);
        const switchStatus = $(this).find('.switch');
        $(this).find('.error-place').html('');
  
        switch (dataType) {
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
            modal.find('#user-form')[0].reset();
            break;
          default: return;
        }

        // Getting data from form after submiting
        $(this).find('form').submit(function (event) {
          event.preventDefault();

          // Collecting data from form
          const data = collectFormData($(this));
          const status = $(this).find('.switch').is(':checked') ? 1 : 0;
        
          $.ajax({
            url: 'server.php',
            type: 'POST',
            data: {
              id: userId,
              firstName: data['firstName'],
              lastName: data['lastName'],
              status: status,
              role: data['role'],
              action: dataType
            },
            success: (data) => {
              const response = JSON.parse(data);
              console.log(response)
              if (!response['status']) {
                $(this).find('.error-place').html(`<div class="error">${response['error']['message']}</div>`);
                return;
              }

              $("#user-form-modal [data-dismiss=modal]").trigger({ type: "click" });
              switch (dataType) {
                case 'edit': 
                  editUser(userId, response['user']);
                  break;
                case 'add': 
                  addUser(response['user']);
                  break;
              }
            }
          })

        });
    })
});