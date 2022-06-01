import { Stack } from "aws-cdk-lib";
import { IRestApi, JsonSchemaType, JsonSchemaVersion, Model } from "aws-cdk-lib/aws-apigateway";



export function getModel(scope: Stack, restAPI: IRestApi): Model {
  return new Model(scope, "MyModel", {
    restApi: restAPI,
    contentType: "application/json",
    schema: {
      schema: JsonSchemaVersion.DRAFT7,
      title: "User",
      type: JsonSchemaType.OBJECT,
      properties: {
          "UserID": {
              type: JsonSchemaType.STRING,
              description: "This is the UserID Description"
          },
          "LanguageName": {
              type: JsonSchemaType.STRING,
              pattern: '^[a-z]{2}-[a-z]{2}$'
          }
      },
      required: ["UserID", "LanguageName"]
    }
  });
}