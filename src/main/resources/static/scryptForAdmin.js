$(document).ready(function () {

    const authUser = document.getElementById('auth-user');
    const authUserTable = document.getElementById('auth-user-table');

    let editModal = new bootstrap.Modal(document.getElementById('edit-modal'));
    const editId = document.getElementById('editId');
    const editName = document.getElementById('editName');
    const editLastName = document.getElementById('editLastName');
    const editAge = document.getElementById('editAge');
    const editEmail = document.getElementById('editEmail');
    let editPassword = document.getElementById('editPassword');
    const editRole = document.getElementById('editRole');

    let deleteModal = new bootstrap.Modal(document.getElementById('delete-modal'));
    const deleteId = document.getElementById('deleteFormId');
    const deleteName = document.getElementById('deleteFormName');
    const deleteLastName = document.getElementById('deleteFormLastName');
    const deleteAge = document.getElementById('deleteFormAge');
    const deleteEmail = document.getElementById('deleteFormEmail');
    const deleteRole = document.getElementById('deleteFormRole');

    const createName = document.getElementById('createName');
    const createLastName = document.getElementById('createLastName');
    const createAge = document.getElementById('createAge');
    const createEmail = document.getElementById('createEmail');
    const createPassword = document.getElementById('createPassword');

    let responseRoleData;
    const formSelectEdit = document.getElementById("editRole")

    $.ajax({
        url: "http://localhost:8080/api/roles", success: function (result) {
            responseRoleData = result;
            formSelectEdit.innerHTML = '';
            for (let i = 0; i < responseRoleData.length; i++) {
                formSelectEdit.append(new Option(responseRoleData[i].name, responseRoleData[i].id));
            }
        }
    });

    let respRolesData = null;
    const formSelectCreate = document.getElementById("createRoles");

    $.ajax({
        url: "http://localhost:8080/api/roles", success: function (result) {
            respRolesData = result;
            formSelectCreate.innerHTML = '';
            for (let i = 0; i < respRolesData.length; i++) {
                formSelectCreate.append(new Option(respRolesData[i].name, respRolesData[i].id));
            }
        }
    });


    $(document).on("click", ".edit-btn", function () {
        const id = $(this).data("id")
        openEditModal(id);
    });


    $(document).on("click", "#edit-submit", function () {
        const id = $(this).data("id")
        editUser(id);
    });


    $(document).on("click", ".delete-btn", function () {
        const id = $(this).data("id")
        openDeleteModal(id);
    });


    $(document).on("click", "#delete-submit", function () {
        const id = $(this).data("id")
        deleteUser(id);
    });

    $(document).on("click", "#create-user", function () {
        createUser();
    });

    fetch('http://localhost:8080/api/users')
        .then(response => response.json())
        .then(users => {
            displayUsers(users);
        })
        .catch(error => console.error(error));

    fetch('http://localhost:8080/api/authenticated')

        .then(response => response.json())
        .then(user => {
            displayUser(user);
        })
        .catch(error => console.error(error));


    function displayUsers(users) {
        const usersListBody = document.querySelector(".table-body")
        usersListBody.innerHTML = "";
        for (let i = 0; i < users.length; i++) {
            const userEl = document.createElement("tr");
            const editBtn = document.createElement("td");
            const deleteBtn = document.createElement("td");

            userEl.innerHTML = `
                    <td><p>${users[i].id}</p></td>
                    <td><p>${users[i].name}</p></td>
                    <td><p>${users[i].lastName}</p></td>
                    <td><p>${users[i].age}</p></td>
                    <td><p>${users[i].email}</p></td>
                    <td><p>${users[i].roles.map(role => role.name.replaceAll('ROLE_', '')).join(', ')}</p></td>`;
            editBtn.innerHTML = `<button data-id="${users[i].id}" type="button" class="btn btn-primary edit-btn" >Edit</button>`;
            deleteBtn.innerHTML = `<button data-id="${users[i].id}" type="button" class="btn btn-danger delete-btn">Delete</button>`;

            userEl.append(editBtn);
            userEl.append(deleteBtn);
            usersListBody.appendChild(userEl);
        }
    }

    function displayUser(user) {
        authUser.textContent = user.email + ' with roles ' + user.roles.map(role => role.name.replaceAll('ROLE_', '')).join(', ');

        authUserTable.innerHTML = '';
        const user_ = document.createElement('tr');
        user_.innerHTML = `
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td>${user.email}</td>
               <td>${user.roles.map(role => role.name.replaceAll('ROLE_', '')).join(', ')}</td>`;
        authUserTable.appendChild(user_);
    }

    function openEditModal(id) {
        // Найти пользователя по id
        fetch(`http://localhost:8080/api/users/${id}`)
            .then(response => response.json())
            .then(async user => {
                // Заполнить поля модального окна данными пользователя
                editId.value = user.id;
                editName.value = user.name;
                editLastName.value = user.lastName;
                editAge.value = user.age;
                editEmail.value = user.email;
                editPassword = user.password;
                editRole.innerHTML = '';
                for (let i = 0; i < responseRoleData.length; i++) {
                    let bool = false;
                    user.roles.map(role => {
                        if (role.name === responseRoleData[i].name) bool = true
                    });
                    formSelectEdit.append(new Option(responseRoleData[i].name, responseRoleData[i].id, false, bool));

                }
                editModal.show();
                $("#edit-submit").data("id", editId.value);
            })
            .catch(error => console.error(error));
    }

    function editUser(id) {
        const name = editName.value;
        const lastName = editLastName.value;
        const age = editAge.value;
        const email = editEmail.value;
        const password = editPassword;
        let roles = [];
        for (let i = 0; i < formSelectEdit.length; i++) {
            if (formSelectEdit[i].selected) {
                let role = {id: 0, name: ""}
                role.id = i + 1;
                role.name = formSelectEdit[i].name;
                roles.push(role);
            }
        }
        fetch(`http://localhost:8080/api/users/edit/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({name, lastName, age, password, email, roles})
        })
            .then(response => response.json())
            .then(updatedUser => {
                fetch('http://localhost:8080/api/users')
                    .then(response => response.json())
                    .then(users => {
                        displayUsers(users);
                        editModal.hide();
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.log(error));
    }

    function openDeleteModal(id) {
        // Найти пользователя по id
        fetch(`http://localhost:8080/api/users/${id}`)
            .then(response => response.json())
            .then(user => {
                deleteId.value = user.id;
                deleteName.value = user.name;
                deleteLastName.value = user.lastName;
                deleteAge.value = user.age;
                deleteEmail.value = user.email;
                deleteRole.innerHTML = '';
                for (let i = 0; i < responseRoleData.length; i++) {
                    let bool = false;
                    user.roles.map(role => {
                        if (role.name === responseRoleData[i].name) bool = true
                    });
                    deleteRole.append(new Option(responseRoleData[i].name, responseRoleData[i].id, false, bool));
                }
                deleteModal.show();
                $("#delete-submit").data("id", id);
            })
            .catch(error => console.error(error));
    }

    function deleteUser(id) {
        fetch(`http://localhost:8080/api/users/delete/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                fetch('http://localhost:8080/api/users')
                    .then(response => response.json())
                    .then(users => {
                        displayUsers(users);
                        deleteModal.hide();
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.log(error));
    }

    function createUser() {
        const name = createName.value;
        const lastName = createLastName.value;
        const age = createAge.value;
        const email = createEmail.value;
        const password = createPassword.value;
        let roles = [];
        for (let i = 0; i < formSelectCreate.length; i++) {
            if (formSelectCreate[i].selected) {
                let role = {id: 0, name: ""}
                role.id = i + 1;
                role.name = respRolesData[i].name;
                roles.push(role);
            }
        }
        fetch('http://localhost:8080/api/users/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, lastName, age, email, password, roles})
        })
            .then(response => response.json())
            .then(user => {
                createName.value = '';
                createLastName.value = '';
                createAge.value = '';
                createEmail.value = '';
                createPassword.value = '';
                formSelectCreate.value = '';
                fetch('http://localhost:8080/api/users')
                    .then(response => response.json())
                    .then(users => {
                        displayUsers(users);
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.log(error));
    }
})