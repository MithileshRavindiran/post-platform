import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { InstanceClass, InstanceSize, InstanceType, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { CfnDBCluster, Credentials, DatabaseCluster, DatabaseClusterEngine, DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion, ServerlessCluster } from "aws-cdk-lib/aws-rds";
import { Construct } from "constructs";
import { DatabaseStackProps } from "./props/database-stack-props";

export class DatabaseStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps, dbProps?: DatabaseStackProps) {
        super(scope, id, props);

        const vpc = Vpc.fromLookup(this, 'vpc', {
            isDefault: true,
            vpcId: dbProps?.vpcId
        })


        const dbInstance = new DatabaseInstance(this, 'db-instance', {
            vpc,
            vpcSubnets: {
                subnetType: SubnetType.PUBLIC,
              },
            engine: DatabaseInstanceEngine.postgres({
              version: PostgresEngineVersion.VER_14
            }),
            instanceType: InstanceType.of(
              InstanceClass.BURSTABLE3,
              InstanceSize.MICRO,
            ),
            credentials: Credentials.fromGeneratedSecret('postgres'),
            multiAz: false,
            allocatedStorage: 100,
            maxAllocatedStorage: 105,
            allowMajorVersionUpgrade: false,
            autoMinorVersionUpgrade: true,
            backupRetention: Duration.days(0),
            deleteAutomatedBackups: true,
            removalPolicy: RemovalPolicy.DESTROY,
            deletionProtection: false,
            databaseName: 'postplatformdb',
            //for testing purposed added it to true
            publiclyAccessible: true,
          });
      
    }

}