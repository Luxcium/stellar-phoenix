# Stage 5: Automated Instance De-Provisioning

## Step 5.1: Pre-Termination Checklist

```bash
# Verify workload completion
ps aux | grep python

# Save output files
aws s3 cp /path/to/results s3://your-bucket/results/
```

## Step 5.2: Instance Termination

```bash
# Terminate instance
aws ec2 terminate-instances --instance-ids $INSTANCE_ID

# Wait for termination
aws ec2 wait instance-terminated --instance-ids $INSTANCE_ID
```
