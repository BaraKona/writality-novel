import { FC, useRef, useState } from 'react'
import { useLocation } from '@tanstack/react-router'
import { EllipsisIcon, GripVerticalIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useCreateTodos } from '@renderer/hooks/todos/useCreateTodos'
import { useUpdateTodos } from '@renderer/hooks/todos/useUpdateTodos'
import { useDeleteTodo } from '@renderer/hooks/todos/useDeleteTodo'
import { Input } from '@renderer/components/ui/input'
import { generateUniqueId } from '@shared/functions'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@renderer/components/ui/dropdown-menu'
import { IconListCheck } from '@tabler/icons-react'
import { Button } from '@renderer/components/ui/button'
import SortableList, { SortableItem, SortableKnob } from 'react-easy-sort'
import { Todo } from '@shared/models'
import { useTodos } from '@renderer/hooks/todos/useTodos'

export const FileTodos: FC<{ todos: Todo[] }> = () => {
  const [isAddingTodo, setIsAddingTodo] = useState(false)
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null)
  const [error, setError] = useState('')

  const [newTodo, setNewTodo] = useState('')
  const location = useLocation()
  const [animate] = useAutoAnimate()

  const todoRef = useRef<HTMLInputElement>(null)

  const { data: todos, isLoading } = useTodos(location.pathname)
  const { mutate: createTodo } = useCreateTodos()
  const { mutate: updateTodo } = useUpdateTodos()
  const { mutate: deleteTodo } = useDeleteTodo()

  const handleCreateTodo = () => {
    if (!newTodo || !newTodo.trim()) {
      setNewTodo('')
      setIsAddingTodo(false)
      if (todoRef.current) todoRef.current.innerText = ''
      return
    }

    setError('')
    createTodo({
      filePath: location.pathname,
      todo: {
        title: newTodo.trim(),
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: generateUniqueId(),
        position: todos?.length ?? 0
      }
    })
    setNewTodo('')
    setIsAddingTodo(false)
    if (todoRef.current) todoRef.current.innerText = ''
  }

  const handleBlurInput = (e: React.FocusEvent<HTMLSpanElement, Element>) => {
    if (e.target.innerText !== '' && e.target.innerText.trim() !== '') {
      handleCreateTodo()
    } else {
      setIsAddingTodo(false), setNewTodo('')
      if (todoRef.current) todoRef.current.innerText = ''
    }
  }

  const onSortEnd = (oldIndex: number, newIndex: number) => {
    if (!todos) return

    const sortedTodos = [...todos]
    const [removed] = sortedTodos.splice(oldIndex, 1)
    sortedTodos.splice(newIndex, 0, removed)

    sortedTodos.forEach((todo, index) => {
      updateTodo({
        filePath: location.pathname,
        todo: {
          ...todo,
          position: index
        }
      })
    })
  }



  if (todos?.length === 0) {
    return (
      <div className="w-full flex flex-col gap-0.5 items-center text-text px-2 grow overflow-y-auto group/todo-menu relative">
        {isAddingTodo ? (
          <TodoInput
            newTodo={newTodo}
            setNewTodo={setNewTodo}
            handleCreateTodo={handleCreateTodo}
            handleBlurInput={handleBlurInput}
            todoRef={todoRef}
          />
        ) : (
          <>
            <div className="flex items-center mt-8 gap-2 text-sm">
              <IconListCheck size={18} />
              No todos yet.
            </div>
            <p className="text-xs mt-2 max-w-[250px] text-center mx-auto">
              Todos are a great way to keep track of tasks and ideas and make sure you don't forget
              anything.
            </p>
            <Button
              className="mt-4 text-xs flex items-center gap-2 px-2"
              onClick={() => setIsAddingTodo(true)}
            >
              <PlusIcon size={16} strokeWidth={1.5} />
              Add todo
            </Button>
          </>
        )}
      </div>
    )
  }

  return (
    <div
      className="h-full flex flex-col gap-0.5 grow overflow-y-auto px-1 group/todo-menu relative"
      ref={animate}
    >
      <SortableList
        onSortEnd={onSortEnd}
        draggedItemClassName="dragged"
        lockAxis="y"
        className="flex flex-col gap-0.5 overflow-y-auto grow"
      >
        {todos?.map((todo) => (
          <SortableItem key={todo.id}>
            <div className="flex items-start gap-2 py-2 px-2 text-sm group/list rounded-md cursor-default relative hover:bg-hover has-[:checked]:bg-hover">
              <DropdownMenu>
                <SortableKnob>
                  <GripVerticalIcon
                    className={`absolute left-0.5 group-hover/list:block cursor-pointer hidden text-text my-auto top-2.5 `}
                    size={14}
                    strokeWidth={2}
                  />
                </SortableKnob>
                <Input
                  type="checkbox"
                  className="peer ml-2.5 h-4 w-4 px-2 mt-px cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-editorText checked:border-secondaryBackground"
                  checked={todo.completed}
                  onChange={() =>
                    updateTodo({
                      filePath: location.pathname,
                      todo: {
                        ...todo,
                        completed: !todo.completed,
                        updatedAt: new Date()
                      }
                    })
                  }
                />
                <label
                  className={`peer-checked:line-through w-full rounded
                  ${editingTodoId === todo.id ? 'ring-1 ring-highlight' : ''}
                  `}
                  contentEditable={editingTodoId === todo.id}
                  onDoubleClick={() => setEditingTodoId(todo.id)}
                  onBlur={(e) => {
                    if (e.target.innerText !== todo.title) {
                      updateTodo({
                        filePath: location.pathname,
                        todo: {
                          ...todo,
                          title: e.target.innerText.trim()
                        }
                      })
                    }
                    setEditingTodoId(null)
                  }}
                  suppressContentEditableWarning
                >
                  {todo?.title}
                </label>
                <DropdownMenuTrigger className="">
                  <div className="hover:bg-hover p-0 text-text invisible group-hover/list:visible">
                    <EllipsisIcon size={16} strokeWidth={2} />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background text-text">
                  <DropdownMenuItem
                    className="flex gap-1 text-sm"
                    onClick={() => setEditingTodoId(todo.id)}
                  >
                    <PencilIcon size={14} strokeWidth={2} />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex gap-1 text-sm"
                    onClick={() => deleteTodo({ filePath: location.pathname, todo })}
                  >
                    <Trash2Icon size={14} strokeWidth={2} />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SortableItem>
        ))}
        <TodoInput
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          handleCreateTodo={handleCreateTodo}
          handleBlurInput={handleBlurInput}
          todoRef={todoRef}
        />
      </SortableList>
    </div>
  )
}

