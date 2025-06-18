const app = document.getElementById("app");

let username = localStorage.getItem("username");
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
let reflection = localStorage.getItem("reflection") || "";

function renderApp() {
  if (!username) {
    app.innerHTML = `
      <div class="container">
        <h2>Welcome! What's your name?</h2>
        <input id="nameInput" placeholder="Enter your name" />
        <button onclick="saveName()">Continue</button>
      </div>
    `;
    return;
  }

  app.innerHTML = `
    <div class="container">
      <h1>${username}'s Daily Plan</h1>
      <div>
        <h3>📝 To-Do List</h3>
        <input id="taskInput" placeholder="Add a task..." />
        <button onclick="addTask()">Add</button>
        <div id="taskList"></div>
      </div>
      <div style="margin-top:2rem;">
        <h3>🌙 Nightly Reflection</h3>
        <textarea id="reflectionBox" placeholder="How did today go?">${reflection}</textarea>
      </div>
    </div>
  `;

  renderTasks();

  document.getElementById("reflectionBox").addEventListener("input", e => {
    reflection = e.target.value;
    localStorage.setItem("reflection", reflection);
  });
}

function saveName() {
  const input = document.getElementById("nameInput").value.trim();
  if (input) {
    username = input;
    localStorage.setItem("username", username);
    renderApp();
  }
}

function addTask() {
  const input = document.getElementById("taskInput");
  const text = input.value.trim();
  if (text) {
    tasks.push({ text, done: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    input.value = "";
    renderTasks();
  }
}

function toggleTask(i) {
  tasks[i].done = !tasks[i].done;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function deleteTask(i) {
  tasks.splice(i, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach((task, i) => {
    const item = document.createElement("div");
    item.className = "todo-item" + (task.done ? " done" : "");
    item.innerHTML = `
      <label>
        <input type="checkbox" ${task.done ? "checked" : ""} onchange="toggleTask(${i})" />
        <span>${task.text}</span>
      </label>
      <button onclick="deleteTask(${i})">✕</button>
    `;
    list.appendChild(item);
  });
}

renderApp();

