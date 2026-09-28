import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { Todo } from "@/types";

interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  refreshing: boolean;
  error: string | null;
  totalCount: number;
  activeCount: number;
  completedCount: number;
  progressPercent: number;
  fetchTodos: (isRefresh?: boolean) => Promise<void>;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string, completed: boolean) => Promise<void>;
  editTodo: (id: string, text: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  clearAll: () => Promise<void>;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

interface TodoProviderProps {
  children: ReactNode;
}

/**
 * Провайдер завдань поверх Convex.
 * Дані персональні: бекенд повертає лише завдання поточного користувача
 * (getAuthUserId), а підписка useQuery оновлюється в реальному часі.
 */
export function TodoProvider({ children }: TodoProviderProps) {
  const rawTodos = useQuery(api.todos.getTodos);
  const createTodo = useMutation(api.todos.createTodo);
  const toggleTodoMutation = useMutation(api.todos.toggleTodo);
  const updateTodo = useMutation(api.todos.updateTodo);
  const deleteTodoMutation = useMutation(api.todos.deleteTodo);
  const clearCompletedMutation = useMutation(api.todos.clearCompleted);
  const clearAllMutation = useMutation(api.todos.clearAll);

  const [refreshing, setRefreshing] = useState(false);

  const loading = rawTodos === undefined;

  // Мапимо документи Convex у тип Todo, який використовують UI-компоненти
  const todos = useMemo<Todo[]>(
    () =>
      (rawTodos ?? []).map((t) => ({
        id: t._id,
        text: t.text,
        completed: t.isCompleted,
        createdAt: t.createdAt,
      })),
    [rawTodos],
  );

  // Дані вже «живі» (real-time), тож pull-to-refresh лише коротко показує індикатор
  const fetchTodos = useCallback(async (isRefresh = false) => {
    if (!isRefresh) return;
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setRefreshing(false);
  }, []);

  const addTodo = useCallback(
    async (text: string) => {
      await createTodo({ text });
    },
    [createTodo],
  );

  // Сервер сам інвертує isCompleted, тому другий аргумент не потрібен
  const toggleTodo = useCallback(
    async (id: string, _completed: boolean) => {
      await toggleTodoMutation({ id: id as Id<"todos"> });
    },
    [toggleTodoMutation],
  );

  const editTodo = useCallback(
    async (id: string, text: string) => {
      await updateTodo({ id: id as Id<"todos">, text });
    },
    [updateTodo],
  );

  const deleteTodo = useCallback(
    async (id: string) => {
      await deleteTodoMutation({ id: id as Id<"todos"> });
    },
    [deleteTodoMutation],
  );

  const clearCompleted = useCallback(async () => {
    await clearCompletedMutation({});
  }, [clearCompletedMutation]);

  const clearAll = useCallback(async () => {
    await clearAllMutation({});
  }, [clearAllMutation]);

  const totalCount = todos.length;
  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos],
  );
  const activeCount = totalCount - completedCount;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const value = useMemo<TodoContextType>(
    () => ({
      todos,
      loading,
      refreshing,
      error: null,
      totalCount,
      activeCount,
      completedCount,
      progressPercent,
      fetchTodos,
      addTodo,
      toggleTodo,
      editTodo,
      deleteTodo,
      clearCompleted,
      clearAll,
    }),
    [
      todos,
      loading,
      refreshing,
      totalCount,
      activeCount,
      completedCount,
      progressPercent,
      fetchTodos,
      addTodo,
      toggleTodo,
      editTodo,
      deleteTodo,
      clearCompleted,
      clearAll,
    ],
  );

  return (
    <TodoContext.Provider value={value}>{children}</TodoContext.Provider>
  );
}

export function useTodos(): TodoContextType {
  const ctx = useContext(TodoContext);
  if (!ctx) {
    throw new Error("useTodos має використовуватися всередині TodoProvider");
  }
  return ctx;
}
