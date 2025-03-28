# Installation Guide

## Prerequisites

1. AWS Account Setup

```bash
# Install AWS CLI
pip install awscli

# Configure AWS credentials
aws configure
```

## System Requirements

- Ubuntu 20.04 or later
- NVIDIA GPU support
- Python 3.8+

## Installation Steps

1. Clone Repository

```bash
git clone https://github.com/your-org/nexo-owl-project.git
cd nexo-owl-project
```

2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

3. Configure AWS Permissions

```bash
# Ensure your IAM user has these policies:
# - AmazonEC2FullAccess
# - AmazonS3ReadOnlyAccess
```

4. Setup SSH Keys

```bash
# Generate new key pair
aws ec2 create-key-pair --key-name nexo-owl-key \
    --query 'KeyMaterial' --output text > nexo-owl-key.pem
chmod 400 nexo-owl-key.pem
```

## Validation

Run the validation script:

```bash
./scripts/orchestrate_gpu.sh --validate
```
