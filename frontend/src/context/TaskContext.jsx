import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export const TaskContext = createContext();

const API_BASE_URL = 'http://localhost:8080/challenges';

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [recentlyOpened, setRecentlyOpened] = useState([]);
  const [theme, setTheme] = useState('light');

  // Dummy user and friends data for testing
  const [currentUser] = useState({
    username: 'Sami_Dev',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sami',
    isOnline: true
  });

  const [friends] = useState([
    {
      id: 1,
      username: 'Antigravity',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Antigravity',
      isOnline: true
    }
  ]);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const colors = ['#0d6efd', '#6610f2', '#6f42c1', '#d63384', '#dc3545', '#fd7e14', '#ffc107', '#198754', '#20c997', '#0dcaf0'];

  // Fetch all tasks from backend on mount
  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      console.log("Data received from backend:", response.data);
      
      const fetchedTasks = response.data.map((task, index) => {
        let parsedYear = new Date().getFullYear();
        let parsedMonth = new Date().getMonth();
        let parsedDay = new Date().getDate();

        // Convert backend eventDate back to React integers
        if (task.eventDate) {
          if (Array.isArray(task.eventDate)) {
            parsedYear = task.eventDate[0];
            parsedMonth = task.eventDate[1] - 1; // JS months are 0-11
            parsedDay = task.eventDate[2];
          } else if (typeof task.eventDate === 'string') {
            const parts = task.eventDate.split('-');
            parsedYear = parseInt(parts[0], 10);
            parsedMonth = parseInt(parts[1], 10) - 1;
            parsedDay = parseInt(parts[2], 10);
          }
        }

        return {
          id: task.id,
          title: task.title,
          description: task.description,
          year: parsedYear,
          month: parsedMonth,
          day: parsedDay,
          color: colors[index % colors.length], // Default color since backend doesn't store it
          markdownContent: task.textMarkDown || '' // Mapped to backend's textMarkDown
        };
      });
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching tasks from backend:", error);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (taskData) => {
    // 1. Format the React integers into a standard ISO Date string for eventDate
    const monthStr = String(taskData.month + 1).padStart(2, '0');
    const dayStr = String(taskData.day).padStart(2, '0');
    const eventDateStr = `${taskData.year}-${monthStr}-${dayStr}`;

    // 2. Build the exact object expected by the Java Challenge class (WITHOUT ID)
    const backendPayload = {
      title: taskData.title,
      description: taskData.description,
      eventDate: eventDateStr,
      textMarkDown: ''
    };

    try {
      console.log("Sending task to backend:", backendPayload);
      const postResponse = await axios.post(API_BASE_URL, backendPayload);
      
      // Fetch the updated list to ensure we have the absolute latest data from backend
      const getResponse = await axios.get(API_BASE_URL);
      const fetchedTasks = getResponse.data;
      
      // Find the task we just added (match by title and description, or get the last one if we can't tell)
      const matchedTask = fetchedTasks.reverse().find(t => t.title === taskData.title && t.description === taskData.description);
      
      // Get the real ID from the backend response or the fetched list
      const realId = (postResponse.data && postResponse.data.id) ? postResponse.data.id : (matchedTask ? matchedTask.id : uuidv4());
      const newColor = colors[tasks.length % colors.length];
      
      await fetchTasks(); // Update context state
      
      addToRecentlyOpened({ ...taskData, id: realId, color: newColor, markdownContent: '' });
    } catch (error) {
      console.error("Error adding task. Falling back to local state.", error);
      const newColor = colors[tasks.length % colors.length];
      const fallbackTask = { ...taskData, id: uuidv4(), color: newColor, markdownContent: '' };
      setTasks(prevTasks => [...prevTasks, fallbackTask]);
      addToRecentlyOpened(fallbackTask);
    }
  };

  const updateTaskMarkdown = async (id, newContent) => {
    const taskToUpdate = tasks.find(t => String(t.id) === String(id)); // ID from URL is a string, DB ID is a number
    if (!taskToUpdate) {
      console.error("Task not found for updating:", id);
      return;
    }

    const updatedTask = { ...taskToUpdate, markdownContent: newContent };

    // Optimistic UI update
    setTasks(tasks.map(task =>
      String(task.id) === String(id) ? updatedTask : task
    ));

    // Convert back to backend structure for PUT request
    const monthStr = String(taskToUpdate.month + 1).padStart(2, '0');
    const dayStr = String(taskToUpdate.day).padStart(2, '0');
    const eventDateStr = `${taskToUpdate.year}-${monthStr}-${dayStr}`;

    const backendPayload = {
      title: taskToUpdate.title,
      description: taskToUpdate.description,
      eventDate: eventDateStr,
      textMarkDown: newContent
    };

    try {
      console.log("Updating markdown for task", id, "with payload:", backendPayload);
      await axios.put(`${API_BASE_URL}/${id}`, backendPayload);
    } catch (error) {
      console.error("Error updating task markdown:", error);
    }
  };

  const addToRecentlyOpened = (task) => {
    setRecentlyOpened(prev => {
      const filtered = prev.filter(t => t.id !== task.id);
      return [task, ...filtered].slice(0, 10);
    });
  };

  const deleteTask = async (id) => {
    try {
      console.log("Deleting task:", id);
      await axios.delete(`${API_BASE_URL}/${id}`);
      
      // Update local state
      setTasks(prevTasks => prevTasks.filter(task => String(task.id) !== String(id)));
      setRecentlyOpened(prevOpened => prevOpened.filter(task => String(task.id) !== String(id)));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const getTasksForMonth = (year, month) => {
    return tasks.filter(task => task.year === year && task.month === month);
  };

  const getTaskById = (id) => {
    // Note: since id could be string or number depending on backend vs uuid, convert to string for comparison
    return tasks.find(task => String(task.id) === String(id));
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      addTask,
      deleteTask,
      getTasksForMonth,
      getTaskById,
      currentYear,
      setCurrentYear,
      updateTaskMarkdown,
      recentlyOpened,
      addToRecentlyOpened,
      theme,
      toggleTheme,
      currentUser,
      friends
    }}>
      {children}
    </TaskContext.Provider>
  );
};
