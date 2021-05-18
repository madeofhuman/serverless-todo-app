import * as uuid from 'uuid'
import { TodoItem } from '@models/TodoItem'
import { TodoAccess } from '@dataLayer/todosAccess'
import { parseUserId } from '@auth/utils'
import { CreateTodoRequest } from '@requests/CreateTodoRequest'
import { createLogger } from '@utils/logger'
import { UpdateTodoRequest } from '@requests/UpdateTodoRequest'

const logger = createLogger('todos')

const todoAccess = new TodoAccess()

export async function getTodos(jwtToken: string): Promise<TodoItem[]> {
	const userId = parseUserId(jwtToken)

	return todoAccess.getTodos(userId)
}

export async function createTodo(
	jwtToken: string,
	parsedBody: CreateTodoRequest
) {
	const userId = parseUserId(jwtToken)
	const todoId = uuid.v4()

	logger.info('userId', userId)
	logger.info('todoId', todoId)

	const item = {
		userId,
		todoId,
		createdAt: new Date().toISOString(),
		done: false,
		...parsedBody,
		attachmentUrl: ''
	}

	logger.info('Item to be created at business logic', item)
	const toReturn = todoAccess.createTodo(item)

	return toReturn
}

export async function updateTodo(
	jwtToken: string,
	todoId: string,
	parsedBody: UpdateTodoRequest
) {
	const userId = parseUserId(jwtToken)
	const result = todoAccess.updateTodo(userId, todoId, parsedBody)

	return result
}

export async function deleteTodo(jwtToken: string, todoId: string) {
	const userId = parseUserId(jwtToken)
	const toReturn = todoAccess.deleteTodo(userId, todoId)

	return toReturn
}

export async function generateUploadUrl(jwtToken: string, todoId: string) {
	const userId = parseUserId(jwtToken)
	const result = todoAccess.generateUploadUrl(userId, todoId)

	return result
}
