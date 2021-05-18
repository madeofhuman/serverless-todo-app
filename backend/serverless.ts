import type { AWS } from '@serverless/typescript';

import Auth from '@functions/auth';
import getTodos from '@functions/http/getTodos';
import createTodo from '@functions/http/createTodo';
import updateTodo from '@functions/http/updateTodo';

const serverlessConfiguration: AWS = {
  service: 'serverless-todo-app',
  configValidationMode: 'error',
  frameworkVersion: '2',
  variablesResolutionMode: '20210326',
  disabledDeprecations: [
    'CLI_OPTIONS_SCHEMA',
    'UNSUPPORTED_CLI_OPTIONS'
  ],
  plugins: [
    'serverless-iam-roles-per-function',
    'serverless-offline',
    'serverless-dynamodb-local',
    'serverless-dotenv-plugin',
    'serverless-bundle',
  ],
  package: {
    individually: true
  },
  custom: {
    ['serverless-offline']: {
      httpPort: 3003,
      babelOptions: {
        presets: ["env"]
      }
    },
    dynamodb: {
      start: {
        port: 8000,
        inMemory: true,
        migrate: true,
      },
      stages: ["${self:custom.stage}"]
    },
    stage: "${opt:stage, 'dev'}",
    region: "${opt:region, 'eu-west-2'}",
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    lambdaHashingVersion: '20201221',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      TODOS_TABLE: '${self:service}-Todos-${self:custom.stage}',
      TODOS_IMAGES_S3_BUCKET: 'madeofhuman-todos-images-${self:custom.stage}',
      TODOS_SIGNED_URL_EXPIRATION: '700',
      INDEX_NAME: 'dueDate',
    },
    tracing: {
      lambda: true,
      apiGateway: true,
    }
  },
  functions: {
    Auth,
    getTodos,
    createTodo,
    updateTodo,
  },
  resources: {
    Resources: {
      TodosDynamoDBTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:provider.environment.TODOS_TABLE}',
          AttributeDefinitions: [
            { AttributeName: 'userId', AttributeType: 'S' },
            { AttributeName: 'todoId', AttributeType: 'S' }
          ],
          KeySchema: [
            { AttributeName: 'userId', KeyType: 'HASH' },
            { AttributeName: 'todoId', KeyType: 'RANGE' },
          ],
          BillingMode: 'PAY_PER_REQUEST'
        }
      },
      AttachmentsBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:provider.environment.TODOS_IMAGES_S3_BUCKET}',
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedOrigins: ['*'],
                AllowedHeaders: ['*'],
                AllowedMethods: [
                  'GET',
                  'PUT',
                  'POST',
                  'DELETE',
                  'HEAD'
                ],
                MaxAge: 3000
              }
            ]
          }
        }
      },
      BucketPolicy: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          PolicyDocument: {
            Id: 'MyPolicy',
            Version: '2012-10-17',
            Statement: [
              {
                Sid: 'PublicReadForGetBucketObjects',
                Effect: 'Allow',
                Principal: '*',
                Action: 's3:GetObject',
                Resource: 'arn:aws:s3:::${self:provider.environment.TODOS_IMAGES_S3_BUCKET}/*'
              }
            ],
          },
          Bucket: {
            Ref: "AttachmentsBucket"
          }
        }
      },
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            ['gatewayresponse.header.Access-Control-Allow-Origin']: "'*'",
            ['gatewayresponse.header.Access-Control-Allow-Headers']: "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
            ['gatewayresponse.header.Access-Control-Allow-Methods']: "'GET,OPTIONS,POST'",
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: "ApiGatewayRestApi"
          }
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
