// ========================================
// TASKFLOW
// ========================================

// ========================================
// STORAGE
// ========================================

let savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

let editingTask = null;

let currentFilter = "all";

// ========================================
// ELEMENTS
// ========================================

// Dashboard statistics

const totalTasks = document.getElementById("total-tasks");
const inProgress = document.getElementById("in-progress");
const completedTasks = document.getElementById("completed-tasks");

// Task list

const taskList = document.querySelector(".task-list");

// Modal

const taskModal = document.getElementById("task-modal");
const closeModalButton = document.getElementById("close-modal");

const taskForm = document.getElementById("task-form");

const taskTitleInput = document.getElementById("task-title");
const taskCategoryInput = document.getElementById("task-category");
const taskDateInput = document.getElementById("task-date");
const taskPriorityInput = document.getElementById("task-priority");

// Add buttons

const addTaskButtons = document.querySelectorAll(".add-task-btn");

// Navigation links

const dashboardLink = document.getElementById("dashboard-link");
const tasksLink = document.getElementById("tasks-link");
const calendarLink = document.getElementById("calendar-link");
const statisticsLink = document.getElementById("statistics-link");
const settingsLink = document.getElementById("settings-link");

// Pages

const dashboardPage = document.getElementById("dashboard-page");
const tasksPage = document.getElementById("tasks-page");
const calendarPage = document.getElementById("calendar-page");
const statisticsPage = document.getElementById("statistics-page");
const settingsPage = document.getElementById("settings-page");

// My Tasks

const allTasksList = document.getElementById("all-tasks-list");
const taskSearch = document.getElementById("task-search");
const filterButtons = document.querySelectorAll(".filter-btn");

// Calendar

const calendarGrid = document.getElementById("calendar-grid");
const calendarMonth = document.getElementById("calendar-month");

const prevMonthButton = document.getElementById("prev-month");
const nextMonthButton = document.getElementById("next-month");

// Statistics

const statsTotal = document.getElementById("stats-total");
const statsCompleted = document.getElementById("stats-completed");
const statsActive = document.getElementById("stats-active");
const statsRate = document.getElementById("stats-rate");

const progressPercent = document.getElementById("progress-percent");
const progressFill = document.getElementById("progress-fill");

const priorityHigh = document.getElementById("priority-high");
const priorityMedium = document.getElementById("priority-medium");
const priorityLow = document.getElementById("priority-low");

// Settings

const darkModeToggle = document.getElementById("dark-mode-toggle");

// ========================================
// SAVE TASKS
// ========================================

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(savedTasks));
}

// ========================================
// DASHBOARD STATISTICS
// ========================================

function updateStats() {
  const total = savedTasks.length;

  const completed = savedTasks.filter(function (task) {
    return task.completed;
  }).length;

  const active = total - completed;

  totalTasks.textContent = total;

  completedTasks.textContent = completed;

  inProgress.textContent = active;
}

// ========================================
// DASHBOARD TASKS
// ========================================

function renderDashboardTasks() {
  taskList.innerHTML = "";

  if (savedTasks.length === 0) {
    taskList.innerHTML = `
      <p class="tasks-placeholder">
        No tasks yet. Create your first task!
      </p>
    `;

    updateStats();

    return;
  }

  savedTasks.forEach(function (task) {
    const taskElement = document.createElement("div");

    taskElement.classList.add("task-item");

    if (task.completed) {
      taskElement.classList.add("completed");
    }

    taskElement.innerHTML = `

      <input
        type="checkbox"
        ${task.completed ? "checked" : ""}
      >

      <div class="task-info">

        <h3>
          ${task.title}
        </h3>

        <p>
          ${task.category} • ${task.date}
        </p>

      </div>

      <span class="priority ${task.priority}">

        ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}

      </span>

      <button class="edit-task">
        Edit
      </button>

      <button class="delete-task">
        Delete
      </button>
    `;

    taskList.appendChild(taskElement);

    // Checkbox

    const checkbox = taskElement.querySelector("input[type='checkbox']");

    checkbox.addEventListener("change", function () {
      task.completed = checkbox.checked;

      saveTasks();

      refreshApp();
    });

    // Edit

    const editButton = taskElement.querySelector(".edit-task");

    editButton.addEventListener("click", function () {
      editTask(task);
    });

    // Delete

    const deleteButton = taskElement.querySelector(".delete-task");

    deleteButton.addEventListener("click", function () {
      deleteTask(task);
    });
  });

  updateStats();
}

// ========================================
// DELETE TASK
// ========================================

function deleteTask(taskData) {
  const taskIndex = savedTasks.indexOf(taskData);

  if (taskIndex !== -1) {
    savedTasks.splice(taskIndex, 1);
  }

  saveTasks();

  refreshApp();
}

// ========================================
// EDIT TASK
// ========================================

