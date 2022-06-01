import { Duration, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { InstanceClass, InstanceSize, InstanceType, Peer, Port, SecurityGroup, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { Effect, ManagedPolicy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { CfnDBCluster, Credentials, DatabaseCluster, DatabaseClusterEngine, DatabaseInstance, DatabaseInstanceEngine, DatabaseProxy, PostgresEngineVersion, ProxyTarget, ServerlessCluster } from "aws-cdk-lib/aws-rds";
import { ParameterTier, ParameterType, StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { DatabaseStackProps } from "./props/database-stack-props";

export class DatabaseStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps, dbProps?: DatabaseStackProps) {
        super(scope, id, props);

        const vpc = Vpc.fromLookup(this, 'vpc', {
            isDefault: true,
            vpcId: dbProps?.vpcId
        })


        const dbSecurityGroup = new SecurityGroup(this, 'rds-security-group', {
            vpc: vpc,
            securityGroupName: 'rds-security-group',
            allowAllOutbound: true
        });

        const dbProxySecurityGroup = new SecurityGroup(this, 'rds-proxy-security-group', {
            vpc: vpc,
            securityGroupName: 'rds-proxy-security-group',
            allowAllOutbound: true
        });

        dbSecurityGroup.addIngressRule(dbProxySecurityGroup, Port.tcp(5432));


        const dbInstance = new DatabaseInstance(this, 'db-instance', {
            vpc,
            vpcSubnets: {
                 //Added for testing purposes :Prod shouldn't have this setup should be in PRIVATE/ISOLATED subnet
                subnetType: SubnetType.PUBLIC,
              },
            engine: DatabaseInstanceEngine.postgres({
              version: PostgresEngineVersion.VER_13_6
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
            securityGroups:[dbSecurityGroup],
            //for testing purposed added it to true
            publiclyAccessible: true,
          });

          //Added for testing purposes :Prod shouldn't have this setup
          dbInstance.connections.allowFromAnyIpv4(Port.tcp(5432));

          const secret = dbInstance.secret;
          const proxy = new DatabaseProxy(this, 'rds-database-proxy', {
                 dbProxyName: dbInstance.instanceIdentifier+'-'+'proxy',
                 secrets: [secret!],
                 debugLogging: false,
                 vpc: vpc,
                 proxyTarget: ProxyTarget.fromInstance(dbInstance),
                 securityGroups: [dbProxySecurityGroup]
          });

          const connectToDbPolicy = new ManagedPolicy(this, "connect-to-db-policy", {
            managedPolicyName: 'connect-to-db-policy',
            statements:[new PolicyStatement({
                sid: 'grantConnect',
                effect: Effect.ALLOW,
                resources: [proxy.dbProxyArn],
                actions: ['rds-db:connect']
            })]
        });
    

        new StringParameter(this,  'db-security-group-id-output', {
            parameterName: 'dbSecurityGroupId',
            stringValue: dbSecurityGroup.securityGroupId,
            description: 'database security group id',
            type: ParameterType.STRING,
            tier: ParameterTier.STANDARD
        })

        new StringParameter(this,  'db-proxy-security-group-id-output', {
            parameterName: 'dbProxySecurityGroupId',
            stringValue: dbProxySecurityGroup.securityGroupId,
            description: 'database proxy security group id',
            type: ParameterType.STRING,
            tier: ParameterTier.STANDARD
        })

        new StringParameter(this,  'db-secret-name-output', {
            parameterName: 'primaryDbSecretName',
            stringValue: secret!.secretName,
            description: 'the database secret name',
            type: ParameterType.STRING,
            tier: ParameterTier.STANDARD
        })

        new StringParameter(this,  'db-secret-arn-output', {
            parameterName: 'primaryDbFullArn',
            stringValue: secret!.secretFullArn!,
            description: 'the database secret full arn',
            type: ParameterType.STRING,
            tier: ParameterTier.STANDARD
        })

        new StringParameter(this,  'db-instance-identifier-output', {
            parameterName: 'primaryDbInstanceIdentifier',
            stringValue: dbInstance.instanceIdentifier,
            description: 'the database instance identifier name',
            type: ParameterType.STRING,
            tier: ParameterTier.STANDARD
        })

        new StringParameter(this,  'db-instance-endpoint-url-output', {
            parameterName: 'primaryDbInstanceEndpointURL',
            stringValue: dbInstance.dbInstanceEndpointAddress + ":" + dbInstance.dbInstanceEndpointPort + '/postplatformdb',
            description: 'the database end point url',
            type: ParameterType.STRING,
            tier: ParameterTier.STANDARD
        })

        new StringParameter(this,  'db-connect-policy-arn-output', {
            parameterName: 'primaryDbConnectPolicyArn',
            stringValue: connectToDbPolicy.managedPolicyArn,
            description: 'the database managed policy arn',
            type: ParameterType.STRING,
            tier: ParameterTier.STANDARD
        })


        new StringParameter(this,  'db-instance-proxy-endpoint-output', {
            parameterName: 'primaryDbProxyEndpointURL',
            stringValue: proxy.endpoint,
            description: 'the database proxy endpoint url',
            type: ParameterType.STRING,
            tier: ParameterTier.STANDARD
        })

        new StringParameter(this,  'db-instance-proxy-arn-output', {
            parameterName: 'primaryDbProxyArn',
            stringValue: proxy.dbProxyArn,
            description: 'the database proxy Arn',
            type: ParameterType.STRING,
            tier: ParameterTier.STANDARD
        })

        new StringParameter(this,  'db-instance-proxy-name', {
            parameterName: 'primaryDbProxyName',
            stringValue: proxy.dbProxyName,
            description: 'the database proxy Name',
            type: ParameterType.STRING,
            tier: ParameterTier.STANDARD
        })

      
    }

}