# Stage 6: Finalization and Reporting

## Step 6.1: Execution Summary

### Performance Metrics

- Instance Type: ${INSTANCE_TYPE}
- Runtime Duration: $(runtime_duration)
- GPU Utilization: $(gpu_utilization)%

## Step 6.2: Cost Analysis

```bash
# Get instance usage cost
aws ce get-cost-and-usage \
    --time-period Start=$(start_date),End=$(end_date) \
    --granularity DAILY \
    --metrics "BlendedCost" \
    --filter '{"Dimensions": {"Key": "INSTANCE_ID","Values": ["'$INSTANCE_ID'"]}}'
```

## Step 6.3: Documentation Update

- Update run history in CHANGELOG.md
- Record any issues in TROUBLESHOOTING.md
- Update performance benchmarks
