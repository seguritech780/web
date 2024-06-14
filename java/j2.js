document.addEventListener('DOMContentLoaded', () => {
    const showFormButton = document.getElementById('showformem');
    const formContainer = document.getElementById('empleadoformcontenedor');
    const employeeForm = document.getElementById('formempleados');
    const employeeTableBody = document.getElementById('tablaempleado');
    const employeeCount = document.getElementById('contadorempleados');

    showFormButton.addEventListener('click', () => {
        formContainer.style.display = formContainer.style.display === 'none' ? 'block' : 'none';
    });

    employeeForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const employeeName = document.getElementById('name').value;
        addEmployee(employeeName);
        document.getElementById('name').value = '';
        formContainer.style.display = 'none';
    });

    const addEmployee = (name) => {
        const employeeList = getEmployeeList();
        employeeList.push(name);
        saveEmployeeList(employeeList);
        renderEmployeeTable(employeeList);
    };

    const renderEmployeeTable = (employeeList) => {
        employeeTableBody.innerHTML = '';
        employeeList.forEach((name, index) => {
            const row = document.createElement('tr');
            const nameCell = document.createElement('td');
            const actionCell = document.createElement('td');
            const deleteButton = document.createElement('button');

            nameCell.textContent = name;
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', () => {
                removeEmployee(index);
            });

            actionCell.appendChild(deleteButton);
            row.appendChild(nameCell);
            row.appendChild(actionCell);
            employeeTableBody.appendChild(row);
        });
        employeeCount.textContent = employeeList.length;
    };

    const removeEmployee = (index) => {
        const employeeList = getEmployeeList();
        employeeList.splice(index, 1);
        saveEmployeeList(employeeList);
        renderEmployeeTable(employeeList);
    };

    const getEmployeeList = () => {
        return JSON.parse(localStorage.getItem('employeeList')) || [];
    };

    const saveEmployeeList = (employeeList) => {
        localStorage.setItem('employeeList', JSON.stringify(employeeList));
    };

    // Initial render
    renderEmployeeTable(getEmployeeList());
});
