import { createClient } from "hosby-ts"
import type { Todo } from "@/types/todo"

export class TodoService {
  private client: any
  private isInitialized = false

  constructor() {
    try {
      // Initialize the Hosby client using the createClient method
      this.client = createClient({
        baseURL: process.env.NEXT_PUBLIC_HOSBY_BASE_URL || "",
        privateKey: process.env.NEXT_PUBLIC_HOSBY_PRIVATE_KEY || "",
        apiKeyId: process.env.NEXT_PUBLIC_HOSBY_API_KEY_ID || "",
        projectName: process.env.NEXT_PUBLIC_HOSBY_PROJECT_NAME || "",
        projectId: process.env.NEXT_PUBLIC_HOSBY_PROJECT_ID || "",
        userId: process.env.NEXT_PUBLIC_HOSBY_USER_ID || "",
      })
    } catch (error) {
      console.error("Error creating Hosby client:", error)
      throw new Error("Failed to create Hosby client. Check your environment variables.")
    }
  }

  private async ensureInitialized() {
    if (!this.isInitialized) {
      try {
        await this.client.init()
        this.isInitialized = true
      } catch (error) {
        console.error("Error initializing Hosby client:", error)
        throw new Error("Failed to initialize Hosby client. Check your connection and credentials.")
      }
    }
  }

  async getAllTodos(): Promise<Todo[]> {
    try {
      await this.ensureInitialized()

      // Use the Hosby client to fetch all todos
      const response = await this.client.find<Todo[]>("todos")

      if (response && response.success) {
        return response.data || []
      } else {
        const errorMessage = response?.message || "Failed to fetch todos"
        console.error(errorMessage)
        throw new Error(errorMessage)
      }
    } catch (error) {
      console.error("Error fetching todos:", error)
      // Return empty array instead of throwing to avoid breaking the UI
      return []
    }
  }

  async createTodo(todo: Omit<Todo, "id">): Promise<Todo> {
    try {
      await this.ensureInitialized()

      // Use the Hosby client to create a new todo
      const response = await this.client.insertOne<Todo>("todos", todo)

      if (response && response.success) {
        return response.data
      } else {
        throw new Error(response?.message || "Failed to create todo")
      }
    } catch (error) {
      console.error("Error creating todo:", error)
      throw error
    }
  }

  async updateTodo(id: string, todo: Partial<Todo>): Promise<Todo> {
    try {
      await this.ensureInitialized()

      // Use the Hosby client to update a todo
      const response = await this.client.updateOne<Todo>("todos", [{ field: "id", value: id }], todo)

      if (response && response.success) {
        return response.data
      } else {
        throw new Error(response?.message || "Failed to update todo")
      }
    } catch (error) {
      console.error("Error updating todo:", error)
      throw error
    }
  }

  async deleteTodo(id: string): Promise<void> {
    try {
      await this.ensureInitialized()

      // Use the Hosby client to delete a todo
      const response = await this.client.deleteOne<Todo>("todos", [{ field: "id", value: id }])

      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to delete todo")
      }
    } catch (error) {
      console.error("Error deleting todo:", error)
      throw error
    }
  }
}
