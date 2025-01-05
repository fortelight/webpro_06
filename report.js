"use strict";
const express = require("express");
const app = express();

let bbs = [];  // 本来はDBMSを使用するが、今回はこの変数にデータを蓄える
let tasks = [];  // タスク管理用データ

app.set("view engine", "ejs");
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// === BBS機能 ===

// 投稿数確認
app.post("/bbs/check", (req, res) => {
  res.json({ number: bbs.length });
});

// 投稿取得
app.post("/bbs/read", (req, res) => {
  const start = Number(req.body.start);
  if (start === 0) res.json({ messages: bbs });
  else res.json({ messages: bbs.slice(start) });
});

// 新規投稿
app.post("/bbs/post", (req, res) => {
  const { name, message } = req.body;
  bbs.push({ name, message });
  res.json({ number: bbs.length });
});

// === タスク管理SPA機能 ===

// 全タスク取得
app.get("/tasks", (req, res) => {
  res.json({ tasks });
});

// 特定のタスク取得
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  res.json({ task });
});

// 新規タスク作成
app.post("/tasks", (req, res) => {
  const newTask = {
    id: tasks.length + 1,
    title: req.body.title,
    completed: false,
    priority: req.body.priority || "中", // デフォルトは「中」
  };
  tasks.push(newTask);
  res.status(201).json({ task: newTask });
});

// タスク更新
app.put("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }
  task.title = req.body.title || task.title;
  task.completed = req.body.completed ?? task.completed;
  task.priority = req.body.priority || task.priority;
  res.json({ task });
});

// タスク削除
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Task not found" });
  }
  tasks.splice(index, 1);
  res.status(204).end();
});

// === 通知スケジュール管理機能 ===

let notificationSettings = []; // 通知スケジュールを管理

// 通知スケジュール取得
app.get("/notifications/:userId", (req, res) => {
  const userId = Number(req.params.userId);
  const setting = notificationSettings.find((s) => s.userId === userId);
  if (!setting) {
    return res.status(404).json({ error: "通知スケジュールが見つかりません。" });
  }
  res.json(setting);
});

// 通知スケジュール設定・更新
app.post("/notifications", (req, res) => {
  const { userId, schedule } = req.body;
  const existingSetting = notificationSettings.find((s) => s.userId === userId);
  if (existingSetting) {
    existingSetting.notificationSchedule = schedule;
  } else {
    notificationSettings.push({ userId, notificationSchedule: schedule });
  }
  res.json({ message: "通知スケジュールが設定されました。" });
});

// 通知スケジュール削除
app.delete("/notifications/:userId", (req, res) => {
  const userId = Number(req.params.userId);
  const index = notificationSettings.findIndex((s) => s.userId === userId);
  if (index === -1) {
    return res.status(404).json({ error: "通知スケジュールが見つかりません。" });
  }
  notificationSettings.splice(index, 1);
  res.json({ message: `ユーザー ${userId} の通知スケジュールを削除しました。` });
});

// サーバー起動
app.listen(8080, () => console.log("Example app listening on port 8080!"));
