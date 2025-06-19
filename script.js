const today = new Date().toISOString().slice(0, 10);
    let username = localStorage.getItem('username') || '';
    let recentlyDeleted = null;

    const app = document.getElementById('app');
    const prompt = document.getElementById('usernamePrompt');
    const header = document.getElementById('header');
    const nameInput = document.getElementById('nameInput');
    const taskInput = document.getElementById('taskInput');
    const reflectionInput = document.getElementById('reflectionInput');
    const taskList = document.getElementById('taskList');
    const historySelect = document.getElementById('historySelect');
    const historyContent = document.getElementById('historyContent');
    const deleteDayBtn = document.getElementById('deleteDayBtn');

    function setUsername() {
      username = nameInput.value.trim();
      if (username) {
        localStorage.setItem('username', username);
        init();
      }
    }

    function init() {
      prompt.style.display = 'none';
      app.style.display = 'block';
      header.textContent = `${username}'s Daily Plan`;
      loadToday();
      loadHistoryOptions();
      loadWeeklySummary();
    }

    function loadToday() {
      const data = JSON.parse(localStorage.getItem(`todo-${today}`)) || { tasks: [], reflection: '' };
      taskList.innerHTML = '';
      data.tasks.forEach((task, i) => addTaskElement(task.text, task.done, i));
      reflectionInput.value = data.reflection;
    }

    function addTask() {
      const text = taskInput.value.trim();
      if (text) {
        addTaskElement(text, false);
        taskInput.value = '';
      }
    }

    function addTaskElement(text, done = false, index = null) {
      const div = document.createElement('div');
      div.className = 'task' + (done ? ' done' : '');

      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = done;
      checkbox.onchange = () => {
        div.classList.toggle('done');
      };
      const span = document.createElement('span');
      span.textContent = text;

      label.appendChild(checkbox);
      label.appendChild(span);

      const del = document.createElement('button');
      del.textContent = '✕';
      del.onclick = () => div.remove();

      div.appendChild(label);
      div.appendChild(del);
      taskList.appendChild(div);
    }

    function saveToday() {
      const tasks = [];
      document.querySelectorAll('#taskList .task').forEach(taskEl => {
        const text = taskEl.querySelector('span').textContent;
        const done = taskEl.querySelector('input').checked;
        tasks.push({ text, done });
      });
      const reflection = reflectionInput.value;
      localStorage.setItem(`todo-${today}`, JSON.stringify({ tasks, reflection }));
      loadHistoryOptions();
      loadWeeklySummary();
    }

    function loadHistoryOptions() {
      historySelect.innerHTML = '<option value="">Select a date</option>';
      Object.keys(localStorage)
        .filter(k => k.startsWith('todo-'))
        .forEach(k => {
          const date = k.split('todo-')[1];
          const option = document.createElement('option');
          option.value = date;
          option.textContent = date;
          historySelect.appendChild(option);
        });
    }

    function loadHistory() {
      const date = historySelect.value;
      const data = JSON.parse(localStorage.getItem(`todo-${date}`));
      if (data) {
        historyContent.innerHTML = `<h4>${date}</h4>` +
          '<ul>' +
          data.tasks.map(t => `<li>${t.done ? '✔️' : '❌'} ${t.text}</li>`).join('') +
          '</ul>' +
          `<p><strong>Reflection:</strong> ${data.reflection}</p>`;
        deleteDayBtn.style.display = 'inline-block';
      } else {
        historyContent.innerHTML = '';
        deleteDayBtn.style.display = 'none';
      }
    }

    function deleteHistoryDay() {
      const date = historySelect.value;
      if (date && confirm(`Are you sure you want to delete your entry for ${date}?`)) {
        recentlyDeleted = {
          date,
          data: localStorage.getItem(`todo-${date}`)
        };
        localStorage.removeItem(`todo-${date}`);
        loadHistoryOptions();
        loadWeeklySummary();
        historyContent.innerHTML = `<p>Entry for ${date} deleted. <button onclick="undoDelete()">Undo</button></p>`;
        deleteDayBtn.style.display = 'none';
      }
    }

    function undoDelete() {
      if (recentlyDeleted) {
        localStorage.setItem(`todo-${recentlyDeleted.date}`, recentlyDeleted.data);
        loadHistoryOptions();
        loadWeeklySummary();
        historySelect.value = recentlyDeleted.date;
        loadHistory();
        recentlyDeleted = null;
      }
    }

    if (username) {
      init();
    }

