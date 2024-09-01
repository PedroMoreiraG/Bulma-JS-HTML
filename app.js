document.addEventListener('DOMContentLoaded', () => {
  const taskModal = document.getElementById('taskModal');
  const newTaskBtn = document.getElementById('newTaskBtn');
  const saveTaskBtn = document.getElementById('saveTaskBtn');
  const cancelTaskBtn = document.getElementById('cancelTaskBtn');
  const taskForm = document.getElementById('taskForm');

  let isEditing = false;
  let currentTask = null;

  // Abrir modal para nueva tarea
  newTaskBtn.addEventListener('click', () => {
      isEditing = false;
      taskModal.classList.add('is-active');
  });

  // Cerrar modal
  const closeModal = () => {
      taskModal.classList.remove('is-active');
      taskForm.reset(); // Limpiar el formulario
      isEditing = false;
      currentTask = null;
  };
  
  document.querySelector('.delete').addEventListener('click', closeModal);
  cancelTaskBtn.addEventListener('click', closeModal);

  // Guardar nueva tarea o actualizar existente
  saveTaskBtn.addEventListener('click', () => {
      const title = document.getElementById('taskTitle').value;
      const description = document.getElementById('taskDescription').value;
      const assigned = document.getElementById('taskAssigned').value;
      const priority = document.getElementById('taskPriority').value;
      const state = document.getElementById('taskState').value;
      const deadline = document.getElementById('taskDeadline').value;

      if (isEditing && currentTask) {
          // Editar tarea existente
          currentTask.querySelector('.card-header-title').textContent = title;
          currentTask.querySelector('.content').textContent = description;
          currentTask.querySelector('.assigned').textContent = `Asignado: ${assigned}`;
          currentTask.querySelector('.priority').textContent = `Prioridad: ${priority}`;
          currentTask.querySelector('.deadline').textContent = `Fecha Límite: ${deadline}`;
          
          // Mover la tarjeta a la columna correcta si se cambió el estado
          const newColumn = document.querySelector(`.${state.toLowerCase().replace(" ", "-")}`);
          if (!newColumn.contains(currentTask)) {
              newColumn.appendChild(currentTask);
          }
      } else {
          // Crear nueva tarea
          const taskCard = document.createElement('div');
          taskCard.className = 'card task-card';
          taskCard.draggable = true;
          taskCard.innerHTML = `
              <header class="card-header">
                  <p class="card-header-title">${title}</p>
              </header>
              <div class="card-content">
                  <div class="content">${description}</div>
                  <p class="assigned"><strong>Asignado:</strong> ${assigned}</p>
                  <p class="priority"><strong>Prioridad:</strong> ${priority}</p>
                  <p class="deadline"><strong>Fecha Límite:</strong> ${deadline}</p>
              </div>
          `;

          // Agregar la tarea a la columna correspondiente
          document.querySelector(`.${state.toLowerCase().replace(" ", "-")}`).appendChild(taskCard);

          // Añadir evento de click para editar la tarea
          taskCard.addEventListener('click', () => openEditModal(taskCard));
      }

      closeModal(); // Cerrar y limpiar el modal
  });

  // Abrir modal para editar tarea
  const openEditModal = (taskCard) => {
      isEditing = true;
      currentTask = taskCard;

      // Cargar datos de la tarea en el modal
      document.getElementById('taskTitle').value = taskCard.querySelector('.card-header-title').textContent;
      document.getElementById('taskDescription').value = taskCard.querySelector('.content').textContent;
      document.getElementById('taskAssigned').value = taskCard.querySelector('.assigned').textContent.replace('Asignado: ', '');
      document.getElementById('taskPriority').value = taskCard.querySelector('.priority').textContent.replace('Prioridad: ', '');
      document.getElementById('taskState').value = taskCard.parentNode.className.split(' ')[1];
      document.getElementById('taskDeadline').value = taskCard.querySelector('.deadline').textContent.replace('Fecha Límite: ', '');

      // Mostrar modal
      taskModal.classList.add('is-active');
  };

  // Funcionalidad básica de Drag and Drop
  document.querySelectorAll('.column').forEach(column => {
      column.addEventListener('dragover', (event) => {
          event.preventDefault();
      });

      column.addEventListener('drop', (event) => {
          const draggedElement = document.querySelector('.dragging');
          column.appendChild(draggedElement);
          draggedElement.classList.remove('dragging');
      });
  });

  document.addEventListener('dragstart', (event) => {
      event.target.classList.add('dragging');
  });

  document.addEventListener('dragend', (event) => {
      event.target.classList.remove('dragging');
  });

  // Añadir evento de click a las tareas existentes (si las hay)
  document.querySelectorAll('.task-card').forEach(taskCard => {
      taskCard.addEventListener('click', () => openEditModal(taskCard));
  });
});
