#!/usr/bin/env bash
set -euo pipefail

# Load operator credentials
DEPLOY_ENV="$HOME/.kannegiesser/deploy.env"
if [ -f "$DEPLOY_ENV" ]; then
  set -a && source "$DEPLOY_ENV" && set +a
fi

if [ -z "${NORTHFLANK_API_TOKEN:-}" ]; then
  echo "ERROR: NORTHFLANK_API_TOKEN not set. Add it to ~/.kannegiesser/deploy.env"
  exit 1
fi

NF_API="https://api.northflank.com/v1"
PROJECT_NAME="service-contracts"
SERVICE_NAME="service-contracts-web"
GITHUB_ORG="EtechInc"
GITHUB_REPO="service-contracts"
BRANCH="main"
PLAN="nf-compute-10"
PORT=80
REGION="us-central"

# Load app env vars (build-time only for static Vite site)
ENV_FILE=".env"
for f in .env.local .env.production.local .env.production .env; do
  if [ -f "$f" ]; then ENV_FILE="$f"; break; fi
done

declare -A BUILD_ARGS
while IFS= read -r line || [ -n "$line" ]; do
  [[ "$line" =~ ^#.*$ || -z "$line" ]] && continue
  key="${line%%=*}"
  val="${line#*=}"
  val="${val%\"}" ; val="${val#\"}" ; val="${val%\'}" ; val="${val#\'}"
  # Skip operator tokens
  case "$key" in
    NORTHFLANK_API_TOKEN|CLOUDFLARE_API_TOKEN|CLOUDFLARE_ZONE_ID) continue ;;
  esac
  BUILD_ARGS["$key"]="$val"
done < "$ENV_FILE"

# ── Redeploy shortcut ──────────────────────────────────────────────────────────
if [ "${1:-}" = "redeploy" ]; then
  echo "→ Fetching project/service IDs..."
  PROJECT_ID=$(curl -sf -H "Authorization: Bearer $NORTHFLANK_API_TOKEN" \
    "$NF_API/projects" | python3 -c "
import sys,json
for p in json.load(sys.stdin)['data']['projects']:
  if p['name'] == '$PROJECT_NAME': print(p['id']); break
")
  SERVICE_ID=$(curl -sf -H "Authorization: Bearer $NORTHFLANK_API_TOKEN" \
    "$NF_API/projects/$PROJECT_ID/services" | python3 -c "
import sys,json
for s in json.load(sys.stdin)['data']['services']:
  if s['name'] == '$SERVICE_NAME': print(s['id']); break
")
  SHA=$(git rev-parse HEAD)
  echo "→ Triggering rebuild at $SHA..."
  curl -sf -X POST \
    -H "Authorization: Bearer $NORTHFLANK_API_TOKEN" \
    -H "Content-Type: application/json" \
    "$NF_API/projects/$PROJECT_ID/services/$SERVICE_ID/build" \
    -d "{\"commitSha\": \"$SHA\"}" | python3 -c "import sys,json; print(json.load(sys.stdin))"
  echo "✓ Rebuild triggered. Watch: https://app.northflank.com/s/team/projects/$PROJECT_ID/services/$SERVICE_ID"
  exit 0
fi

# ── Full deploy ────────────────────────────────────────────────────────────────
echo "→ Creating Northflank project '$PROJECT_NAME'..."
curl -sf -X PUT \
  -H "Authorization: Bearer $NORTHFLANK_API_TOKEN" \
  -H "Content-Type: application/json" \
  "$NF_API/projects" \
  -d "{\"name\": \"$PROJECT_NAME\", \"description\": \"Service Contracts Dashboard\", \"region\": \"$REGION\", \"color\": \"#2563eb\"}" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print('Project ID:', d['data']['id'])"

PROJECT_ID=$(curl -sf -H "Authorization: Bearer $NORTHFLANK_API_TOKEN" \
  "$NF_API/projects" | python3 -c "
import sys,json
for p in json.load(sys.stdin)['data']['projects']:
  if p['name'] == '$PROJECT_NAME': print(p['id']); break
")
echo "  Project ID: $PROJECT_ID"

echo "→ Creating combined service '$SERVICE_NAME'..."
SERVICE_RESP=$(curl -sf -X POST \
  -H "Authorization: Bearer $NORTHFLANK_API_TOKEN" \
  -H "Content-Type: application/json" \
  "$NF_API/projects/$PROJECT_ID/services/combined" \
  -d "{
    \"name\": \"$SERVICE_NAME\",
    \"billing\": {\"deploymentPlan\": \"$PLAN\"},
    \"deployment\": {\"instances\": 1},
    \"vcsData\": {
      \"projectUrl\": \"https://github.com/$GITHUB_ORG/$GITHUB_REPO\",
      \"projectType\": \"github\",
      \"accountLogin\": \"$GITHUB_ORG\",
      \"projectBranch\": \"$BRANCH\"
    },
    \"buildSettings\": {
      \"dockerfile\": {\"dockerFilePath\": \"/Dockerfile\", \"dockerWorkDir\": \"/\"}
    },
    \"ports\": [{\"name\": \"http\", \"internalPort\": $PORT, \"public\": true, \"protocol\": \"HTTP\"}]
  }")

SERVICE_ID=$(echo "$SERVICE_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['id'])")
echo "  Service ID: $SERVICE_ID"

echo "→ Syncing build arguments..."
BUILD_ARGS_JSON=$(python3 -c "
import json, sys
args = {}
$(for k in "${!BUILD_ARGS[@]}"; do echo "args['$k'] = '''${BUILD_ARGS[$k]}'''"; done)
print(json.dumps({'buildArguments': args}))
")
curl -sf -X POST \
  -H "Authorization: Bearer $NORTHFLANK_API_TOKEN" \
  -H "Content-Type: application/json" \
  "$NF_API/projects/$PROJECT_ID/services/$SERVICE_ID/build-arguments" \
  -d "$BUILD_ARGS_JSON" > /dev/null
echo "  Build args set."

SHA=$(git rev-parse HEAD)
echo "→ Triggering first build at $SHA..."
curl -sf -X POST \
  -H "Authorization: Bearer $NORTHFLANK_API_TOKEN" \
  -H "Content-Type: application/json" \
  "$NF_API/projects/$PROJECT_ID/services/$SERVICE_ID/build" \
  -d "{\"commitSha\": \"$SHA\"}" > /dev/null

echo ""
echo "✓ Deploy triggered!"
echo "  Dashboard: https://app.northflank.com/s/team/projects/$PROJECT_ID/services/$SERVICE_ID"
echo "  Run './deploy.sh redeploy' for future deploys"
