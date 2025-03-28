#!/bin/bash
set -euo pipefail

# Ensure yq and nvidia-smi are available
command -v yq >/dev/null 2>&1 || { echo "yq is required. Please install yq."; exit 1; }
command -v nvidia-smi >/dev/null 2>&1 || { echo "nvidia-smi is required. Ensure NVIDIA drivers are installed."; exit 1; }

CONFIG_FILE="${CONFIG_FILE:-config.yaml}"
if [ -f "$CONFIG_FILE" ]; then
    METRICS_DIR=$(yq eval '.monitoring.log_dir' "$CONFIG_FILE")
    INTERVAL=$(yq eval '.gpu.metrics_interval' "$CONFIG_FILE")
fi

LOG_FILE="${METRICS_DIR:-/tmp/metrics}/gpu_monitoring.log"
INTERVAL="${INTERVAL:-5}"

function export_prometheus_metrics() {
    local PROM_DIR="${METRICS_DIR}/prometheus"
    mkdir -p "$PROM_DIR"
    if ! nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader > /dev/null; then
        echo "Error: Unable to query GPU metrics." >&2
        return 1
    fi
    while read -r line; do
        echo "# HELP gpu_utilization Current GPU utilization" > "$PROM_DIR/metrics"
        echo "# TYPE gpu_utilization gauge" >> "$PROM_DIR/metrics"
        echo "gpu_utilization{device=\"$line\"}" >> "$PROM_DIR/metrics"
    done < <(nvidia-smi --query-gpu=utilization.gpu --format=csv,noheader)
}

function monitor_gpu() {
    echo "Starting GPU monitoring, logging to $LOG_FILE"
    while true; do
        if ! date >> "$LOG_FILE"; then
            echo "Warning: Failed to write timestamp to log" >&2
        fi
        if ! nvidia-smi --query-gpu=timestamp,name,temperature.gpu,utilization.gpu,memory.used,memory.total \
                  --format=csv,noheader >> "$LOG_FILE"; then
            echo "Error: Failed to query NVIDIA metrics" >&2
        fi
        echo "---" >> "$LOG_FILE"
        sleep "$INTERVAL"
        export_prometheus_metrics || echo "Prometheus metrics export failed" >&2
    done
}

function cleanup() {
    echo "Stopping GPU monitoring"
    exit 0
}

trap cleanup SIGINT SIGTERM
monitor_gpu
