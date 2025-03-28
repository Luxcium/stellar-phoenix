# Stage 4: Monitoring and Validation

## Step 4.1: Real-Time Monitoring

### GPU Metrics

```bash
# Real-time GPU stats
watch -n 1 nvidia-smi

# Get GPU utilization
nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader
```

### System Metrics

```bash
# CPU and memory usage
top -b -n 1

# Disk usage
df -h
```

## Step 4.2: CloudWatch Integration

```bash
# Enable detailed monitoring
aws ec2 monitor-instances --instance-ids $INSTANCE_ID
```
