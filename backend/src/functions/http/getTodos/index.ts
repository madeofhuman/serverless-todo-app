import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/getTodos.handler`,
  events: [
    {
      http: {
        method: 'get',
        path: 'todos',
        cors: true,
        authorizer: "Auth"
      }
    }
  ],
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: [
        'dynamodb:Query'
      ],
      Resource: [
        {"Fn::GetAtt": [ 'TodosDynamoDBTable', 'Arn' ]},
      ],
    }
  ]
}
