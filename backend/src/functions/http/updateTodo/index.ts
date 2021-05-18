import schema from './schema'
import { handlerPath } from '@libs/handlerResolver'

export default {
  handler: `${handlerPath(__dirname)}/updateTodo.handler`,
  events: [
    {
      http: {
        method: 'patch',
        path: 'todos/{todoId}',
        cors: true,
        authorizer: 'Auth',
        request: {
          schemas: {
            'application/json': schema
          }
        }
      }
    }
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:Query',
        'dynamodb:UpdateItem',
      ],
      Resource: [
        {"Fn::GetAtt": [ 'TodosDynamoDBTable', 'Arn' ]},
      ],
    }
  ]
}
