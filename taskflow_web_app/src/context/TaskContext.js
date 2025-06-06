import React, { createContext, useContext, useReducer, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const TaskContext = createContext();

const getInitialState = () => {
  try {
    const local = localStorage.getItem("taskflow-data");
    return local ? JSON.parse(local) : { tasks: [], categories: [] };
  } catch {
    return { tasks: [], categories: [] };
  }
};

const initialState = getInitialState();

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? { ...action.payload } : t
        ),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };
    case "TOGGLE_TASK_STATUS": {
      const tasks = state.tasks.map((t) =>
        t.id === action.payload
          ? {
              ...t,
              completed: !t.completed,
              inProgress: t.completed ? true : !t.inProgress,
            }
          : t
      );
      return { ...state, tasks };
    }
    case "ADD_CATEGORY":
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    case "SELECT_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "INIT":
      return { ...action.payload };
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function TaskProvider({ children }) {
  /**
   * Provides global task and category handling.
   * Persists to localStorage for demo purposes.
   */
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    localStorage.setItem("taskflow-data", JSON.stringify(state));
  }, [state]);

  // Initial setup: add a default category if none
  useEffect(() => {
    if (state.categories.length === 0) {
      dispatch({
        type: "ADD_CATEGORY",
        payload: {
          id: uuidv4(),
          name: "Personal",
          color: "#ff0000",
        },
      });
    }
  }, []);

  // PUBLIC_INTERFACE
  function addTask(task) {
    dispatch({
      type: "ADD_TASK",
      payload: { ...task, id: uuidv4(), completed: false, inProgress: true },
    });
  }
  // PUBLIC_INTERFACE
  function updateTask(task) {
    dispatch({ type: "UPDATE_TASK", payload: task });
  }
  // PUBLIC_INTERFACE
  function deleteTask(taskId) {
    dispatch({ type: "DELETE_TASK", payload: taskId });
  }
  // PUBLIC_INTERFACE
  function toggleTaskStatus(taskId) {
    dispatch({ type: "TOGGLE_TASK_STATUS", payload: taskId });
  }
  // PUBLIC_INTERFACE
  function addCategory(name) {
    dispatch({
      type: "ADD_CATEGORY",
      payload: { id: uuidv4(), name, color: "#ff0000" },
    });
  }
  // PUBLIC_INTERFACE
  function selectCategory(id) {
    dispatch({ type: "SELECT_CATEGORY", payload: id });
  }

  const { tasks, categories, selectedCategory } = state;
  // Filter tasks for current category
  const filteredTasks = selectedCategory
    ? tasks.filter((t) => t.categoryId === selectedCategory)
    : tasks;

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        filteredTasks,
        categories: state.categories,
        selectedCategory: state.selectedCategory,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        addCategory,
        selectCategory,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

// PUBLIC_INTERFACE
export function useTaskContext() {
  return useContext(TaskContext);
}
