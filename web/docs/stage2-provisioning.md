# Stage 2: Automated GPU Instance Provisioning

## Step 2.1: Define Instance Parameters

### AMI Selection

```bash
# Get latest Deep Learning AMI ID
AMI_ID=$(aws ec2 describe-images \
    --filters "Name=name,Values=Deep Learning AMI GPU*" \
    --query 'sort_by(Images, &CreationDate)[-1].ImageId' \
    --output text)
```

### Instance Configuration

```bash
INSTANCE_TYPE="g4dn.xlarge"
KEY_NAME="gpu-instance-key"
SECURITY_GROUP_ID="sg-xxxxxx"
SUBNET_ID="subnet-xxxxxx"
```

## Step 2.2: Launch Instance

### Launch Command

```bash
INSTANCE_ID=$(aws ec2 run-instances \
    --image-id $AMI_ID \
    --instance-type $INSTANCE_TYPE \
    --key-name $KEY_NAME \
    --security-group-ids $SECURITY_GROUP_ID \
    --subnet-id $SUBNET_ID \
    --query 'Instances[0].InstanceId' \
    --output text)
```

### Wait for Instance Ready

```bash
aws ec2 wait instance-running --instance-ids $INSTANCE_ID
```