function editTask(taskData) {
  editingTask = taskData;

  taskTitleInput.value = taskData.title;

  taskCategoryInput.value = taskData.category;

  taskDateInput.value = taskData.date;

  taskPriorityInput.value = taskData.priority;

  document.querySelector(".modal-header h2").textContent = "Edit Task";

  document.querySelector(".modal-header p").textContent =
    "Update your task information.";

  document.querySelector(".create-task-btn").textContent = "Save Changes";

  taskModal.classList.add("active");
}

// ========================================
// RESET MODAL
// ========================================

function resetModal() {
  editingTask = null;

  taskForm.reset();

  document.querySelector(".modal-header h2").textContent = "Create New Task";

  document.querySelector(".modal-header p").textContent =
    "Add a new task to your list.";

  document.querySelector(".create-task-btn").textContent = "Create Task";
}

// ========================================
// OPEN MODAL
// ========================================

addTaskButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    resetModal();

    taskModal.classList.add("active");
  });
});

// ========================================
// CLOSE MODAL
// ========================================

closeModalButton.addEventListener("click", function () {
  resetModal();

  taskModal.classList.remove("active");
});

taskModal.addEventListener("click", function (event) {
  if (event.target === taskModal) {
    resetModal();

    taskModal.classList.remove("active");
  }
});

// ========================================
// CREATE / EDIT TASK
// ========================================

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const title = taskTitleInput.value.trim();

  const category = taskCategoryInput.value.trim();

  const date = taskDateInput.value;

  const priority = taskPriorityInput.value;

  // EDIT

  if (editingTask !== null) {
    editingTask.title = title;

    editingTask.category = category;

    editingTask.date = date;

    editingTask.priority = priority;

    saveTasks();

    resetModal();

    taskModal.classList.remove("active");

    refreshApp();

    return;
  }

  // CREATE

  const taskData = {
    title: title,

    category: category,

    date: date,

    priority: priority,

    completed: false,
  };

  savedTasks.push(taskData);

  saveTasks();

  resetModal();

  taskModal.classList.remove("active");

  refreshApp();
});

// ========================================
// PAGE NAVIGATION
// ========================================

function showPage(page, link) {
  const pages = document.querySelectorAll(".page");

  const links = document.querySelectorAll(".menu-item");

  // Hide all pages

  pages.forEach(function (currentPage) {
    currentPage.classList.remove("active-page");
  });

  // Remove active menu state

  links.forEach(function (currentLink) {
    currentLink.classList.remove("active");
  });

  // Show selected page

  page.classList.add("active-page");

  // Highlight selected link

  link.classList.add("active");
}

// Dashboard

dashboardLink.addEventListener("click", function (event) {
  event.preventDefault();

  showPage(dashboardPage, dashboardLink);

  renderDashboardTasks();
});

// My Tasks

tasksLink.addEventListener("click", function (event) {
  event.preventDefault();

  showPage(tasksPage, tasksLink);

  renderMyTasks();
});

// Calendar

calendarLink.addEventListener("click", function (event) {
  event.preventDefault();

  showPage(calendarPage, calendarLink);

  renderCalendar();
});

// Statistics

statisticsLink.addEventListener("click", function (event) {
  event.preventDefault();

  showPage(statisticsPage, statisticsLink);

  renderStatistics();
});

// Settings

settingsLink.addEventListener("click", function (event) {
  event.preventDefault();

  showPage(settingsPage, settingsLink);
});

// View All

const viewAllTasks = document.getElementById("view-all-tasks");

viewAllTasks.addEventListener("click", function (event) {
  event.preventDefault();

  showPage(tasksPage, tasksLink);

  renderMyTasks();
});

// ========================================
// MY TASKS
// ========================================

function renderMyTasks() {
  allTasksList.innerHTML = "";

  const searchText = taskSearch.value.toLowerCase();

  const filteredTasks = savedTasks.filter(function (task) {
    // Search

    const matchesSearch =
      task.title.toLowerCase().includes(searchText) ||
      task.category.toLowerCase().includes(searchText);

    // Filter

    let matchesFilter = true;

    if (currentFilter === "active") {
      matchesFilter = !task.completed;
    }

    if (currentFilter === "completed") {
      matchesFilter = task.completed;
    }

    return matchesSearch && matchesFilter;
  });

  // Nothing found

  if (filteredTasks.length === 0) {
    allTasksList.innerHTML = `

      <p class="tasks-placeholder">

        No tasks found.

      </p>

    `;

    return;
  }

  filteredTasks.forEach(function (task) {
    const taskElement = document.createElement("div");

    taskElement.classList.add("my-task-item");

    if (task.completed) {
      taskElement.classList.add("completed");
    }

    taskElement.innerHTML = `

      <input
        type="checkbox"
        ${task.completed ? "checked" : ""}
      >

      <div class="my-task-info">

        <h3>
          ${task.title}
        </h3>

        <p>
          ${task.category} • ${task.date}
        </p>

      </div>

      <span class="priority ${task.priority}">

        ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}

      </span>
    `;

    allTasksList.appendChild(taskElement);

    const checkbox = taskElement.querySelector("input[type='checkbox']");

    checkbox.addEventListener("change", function () {
      task.completed = checkbox.checked;

      saveTasks();

      refreshApp();
    });
  });
}

