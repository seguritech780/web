// Clase Empleado
class Empleado {
    constructor(name, horastrabajadas, pagoporhora, pagoempresa) {
        this.name = name;
        this.horastrabajadas = horastrabajadas;
        this.pagoporhora = pagoporhora;
        this.pagoempresa = pagoempresa;
    }

    // Método para calcular el salario del empleado
    getSalary() {
        return this.horastrabajadas * this.pagoporhora;
    }

    // Método para calcular los ingresos totales para el empleador
    getTotalIngresos() {
        return this.horastrabajadas * this.pagoempresa;
    }

    // Método para calcular las ganancias totales para el empleador
    getTotalGanancias() {
        return this.getTotalIngresos() - this.getSalary();
    }
}

// Variables para almacenar totales
let totalSalary = 0;
let totalIngresos = 0;
let totalGanancias = 0;
let totalHoras = 0; // Variable para acumular las horas trabajadas

// Evento al cargar el DOM
document.addEventListener('DOMContentLoaded', function () {
    // Obtener empleados desde localStorage o inicializar un array vacío
    const empleados = JSON.parse(localStorage.getItem('empleados')) || [];

    // Recorrer empleados y calcular totales al cargar la página
    empleados.forEach((empleadoData, index) => {
        const empleado = new Empleado(empleadoData.name, empleadoData.horastrabajadas, empleadoData.pagoporhora, empleadoData.pagoempresa);
        totalSalary += empleado.getSalary();
        totalIngresos += empleado.getTotalIngresos();
        totalGanancias += empleado.getTotalGanancias();
        addEmpleadoToTable(empleado, index);
    });

    // Mostrar totales en el tfoot de la tabla al cargar la página
    mostrarTotales();
    actualizarContadorEmpleados(empleados.length);

    // Evento para agregar horas al total trabajado
    document.getElementById('addHoraBtn').addEventListener('click', function () {
        const horasInput = document.getElementById('horas');
        const horas = parseInt(horasInput.value.trim());

        if (!isNaN(horas) && horas > 0) {
            totalHoras += horas; // Sumar horas al total acumulado
            document.getElementById('horastrabajadas').value = totalHoras;
            horasInput.value = '';
        } else {
            alert('Ingrese una cantidad de horas válida.');
        }
    });

    // Evento para mostrar formulario de agregar empleado
    document.getElementById('showformem').addEventListener('click', function () {
        document.getElementById('empleadoformcontenedor').style.display = 'block';
    });

    // Evento para agregar empleado desde el formulario
    document.getElementById('formempleados').addEventListener('submit', function (event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const totalHoras = parseInt(document.getElementById('horastrabajadas').value);
        const pagoporhora = parseFloat(document.getElementById('pagoporhora').value);
        const pagoempresa = parseFloat(document.getElementById('pagoempresa').value);

        if (!name || totalHoras <= 0 || pagoporhora <= 0 || pagoempresa <= 0) {
            alert('Por favor, complete todos los campos con valores válidos para poder continuar.');
            return;
        }

        const empleado = new Empleado(name, totalHoras, pagoporhora, pagoempresa);
        const salary = empleado.getSalary();
        const ingresos = empleado.getTotalIngresos(); // Total de ingresos para el empleador
        const ganancias = empleado.getTotalGanancias(); // Total de ganancias para el empleador

        // Guardar empleado en localStorage
        empleados.push({
            name: name,
            horastrabajadas: totalHoras,
            pagoporhora: pagoporhora,
            pagoempresa: pagoempresa
        });
        localStorage.setItem('empleados', JSON.stringify(empleados));

        // Actualizar totales
        totalSalary += salary;
        totalIngresos += ingresos;
        totalGanancias += ganancias;
        mostrarTotales();

        // Agregar empleado a la tabla
        addEmpleadoToTable(empleado, empleados.length - 1);

        // Actualizar contador de empleados
        actualizarContadorEmpleados(empleados.length);

        // Resetear totalHoras para el próximo empleado
        totalHoras = 0;
        document.getElementById('horastrabajadas').value = totalHoras;

        // Resetear formulario y ocultar contenedor
        document.getElementById('formempleados').reset();
        document.getElementById('empleadoformcontenedor').style.display = 'none';
    });
});

