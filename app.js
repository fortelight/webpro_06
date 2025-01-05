"use strict";

const express = require("express");
const app = express();

let tasks = []; // タスク管理用データ

// ミドルウェア設定
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(__dirname + "/public"));

// === クライアントサイドのエントリーポイント ===
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/report.html");
});

// === タスク管理機能 ===

// 全タスク取得
app.get("/tasks", (req, res) => {
  res.json({ tasks });
});

// 新規タスク作成
app.post("/tasks", (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    completed: false,
    priority: req.body.priority || "中",
  };
  tasks.push(newTask);
  res.status(201).json({ task: newTask });
});

// タスク更新
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.title = req.body.title || task.title;
  task.completed = req.body.completed ?? task.completed;
  task.priority = req.body.priority || task.priority;
  res.json({ task });
});

// タスク削除
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Task not found" });

  tasks.splice(index, 1);
  res.status(204).end();
});

// サーバー起動
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

