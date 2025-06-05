# Stage 3: Execution of GPU-Enabled Workload

## Step 3.1: Connect to Instance

```bash
# Get instance public DNS
PUBLIC_DNS=$(aws ec2 describe-instances \
    --instance-ids $INSTANCE_ID \
    --query 'Reservations[0].Instances[0].PublicDnsName' \
    --output text)

# SSH connection
ssh -i "${KEY_NAME}.pem" ubuntu@$PUBLIC_DNS
```

## Step 3.2: Instance Preparation

```bash
# Update package lists
sudo apt update

# Verify system requirements
free -h
df -h
lscpu
```

## Step 3.3: Validate GPU Access

```bash
# Verify NVIDIA drivers
nvidia-smi

# Test CUDA availability
python3 -c "import torch; print(torch.cuda.is_available())"
```

## Step 3.4: Environment Validation

```bash
# Check CUDA version
nvcc --version

# Verify Python environment
python3 -m pip list | grep -E "torch|cuda"

# Test GPU memory
python3 -c "import torch; print(f'GPU Memory: {torch.cuda.get_device_properties(0).total_memory/1e9:.2f}GB')"
```

## Step 3.5: Execute Workload

```bash
# Run GPU task
python3 /home/ubuntu/run_gpu_task.py
```

## Step 3.6: Monitoring and Logs

```bash
# Monitor GPU usage
watch -n 1 nvidia-smi

# Check system logs
tail -f /var/log/syslog | grep cuda
```

## Step 3.7: Cleanup

```bash
# Stop running processes
pkill -f run_gpu_task.py

# Clear GPU memory
nvidia-smi --gpu-reset
```

## Troubleshooting

If GPU is not detected:

```bash
sudo ubuntu-drivers autoinstall
sudo systemctl restart nvidia-persistenced
```
