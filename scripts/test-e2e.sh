#!/usr/bin/env bash

set -eo pipefail

trap 'sfdx plugins unlink' EXIT
sfdx plugins link

targetOrgUsername="$(node -pe 'JSON.parse(fs.readFileSync(0, "utf8")).result.username' < <(sfdx org display --json))"
echo "Grepping debug log for SFDX_TARGET_ORG_USERNAME=\"${targetOrgUsername}\""

export DEBUG="*:sfdx-predeploy-hook-org-env:*"
sfdx force source deploy --checkonly -p force-app 2>&1 \
    | grep "SFDX_TARGET_ORG_USERNAME=\"${targetOrgUsername}\""
