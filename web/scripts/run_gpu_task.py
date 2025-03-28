#!/usr/bin/env python3

import json
import logging
import os
import time
from typing import Tuple

import torch
import yaml

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GPUTask:
    def __init__(self):
        self.config = self._load_config()
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self._validate_gpu()

    def _load_config(self) -> dict:
        config_path = os.getenv('GPU_CONFIG', 'config.yaml')
        try:
            if os.path.exists(config_path):
                with open(config_path) as f:
                    config = yaml.safe_load(f)
                    logger.info(f"Configuration loaded from {config_path}: {config}")
                    return config
        except Exception as e:
            logger.error(f"Failed to load config from {config_path}: {e}")
        return {}

    def _validate_gpu(self) -> None:
        if not torch.cuda.is_available():
            raise RuntimeError("CUDA is not available")
        logger.info(f"Using device: {self.device}")
        logger.info(f"GPU Memory: {torch.cuda.get_device_properties(0).total_memory/1e9:.2f}GB")
        # Double validation: run a simple computation
        test_tensor = torch.ones((10, 10), device=self.device)
        if torch.sum(test_tensor).item() != 100:
            raise RuntimeError("GPU test computation failed")
        logger.info("GPU test computation succeeded")

    def run_sample_computation(self, matrix_size: Tuple[int, int] = (5000, 5000)) -> None:
        logger.info(f"Starting matrix multiplication {matrix_size}")
        matrix1 = torch.rand(matrix_size, device=self.device)
        matrix2 = torch.rand(matrix_size, device=self.device)
        start_time = time.time()
        result = torch.matmul(matrix1, matrix2)
        elapsed = time.time() - start_time
        logger.info(f"Computation completed in {elapsed:.2f} seconds")
        logger.info(f"Result shape: {result.shape}")

    def export_metrics(self) -> None:
        metrics = {
            'device': str(self.device),
            'memory_available': float(torch.cuda.get_device_properties(0).total_memory/1e9),
            'cuda_version': torch.version.cuda
        }
        with open('/tmp/gpu_metrics.json', 'w') as f:
            json.dump(metrics, f)

if __name__ == "__main__":
    try:
        task = GPUTask()
        task.run_sample_computation()
    except Exception as e:
        logger.error(f"Error during execution: {str(e)}")
        exit(1)
