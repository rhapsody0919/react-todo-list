import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos')
    return saved ? JSON.parse(saved) : []
  })
  const [inputValue, setInputValue] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('work')
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })
  const [draggedItem, setDraggedItem] = useState(null)

  const categories = [
    { id: 'work', label: '仕事', color: '#646cff' },
    { id: 'personal', label: '個人', color: '#22c55e' },
    { id: 'urgent', label: '緊急', color: '#ef4444' },
    { id: 'other', label: 'その他', color: '#a855f7' }
  ]

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    document.body.classList.toggle('dark-mode', darkMode)
  }, [darkMode])

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([...todos, {
        id: Date.now(),
        text: inputValue,
        completed: false,
        category: selectedCategory,
        createdAt: new Date().toISOString()
      }])
      setInputValue('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const handleDragStart = (e, index) => {
    setDraggedItem(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    if (draggedItem === null || draggedItem === index) return

    const newTodos = [...todos]
    const draggedTodo = newTodos[draggedItem]
    newTodos.splice(draggedItem, 1)
    newTodos.splice(index, 0, draggedTodo)

    setDraggedItem(index)
    setTodos(newTodos)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const completedCount = todos.filter(todo => todo.completed).length
  const totalCount = todos.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <div className="header">
        <h1>Todo List</h1>
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'ライトモード' : 'ダークモード'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {totalCount > 0 && (
        <div className="progress-section">
          <div className="progress-info">
            <span>{completedCount} / {totalCount} 完了</span>
            <span>{progressPercentage.toFixed(0)}%</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      <div className="input-container">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.label}</option>
          ))}
        </select>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="新しいタスクを入力..."
        />
        <button onClick={addTodo}>追加</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo, index) => {
          const category = categories.find(c => c.id === todo.category)
          return (
            <li
              key={todo.id}
              className={`${todo.completed ? 'completed' : ''} ${draggedItem === index ? 'dragging' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="drag-handle">⋮⋮</div>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
              />
              <span className="todo-text">{todo.text}</span>
              <span
                className="category-tag"
                style={{ backgroundColor: category?.color }}
              >
                {category?.label}
              </span>
              <button onClick={() => deleteTodo(todo.id)} className="delete-btn">削除</button>
            </li>
          )
        })}
      </ul>
      {todos.length === 0 && <p className="empty-message">タスクがありません</p>}
    </div>
  )
}

export default App
