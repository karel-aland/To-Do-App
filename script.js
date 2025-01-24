"use strict";

// Select DOM elements
const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const timeInput = document.getElementById("time-input");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const filterTasks = document.getElementById("filter-tasks");
const sortTasks = document.getElementById("sort-tasks");
const themeToggle = document.querySelector(".theme-toggle");

// Array to store tasks
let tasks = [];

// Function to add a task
function addTask() {
    const taskTitle = taskInput.value.trim();
    const taskDate = dateInput.value;
    const taskTime = timeInput.value;

    if (taskTitle === "" || taskDate === "" || taskTime === "") {
        alert("Please fill in all fields.");
        return;
    }

    const task = {
        title: taskTitle,
        date: taskDate,
        time: taskTime,
        completed: false,
    };

    tasks.push(task);

    // Clear inputs
    taskInput.value = "";
    dateInput.value = "";
    timeInput.value = "";

    renderTasks();
}

// Function to render tasks
function renderTasks() {
    taskList.innerHTML = ""; // Clear the list

    // Apply filter and sort
    let filteredTasks = [...tasks];

    if (filterTasks.value === "completed") {
        filteredTasks = filteredTasks.filter(task => task.completed);
    } else if (filterTasks.value === "incomplete") {
        filteredTasks = filteredTasks.filter(task => !task.completed);
    }

    if (sortTasks.value === "date") {
        filteredTasks.sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    } else if (sortTasks.value === "title") {
        filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
    }

    filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement("li");
        taskItem.className = `task-item ${task.completed ? "completed" : ""}`;

        const taskDetails = document.createElement("div");
        taskDetails.innerHTML = `
            <strong>${task.title}</strong>
            <small>${task.date} at ${task.time}</small>
        `;

        const actionsDiv = document.createElement("div");
        actionsDiv.className = "task-actions";

        const completeCheckbox = document.createElement("input");
        completeCheckbox.type = "checkbox";
        completeCheckbox.checked = task.completed;
        completeCheckbox.addEventListener("change", () => toggleComplete(index));

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-task";
        deleteButton.addEventListener("click", () => deleteTask(index));

        actionsDiv.appendChild(completeCheckbox);
        actionsDiv.appendChild(deleteButton);

        taskItem.appendChild(taskDetails);
        taskItem.appendChild(actionsDiv);

        taskList.appendChild(taskItem);
    });
}

// Function to toggle task completion
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
}

// Function to delete a task
function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

// Function to toggle theme
function toggleTheme() {
    document.body.classList.toggle("light");
    document.querySelector(".page-frame").classList.toggle("light");
    document.querySelector(".todo-container").classList.toggle("light");
}

// Function to show a styled notification
function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;

    document.body.appendChild(notification);

    // Show the notification
    setTimeout(() => {
        notification.classList.add("show");
    }, 100);

    // Remove the notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Function to schedule notifications
function scheduleNotifications() {
    const now = new Date();

    tasks.forEach(task => {
        if (!task.notified) {
            const taskTime = new Date(`${task.date}T${task.time}`);
            const timeDifference = taskTime - now;

            if (timeDifference > 0 && timeDifference <= 15 * 60 * 1000) {
                task.notified = true;
                setTimeout(() => {
                    showNotification(`Its TIME! ${task.title} is starting soon!`);
                }, timeDifference);
            }
        }
    });
}


// Event listeners
addTaskButton.addEventListener("click", addTask);
filterTasks.addEventListener("change", renderTasks);
sortTasks.addEventListener("change", renderTasks);
themeToggle.addEventListener("click", toggleTheme);

taskInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        addTask();
    }
});

// Periodically check for notifications
setInterval(scheduleNotifications, 60 * 1000);



