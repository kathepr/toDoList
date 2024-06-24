// URL de la API donde se almacenan las tareas
const apiUrl = 'https://6674179975872d0e0a950e53.mockapi.io/todoList';

// Evento que se dispara cuando el documento HTML ha sido completamente cargado y analizado
document.addEventListener('DOMContentLoaded', () => {
    // Añade un evento de clic al botón de agregar tarea para que llame a la función addTask
    document.getElementById('addTaskButton').addEventListener('click', addTask);
    // Llama a la función para obtener las tareas existentes
    fetchTasks();
});

// Función para obtener las tareas de la API y mostrarlas en la página
async function fetchTasks() {
    const response = await fetch(apiUrl); // Realiza una solicitud GET a la API
    const tasks = await response.json(); // Convierte la respuesta a formato JSON
    renderTasks(tasks); // Llama a la función para mostrar las tareas en el DOM
}

// Función para mostrar las tareas en el DOM
function renderTasks(tasks) {
    const tasksContainer = document.getElementById('tasks'); // Contenedor donde se mostrarán las tareas
    tasksContainer.innerHTML = ''; // Limpia el contenedor

    tasks.forEach(task => { // Recorre cada tarea
        const taskElement = document.createElement('div'); // Crea un elemento div para cada tarea
        taskElement.className = `task ${task.status === 'ready' ? 'completed' : ''}`; // Añade clases CSS
        taskElement.innerHTML = `
            <span>${task.task}</span>
            <div>
                <button class="delete-btn">🗑</button>
                <button class="toggle-btn">✔️</button>
            </div>
        `;

        // Añade eventos de clic a los botones de eliminar y cambiar estado
        taskElement.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
        taskElement.querySelector('.toggle-btn').addEventListener('click', () => toggleStatus(task.id, task.status));

        tasksContainer.appendChild(taskElement); // Añade el elemento de tarea al contenedor
    });
}

// Función para agregar una nueva tarea
async function addTask() {
    const taskInput = document.getElementById('new-task'); // Obtiene el valor del input de la nueva tarea
    const newTask = {
        task: taskInput.value, // Toma el valor del input
        status: 'On hold' // Establece el estado inicial de la tarea
    };

    const response = await fetch(apiUrl, {
        method: 'POST', // Solicitud POST para agregar una nueva tarea
        headers: {
            'Content-Type': 'application/json' // Especifica el tipo de contenido como JSON
        },
        body: JSON.stringify(newTask) // Convierte la nueva tarea a JSON para enviarla
    });

    if (response.ok) {
        taskInput.value = ''; // Limpia el input
        const addedTask = await response.json(); // Convierte la respuesta a formato JSON
        renderNewTask(addedTask); // Llama a la función para mostrar la nueva tarea en el DOM
    }
}

// Función para mostrar una nueva tarea en el DOM
function renderNewTask(task) {
    const tasksContainer = document.getElementById('tasks'); // Contenedor donde se mostrarán las tareas
    const taskElement = document.createElement('div'); // Crea un elemento div para la tarea
    taskElement.className = `task ${task.status === 'ready' ? 'completed' : ''}`; // Añade clases CSS
    taskElement.innerHTML = `
        <span>${task.task}</span>
        <div>
            <button class="delete-btn">🗑</button>
            <button class="toggle-btn">✔️</button>
        </div>
    `;

    // Añade eventos de clic a los botones de eliminar y cambiar estado
    taskElement.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
    taskElement.querySelector('.toggle-btn').addEventListener('click', () => toggleStatus(task.id, task.status));

    tasksContainer.appendChild(taskElement); // Añade el elemento de tarea al contenedor
}

// Función para eliminar una tarea
async function deleteTask(id) {
    await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE' // Solicitud DELETE para eliminar una tarea
    });

    fetchTasks(); // Vuelve a obtener las tareas para actualizar la lista
}

// Función para cambiar el estado de una tarea
async function toggleStatus(id, currentStatus) {
    const newStatus = currentStatus === 'ready' ? 'On hold' : 'ready'; // Cambia el estado

    await fetch(`${apiUrl}/${id}`, {
        method: 'PUT', // Solicitud PUT para actualizar el estado de la tarea
        headers: {
            'Content-Type': 'application/json' // Especifica el tipo de contenido como JSON
        },
        body: JSON.stringify({ status: newStatus }) // Convierte el nuevo estado a JSON para enviarlo
    });

    fetchTasks(); // Vuelve a obtener las tareas para actualizar la lista
}