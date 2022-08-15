// Function for manipulate with user table

// Getting user data by (user) id
const getUserData = (userId) => {
    return $(`#row-user-${userId}`).data();
}

const deleteUser = (id) => {
    $(`#row-user-${id}`).remove();
}

const activateUser = (id) => {
    const userRow = $(`#row-user-${id}`);
    const status = userRow.find('.fa-circle');
    status.removeClass('not-active-circle');
    status.addClass('active-circle');
    userRow.attr('data-status', 1);
}

const deactivateUser = (id) => {
    const userRow = $(`#row-user-${id}`);
    const status = userRow.find('.fa-circle');
    status.removeClass('active-circle');
    status.addClass('not-active-circle');
    userRow.attr('data-status', 0);
}

const editUser = (id, user) => {
    const role = +user['role'] ? 'Admin' : 'User';
    const status = +user['status'] ? 'active-circle' : 'not-active-circle';

    $('#row-user-' + id).replaceWith(`
        <tr id="row-user-${id}" data-id="${id}" data-firstname="${user['firstName']}" data-lastname="${user['lastName']}" data-role="${user['role']}" data-status="${user['status']}">
        <td class="align-middle">
        <div
            class="custom-control custom-control-inline custom-checkbox custom-control-nameless m-0 align-top">
            <input type="checkbox" class="custom-control-input check-box" data-userid="${id}" id="item-${id}">
            <label class="custom-control-label" for="item-${id}"></label>
        </div>
        </td>
        <td class="text-nowrap align-middle">${user['firstName']} ${user['lastName']}</td>
        <td class="text-nowrap align-middle"><span>${role}</span></td>
        <td class="text-center align-middle"><i class="fa fa-circle ${status}"></i></td>
        <td class="text-center align-middle">
        <div class="btn-group align-top">
            <button class="btn btn-sm btn-outline-secondary badge" type="button" data-toggle="modal" data-type="edit"
            data-target="#user-form-modal" data-userid="${id}">
            Edit
            </button>
            <button class="btn btn-sm btn-outline-secondary badge" type="button" data-toggle="modal" data-target="#deleteUserConfirmationModal" 
            data-userid="${id}">
            <i class="fa fa-trash"></i>
            </button>
        </div>
        </td>
    </tr>
  `);
}

const addUser = (user) => {
    const role = +user['role'] ? 'Admin' : 'User';
    const status = +user['status'] ? 'active-circle' : 'not-active-circle';

    $('#user-table-body').append(`
        <tr id="row-user-${user['id']}" data-id="${user['id']}" data-firstname="${user['firstName']}" data-lastname="${user['lastName']}" data-role="${user['role']}" data-status="${user['status']}">
        <td class="align-middle">
        <div
            class="custom-control custom-control-inline custom-checkbox custom-control-nameless m-0 align-top">
            <input type="checkbox" class="custom-control-input check-box" data-userid="${user['id']}" id="item-${user['id']}">
            <label class="custom-control-label" for="item-${user['id']}"></label>
        </div>
        </td>
        <td class="text-nowrap align-middle">${user['firstName']} ${user['lastName']}</td>
        <td class="text-nowrap align-middle"><span>${role}</span></td>
        <td class="text-center align-middle"><i class="fa fa-circle ${status}"></i></td>
        <td class="text-center align-middle">
        <div class="btn-group align-top">
            <button class="btn btn-sm btn-outline-secondary badge" type="button" data-toggle="modal" data-type="edit"
            data-target="#user-form-modal" data-userid="${user['id']}">
            Edit
            </button>
            <button class="btn btn-sm btn-outline-secondary badge" type="button" data-toggle="modal" data-target="#deleteUserConfirmationModal" 
            data-userid="${user['id']}">
            <i class="fa fa-trash"></i>
            </button>
        </div>
        </td>
    </tr>
  `);
}

export {
    getUserData,
    deleteUser,
    activateUser,
    deactivateUser,
    editUser,
    addUser
}