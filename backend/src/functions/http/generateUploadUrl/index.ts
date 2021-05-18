
import { handlerPath } from '@libs/handlerResolver'

export default {
  handler: `${handlerPath(__dirname)}/generateUploadUrl.handler`,
  events: [
    {
      http: {
        method: 'post',
        path: 'todos/{todoId}/attachment',
        cors: true,
        authorizer: 'Auth',
      }
    }
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: [
        's3:PutObject',
      ],
      Resource: [
        {"Fn::GetAtt": [ 'AttachmentsBucket', 'Arn' ]},
      ],
    },
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:Query',
        'dynamodb:UpdateItem',
      ],
      Resource: [
        {"Fn::GetAtt": [ 'TodosDynamoDBTable', 'Arn' ]},
      ],
    },
  ]
}
