const { Stack, Duration } = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const cloudwatch = require("aws-cdk-lib/aws-cloudwatch");
const actions = require("aws-cdk-lib/aws-cloudwatch-actions");

class McServerStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "McServerVpc", {
      maxAzs: 1,
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "PublicSubnet",
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    const securityGroup = new ec2.SecurityGroup(this, "McServerSg", {
      vpc: vpc,
      description:
        "Allows inbound traffic on port 22 for SSH access and port 25565 for Minecraft server connections",
      allowAllOutbound: true,
    });
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22));
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(25565));
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.udp(19132));

    const keyPair = ec2.KeyPair.fromKeyPairAttributes(this, "McServerKeyPair", {
      keyPairName: "McServerKeyPair",
      type: ec2.KeyPairType.RSA,
    });

    const instance = new ec2.Instance(this, "McServerEc2", {
      vpc: vpc,

      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },

      securityGroup: securityGroup,

      keyPair: keyPair,

      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE4_GRAVITON,
        ec2.InstanceSize.LARGE
      ),

      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023,
        cpuType: ec2.AmazonLinuxCpuType.ARM_64,
      }),

      associatePublicIpAddress: true,
    });

    const alarm = new cloudwatch.Alarm(this, "CpuUtilizationAlarm", {
      alarmName: "cpu-mon",
      alarmDescription: "Alarm when CPU usage drop below 15%",
      metric: new cloudwatch.Metric({
        namespace: "AWS/EC2",
        metricName: "CPUUtilization",
        dimensionsMap: {
          InstanceId: instance.instanceId,
        },
        statistic: "Average",
        period: Duration.minutes(3),
      }),
      threshold: 15,
      comparisonOperator:
        cloudwatch.ComparisonOperator.LESS_THAN_OR_EQUAL_TO_THRESHOLD,
      evaluationPeriods: 5,
    });
    alarm.addAlarmAction(new actions.Ec2Action(actions.Ec2InstanceAction.STOP));
  }
}
module.exports = { McServerStack };
