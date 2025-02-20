#!/usr/bin/env bash

set -eo pipefail

trap 'sf plugins unlink' EXIT
sf plugins link

targetOrgUsername="$(node -pe 'JSON.parse(fs.readFileSync(0, "utf8")).result.username' < <(sf org display --json))"
echo "Grepping debug log for SFDX_TARGET_ORG_USERNAME=\"${targetOrgUsername}\""

export DEBUG="*:sfdx-predeploy-hook-org-env:*"
sf project deploy start --dry-run -d force-app --dev-debug 2>&1 \
    | grep "SFDX_TARGET_ORG_USERNAME=\"${targetOrgUsername}\""
