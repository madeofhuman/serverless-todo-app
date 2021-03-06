import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '@utils/logger'
import { deleteTodo } from '@businessLogic/todos'
import { getToken } from '@functions/utils'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const logger = createLogger('deleteTodo')

export const handler = middy(
	async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
		const todoId = event.pathParameters.todoId

		logger.info('Deleting todo: ', {
			event
		})

		const jwtToken = getToken(event)
		const result = await deleteTodo(jwtToken, todoId)

		return {
			statusCode: result.statusCode,
			body: result.body
		}
	}
)

handler.use(
	cors({
		credentials: true,
    origin: '*'
	})
)
