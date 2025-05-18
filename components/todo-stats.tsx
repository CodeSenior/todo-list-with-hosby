"use client"

import { Button } from "@/components/ui/button"
import type { Todo } from "@/types/todo"

interface TodoStatsProps {
  todos: Todo[]
  onClearCompleted: () => void
}

export function TodoStats({ todos, onClearCompleted }: TodoStatsProps) {
  const totalTodos = todos.length
  const completedTodos = todos.filter((todo) => todo.completed).length
  const hasCompletedTodos = completedTodos > 0

  if (totalTodos === 0) {
    return null
  }

  return (
    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
      <div>
        {completedTodos} of {totalTodos} completed
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearCompleted}
        disabled={!hasCompletedTodos}
        className={!hasCompletedTodos ? "opacity-50 cursor-not-allowed" : ""}
      >
        Clear completed
      </Button>
    </div>
  )
}
