class Empleado {
    constructor(name, horastrabajadas, pagoporhora) {
        this.name = name;
        this.horastrabajadas = horastrabajadas;
        this.pagoporhora = pagoporhora;
    }

    getSalary() {
        return this.horastrabajadas * this.pagoporhora;
    }
}

let totalSalary = 0;

document.addEventListener('DOMContentLoaded', function () {
    const empleados = JSON.parse(localStorage.getItem('empleados')) || [];
    empleados.forEach((empleadoData, index) => {
        const empleado = new Empleado(empleadoData.name, empleadoData.horastrabajadas, empleadoData.pagoporhora);
        addEmpleadoToTable(empleado, index);
        totalSalary += empleado.getSalary();
    });
    document.getElementById('totalSalary').textContent = totalSalary.toFixed(2);
    document.getElementById('contadorempleados').textContent = empleados.length;

    document.getElementById('addHoraBtn').addEventListener('click', function () {
        const horasInput = document.getElementById('horas');
        const horas = parseInt(horasInput.value.trim());

        if (!isNaN(horas) && horas > 0) {
            document.getElementById('horastrabajadas').value = horas; // Establecer horas trabajadas para el empleado actual
            horasInput.value = '';
        } else {
            alert('Ingrese una cantidad de horas válida.');
        }
    });
});

document.getElementById('showformem').addEventListener('click', function () {
    const formContenedor = document.getElementById('empleadoformcontenedor');
    formContenedor.style.display = 'block';
});

document.getElementById('formempleados').addEventListener('submit', addEmpleadoEvent);

function addEmpleadoEvent(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const horasTrabajadas = parseInt(document.getElementById('horastrabajadas').value);
    const pagoPorHora = parseFloat(document.getElementById('pagoporhora').value);

    if (!name || horasTrabajadas <= 0 || pagoPorHora <= 0) {
        alert('Por favor, complete todos los campos con valores válidos para poder continuar.');
        return;
    }

    const empleado = new Empleado(name, horasTrabajadas, pagoPorHora);
    const salary = empleado.getSalary();

    let empleados = JSON.parse(localStorage.getItem('empleados')) || [];
    empleados.push(empleado);
    localStorage.setItem('empleados', JSON.stringify(empleados));

    addEmpleadoToTable(empleado, empleados.length - 1);

    totalSalary += salary;
    document.getElementById('totalSalary').textContent = totalSalary.toFixed(2);

    const contadorEmpleados = document.getElementById('contadorempleados');
    contadorEmpleados.textContent = parseInt(contadorEmpleados.textContent) + 1;

    document.getElementById('formempleados').reset();
    document.getElementById('empleadoformcontenedor').style.display = 'none';
}

function addEmpleadoToTable(empleado, index) {
    const empleadosTabla = document.getElementById('tablaempleado');

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${empleado.name}</td>
        <td>${empleado.horastrabajadas}</td>
        <td>${empleado.getSalary().toFixed(2)}</td>
        <td>
            <button onclick="editEmpleado(${index})">Editar</button>
            <button onclick="deleteEmpleado(${index})">Eliminar</button>
        </td>
    `;

    empleadosTabla.appendChild(row);
}

function editEmpleado(index) {
    const empleados = JSON.parse(localStorage.getItem('empleados')) || [];
    const empleado = empleados[index];

    document.getElementById('name').value = empleado.name;
    document.getElementById('horastrabajadas').value = empleado.horastrabajadas;
    document.getElementById('pagoporhora').value = empleado.pagoporhora;

    const formContenedor = document.getElementById('empleadoformcontenedor');
    formContenedor.style.display = 'block';

    document.getElementById('formempleados').onsubmit = function (event) {
        event.preventDefault();

        empleado.name = document.getElementById('name').value;
        empleado.horastrabajadas = parseInt(document.getElementById('horastrabajadas').value);
        empleado.pagoporhora = parseFloat(document.getElementById('pagoporhora').value);

        empleados[index] = empleado;
        localStorage.setItem('empleados', JSON.stringify(empleados));

        refreshTable();
        totalSalary = empleados.reduce((acc, emp) => acc + emp.horastrabajadas * emp.pagoporhora, 0);
        document.getElementById('totalSalary').textContent = totalSalary.toFixed(2);

        document.getElementById('formempleados').reset();
        formContenedor.style.display = 'none';
        document.getElementById('formempleados').onsubmit = addEmpleadoEvent;
    };
}

function deleteEmpleado(index) {
    let empleados = JSON.parse(localStorage.getItem('empleados')) || [];
    const salary = new Empleado(
        empleados[index].name,
        empleados[index].horastrabajadas,
        empleados[index].pagoporhora
    ).getSalary();

    empleados.splice(index, 1);
    localStorage.setItem('empleados', JSON.stringify(empleados));

    totalSalary -= salary;
    document.getElementById('totalSalary').textContent = totalSalary.toFixed(2);

    refreshTable();
    document.getElementById('contadorempleados').textContent = empleados.length;
}

function refreshTable() {
    const empleadosTabla = document.getElementById('tablaempleado');
    empleadosTabla.innerHTML = '';

    const empleados = JSON.parse(localStorage.getItem('empleados')) || [];
    empleados.forEach((empleadoData, index) => {
        const empleado = new Empleado(empleadoData.name, empleadoData.horastrabajadas, empleadoData.pagoporhora);
        addEmpleadoToTable(empleado, index);
    });
}
