document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("task-form");
    const taskList = document.getElementById("task-list");
  
    // タスク追加
    taskForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("task-title").value;
      const priority = document.getElementById("task-priority").value;
  
      await fetch("/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, priority }),
      });
  
      document.getElementById("task-title").value = ""; // 入力フィールドをリセット
      loadTasks(); // タスク一覧を再読み込み
    });
  
    // タスク一覧を取得して表示
    async function loadTasks() {
      const res = await fetch("/tasks");
      const data = await res.json();
      taskList.innerHTML = data.tasks
        .map(
          (task) => `
          <li>
            ${task.title} (${task.priority})
            <button onclick="deleteTask(${task.id})">Delete</button>
          </li>
        `
        )
        .join("");
    }
  
    // タスク削除
    window.deleteTask = async (id) => {
      await fetch(`/tasks/${id}`, { method: "DELETE" });
      loadTasks();
    };
  
    loadTasks(); // 初期読み込み
  });
  
    
  