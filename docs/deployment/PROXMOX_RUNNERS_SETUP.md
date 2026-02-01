# Ephemeral Self-Hosted GitHub Runners on Proxmox

This guide shows how to set up ephemeral GitHub Actions runners on your Proxmox server for faster, cost-effective CI/CD.

## Benefits

- 🚀 **Faster builds**: Local hardware performance
- 💰 **Cost savings**: No GitHub Actions minutes usage
- 🔒 **Security**: Isolated ephemeral environments
- 🎛️ **Control**: Custom tools, caching, environment
- 📈 **Scalability**: Multiple parallel runners

## Prerequisites

- Proxmox VE server with sufficient resources
- GitHub repository with admin access
- Basic Proxmox API knowledge
- Ubuntu 22.04 ISO downloaded to Proxmox

## Architecture Overview

```
GitHub Webhook → Proxmox API → Clone VM Template → Register Runner → Execute Job → Destroy VM
```

## Implementation Options

### Option 1: Simple VM-based Runners (Recommended)

**Pros**: Full isolation, clean environment per job
**Cons**: Slightly slower startup (~30-60s)
**Best for**: Production workloads, security-sensitive projects

### Option 2: Docker-based Runners

**Pros**: Fast startup (~5-10s), resource efficient
**Cons**: Less isolation, shared kernel
**Best for**: Development, testing, simple builds

## Quick Setup (Option 1: VM-based)

### Step 1: Create VM Template

```bash
# 1. Create Ubuntu 22.04 VM in Proxmox
# 2. Install dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git docker.io nodejs npm

# 3. Install GitHub Actions runner
mkdir actions-runner && cd actions-runner
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# 4. Create runner setup script
sudo tee /usr/local/bin/setup-runner.sh << 'EOF'
#!/bin/bash
set -e

REPO_URL="$1"
RUNNER_TOKEN="$2"
RUNNER_NAME="proxmox-runner-$(date +%s)"

cd /home/ubuntu/actions-runner

# Configure runner
./config.sh --url "$REPO_URL" --token "$RUNNER_TOKEN" --name "$RUNNER_NAME" --work _work --replace --ephemeral

# Run runner (will exit after one job)
./run.sh
EOF

chmod +x /usr/local/bin/setup-runner.sh

# 5. Shutdown and convert to template
sudo shutdown -h now
# In Proxmox: Right-click VM → Convert to Template
```

### Step 2: Create Runner Management Script

```bash
# On your Proxmox host, create runner management script
sudo tee /usr/local/bin/github-runner-manager.sh << 'EOF'
#!/bin/bash

TEMPLATE_ID="9000"  # Your template VM ID
REPO_URL="https://github.com/andreirepo/qa-portfolio"
GITHUB_TOKEN="your_github_token"  # GitHub Personal Access Token

# Function to get runner registration token
get_runner_token() {
    curl -s -X POST \
        -H "Authorization: token $GITHUB_TOKEN" \
        -H "Accept: application/vnd.github.v3+json" \
        "$REPO_URL/actions/runners/registration-token" | \
        jq -r '.token'
}

# Function to create and start ephemeral runner
start_runner() {
    local runner_token=$(get_runner_token)
    local vm_id=$((10000 + RANDOM % 1000))

    echo "Creating runner VM $vm_id..."

    # Clone template
    qm clone $TEMPLATE_ID $vm_id --name "github-runner-$vm_id"

    # Start VM
    qm start $vm_id

    # Wait for VM to boot
    sleep 30

    # Get VM IP (adjust network interface as needed)
    local vm_ip=$(qm guest cmd $vm_id network-get-interfaces | jq -r '.[] | select(.name=="eth0") | .["ip-addresses"][] | select(.["ip-address-type"]=="ipv4") | .["ip-address"]')

    # SSH and start runner (you'll need SSH key setup)
    ssh ubuntu@$vm_ip "/usr/local/bin/setup-runner.sh '$REPO_URL' '$runner_token'"

    # Cleanup VM after runner completes
    sleep 10
    qm stop $vm_id
    qm destroy $vm_id
}

# Start runner
start_runner
EOF

chmod +x /usr/local/bin/github-runner-manager.sh
```