function TodoInput({
  newTodo,
  setNewTodo,
  handleCreateTodo,
  handleBlurInput,
  todoRef
}: {
  newTodo: string
  setNewTodo: (value: string) => void
  handleCreateTodo: () => void
  handleBlurInput: (e: React.FocusEvent<HTMLSpanElement, Element>) => void
  todoRef: React.RefObject<HTMLInputElement>
}) {
  return (
    <div className="gap-2 pb-8 items-center w-full pl-[18px] pt-1 group-hover/todo-menu:flex relative hidden">
      <Input
        type="checkbox"
        className="peer h-4 w-4 px-2 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-gray-200 checked:bg-secondaryBackground checked:border-secondaryBackground"
        checked={false}
      />

      <span
        contentEditable
        key="new-todo"
        className="peer-checked:line-through w-full !peer-checked:text-highlight ring-0 mt-px outline-none text-sm text-text z-10"
        ref={todoRef}
        onBlur={(e) => handleBlurInput(e)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleCreateTodo()
          }
        }}
        onInput={(e: React.FocusEvent<HTMLSpanElement, Element>) => setNewTodo(e.target.innerText)}
        suppressContentEditableWarning
      ></span>
      <div
        className={`text-sm text-text opacity-50 absolute left-5 ml-6 z-0 ${newTodo ? 'invisible' : 'visible'}`}
      >
        New todo
      </div>
    </div>
  )
}
