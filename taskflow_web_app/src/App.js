import React, { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import TaskList from "./components/TaskList";
import TaskModal from "./components/TaskModal";
import Notification from "./components/Notification";
import Auth from "./components/Auth";
import { TaskProvider, useTaskContext } from "./context/TaskContext";
import { AuthProvider, useAuthContext } from "./context/AuthContext";

/** Top bar with user info and notifications */
function TopBar({ onLogout, user, onShowReminders }) {
  return (
    <div className="navbar">
      <div className="container topbar-container">
        <div className="logo">
          <span className="logo-symbol">*</span> TaskFlow
        </div>
        <div className="topbar-actions">
          <button className="btn btn-accent" onClick={onShowReminders} title="View Reminders">
            &#128276;
          </button>
          {user && (
            <span className="topbar-user">
              {user.email}
              <button className="btn btn-outline" onClick={onLogout}>Logout</button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Main App Content after Auth/Login
function TaskFlowMain() {
  const {
    tasks,
    filteredTasks,
    categories,
    selectedCategory,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    addCategory,
    selectCategory,
  } = useTaskContext();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [notif, setNotif] = useState("");
  const [reminders, setReminders] = useState([]);

  // Setup reminders for upcoming/overdue tasks
  useEffect(() => {
    const now = new Date();
    const soonDue = tasks.filter(
      (t) =>
        !t.completed &&
        t.due &&
        new Date(t.due).setHours(23,59,59,999) - now <= 86400000 &&
        new Date(t.due).setHours(23,59,59,999) > now
    );
    const overdue = tasks.filter(
      (t) =>
        !t.completed &&
        t.due &&
        new Date(t.due).setHours(23,59,59,999) < now
    );
    setReminders([
      ...overdue.map(
        (t) =>
          `Task "${t.title}" is overdue (was due ${new Date(
            t.due
          ).toLocaleDateString()})`
      ),
      ...soonDue.map(
        (t) =>
          `Task "${t.title}" is due soon (${new Date(
            t.due
          ).toLocaleDateString()})`
      ),
    ]);
  }, [tasks]);

  function handleAddTask() {
    setEditingTask(null);
    setModalOpen(true);
  }
  function handleEditTask(task) {
    setEditingTask(task);
    setModalOpen(true);
  }
  function handleSaveTask(task) {
    if (!task.title) return;
    if (task.id) {
      updateTask(task);
      setNotif("Task updated.");
    } else {
      addTask(task);
      setNotif("Task created!");
    }
    setModalOpen(false);
  }

  function handleAddCategory() {
    const name = window.prompt("New project name:");
    if (name) addCategory(name);
  }

  function handleShowReminders() {
    if (reminders.length > 0) {
      setNotif(reminders.join(" | "));
    } else {
      setNotif("No reminders currently.");
    }
  }

  return (
    <div className="taskflow-app">
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={selectCategory}
        onAddCategory={handleAddCategory}
      />
      <main className="main">
        <header className="main-header">
          <div className="main-header-titles">
            <h1>Tasks</h1>
            <button className="btn btn-accent" onClick={handleAddTask}>
              + New Task
            </button>
          </div>
          <div className="main-header-progress">
            Progress:{" "}
            <span>
              {tasks.length === 0
                ? "0"
                : `${tasks.filter((t) => t.completed).length} / ${
                    tasks.length
                  }`}
            </span>
          </div>
        </header>
        <TaskList
          tasks={filteredTasks}
          onEdit={handleEditTask}
          onDelete={deleteTask}
          onToggleStatus={toggleTaskStatus}
        />
      </main>
      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
        categories={categories}
      />
      <Notification message={notif} onDismiss={() => setNotif("")} />
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <MainAppContainer />
      </TaskProvider>
    </AuthProvider>
  );
}

// Splits auth state and main app
function MainAppContainer() {
  const { user, login, signup, logout } = useAuthContext();
  const [showReminders, setShowReminders] = useState(false);

  return (
    <div className="app">
      <TopBar user={user} onLogout={logout} onShowReminders={() => setShowReminders(true)} />
      {!user ? (
        <div className="container center-content" style={{ minHeight: "80vh" }}>
          <Auth onLogin={login} onSignup={signup} />
        </div>
      ) : (
        <TaskFlowMain />
      )}
    </div>
  );
}

export default App;