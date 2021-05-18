import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'

const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('todosAccess')

export class TodoAccess {
	constructor(
		private readonly docClient: DocumentClient = createDynamoDBClient(),
		private readonly todosTable = process.env.TODOS_TABLE,
	) {}

	async getTodos(userId: string): Promise<TodoItem[]> {
		const result = await this.docClient
			.query({
				TableName: this.todosTable,
				KeyConditionExpression: 'userId = :userId',
				ExpressionAttributeValues: {
					':userId': userId
				}
			})
			.promise()

		logger.info('Query result:', result)

		const items = result.Items
		return items as TodoItem[]
	}

	async createTodo(todo: TodoItem): Promise<TodoItem> {
		await this.docClient
			.put({
				TableName: this.todosTable,
				Item: todo
			})
			.promise()

		return todo
	}
}

function createDynamoDBClient(): AWS.DynamoDB.DocumentClient {
	if (process.env.IS_OFFLINE) {
		logger.info('Using local DynamoDB instance')
		return new XAWS.DynamoDB.DocumentClient({
			region: 'localhost',
			endpoint: 'http://localhost:8000'
		})
	}

	return new XAWS.DynamoDB.DocumentClient()
}
