import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import { API } from "../api";

const TaskContext = createContext();

const initialState = {
  tasks: [],
  categories: [],
  selectedCategory: null,
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return { ...state, ...action.payload, loading: false };
    case "SET_LOADING":
      return { ...state, loading: true };
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
    default:
      return state;
  }
}

// PUBLIC_INTERFACE
export function TaskProvider({ children }) {
  /**
   * Provides global task and category handling via API abstraction.
   */
  const [state, dispatch] = useReducer(reducer, initialState);

  // Effects to fetch initial tasks/categories from mock API
  useEffect(() => {
    (async () => {
      dispatch({ type: "SET_LOADING" });
      const [tasksResp, catsResp] = await Promise.all([
        API.getTasks(),
        API.getCategories(),
      ]);

      // Preset categories: always available, fixed ID and color
      const presetCategories = [
        { id: "preset-office", name: "Office Task", color: "#3B82F6" },
        { id: "preset-urgent", name: "Urgent Task", color: "#E11D48" },
        { id: "preset-noturgent", name: "Not Urgent Task", color: "#F59E42" },
      ];
      // Avoid duplicate by name (case-insensitive), custom ones come after presets
      let userCategories =
        catsResp.ok && catsResp.categories.length > 0 ? catsResp.categories : [];
      userCategories = userCategories.filter(
        (cat) =>
          !presetCategories.some(
            (preset) => preset.name.toLowerCase() === cat.name.toLowerCase()
          )
      );
      const allCategories = [...presetCategories, ...userCategories];

      let defaultCat = allCategories[0]?.id || null;
      dispatch({
        type: "INIT",
        payload: {
          tasks: tasksResp.ok ? tasksResp.tasks : [],
          categories: allCategories,
          selectedCategory: defaultCat,
        },
      });
    })();
  }, []);

  // PUBLIC_INTERFACE
  const addTask = useCallback(async (task) => {
    const resp = await API.addTask(task);
    if (resp.ok) dispatch({ type: "ADD_TASK", payload: resp.task });
  }, []);

  // PUBLIC_INTERFACE
  const updateTask = useCallback(async (task) => {
    const resp = await API.updateTask(task);
    if (resp.ok) dispatch({ type: "UPDATE_TASK", payload: resp.task });
  }, []);

  // PUBLIC_INTERFACE
  const deleteTask = useCallback(async (taskId) => {
    const resp = await API.deleteTask(taskId);
    if (resp.ok) dispatch({ type: "DELETE_TASK", payload: taskId });
  }, []);

  // PUBLIC_INTERFACE
  const toggleTaskStatus = useCallback(async (taskId) => {
    const resp = await API.toggleTaskStatus(taskId);
    if (resp.ok) dispatch({ type: "UPDATE_TASK", payload: resp.task });
  }, []);

  // PUBLIC_INTERFACE
  const addCategory = useCallback(async (name) => {
    const resp = await API.addCategory(name);
    if (resp.ok) dispatch({ type: "ADD_CATEGORY", payload: resp.category });
  }, []);

  // PUBLIC_INTERFACE
  const selectCategory = useCallback((id) => {
    dispatch({ type: "SELECT_CATEGORY", payload: id });
  }, []);

  const { tasks, categories, selectedCategory, loading } = state;
  // Filter tasks for current category
  const filteredTasks = selectedCategory
    ? tasks.filter((t) => t.categoryId === selectedCategory)
    : tasks;

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        categories,
        selectedCategory,
        loading,
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
