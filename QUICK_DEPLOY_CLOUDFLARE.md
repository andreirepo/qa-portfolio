# Quick Deploy Guide - Cloudflare Domain + GitHub Actions

This is your streamlined guide for deploying with Cloudflare domain and automatic GitHub Actions deployment.

## 🎯 Your Setup

- ✅ Domain hosted on Cloudflare
- ✅ Want to host on AWS S3 + CloudFront
- ✅ Want automatic deployment on PR merge

## 📋 Prerequisites Checklist

- [ ] AWS account created
- [ ] Cloudflare account with domain
- [ ] GitHub account
- [ ] AWS CLI installed
- [ ] Node.js 18+ installed

## 🚀 Step-by-Step Deployment

### Part 1: AWS Setup (15 minutes)

#### 1. Build Your Project
```bash
npm install
npm run build
```

#### 2. Create S3 Bucket
```bash
# Replace 'my-portfolio' with your preferred name
aws s3 mb s3://my-portfolio-bucket --region us-east-1

# Enable static website hosting
aws s3 website s3://my-portfolio-bucket \
  --index-document index.html \
  --error-document index.html
```

#### 3. Update and Apply Bucket Policy
Edit `bucket-policy.json` - replace `your-portfolio-bucket-name` with `my-portfolio-bucket`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-portfolio-bucket/*"
    }
  ]
}
```

Apply it:
```bash
aws s3api put-bucket-policy \
  --bucket my-portfolio-bucket \
  --policy file://bucket-policy.json
```

#### 4. Upload Files
```bash
aws s3 sync dist/ s3://my-portfolio-bucket --delete
```

Test: `http://my-portfolio-bucket.s3-website-us-east-1.amazonaws.com`

#### 5. Request SSL Certificate
```bash
# Replace yourdomain.com with your actual domain
aws acm request-certificate \
  --domain-name yourdomain.com \
  --subject-alternative-names www.yourdomain.com \
  --validation-method DNS \
  --region us-east-1
```

Save the Certificate ARN from output!

#### 6. Get Validation Records
```bash
# Replace CERT_ARN with your certificate ARN
aws acm describe-certificate \
  --certificate-arn CERT_ARN \
  --region us-east-1
```

You'll see something like:
```
Name: _abc123.yourdomain.com
Type: CNAME
Value: _xyz456.acm-validations.aws.
```

### Part 2: Cloudflare Setup (10 minutes)

#### 7. Add ACM Validation Record to Cloudflare

1. Log in to Cloudflare Dashboard
2. Select your domain
3. Go to **DNS** → **Records**
4. Click **Add record**
5. Add:
   - **Type**: CNAME
   - **Name**: `_abc123` (from ACM validation)
   - **Target**: `_xyz456.acm-validations.aws.` (from ACM validation)
   - **Proxy status**: DNS only (gray cloud) ⚠️
   - **TTL**: Auto
6. Click **Save**

Wait 5-10 minutes for validation.

#### 8. Create CloudFront Distribution

**Using AWS Console** (easier):

1. Go to CloudFront → Create Distribution
2. **Origin Domain**: Select your S3 bucket
3. **Viewer Protocol Policy**: Redirect HTTP to HTTPS
4. **Alternate Domain Names (CNAMEs)**: 
   - `yourdomain.com`
   - `www.yourdomain.com`
5. **Custom SSL Certificate**: Select your validated ACM certificate
6. **Default Root Object**: `index.html`
7. **Custom Error Responses**:
   - 403 → `/index.html` (Response code: 200)
   - 404 → `/index.html` (Response code: 200)
8. Click **Create Distribution**

Wait 10-15 minutes. Note your CloudFront domain (e.g., `d1234abcd.cloudfront.net`)

#### 9. Update Cloudflare DNS

1. Go to Cloudflare → DNS → Records
2. Add/Update:

**Root domain:**
- **Type**: CNAME
- **Name**: `@`
- **Target**: `d1234abcd.cloudfront.net` (your CloudFront domain)
- **Proxy status**: DNS only (gray cloud) ⚠️
- **TTL**: Auto

**WWW subdomain:**
- **Type**: CNAME
- **Name**: `www`
- **Target**: `d1234abcd.cloudfront.net`
- **Proxy status**: DNS only (gray cloud) ⚠️
- **TTL**: Auto

#### 10. Configure Cloudflare SSL

1. Go to **SSL/TLS** → **Overview**
2. Set to **Full** (not Full Strict)

### Part 3: GitHub Actions Setup (10 minutes)

#### 11. Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit: QA Portfolio"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/qa-portfolio.git
git branch -M main
git push -u origin main
```

#### 12. Create IAM User for GitHub Actions

1. Go to AWS IAM → Users → Create user
2. Name: `github-actions-deploy`
3. Attach this policy (create custom policy):

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
        "arn:aws:s3:::my-portfolio-bucket",
        "arn:aws:s3:::my-portfolio-bucket/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation"
      ],
      "Resource": "*"
    }
  ]
}
```

4. Create access key
5. Save Access Key ID and Secret Access Key

#### 13. Add GitHub Secrets

1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:

| Secret Name | Value |
|-------------|-------|
| `AWS_ACCESS_KEY_ID` | Your IAM user access key ID |
| `AWS_SECRET_ACCESS_KEY` | Your IAM user secret access key |
| `S3_BUCKET_NAME` | `my-portfolio-bucket` |
| `CLOUDFRONT_DISTRIBUTION_ID` | Your CloudFront distribution ID (e.g., `E1234ABCD`) |

#### 14. Test the Pipeline

Create a test branch and PR:

```bash
git checkout -b test-cicd
echo "Testing CI/CD" >> README.md
git add README.md
git commit -m "test: CI/CD pipeline"
git push origin test-cicd
```

1. Go to GitHub and create a Pull Request
2. Watch the **PR Quality Checks** run
3. Merge the PR
4. Watch the **Deploy to AWS** workflow run
5. Check your website!

### Part 4: Verify Everything (5 minutes)

#### 15. Test Your Website

```bash
# Test DNS
nslookup yourdomain.com

# Test HTTPS
curl -I https://yourdomain.com

# Open in browser
open https://yourdomain.com
```

Check:
- [ ] Website loads
- [ ] HTTPS works (green padlock)
- [ ] All sections visible
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] No console errors

## 🎉 You're Done!

Your portfolio is now:
- ✅ Hosted on AWS S3 + CloudFront
- ✅ Using your Cloudflare domain
- ✅ Secured with HTTPS
- ✅ Automatically deployed on PR merge
- ✅ Fast and globally distributed

## 🔄 Daily Workflow

### Making Updates:

1. **Create branch:**
```bash
git checkout -b feature/update-projects
```

2. **Make changes:**
```bash
# Edit src/data/projects.json or other files
git add .
git commit -m "feat: Add new project"
```

3. **Push and create PR:**
```bash
git push origin feature/update-projects
# Create PR on GitHub
```

4. **Wait for checks:**
- PR Quality Checks run automatically
- Review results

5. **Merge PR:**
- Click "Merge pull request"
- Deployment starts automatically
- Wait 2-3 minutes

6. **Verify:**
- Check https://yourdomain.com
- Changes are live!

## 🔧 Maintenance Commands

### Update Content:
```bash
# Edit JSON files
vim src/data/projects.json
vim src/data/skills.json

# Commit and push
git add .
git commit -m "content: Update projects"
git push
```

### Manual Deployment:
```bash
npm run build
aws s3 sync dist/ s3://my-portfolio-bucket --delete
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"
```

### Check Deployment Status:
```bash
# View GitHub Actions
gh run list

# View CloudFront status
aws cloudfront get-distribution --id YOUR_DIST_ID
```

## 💰 Monthly Costs

- S3 Storage: ~$0.50
- CloudFront: ~$1-3 (1TB free first year)
- Data Transfer: ~$0.50
- **Total: $2-4/month**

Cloudflare DNS: Free ✨

## 🆘 Troubleshooting

### Website not loading?
- Wait 24-48 hours for DNS propagation
- Check DNS: https://dnschecker.org
- Clear browser cache

### SSL certificate pending?
- Verify CNAME record in Cloudflare
- Ensure "DNS only" (gray cloud)
- Wait 10-15 minutes

### Deployment failing?
- Check GitHub Secrets are correct
- Verify IAM permissions
- Check workflow logs in GitHub Actions

### Changes not appearing?
- Wait 5-10 minutes for CloudFront
- Invalidate cache manually
- Clear browser cache

## 📚 Need More Help?

- **Cloudflare Setup**: See [CLOUDFLARE_SETUP.md](./CLOUDFLARE_SETUP.md)
- **CI/CD Details**: See [CICD_SETUP.md](./CICD_SETUP.md)
- **AWS Deployment**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

## ✅ Final Checklist

- [ ] AWS S3 bucket created and configured
- [ ] SSL certificate validated
- [ ] CloudFront distribution created
- [ ] Cloudflare DNS records updated
- [ ] GitHub repository created
- [ ] GitHub Secrets configured
- [ ] IAM user created with minimal permissions
- [ ] Test PR created and merged
- [ ] Website accessible via domain
- [ ] HTTPS working
- [ ] Automatic deployment working

---

**Congratulations! Your portfolio is live with automatic deployments!** 🚀

*Estimated total setup time: 40 minutes*