// Función para mostrar los totales en el tfoot de la tabla
function mostrarTotales() {
    document.getElementById('totalSalary').textContent = totalSalary.toFixed(2);
    document.getElementById('totalIngresos').textContent = totalIngresos.toFixed(2);
    document.getElementById('totalGanancias').textContent = totalGanancias.toFixed(2);
}

// Función para actualizar el contador de empleados
function actualizarContadorEmpleados(cantidad) {
    document.getElementById('contadorempleados').textContent = cantidad;
}

// Función para editar empleado
function editEmpleado(index) {
    const empleados = JSON.parse(localStorage.getItem('empleados')) || [];
    const empleado = empleados[index];

    // Llenar formulario con datos del empleado seleccionado
    document.getElementById('name').value = empleado.name;
    document.getElementById('horastrabajadas').value = empleado.horastrabajadas;
    document.getElementById('pagoporhora').value = empleado.pagoporhora;
    document.getElementById('pagoempresa').value = empleado.pagoempresa;

    // Mostrar formulario de edición
    document.getElementById('empleadoformcontenedor').style.display = 'block';

    // Evento para actualizar empleado editado
    document.getElementById('formempleados').onsubmit = function (event) {
        event.preventDefault();

        empleado.name = document.getElementById('name').value;
        empleado.horastrabajadas = parseInt(document.getElementById('horastrabajadas').value);
        empleado.pagoporhora = parseFloat(document.getElementById('pagoporhora').value);
        empleado.pagoempresa = parseFloat(document.getElementById('pagoempresa').value);

        empleados[index] = empleado;
        localStorage.setItem('empleados', JSON.stringify(empleados));

        // Actualizar tabla y totales
        refreshTable();
        totalSalary = empleados.reduce((acc, emp) => acc + emp.horastrabajadas * emp.pagoporhora, 0);
        totalIngresos = empleados.reduce((acc, emp) => acc + emp.horastrabajadas * emp.pagoempresa, 0);
        totalGanancias = totalIngresos - totalSalary;
        mostrarTotales();

        // Resetear formulario y ocultar contenedor
        document.getElementById('formempleados').reset();
        document.getElementById('empleadoformcontenedor').style.display = 'none';

        // Restaurar evento original de submit
        document.getElementById('formempleados').onsubmit = function (event) {
            addEmpleadoEvent(event);
        };
    };
}

// Función para eliminar empleado
function deleteEmpleado(index) {
    let empleados = JSON.parse(localStorage.getItem('empleados')) || [];
    const empleado = empleados[index];
    const salary = new Empleado(empleado.name, empleado.horastrabajadas, empleado.pagoporhora, empleado.pagoempresa).getSalary();

    empleados.splice(index, 1);
    localStorage.setItem('empleados', JSON.stringify(empleados));

    // Actualizar totales y tabla
    totalSalary -= salary;
    totalIngresos = empleados.reduce((acc, emp) => acc + emp.horastrabajadas * emp.pagoempresa, 0);
    totalGanancias = totalIngresos - totalSalary;
    mostrarTotales();
    refreshTable();

    // Actualizar contador de empleados
    actualizarContadorEmpleados(empleados.length);
}

// Función para refrescar la tabla de empleados
function refreshTable() {
    const empleadosTabla = document.getElementById('tablaempleado');
    empleadosTabla.innerHTML = '';

    const empleados = JSON.parse(localStorage.getItem('empleados')) || [];
    empleados.forEach((empleadoData, index) => {
        const empleado = new Empleado(empleadoData.name, empleadoData.horastrabajadas, empleadoData.pagoporhora, empleadoData.pagoempresa);
        addEmpleadoToTable(empleado, index);
    });
}

// Función para agregar empleado a la tabla
function addEmpleadoToTable(empleado, index) {
    const empleadosTabla = document.getElementById('tablaempleado');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${empleado.name}</td>
        <td>${empleado.horastrabajadas}</td>
        <td>${empleado.getSalary().toFixed(2)}</td>
        <td>${empleado.getTotalIngresos().toFixed(2)}</td>
        <td>${empleado.getTotalGanancias().toFixed(2)}</td>
        <td>
            <button onclick="editEmpleado(${index})">Editar</button>
            <button onclick="deleteEmpleado(${index})">Eliminar</button>
        </td>
    `;
    empleadosTabla.appendChild(row);
}