// ========================================
// SEARCH
// ========================================

taskSearch.addEventListener("input", function () {
  renderMyTasks();
});

// ========================================
// FILTERS
// ========================================

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (btn) {
      btn.classList.remove("active-filter");
    });

    button.classList.add("active-filter");

    currentFilter = button.dataset.filter;

    renderMyTasks();
  });
});

// ========================================
// CALENDAR
// ========================================

let calendarDate = new Date();

const monthNames = [
  "January",

  "February",

  "March",

  "April",

  "May",

  "June",

  "July",

  "August",

  "September",

  "October",

  "November",

  "December",
];

function renderCalendar() {
  calendarGrid.innerHTML = "";

  const year = calendarDate.getFullYear();

  const month = calendarDate.getMonth();

  calendarMonth.textContent = monthNames[month] + " " + year;

  const firstDay = new Date(year, month, 1);

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Monday = 0

  let startDay = firstDay.getDay() - 1;

  if (startDay < 0) {
    startDay = 6;
  }

  // Empty cells

  for (let i = 0; i < startDay; i++) {
    const emptyDay = document.createElement("div");

    emptyDay.classList.add("calendar-day", "empty-day");

    calendarGrid.appendChild(emptyDay);
  }

  // Days

  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div");

    dayElement.classList.add("calendar-day");

    const dayNumber = document.createElement("span");

    dayNumber.classList.add("calendar-day-number");

    dayNumber.textContent = day;

    dayElement.appendChild(dayNumber);

    // YYYY-MM-DD

    const monthNumber = String(month + 1).padStart(2, "0");

    const dayFormatted = String(day).padStart(2, "0");

    const currentDate = `${year}-${monthNumber}-${dayFormatted}`;

    // Tasks for this date

    const tasksForDay = savedTasks.filter(function (task) {
      return task.date === currentDate;
    });

    tasksForDay.forEach(function (task) {
      const calendarTask = document.createElement("div");

      calendarTask.classList.add("calendar-task", task.priority);

      if (task.completed) {
        calendarTask.classList.add("completed");
      }

      calendarTask.textContent = task.title;

      calendarTask.title = `${task.title} — ${task.category}`;

      dayElement.appendChild(calendarTask);
    });

    calendarGrid.appendChild(dayElement);
  }
}

// Previous Month

prevMonthButton.addEventListener("click", function () {
  calendarDate.setMonth(calendarDate.getMonth() - 1);

  renderCalendar();
});

// Next Month

nextMonthButton.addEventListener("click", function () {
  calendarDate.setMonth(calendarDate.getMonth() + 1);

  renderCalendar();
});

// ========================================
// STATISTICS
// ========================================

function renderStatistics() {
  const total = savedTasks.length;

  const completed = savedTasks.filter(function (task) {
    return task.completed;
  }).length;

  const active = total - completed;

  let rate = 0;

  if (total > 0) {
    rate = Math.round((completed / total) * 100);
  }

  // Main cards

  statsTotal.textContent = total;

  statsCompleted.textContent = completed;

  statsActive.textContent = active;

  statsRate.textContent = rate + "%";

  // Progress

  progressPercent.textContent = rate + "%";

  progressFill.style.width = rate + "%";

  // Priorities

  const highTasks = savedTasks.filter(function (task) {
    return task.priority === "high";
  }).length;

  const mediumTasks = savedTasks.filter(function (task) {
    return task.priority === "medium";
  }).length;

  const lowTasks = savedTasks.filter(function (task) {
    return task.priority === "low";
  }).length;

  priorityHigh.textContent = highTasks;

  priorityMedium.textContent = mediumTasks;

  priorityLow.textContent = lowTasks;
}

// ========================================
// SETTINGS / DARK MODE
// ========================================

function applyDarkMode(enabled) {
  if (enabled) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

// Load saved theme

const savedDarkMode = localStorage.getItem("darkMode") === "true";

darkModeToggle.checked = savedDarkMode;

applyDarkMode(savedDarkMode);

// Toggle theme

darkModeToggle.addEventListener("change", function () {
  const enabled = darkModeToggle.checked;

  localStorage.setItem("darkMode", enabled);

  applyDarkMode(enabled);
});

// ========================================
// REFRESH APP
// ========================================

function refreshApp() {
  renderDashboardTasks();

  renderMyTasks();

  renderCalendar();

  renderStatistics();
}

// ========================================
// INITIAL LOAD
// ========================================

refreshApp();
