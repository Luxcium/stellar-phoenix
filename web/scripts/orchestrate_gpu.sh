#!/bin/bash
set -euo pipefail

# Shared configuration and metrics directory settings
CONFIG_FILE="${CONFIG_FILE:-config.yaml}"
METRICS_DIR="/tmp/metrics"

function check_prerequisites() {
    command -v aws >/dev/null 2>&1 || { echo "AWS CLI required"; exit 1; }
    command -v ssh >/dev/null 2>&1 || { echo "SSH required"; exit 1; }
}

function setup_shared_resources() {
    mkdir -p "$METRICS_DIR"
    cat > "$CONFIG_FILE" <<EOF
version: "1.0"
shared:
  metrics_dir: "${METRICS_DIR}"
  log_level: "INFO"
EOF
}

function setup_instance() {
    local instance_id=$1
    local key_name=$2

    PUBLIC_DNS=$(aws ec2 describe-instances \
        --instance-ids "$instance_id" \
        --query 'Reservations[0].Instances[0].PublicDnsName' \
        --output text)

    echo "Waiting for instance to be ready..."
    sleep 30

    # Copy files and configuration to the instance
    scp -i "${key_name}.pem" \
        ./run_gpu_task.py \
        ./monitor_gpu.sh \
        "${CONFIG_FILE}" \
        "ubuntu@${PUBLIC_DNS}:/home/ubuntu/"

    # Execute setup commands on the instance
    ssh -i "${key_name}.pem" "ubuntu@${PUBLIC_DNS}" "
        sudo apt update
        sudo ubuntu-drivers autoinstall
        nvidia-smi
        python3 -c 'import torch; print(torch.cuda.is_available())'
        mkdir -p ${METRICS_DIR}
        chmod 755 ${METRICS_DIR}
    "
}

function main() {
    if [ "$#" -ne 2 ]; then
        echo "Usage: $0 <instance-id> <key-name>"
        exit 1
    fi

    check_prerequisites
    setup_shared_resources
    setup_instance "$1" "$2"
}

main "$@"
