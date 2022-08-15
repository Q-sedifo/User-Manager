 <!-- form fiels -->
 <form class="form-inline multiple-user-form" action="" method="POST">
    <button type="button" class="btn btn-primary mr-3" data-toggle="modal" data-target="#user-form-modal" data-type="add">Add</button>
    <select class="form-control form-user-action" name="action">
        <option disabled selected>Please select</option>
        <option value="activate">Set active</option>
        <option value="deactivate">Set not active</option>
        <option value="delete">Delete</option>
    </select>
    <button type="submit" class="btn btn-primary">OK</button>
</form>