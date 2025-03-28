#!/bin/bash

set -euo pipefail

# Source all stage scripts
source "$(dirname "$0")/stages/stage1_preparation.sh"
source "$(dirname "$0")/stages/stage2_provisioning.sh"
source "$(dirname "$0")/stages/stage3_execution.sh"
source "$(dirname "$0")/stages/stage4_monitoring.sh"
source "$(dirname "$0")/stages/stage5_deprovisioning.sh"
source "$(dirname "$0")/stages/stage6_finalization.sh"
source "$(dirname "$0")/utils/logging.sh"

# Main execution flow
main() {
    log_info "Starting GPU instance orchestration"
    
    execute_stage1_preparation
    INSTANCE_ID=$(execute_stage2_provisioning)
    execute_stage3_execution "$INSTANCE_ID"
    execute_stage4_monitoring "$INSTANCE_ID"
    execute_stage5_deprovisioning "$INSTANCE_ID"
    execute_stage6_finalization "$INSTANCE_ID"
    
    log_info "GPU instance orchestration completed successfully"
}

main "$@"
