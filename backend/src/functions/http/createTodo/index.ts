import schema from './schema'
import { handlerPath } from '@libs/handlerResolver'

export default {
  handler: `${handlerPath(__dirname)}/createTodo.handler`,
  events: [
    {
      http: {
        method: 'post',
        path: 'todos',
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
        'dynamodb:PutItem',
        'dynamodb:UpdateItem',
      ],
      Resource: [
        {"Fn::GetAtt": [ 'TodosDynamoDBTable', 'Arn' ]},
      ],
    }
  ]
}
