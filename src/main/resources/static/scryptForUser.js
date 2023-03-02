$(document).ready(function () {
    const authUserBody = document.getElementById("auth-user-table");
    const authUserHeader = document.getElementById("auth-user");

    fetch('http://localhost:8080/api/authenticated')
        .then(response => response.json())
        .then(user => {
            console.log(user)
            displayUser(user);
        }).catch(error => console.error(error));


    function displayUser(person) {
        console.log(person)
        authUserHeader.textContent = person.email + ' with roles ' + person.roles.map(role => role.name.replaceAll('ROLE_', '')).join(', ');

        authUserBody.innerHTML = '';
        const user = document.createElement('tr');
        user.innerHTML = `
                <td>${person.id}</td>
                <td>${person.name}</td>
                <td>${person.lastName}</td>
                <td>${person.age}</td>
                <td>${person.email}</td>
               <td>${person.roles.map(role => role.name.replaceAll('ROLE_', '')).join(', ')}</td>`;
        authUserBody.appendChild(user);
    }
});