### Step 3: Update GitHub Actions Workflow

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  test:
    runs-on: self-hosted # Use your Proxmox runners

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      # ... rest of your workflow
```

## Advanced Setup (Option 2: Docker-based)

### Step 1: Docker Runner Setup

```bash
# Create docker-compose.yml for GitHub runner
version: '3.8'
services:
  github-runner:
    image: myoung34/github-runner:latest
    environment:
      REPO_URL: https://github.com/andreirepo/qa-portfolio
      RUNNER_NAME: proxmox-docker-runner
      ACCESS_TOKEN: ${GITHUB_TOKEN}
      RUNNER_WORKDIR: /tmp/runner/work
      EPHEMERAL: true
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /tmp/runner:/tmp/runner
    restart: unless-stopped
```

### Step 2: Webhook Integration

```javascript
// webhook-server.js - Simple webhook to trigger runners
const express = require('express')
const { exec } = require('child_process')

const app = express()
app.use(express.json())

app.post('/webhook', (req, res) => {
  if (req.body.action === 'queued') {
    console.log('Starting new runner for job:', req.body.workflow_job.id)

    // Start new ephemeral runner
    exec('/usr/local/bin/github-runner-manager.sh', (error, stdout, stderr) => {
      if (error) {
        console.error('Error starting runner:', error)
      } else {
        console.log('Runner started:', stdout)
      }
    })
  }

  res.status(200).send('OK')
})

app.listen(3000, () => {
  console.log('Webhook server listening on port 3000')
})
```

## Security Considerations

### Network Isolation

```bash
# Create isolated VLAN for runners
# Restrict internet access to necessary domains only
# Use firewall rules to limit communication
```

### Secrets Management

```bash
# Never store GitHub tokens in plain text
# Use Proxmox secret storage or external vault
# Rotate tokens regularly
```

### VM Security

```bash
# Use minimal Ubuntu installation
# Disable unnecessary services
# Implement automatic security updates
```

## Monitoring and Logging

### Proxmox Integration

```bash
# Monitor VM resource usage
# Set up alerts for failed runners
# Log runner lifecycle events
```

### GitHub Integration

```bash
# Monitor runner registration/deregistration
# Track job execution times
# Alert on runner failures
```

## Cost Analysis

### Current GitHub Actions (estimated)

- **Build time**: ~5-8 minutes per run
- **Runs per month**: ~100 (assuming daily pushes)
- **Cost**: ~$20-40/month for private repos

### Self-hosted Proxmox

- **Hardware cost**: One-time (existing Proxmox)
- **Electricity**: ~$5-10/month
- **Maintenance**: Minimal
- **Savings**: ~$15-35/month

## Troubleshooting

### Common Issues

**Runner not registering:**

```bash
# Check GitHub token permissions
# Verify network connectivity
# Check runner logs in VM
```

**VM creation fails:**

```bash
# Check Proxmox storage space
# Verify template exists
# Check Proxmox API permissions
```

**Slow startup times:**

```bash
# Use SSD storage for VMs
# Optimize VM template size
# Consider Docker-based runners
```

## Next Steps

1. **Start with Docker approach** (simpler, faster setup)
2. **Test with your current workflow**
3. **Monitor performance and reliability**
4. **Migrate to VM-based if needed**
5. **Add webhook automation**
6. **Implement monitoring and alerts**

## Resources

- [GitHub Self-hosted Runners](https://docs.github.com/en/actions/hosting-your-own-runners)
- [Proxmox API Documentation](https://pve.proxmox.com/pve-docs/api-viewer/)
- [Docker GitHub Runner](https://github.com/myoung34/docker-github-actions-runner)

---

**Estimated setup time**: 2-4 hours for basic implementation
**Maintenance**: ~1 hour/month
**ROI**: 2-3 months for cost savings
