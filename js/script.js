"use strict";

// const
const TASKS_STORAGE_KEY = "tasks";

// DOM variables
const form = document.querySelector(".create-task-form");
const taskInput = document.querySelector(".task-input");
const taskList = document.querySelector(".collection");
const clearButton = document.querySelector(".clear-tasks");
const filterInput = document.querySelector(".filter-input");

// "storage" functions
const getTasksFromStorage = () => {
  return JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY)) || [];
};

const storeTaskInStorage = (newTask) => {
  const tasks = getTasksFromStorage();
  tasks.push(newTask);

  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

const clearTasksFromStorage = () => {
  localStorage.removeItem(TASKS_STORAGE_KEY);
};

const removeTaskByIndexFromStorage = (taskIndex) => {
  const tasks = getTasksFromStorage();
  tasks.splice(taskIndex, 1);

  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

const updateTaskInStorage = (oldTaskText, newTaskText, indexOfLi) => {
  const tasks = getTasksFromStorage();
  tasks.splice(indexOfLi, 1, newTaskText);

  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

//

// "tasks" functions

const appendLi = (value, isChecked) => {
  // Create and add LI element and checkbox
  const li = document.createElement("li");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.classList.add("styled-checkbox");

  const checkStoredData = localStorage.getItem(value);
  if (checkStoredData) {
    const { text, checked } = JSON.parse(checkStoredData);
    checkbox.checked = checked;
  } else {
    checkbox.checked = false;
  }

  checkbox.addEventListener("change", (event) => {
    if (!event.target.classList.contains("styled-checkbox")) {
      return;
    }
    localStorage.setItem(
      value,
      JSON.stringify({ text: value, checked: checkbox.checked })
    );
  });

  li.appendChild(checkbox);

  // li.textContent = value; // Значення яке ввів користувач
  li.insertAdjacentHTML(
    "beforeend",
    `${value} <i class="fa fa-edit edit-item"></i> <i class="fa fa-remove delete-item"></i>`
  );
  taskList.append(li);
};

const addTask = (event) => {
  event.preventDefault();

  // Перевірка на пусте значення
  const value = taskInput.value.trim();
  if (value === "") {
    return;
  }

  appendLi(value);

  // Очистити форму
  // 1 - скидає значення у input'a taskInput
  taskInput.value = "";
  // 2 - скидає всі значення форми
  // form.reset();

  // Фокусуємось на input
  taskInput.focus();

  // Зберігаємо елемент у localStorage
  storeTaskInStorage(value);
};

const clearTasks = () => {
  taskList.innerHTML = "";
  clearTasksFromStorage();

  const storedKeys = Object.keys(localStorage);
  storedKeys.forEach((key) => {
    if (key !== TASKS_STORAGE_KEY) {
      localStorage.removeItem(key);
    }
  });
};

const removeTask = (event) => {
  const isConfirmed = confirm("Ви впевнені що хочете видалити це завдання?");
  if (!isConfirmed) {
    return;
  }
  const li = event.target.closest("li");

  const taskIndex = [...taskList.children].indexOf(li);
  removeTaskByIndexFromStorage(taskIndex);

  li.remove();
};

const editTask = (event) => {
  const li = event.target.closest("li");
  const oldTaskText = li.textContent.trim();
  const newTaskText = prompt("Відредагуйте завдання:", oldTaskText);

  if (newTaskText !== null) {
    const isChecked = li.querySelector(".styled-checkbox").checked;

    //пошук індекса елементу
    const indexOfLi = [...taskList.children].indexOf(li);

    localStorage.removeItem(oldTaskText);

    const hasEditButton = li.querySelector(".edit-item") !== null;
    const hasDeleteButton = li.querySelector(".delete-item") !== null;

    // створення нового об'єкту з оновленними даними
    const taskData = {
      text: newTaskText,
      checked: isChecked,
      hasEditButton: true,
      hasDeleteButton: true,
      position: indexOfLi,
    };

    localStorage.setItem(newTaskText, JSON.stringify(taskData));

    li.remove();

    appendLi(newTaskText, isChecked);

    updateTaskInStorage(oldTaskText, newTaskText, indexOfLi);
  }
};

const handleTaskListClick = (event) => {
  const isDeleteButton = event.target.classList.contains("delete-item");
  const isEditButton = event.target.classList.contains("edit-item");

  if (isDeleteButton) {
    removeTask(event);
  } else if (isEditButton) {
    editTask(event);
  }
};

const filterTasks = ({ target: { value } }) => {
  const text = value.toLowerCase();
  const list = taskList.querySelectorAll("li"); // []

  list.forEach((li) => {
    const liText = li.textContent.trim().toLowerCase();

    li.hidden = !liText.includes(text);
  });
};

const initTasks = () => {
  const tasks = getTasksFromStorage();
  tasks.forEach(appendLi);
};

// Init
initTasks();

// Event listeners
// onsubmit
form.addEventListener("submit", addTask);

clearButton.addEventListener("click", clearTasks);

taskList.addEventListener("click", handleTaskListClick);

filterInput.addEventListener("input", filterTasks);
