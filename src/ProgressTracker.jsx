import React from 'react'

export default function ProgressTracker({ tasks, progressPercent }) {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length

  return (
    <div className="progress-tracker">
      <div className="progress-tracker__header">
        <p>{completedTasks} of {totalTasks} tasks completed</p>
        <strong>{progressPercent}%</strong>
      </div>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progressPercent}%` }} />
      </div>
    </div>
  )
}
