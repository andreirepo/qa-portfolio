# CI/CD Setup Guide - GitHub Actions

Complete guide for setting up automated deployment with GitHub Actions.

## Overview

Your portfolio includes two GitHub Actions workflows:

1. **PR Quality Checks** (`pr-check.yml`) - Runs on every pull request
2. **Deploy to AWS** (`deploy.yml`) - Deploys on PR merge or push to main

## Workflow Behavior

### Pull Request Opened/Updated

- ✅ Runs linter (ESLint)
- ✅ Runs all tests
- ✅ Generates test coverage
- ✅ Builds project
- ✅ Checks bundle size
- ✅ Comments on PR with results
- ❌ Does NOT deploy

### Pull Request Merged to Main

- ✅ Runs linter
- ✅ Runs all tests
- ✅ Builds project
- ✅ Deploys to S3
- ✅ Invalidates CloudFront cache
- ✅ Shows deployment summary

### Direct Push to Main

- ✅ Same as merged PR
- ✅ Immediate deployment

## Setup Instructions

### Step 1: Create GitHub Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: QA Portfolio"

# Create repository on GitHub (via web interface)
# Then connect and push:
git remote add origin https://github.com/yourusername/qa-portfolio.git
git branch -M main
git push -u origin main
```

### Step 2: Configure GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

#### Required Secrets:

**AWS_ACCESS_KEY_ID**

- Value: Your AWS access key ID
- Example: `AKIAIOSFODNN7EXAMPLE`

**AWS_SECRET_ACCESS_KEY**

- Value: Your AWS secret access key
- Example: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`

**S3_BUCKET_NAME**

- Value: Your S3 bucket name
- Example: `my-portfolio-bucket`

#### Optional Secrets:

**CLOUDFRONT_DISTRIBUTION_ID**

- Value: Your CloudFront distribution ID (if using CloudFront)
- Example: `E1234ABCDEFGHI`
- Leave empty if not using CloudFront

### Step 3: Create AWS IAM User for GitHub Actions

For security, create a dedicated IAM user for deployments:

#### Using AWS Console:

1. Go to **IAM** → **Users** → **Create user**
2. User name: `github-actions-deploy`
3. Select **Access key - Programmatic access**
4. Click **Next**

#### Attach Policies:

Create a custom policy with minimal permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::your-portfolio-bucket",
        "arn:aws:s3:::your-portfolio-bucket/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation", "cloudfront:GetInvalidation"],
      "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/YOUR_DIST_ID"
    }
  ]
}
```

Replace:

- `your-portfolio-bucket` with your actual bucket name
- `ACCOUNT_ID` with your AWS account ID
- `YOUR_DIST_ID` with your CloudFront distribution ID

5. Save the Access Key ID and Secret Access Key
6. Add them to GitHub Secrets

### Step 4: Test the Workflow

#### Test PR Checks:

1. Create a new branch:

```bash
git checkout -b test-deployment
```

2. Make a small change (e.g., update README):

```bash
echo "Testing CI/CD" >> README.md
git add README.md
git commit -m "Test: CI/CD pipeline"
git push origin test-deployment
```

3. Create a Pull Request on GitHub
4. Watch the **PR Quality Checks** workflow run
5. Check for the automated comment on your PR

#### Test Deployment:

1. Merge the PR on GitHub
2. Watch the **Deploy to AWS** workflow run
3. Check your website for updates

### Step 5: Verify Deployment

```bash
# Check your website
curl -I https://yourdomain.com

# Or open in browser
open https://yourdomain.com
```

## Workflow Files Explained

### PR Quality Checks (`.github/workflows/pr-check.yml`)

```yaml
# Triggers on PR open, update, or reopen
on:
  pull_request:
    branches:
      - main
    types:
      - opened
      - synchronize
      - reopened

# Runs quality checks
jobs:
  quality-checks:
    - Lint code
    - Run tests
    - Generate coverage
    - Build project
    - Check bundle size

  comment:
    - Posts results to PR
```

### Deploy Workflow (`.github/workflows/deploy.yml`)

```yaml
# Triggers on push to main or merged PR
on:
  push:
    branches:
      - main
  pull_request:
    types:
      - closed

# Two jobs
jobs:
  test:
    - Runs on open PRs (before merge)
    - Validates code quality

  deploy:
    - Runs on merged PRs or push to main
    - Deploys to AWS
    - Invalidates CloudFront cache
