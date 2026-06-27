import React, { useState } from 'react'

export default function TaskForm({ addTask }) {
  const [task, setTask] = useState('')
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('general')
  const [durationMinutes, setDurationMinutes] = useState(25)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!task.trim()) return

    addTask({ text: task, priority, category, durationMinutes })

    setTask('')
    setPriority('medium')
    setCategory('general')
    setDurationMinutes(25)
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div className="task-form__input-group">
        <input
          type="text"
          placeholder="What do you need to do?"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button type="submit">Add task</button>
      </div>

      <div className="task-form__controls">
        <label>
          <span>Priority</span>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>

        <label>
          <span>Category</span>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="general">General</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
          </select>
        </label>

        <label>
          <span>Minutes</span>
          <input
            type="number"
            min="0"
            max="180"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(e.target.value)}
          />
        </label>
      </div>
    </form>
  )
}
