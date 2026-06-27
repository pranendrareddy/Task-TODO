import React, { useState } from 'react'

const formatTime = (seconds) => {
  if (!seconds || seconds <= 0) return '00:00'

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

export default function TaskList({ tasks, updateTask, deleteTask, toggleComplete, setTaskTime, toggleTimer }) {
  const [draftMinutes, setDraftMinutes] = useState({})

  const handleTimeInput = (index, value) => {
    setDraftMinutes((prev) => ({ ...prev, [index]: value }))
  }

  const handleSetTime = (index) => {
    const value = draftMinutes[index] ?? tasks[index]?.durationMinutes ?? 0
    setTaskTime(index, value)
  }

  return (
    <ul className="task-list">
      {tasks.length === 0 ? (
        <li className="empty-state">Nothing here yet. Add your first task and keep going.</li>
      ) : (
        tasks.map((task, index) => {
        const currentValue = draftMinutes[index] ?? task.durationMinutes ?? 0

        return (
          <li key={`${task.text}-${index}`} className={`task-card ${task.completed ? 'completed' : ''}`}>
            <div className="task-card__main">
              <div className="task-card__top">
                <span className={`priority-pill ${task.priority}`}>{task.priority}</span>
                <span className="category-pill">{task.category}</span>
              </div>
              <p className="task-text">{task.text}</p>
              <div className="task-meta">
                <span>⏱ {task.durationMinutes ? `${task.durationMinutes} min` : 'No timer'}</span>
                <span>{task.timerRunning ? `Running • ${formatTime(task.timeLeft)}` : `Remaining • ${formatTime(task.timeLeft)}`}</span>
              </div>
            </div>

            <div className="task-card__actions">
              <div className="timer-setter">
                <input
                  type="number"
                  min="0"
                  max="180"
                  value={currentValue}
                  onChange={(e) => handleTimeInput(index, e.target.value)}
                />
                <button type="button" onClick={() => handleSetTime(index)}>
                  Save
                </button>
              </div>

              <div className="action-row">
                <button type="button" onClick={() => toggleComplete(index)}>
                  {task.completed ? 'Undo' : 'Done'}
                </button>
                <button
                  type="button"
                  onClick={() => toggleTimer(index)}
                  disabled={!task.durationMinutes || task.timeLeft <= 0}
                >
                  {task.timerRunning ? 'Pause' : 'Start'}
                </button>
                <button type="button" onClick={() => deleteTask(index)}>
                  Delete
                </button>
              </div>
            </div>
          </li>
        )
        })
      )}
    </ul>
  )
}
