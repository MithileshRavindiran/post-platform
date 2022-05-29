import { CfnOutput, Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Function, InlineCode, Runtime } from 'aws-cdk-lib/aws-lambda';
import { EventBus, Rule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { PolicyDocument, PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { AccessLogFormat, Integration, IntegrationType, LogGroupLogDestination, MethodLoggingLevel, RequestValidator, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import * as model from './model/model';

export class PostPlatformStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const lambda = new Function(this, "MyEventProcessor", {
      code: new InlineCode("def main(event, context):\n\tprint(event)\n\treturn {'statusCode': 200, 'body': 'Hello, World'}"),
      handler: "index.main",
      runtime: Runtime.PYTHON_3_9
    })

   const bus = new EventBus(this, "MyLanguageBus")


   new CfnOutput(this, "BusName", {value: bus.eventBusName})

   new Rule(this, "LambdaProcessorRule", {
     eventBus: bus,
     eventPattern: {source: ['com.amazon.alexa.english']},
     targets: [new LambdaFunction(lambda)]
   })

   const apigwRole = new Role(this, 'MyAPIGWRole', {
     assumedBy: new ServicePrincipal("apigateway"),
     inlinePolicies: {
      "putEvents": new PolicyDocument({
        statements: [new PolicyStatement({
          actions: ["events:PutEvents"],
          resources: [bus.eventBusArn]
        })]
      })
     }
   })

   const restApiLogs = new LogGroup(this, "api-logs", {
     logGroupName: "/MyRestApi/logs",
     removalPolicy: RemovalPolicy.DESTROY,
     retention: RetentionDays.FIVE_DAYS
   })



   const myRestApi = new RestApi(this, "MyRestApi", {
     restApiName: "my-rest-api",
     description: "created my own rest api name",
     deploy: true,
     deployOptions: {
       loggingLevel: MethodLoggingLevel.INFO,
       stageName: "dev",
       tracingEnabled: true,
       accessLogFormat: AccessLogFormat.jsonWithStandardFields(),
       accessLogDestination: new LogGroupLogDestination(restApiLogs)
     }
   });

   const options = {
    credentialsRole: apigwRole,
    requestParameters: {
      "integration.request.header.X-Amz-Target": "'AWSEvents.PutEvents'",
      "integration.request.header.Content-Type": "'application/x-amz-json-1.1'"
    },
    requestTemplates: {
      "application/json": `#set($language=$input.params('language'))\n{"Entries": [{"Source": "com.amazon.alexa.$language", "Detail": "$util.escapeJavaScript($input.body)", "Resources": ["resource1", "resource2"], "DetailType": "myDetailType", "EventBusName": "${bus.eventBusName}"}]}`
    },
    integrationResponses: [{
      statusCode: "200",
      responseTemplates: {"application/json": ""}
    }]
  }

  const languageResource = myRestApi.root.addResource("{language}");

  languageResource.addMethod("POST", new Integration({
     type: IntegrationType.AWS,
     uri: `arn:aws:apigateway:${process.env.AWS_DEFAULT_REGION}:events:path//`,
     integrationHttpMethod: "POST",
     options: options
  }),
  {
    methodResponses: [{statusCode: "200"}],
    requestModels: {"application/json": model.getModel(this, myRestApi) },
      requestValidator: new RequestValidator(this, "myValidator", {
        restApi: myRestApi,
        validateRequestBody: true
      })
  })
  
  /* 
  myRestApi.root.addMethod("POST", new Integration({
     type: IntegrationType.AWS,
     uri: `arn:aws:apigateway:${process.env.AWS_DEFAULT_REGION}:events:path//`,
     integrationHttpMethod: "POST",
     options: options
   }),
   {
     methodResponses: [{statusCode: "200"}]
   })
   */
  }
}
