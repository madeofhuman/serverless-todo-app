import * as uuid from 'uuid'
import { TodoItem } from '@models/TodoItem'
import { TodoAccess } from '@dataLayer/todosAccess'
import { parseUserId } from '@auth/utils'
import { CreateTodoRequest } from '@requests/CreateTodoRequest'
import { createLogger } from '@utils/logger'

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
