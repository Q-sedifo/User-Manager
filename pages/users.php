<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Users table</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.1/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.1.1/dist/js/bootstrap.bundle.min.js"></script>
  <script type="module" src="js/script.js"></script>
</head>
<body>
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" rel="stylesheet">
  <link href="styles.css" rel="stylesheet">
  <div class="container">
    <div class="row flex-lg-nowrap">
      <div class="col">
        <div class="row flex-lg-nowrap">
          <div class="col mb-3">
            <div class="e-panel card">
              <div class="card-body">
                <div class="card-title">
                  <h6 class="mr-2"><span>Users</span></h6>
                </div>
                <!-- form fiels -->
                <?php require 'components/multipleUserForm.php' ?>
                <div id="user-table" class="e-table">
                  <div class="table-responsive table-lg mt-3">
                    <table class="table table-bordered">
                      <thead>
                        <tr>
                          <th class="align-top">
                            <div
                              class="custom-control custom-control-inline custom-checkbox custom-control-nameless m-0">
                              <input type="checkbox" class="custom-control-input" id="all-items">
                              <label class="custom-control-label" for="all-items"></label>
                            </div>
                          </th>
                          <th class="max-width">Name</th>
                          <th class="sortable">Role</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody id="user-table-body">
                        <?php foreach ($users as $user): ?>
                          <tr id="row-user-<?= $user->id ?>" data-id="<?= $user->id ?>" data-firstname="<?= $user->firstName ?>" data-lastname="<?= $user->lastName ?>" data-role="<?= $user->role ?>" data-status="<?= $user->status ?>">
                            <td class="align-middle">
                              <div
                                class="custom-control custom-control-inline custom-checkbox custom-control-nameless m-0 align-top">
                                <input type="checkbox" class="custom-control-input check-box" data-userid="<?= $user->id ?>" id="item-<?= $user->id ?>">
                                <label class="custom-control-label" for="item-<?= $user->id ?>"></label>
                              </div>
                            </td>
                            <td class="text-nowrap align-middle"><?= $user->firstName; ?> <?= $user->lastName ?></td>
                            <td class="text-nowrap align-middle"><span><?php if ($user->role): ?> Admin <?php else: ?> User <?php endif ?></span></td>
                            <td class="text-center align-middle"><i class="fa fa-circle <?php if ($user->status): ?> active-circle <?php else: ?> not-active-circle <?php endif ?>"></i></td>
                            <td class="text-center align-middle">
                              <div class="btn-group align-top">
                                <button class="btn btn-sm btn-outline-secondary badge edit-user-btn" type="button" data-toggle="modal" data-type="edit"
                                  data-target="#user-form-modal" data-userid="<?= $user->id ?>">
                                  Edit
                                </button>
                                <button class="btn btn-sm btn-outline-secondary badge" type="button" data-toggle="modal" data-target="#deleteUserConfirmationModal" 
                                  data-userid="<?= $user->id; ?>">
                                  <i class="fa fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        <?php endforeach; ?>
                      </tbody>
                    </table>
                  </div>
                </div>
                <!-- form fiels -->
                <?php require 'components/multipleUserForm.php' ?>
              </div>
            </div>
          </div>
        </div>

        <!-- Delete user confirmation modal -->
        <div class="modal fade" id="deleteUserConfirmationModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="deleteUserConfirmationModalLabel">Delete confirmation</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <!--  -->
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button id="confirm" type="button" class="btn btn-primary" class="close" data-dismiss="modal" aria-label="Close">Confirm</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Warning modal -->
        <div class="modal fade" id="warningModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="warningModalLabel">Warning</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>

        <!-- User Form Modal -->
        <div class="modal fade" id="user-form-modal" tabindex="-1" aria-labelledby="user-form-modal" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="UserModalLabel">Add user</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <!-- ... -->
              <form id="user-form">
                <div class="form-group error-place"></div>
                <div class="form-group">
                  <label for="first-name" class="col-form-label">First Name:</label>
                  <input type="text" class="form-control" id="first-name" name="firstName">
                </div>
                <div class="form-group">
                  <label for="last-name" class="col-form-label">Last Name:</label>
                  <input type="text" class="form-control" id="last-name" name="lastName">
                </div>
                <div>
                  <label for="last-name" class="col-form-label">Status:</label>
                  <div><input type="checkbox" class="switch" value="1" name="status"></div>
                </div>
                <div class="form-group">
                  <label for="role" class="col-form-label">Role:</label>
                  <select id="role" class="form-control" name="role">
                    <option value="0" selected>User</option>
                    <option value="1">Admin</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button id="save-btn" type="button" class="btn btn-primary">Save</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</body>
</html>