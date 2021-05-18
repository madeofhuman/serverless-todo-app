import { handlerPath } from '@libs/handlerResolver'

export default {
  handler: `${handlerPath(__dirname)}/deleteTodo.handler`,
  events: [
    {
      http: {
        method: 'delete',
        path: 'todos/{todoId}',
        cors: true,
        authorizer: 'Auth',
      }
    }
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:Query',
        'dynamodb:DeleteItem',
      ],
      Resource: [
        {"Fn::GetAtt": [ 'TodosDynamoDBTable', 'Arn' ]},
      ],
    },
    {
      Effect: 'Allow',
      Action: [
        's3:DeleteObject',
      ],
      Resource: [
        {"Fn::GetAtt": [ 'AttachmentsBucket', 'Arn' ]},
      ],
    }
  ]
}
