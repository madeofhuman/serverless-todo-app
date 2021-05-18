import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '@requests/UpdateTodoRequest'

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

	async updateTodo(
		userId: string,
		todoId: string,
		parsedBody: UpdateTodoRequest
	) {
		let result = {
			statusCode: 200,
			body: ''
		}

		let todoToUpdate = await this.docClient
			.query({
				TableName: this.todosTable,
				KeyConditionExpression: 'userId = :userId AND todoId = :todoId',
				ExpressionAttributeValues: {
					':userId': userId,
					':todoId': todoId
				}
			})
			.promise()

		logger.info('Item to be updated', todoToUpdate)

		if (todoToUpdate.Items.length === 0) {
			result = {
				statusCode: 404,
				body: 'No todo with id found'
			}
			return result
		}

		if (!parsedBody.hasOwnProperty('done')) {
			await this.docClient
				.update({
					TableName: this.todosTable,
					Key: {
						userId,
						todoId
					},
					UpdateExpression: 'set #name =:name, #dueDate=:dueDate',
					ExpressionAttributeValues: {
						':name': parsedBody.name,
						':dueDate': parsedBody.dueDate
					},
					ExpressionAttributeNames: { '#name': 'name', '#dueDate': 'dueDate' },
					ReturnValues: 'UPDATED_NEW'
				})
				.promise()
		} else {
			await this.docClient
				.update({
					TableName: this.todosTable,
					Key: {
						userId,
						todoId
					},
					UpdateExpression: 'set #name =:name, #dueDate=:dueDate, #done=:done',
					ExpressionAttributeValues: {
						':name': parsedBody.name,
						':dueDate': parsedBody.dueDate,
						':done': parsedBody.done
					},
					ExpressionAttributeNames: {
						'#name': 'name',
						'#dueDate': 'dueDate',
						'#done': 'done'
					},
					ReturnValues: 'UPDATED_NEW'
				})
				.promise()
		}

		return result
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
