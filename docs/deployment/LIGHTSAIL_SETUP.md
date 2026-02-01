# LightSail Server Setup Guide

This guide walks you through setting up the portfolio on your AWS LightSail instance.

## Quick Setup (Recommended)

### Option 1: One-Command Setup

SSH into your LightSail server and run this single command:

```bash
ssh ubuntu@52.30.210.152
curl -sSL https://raw.githubusercontent.com/YOUR_USERNAME/qa-portfolio/main/scripts/setup-server.sh | bash
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### Option 2: Manual Setup

If you prefer to run the setup manually:

```bash
# 1. SSH into your server
ssh ubuntu@52.30.210.152

# 2. Create directory and clone repository
mkdir -p /home/ubuntu/apps
cd /home/ubuntu/apps
git clone https://github.com/YOUR_USERNAME/qa-portfolio.git

# 3. Run setup script
cd qa-portfolio
chmod +x scripts/setup-server.sh
./scripts/setup-server.sh
```

## Prerequisites

- AWS LightSail instance running Ubuntu (IP: 52.30.210.152)
- Docker and Docker Compose installed
- SSH access to the server
- GitHub repository created and accessible
- Todo app already running with docker-compose.yml

## What the Setup Script Does

1. ✅ Creates `/home/ubuntu/apps/qa-portfolio` directory
2. ✅ Clones your GitHub repository
3. ✅ Verifies todo-app directory exists
4. ✅ Checks docker-compose.yml includes portfolio service
5. ✅ Makes deployment scripts executable
6. ✅ Runs initial deployment test

## After Setup Completion

Once the setup script completes successfully:

### 1. Verify the setup

```bash
# Check if repository was cloned
ls -la /home/ubuntu/apps/qa-portfolio

# Verify git repository
cd /home/ubuntu/apps/qa-portfolio
git status
git remote -v
```

### 2. Test manual deployment

```bash
cd /home/ubuntu/apps/qa-portfolio
./scripts/deploy.sh
```

### 3. Check if portfolio is running

```bash
# Check Docker containers
docker ps | grep portfolio

# Test local access
curl -I http://localhost

# Test external access (if DNS is configured)
curl -I https://andreirepo.com
```

## Cloudflare DNS Setup

### 1. Add DNS records in Cloudflare

Go to your Cloudflare dashboard for `andreirepo.com` and add:

```
Type: A
Name: @ (root domain)
Content: 52.30.210.152
Proxy: Proxied (orange cloud)

Type: A
Name: www
Content: 52.30.210.152
Proxy: Proxied (orange cloud)
```

### 2. Verify DNS propagation

```bash
# Check DNS resolution
nslookup andreirepo.com
nslookup www.andreirepo.com

# Test HTTP response
curl -I https://andreirepo.com
```

## GitHub Actions Setup

### 1. Add GitHub Secrets

In your GitHub repository, go to **Settings** → **Secrets and variables** → **Actions** and add:

```
LIGHTSAIL_HOST = 52.30.210.152
LIGHTSAIL_USER = ubuntu
LIGHTSAIL_SSH_KEY = [Your private SSH key content]
```

### 2. Get your SSH private key

```bash
# On your local machine, display your private key
cat ~/.ssh/id_rsa

# Copy the entire output (including -----BEGIN/END----- lines)
# Paste this as the LIGHTSAIL_SSH_KEY secret
```

### 3. Test SSH connection

```bash
# Test SSH connection from your local machine
ssh ubuntu@52.30.210.152 "echo 'SSH connection successful'"
```

## Troubleshooting

### Common Issues

**Git repository not found:**

```bash
# Re-clone the repository
cd /home/ubuntu/apps
rm -rf qa-portfolio
git clone https://github.com/YOUR_USERNAME/qa-portfolio.git
```

**Permission denied:**

```bash
# Fix permissions
sudo chown -R ubuntu:ubuntu /home/ubuntu/apps
chmod +x /home/ubuntu/apps/qa-portfolio/scripts/deploy.sh
```

**Docker container not starting:**

```bash
# Check Docker logs
cd /home/ubuntu/apps/todo-app
docker-compose logs portfolio

# Restart Docker service
sudo systemctl restart docker
```

**DNS not resolving:**

```bash
# Check DNS settings
dig andreirepo.com
dig www.andreirepo.com

# Verify Cloudflare proxy is enabled (orange cloud)
```

### Verification Commands

```bash
# Check if portfolio is running
docker ps | grep portfolio

# Test local connection
curl -I http://localhost

# Test external connection
curl -I https://andreirepo.com

# Check container logs
docker-compose logs portfolio --tail=50
```

## Manual Deployment Steps

If GitHub Actions fails, you can deploy manually:

```bash
# 1. SSH into server
ssh ubuntu@52.30.210.152

# 2. Navigate to portfolio
cd /home/ubuntu/apps/qa-portfolio

# 3. Pull latest changes
git pull origin main

# 4. Run deployment
./scripts/deploy.sh

# 5. Verify deployment
curl -I https://andreirepo.com
```

## Security Considerations

### 1. SSH Key Security

- Use a dedicated SSH key for deployment
- Restrict SSH key permissions: `chmod 600 ~/.ssh/id_rsa`
- Consider using SSH key with passphrase

### 2. Server Security

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Configure firewall (if not using LightSail firewall)
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable
```

### 3. Docker Security

```bash
# Run containers as non-root user
# Limit container resources
# Use specific image tags (not 'latest')
```

## Monitoring

### 1. Check deployment status

```bash
# View recent deployments
cd /home/ubuntu/apps/qa-portfolio
git log --oneline -10

# Check container health
docker ps
docker stats portfolio
```

### 2. Monitor logs

```bash
# Portfolio container logs
docker-compose logs -f portfolio

# System logs
sudo journalctl -u docker -f
```

### 3. Performance monitoring

```bash
# Check system resources
htop
df -h
free -h

# Check network connectivity
ping andreirepo.com
```

## Backup and Recovery

### 1. Backup important data

```bash
# Backup docker-compose configuration
cp /home/ubuntu/apps/todo-app/docker-compose.yml ~/backup/

# Backup environment files
cp /home/ubuntu/apps/todo-app/.env ~/backup/
```

### 2. Recovery procedure

```bash
# If deployment fails, rollback
cd /home/ubuntu/apps/qa-portfolio
git log --oneline -5
git reset --hard <previous-commit-hash>
./scripts/deploy.sh
```

## Next Steps

1. ✅ Complete server setup
2. ✅ Configure DNS records
3. ✅ Add GitHub secrets
4. ✅ Test manual deployment
5. ✅ Push code to trigger CI/CD
6. ✅ Verify automatic deployment
7. ✅ Monitor and maintain

Your portfolio should now be live at `https://andreirepo.com` with automatic deployments! 🚀
