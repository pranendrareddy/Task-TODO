import React, { useEffect, useMemo, useState } from 'react'
import TaskForm from './TaskForm'
import TaskList from './TaskList'
import ProgressTracker from './ProgressTracker'

const STORAGE_KEY = 'task-todo-tasks'

const createTask = (text, priority, category, durationMinutes = 0) => ({
  text,
  priority,
  category,
  completed: false,
  durationMinutes: Number(durationMinutes) || 0,
  timeLeft: (Number(durationMinutes) || 0) * 60,
  timerRunning: false,
})

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY)
      return savedTasks ? JSON.parse(savedTasks) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const hasActiveTimer = tasks.some((task) => task.timerRunning)

  useEffect(() => {
    if (!hasActiveTimer) return undefined

    const interval = window.setInterval(() => {
      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (!task.timerRunning) return task
          if (task.timeLeft <= 1) {
            return { ...task, timeLeft: 0, timerRunning: false, completed: true }
          }
          return { ...task, timeLeft: task.timeLeft - 1 }
        }),
      )
    }, 1000)

    return () => window.clearInterval(interval)
  }, [hasActiveTimer])

  const addTask = (task) => {
    const trimmedText = task.text.trim()
    if (!trimmedText) return

    const newTask = createTask(trimmedText, task.priority, task.category, task.durationMinutes)
    setTasks((prevTasks) => [newTask, ...prevTasks])
  }

  const updateTask = (index, updatedTask) => {
    setTasks((prevTasks) => prevTasks.map((task, taskIndex) => (taskIndex === index ? updatedTask : task)))
  }

  const deleteTask = (index) => {
    setTasks((prevTasks) => prevTasks.filter((_, taskIndex) => taskIndex !== index))
  }

  const clearTasks = () => {
    setTasks([])
  }

  const toggleComplete = (index) => {
    const task = tasks[index]
    if (!task) return

    updateTask(index, { ...task, completed: !task.completed, timerRunning: false })
  }

  const setTaskTime = (index, durationMinutes) => {
    const task = tasks[index]
    if (!task) return

    const safeMinutes = Math.max(0, Number(durationMinutes) || 0)
    updateTask(index, {
      ...task,
      durationMinutes: safeMinutes,
      timeLeft: safeMinutes * 60,
      timerRunning: false,
    })
  }

  const toggleTimer = (index) => {
    const task = tasks[index]
    if (!task || task.timeLeft <= 0) return

    updateTask(index, { ...task, timerRunning: !task.timerRunning })
  }

  const progressPercent = useMemo(() => {
    if (tasks.length === 0) return 0
    const completedCount = tasks.filter((task) => task.completed).length
    return Math.round((completedCount / tasks.length) * 100)
  }, [tasks])

  const todayLabel = new Date().toLocaleDateString('en', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="app-shell">
      <div className="app-card">
        <header className="hero">
          <div className="hero-copy">
            <p className="eyebrow">{todayLabel}</p>
            <h1>Task TODO</h1>
            <p className="hero-text">A simple place to keep your day in order.</p>
          </div>
          <div className="hero-badge">Today</div>
        </header>

        <TaskForm addTask={addTask} />
        <ProgressTracker tasks={tasks} progressPercent={progressPercent} />
        <TaskList
          tasks={tasks}
          updateTask={updateTask}
          deleteTask={deleteTask}
          toggleComplete={toggleComplete}
          setTaskTime={setTaskTime}
          toggleTimer={toggleTimer}
        />

        {tasks.length > 0 && (
          <button className="clear-btn" onClick={clearTasks}>
            Clear all
          </button>
        )}
      </div>
    </div>
  )
}
