# Minecraft Server Stack CDK Project

This project uses AWS CDK (Cloud Development Kit) to deploy an EC2 instance for hosting a Minecraft server. It sets up the necessary networking, security, and monitoring resources, including a CPU utilization alarm that stops the instance when CPU usage drops below a defined threshold.

## Prerequisites

Before you deploy the CDK stack, ensure that you have the following:

1. AWS Account and proper credentials configured.
2. AWS CDK installed globally
3. Key Pair:
   Ensure that you have a key pair named `McServerKeyPair` available in your AWS account.
4. Node.js installed on your machine.

## How to Deploy

### Step 1: Install dependencies

First, install the required dependencies by running:

```
npm install
```

### Step 2: Synthesize the CloudFormation Template

Before deploying the stack, you can synthesize the CloudFormation template with:

```
cdk synth
```

### Step 3: Deploy the Stack

To deploy the stack to your AWS account, run the following command:

```
cdk deploy
```

This will create an EC2 instance for your Minecraft server along with the necessary resources, such as VPC, Security Group, and CloudWatch alarm.

## Resources Created

- **VPC**: A Virtual Private Cloud (VPC) with a public subnet.
- **Security Group**: A security group allowing inbound traffic on port 22 (for SSH), 25565 (Minecraft server connections for Java edition), and 19132 (UDP if you want to setup the server to also be accessible for Bedrock edition).
- **EC2 Instance**: A burstable EC2 instance (Graviton `t4g.large`) running Amazon Linux 2023.
- **CloudWatch Alarm**: A CloudWatch alarm that monitors the CPU utilization and stops the instance if it drops below 15%.

## Alarm Details

- **Alarm Name**: `cpu-mon`
- **Alarm Action**: Stops the EC2 instance when the CPU utilization drops below 15% for 5 evaluation periods of 3 minutes each.

This will create an EC2 instance for your Minecraft server along with the necessary resources, such as VPC, Security Group, and CloudWatch alarm.

## Resources Created

- **VPC**: A Virtual Private Cloud (VPC) with a public subnet.
- **Security Group**: A security group allowing inbound traffic on port 22 (for SSH), 25565 (Minecraft server connections), and 19132 (UDP).
- **EC2 Instance**: A burstable EC2 instance (Graviton `t4g.large`) running Amazon Linux 2023.
- **CloudWatch Alarm**: A CloudWatch alarm that monitors the CPU utilization and stops the instance if it drops below 15%.

## Alarm Details

- **Alarm Name**: `cpu-mon`
- **Alarm Action**: Stops the EC2 instance when the CPU utilization drops below 15% for 5 evaluation periods of 3 minutes each.

## Automatic Shutdown

As mentioned, the EC2 instance will turn off automatically based on CPU usage. If no users are accessing the Minecraft server, the CPU usage will be low, causing the server to turn off. You can start it again through the AWS Web Console manually.

Alternatively, I recommend creating a simple script with your favorite programming language (e.g., Python with `boto3`) to start the server automatically.

## Cleanup

To clean up the resources created by this stack, you can run the following command:

```
cdk destroy
```
