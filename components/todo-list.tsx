"use client"

import type { Todo } from "@/types/todo"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface TodoListProps {
  todos: Todo[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return <div className="text-center py-8 text-gray-500">No todos yet. Add one above!</div>
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center justify-between p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center space-x-3">
            <Checkbox id={`todo-${todo.id}`} checked={todo.completed} onCheckedChange={() => onToggle(todo.id)} />
            <label
              htmlFor={`todo-${todo.id}`}
              className={`text-sm font-medium ${todo.completed ? "line-through text-gray-400" : ""}`}
            >
              {todo.title}
            </label>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onDelete(todo.id)} aria-label={`Delete ${todo.title}`}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  )
}
