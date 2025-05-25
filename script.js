
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function throttle(fn, limit) {
  let lastFunc;
  let lastRan;
  return function (...args) {
    if (!lastRan) {
      fn.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          fn.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskCategory = document.getElementById('task-category');
const taskPriority = document.getElementById('task-priority');
const taskDueDate = document.getElementById('task-due-date');
const taskDueTime = document.getElementById('task-due-time');
const taskCompleted = document.getElementById('task-completed');
const clearAllBtn = document.getElementById('clear-all-btn');
const backToTopBtn = document.getElementById('back-to-top');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const darkToggle = document.getElementById('darkToggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';
let currentSearch = '';

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function createTaskElement(task, index) {
  const taskEl = document.createElement('div');
  taskEl.className = 'task-item';
  taskEl.dataset.index = index;

  if (task.completed) taskEl.classList.add('completed');

  taskEl.innerHTML = `
    <h3>${task.text}</h3>
    <p>Category: ${task.category} | Priority: ${task.priority}</p>
    <p>Due: ${task.dueDate} ${task.dueTime}</p>
    <label>
      Completed: <input type="checkbox" class="mark-completed" ${task.completed ? 'checked' : ''}>
    </label>
    <button class="delete-task">Delete</button>
  `;

  taskEl.querySelector('.mark-completed').addEventListener('change', (e) => {
    tasks[index].completed = e.target.checked;
    saveTasks();
    renderTasks(currentFilter, currentSearch);
  });

  taskEl.querySelector('.delete-task').addEventListener('click', () => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks(currentFilter, currentSearch);
  });

  return taskEl;
}

function renderTasks(filter = 'all', search = '') {
  const existingList = document.querySelector('.task-list');
  if (existingList) existingList.remove();

  const taskList = document.createElement('div');
  taskList.className = 'task-list';

  let filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true; 
  });

  if (search.trim()) {
    filteredTasks = filteredTasks.filter(task =>
      task.text.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<p>No tasks found.</p>';
  } else {
    filteredTasks.forEach((task) => {
      const originalIndex = tasks.indexOf(task);
      const taskEl = createTaskElement(task, originalIndex);
      taskList.appendChild(taskEl);
    });
  }

  const taskInputSection = document.querySelector('.task-input-section');
  taskInputSection.insertAdjacentElement('afterend', taskList);
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const newTask = {
    text: taskInput.value.trim(),
    category: taskCategory.value,
    priority: taskPriority.value,
    dueDate: taskDueDate.value,
    dueTime: taskDueTime.value,
    completed: taskCompleted.checked,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks(currentFilter, currentSearch);
  taskForm.reset();
});

clearAllBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all tasks?')) {
    tasks = [];
    saveTasks();
    renderTasks(currentFilter, currentSearch);
  }
});

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    renderTasks(currentFilter, currentSearch);
  });
});

const handleSearch = debounce((e) => {
  currentSearch = e.target.value;
  renderTasks(currentFilter, currentSearch);
}, 300);

searchInput.addEventListener('input', handleSearch);

darkToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode', darkToggle.checked);
  localStorage.setItem('darkMode', darkToggle.checked);
});

if (localStorage.getItem('darkMode') === 'true') {
  darkToggle.checked = true;
  document.body.classList.add('dark-mode');
}
renderTasks();



const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.nav.prev');
const nextBtn = document.querySelector('.nav.next');

let currentIndex = 0;

function showSlide(index) {
  slides.forEach(slide => {
    slide.classList.remove('active');
  });
  
  if (index < 0) {
    currentIndex = slides.length - 1;
  } else if (index >= slides.length) {
    currentIndex = 0;
  } else {
    currentIndex = index;
  }
  slides[currentIndex].classList.add('active');
}
nextBtn.addEventListener('click', () => {
  showSlide(currentIndex + 1);
});
prevBtn.addEventListener('click', () => {
  showSlide(currentIndex - 1);
});
showSlide(currentIndex);