```

## Development Workflow

### Recommended Git Flow:

1. **Create feature branch:**

```bash
git checkout -b feature/update-projects
```

2. **Make changes:**

```bash
# Edit files
git add .
git commit -m "feat: Add new project to portfolio"
```

3. **Push and create PR:**

```bash
git push origin feature/update-projects
# Create PR on GitHub
```

4. **Wait for checks:**

- PR Quality Checks run automatically
- Review the results
- Fix any issues

5. **Merge PR:**

- Click "Merge pull request" on GitHub
- Deployment starts automatically
- Wait 2-3 minutes for deployment

6. **Verify:**

- Check your live website
- Changes should be visible

### Branch Protection Rules (Recommended)

Protect your main branch:

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch
3. Enable:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Require pull request reviews before merging (optional)
   - ✅ Include administrators

This ensures:

- No direct pushes to main
- All changes go through PR
- Tests must pass before merge
- Automatic deployment after merge

## Monitoring Deployments

### View Workflow Runs:

1. Go to your GitHub repository
2. Click **Actions** tab
3. See all workflow runs
4. Click on a run to see details

### Workflow Status Badge:

Add to your README.md:

```markdown
![Deploy Status](https://github.com/yourusername/qa-portfolio/actions/workflows/deploy.yml/badge.svg)
```

### Notifications:

GitHub will email you when:

- Workflow fails
- Deployment completes
- PR checks finish

Configure in: **Settings** → **Notifications**

## Troubleshooting

### Issue: Workflow fails with "Access Denied"

**Solution:**

- Check AWS credentials in GitHub Secrets
- Verify IAM user has correct permissions
- Ensure bucket name is correct

### Issue: CloudFront invalidation fails

**Solution:**

- Check `CLOUDFRONT_DISTRIBUTION_ID` secret is set
- Verify IAM user has CloudFront permissions
- Ensure distribution ID is correct

### Issue: Tests fail in CI but pass locally

**Solution:**

```bash
# Run tests exactly as CI does
npm ci  # Clean install
npm test
```

Common causes:

- Different Node.js version
- Missing dependencies
- Environment-specific issues

### Issue: Build succeeds but site not updating

**Solution:**

- Check S3 sync completed successfully
- Verify CloudFront invalidation ran
- Clear browser cache
- Wait 5-10 minutes for CloudFront propagation

### Issue: PR checks not running

**Solution:**

- Ensure workflow files are in `.github/workflows/`
- Check workflow syntax (YAML)
- Verify branch name matches trigger
- Check GitHub Actions is enabled in repo settings

## Advanced Configuration

### Deploy to Staging Environment

Add a staging workflow (`.github/workflows/deploy-staging.yml`):

```yaml
name: Deploy to Staging

on:
  push:
    branches:
      - develop

jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    steps:
      # Same as deploy.yml but use different bucket
      - name: Deploy to Staging S3
        run: |
          aws s3 sync dist/ s3://${{ secrets.STAGING_S3_BUCKET_NAME }} --delete
```

### Slack Notifications

Add Slack notification step:

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: 'Deployment completed!'
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
  if: always()
```

### Deployment Approval

For production deployments, add manual approval:

```yaml
deploy:
  runs-on: ubuntu-latest
  environment:
    name: production
    url: https://yourdomain.com
  steps:
    # ... deployment steps
```

Then configure environment protection rules in GitHub.

### Rollback Strategy

Keep previous versions in S3:

```yaml
- name: Backup current version
  run: |
    aws s3 sync s3://${{ secrets.S3_BUCKET_NAME }} s3://${{ secrets.S3_BUCKET_NAME }}-backup-$(date +%Y%m%d-%H%M%S)
```

## Performance Optimization

### Cache Dependencies

Already configured in workflows:

```yaml
- uses: actions/setup-node@v3
  with:
    cache: 'npm' # Caches node_modules
```

### Parallel Jobs

Run tests and linting in parallel:

```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
```

### Conditional Deployment

Only deploy if files changed:

```yaml
- name: Check for changes
  id: changes
  run: |
    if git diff --name-only ${{ github.event.before }} ${{ github.sha }} | grep -E '^src/|^public/'; then
      echo "deploy=true" >> $GITHUB_OUTPUT
    fi

- name: Deploy
  if: steps.changes.outputs.deploy == 'true'
  run: aws s3 sync dist/ s3://...
```

## Security Best Practices

1. ✅ Use GitHub Secrets for credentials
2. ✅ Use minimal IAM permissions
3. ✅ Enable branch protection
4. ✅ Require PR reviews
5. ✅ Keep dependencies updated
6. ✅ Use `npm ci` instead of `npm install`
7. ✅ Scan for vulnerabilities: `npm audit`

## Cost Optimization

GitHub Actions free tier:

- 2,000 minutes/month for private repos
- Unlimited for public repos

Typical usage:

- PR check: ~3 minutes
- Deployment: ~4 minutes
- ~10 deployments/month = 40 minutes

Well within free tier! 🎉

## Quick Reference

### Useful Commands

```bash
# Test workflow locally (requires act)
act -j deploy

# Validate workflow syntax
yamllint .github/workflows/*.yml

# Trigger workflow manually (if configured)
gh workflow run deploy.yml

# View workflow runs
gh run list

# View specific run
gh run view RUN_ID
```

### Workflow Triggers

```yaml
# On push to main
on:
  push:
    branches: [main]

# On PR to main
on:
  pull_request:
    branches: [main]

# On PR merge
on:
  pull_request:
    types: [closed]

# Manual trigger
on:
  workflow_dispatch:

# Scheduled (daily at midnight)
on:
  schedule:
    - cron: '0 0 * * *'
```

## Next Steps

1. ✅ Set up GitHub repository
2. ✅ Add GitHub Secrets
3. ✅ Create IAM user with minimal permissions
4. ✅ Test PR workflow
5. ✅ Test deployment workflow
6. ✅ Enable branch protection
7. ✅ Add status badge to README
8. ✅ Document your workflow for team

---

**Your CI/CD pipeline is now ready!** 🚀

Every PR merge will automatically deploy your portfolio to AWS.
