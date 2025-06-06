//
// PUBLIC_INTERFACE
// API abstraction and mock services for TaskFlow. Replace these with real API calls in the future as needed.
//
const fakeDB = {
  users: [{ email: "demo@user.com", password: "password123" }],
  tasks: [],
  categories: [
    { id: "cat-1", name: "Personal", color: "#ff0000" }
  ],
};

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Helper: get user session (simulate token)
let _session = null;

// PUBLIC_INTERFACE
export const API = {
  // --- AUTH ---
  async login(email, password) {
    await sleep(400);
    const user = fakeDB.users.find((u) => u.email === email && u.password === password);
    if (user) {
      _session = { email };
      return { ok: true, user: { email } };
    }
    return { ok: false, error: "Invalid credentials" };
  },
  async signup(email, password) {
    await sleep(400);
    if (fakeDB.users.find((u) => u.email === email)) {
      return { ok: false, error: "Email already registered" };
    }
    fakeDB.users.push({ email, password });
    return { ok: true };
  },
  async logout() {
    _session = null;
    await sleep(100);
    return { ok: true };
  },
  getSession() {
    // For demonstration, return session object or null
    return _session;
  },

  // --- TASKS ---
  async getTasks() {
    await sleep(300);
    return { ok: true, tasks: fakeDB.tasks.slice() };
  },
  async addTask(task) {
    await sleep(200);
    const newTask = {
      ...task,
      id: "task-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      completed: false,
      inProgress: true,
    };
    fakeDB.tasks.push(newTask);
    return { ok: true, task: newTask };
  },
  async updateTask(task) {
    await sleep(150);
    const idx = fakeDB.tasks.findIndex(t => t.id === task.id);
    if (idx >= 0) {
      fakeDB.tasks[idx] = { ...task };
      return { ok: true, task: { ...task } };
    }
    return { ok: false, error: "Task not found" };
  },
  async deleteTask(taskId) {
    await sleep(150);
    fakeDB.tasks = fakeDB.tasks.filter(t => t.id !== taskId);
    return { ok: true };
  },
  async toggleTaskStatus(taskId) {
    await sleep(120);
    const idx = fakeDB.tasks.findIndex(t => t.id === taskId);
    if (idx >= 0) {
      const t = fakeDB.tasks[idx];
      fakeDB.tasks[idx] = {
        ...t,
        completed: !t.completed,
        inProgress: t.completed ? true : !t.inProgress,
      };
      return { ok: true, task: fakeDB.tasks[idx] };
    }
    return { ok: false, error: "Task not found" };
  },
  // --- CATEGORIES ---
  async getCategories() {
    await sleep(200);
    return { ok: true, categories: fakeDB.categories.slice() };
  },
  async addCategory(name) {
    await sleep(150);
    const newCat = {
      id: "cat-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      name,
      color: "#ff0000", // default color
    };
    fakeDB.categories.push(newCat);
    return { ok: true, category: newCat };
  },

  // --- NOTIFICATIONS/REMINDERS (demo purpose) ---
  async getTaskReminders() {
    // Returns reminders for tasks due soon/overdue
    await sleep(150);
    const now = new Date();
    const soonDue = fakeDB.tasks.filter(
      t =>
        !t.completed &&
        t.due &&
        new Date(t.due).setHours(23, 59, 59, 999) - now <= 86400000 &&
        new Date(t.due).setHours(23, 59, 59, 999) > now
    );
    const overdue = fakeDB.tasks.filter(
      t =>
        !t.completed &&
        t.due &&
        new Date(t.due).setHours(23, 59, 59, 999) < now
    );
    return {
      ok: true,
      reminders: [
        ...overdue.map(
          t =>
            `Task "${t.title}" is overdue (was due ${new Date(
              t.due
            ).toLocaleDateString()})`
        ),
        ...soonDue.map(
          t =>
            `Task "${t.title}" is due soon (${new Date(
              t.due
            ).toLocaleDateString()})`
        ),
      ],
    };
  },
};
