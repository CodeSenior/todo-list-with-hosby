"use client"

import { useState, useEffect } from "react"
import { TodoList } from "@/components/todo-list"
import { TodoForm } from "@/components/todo-form"
import { TodoStats } from "@/components/todo-stats"
import { TodoService } from "@/lib/todo-service"
import type { Todo } from "@/types/todo"

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [todoService, setTodoService] = useState<TodoService | null>(null)

  // Initialize the TodoService once
  useEffect(() => {
    try {
      const service = new TodoService()
      setTodoService(service)
    } catch (err: any) {
      setError(`Failed to initialize: ${err.message || "Unknown error"}`)
      setIsLoading(false)
    }
  }, [])

  // Fetch todos when the service is ready
  useEffect(() => {
    const fetchTodos = async () => {
      if (!todoService) return

      try {
        setIsLoading(true)
        const fetchedTodos = await todoService.getAllTodos()
        setTodos(fetchedTodos)
        setError(null)
      } catch (err: any) {
        setError(`Failed to load todos: ${err.message || "Unknown error"}`)
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (todoService) {
      fetchTodos()
    }
  }, [todoService])

  const handleAddTodo = async (title: string) => {
    if (!todoService) {
      setError("Service not initialized")
      return
    }

    try {
      const newTodo = await todoService.createTodo({
        title,
        completed: false,
      })
      setTodos([...todos, newTodo])
    } catch (err: any) {
      setError(`Failed to add todo: ${err.message || "Unknown error"}`)
      console.error(err)
    }
  }

  const handleToggleTodo = async (id: string) => {
    if (!todoService) {
      setError("Service not initialized")
      return
    }

    try {
      const todoToUpdate = todos.find((todo) => todo.id === id)
      if (!todoToUpdate) return

      const updatedTodo = await todoService.updateTodo(id, {
        completed: !todoToUpdate.completed,
      })

      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)))
    } catch (err: any) {
      setError(`Failed to update todo: ${err.message || "Unknown error"}`)
      console.error(err)
    }
  }

  const handleDeleteTodo = async (id: string) => {
    if (!todoService) {
      setError("Service not initialized")
      return
    }

    try {
      await todoService.deleteTodo(id)
      setTodos(todos.filter((todo) => todo.id !== id))
    } catch (err: any) {
      setError(`Failed to delete todo: ${err.message || "Unknown error"}`)
      console.error(err)
    }
  }

  const handleClearCompleted = async () => {
    if (!todoService) {
      setError("Service not initialized")
      return
    }

    try {
      const completedTodos = todos.filter((todo) => todo.completed)

      await Promise.all(completedTodos.map((todo) => todoService.deleteTodo(todo.id)))

      setTodos(todos.filter((todo) => !todo.completed))
    } catch (err: any) {
      setError(`Failed to clear completed todos: ${err.message || "Unknown error"}`)
      console.error(err)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center">Todo List</h1>

        <TodoForm onAddTodo={handleAddTodo} />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            <TodoList todos={todos} onToggle={handleToggleTodo} onDelete={handleDeleteTodo} />

            <TodoStats todos={todos} onClearCompleted={handleClearCompleted} />
          </>
        )}
      </div>
    </main>
  )
}
