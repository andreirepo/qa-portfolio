# AWS Deployment Guide

This guide provides step-by-step instructions for deploying your QA Portfolio to AWS.

## Prerequisites

- AWS Account
- AWS CLI installed and configured
- Node.js 18+ installed
- Project built (`npm run build`)

## Quick Start

### 1. Install AWS CLI

**Windows:**

```powershell
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi
```

**macOS:**

```bash
brew install awscli
```

**Linux:**

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### 2. Configure AWS Credentials

```bash
aws configure
```

You'll need:

- AWS Access Key ID (from IAM user)
- AWS Secret Access Key
- Default region (e.g., `us-east-1`)
- Output format: `json`

### 3. Create IAM User (if needed)

1. Go to AWS Console → IAM → Users
2. Create new user with programmatic access
3. Attach policies:
   - `AmazonS3FullAccess`
   - `CloudFrontFullAccess` (if using CloudFront)
4. Save the Access Key ID and Secret Access Key

## Deployment Steps

### Step 1: Build the Project

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

### Step 2: Create S3 Bucket

```bash
aws s3 mb s3://your-unique-bucket-name --region us-east-1
```

**Important**: Bucket names must be globally unique across all AWS accounts.

### Step 3: Configure Bucket for Static Website Hosting

```bash
aws s3 website s3://your-unique-bucket-name \
  --index-document index.html \
  --error-document index.html
```

The error document is set to `index.html` to support React Router's client-side routing.

### Step 4: Update and Apply Bucket Policy

Edit `bucket-policy.json` and replace `your-portfolio-bucket-name` with your actual bucket name:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-unique-bucket-name/*"
    }
  ]
}
```

Apply the policy:

```bash
aws s3api put-bucket-policy \
  --bucket your-unique-bucket-name \
  --policy file://bucket-policy.json
```

### Step 5: Upload Files to S3

```bash
aws s3 sync dist/ s3://your-unique-bucket-name --delete
```

The `--delete` flag removes files from S3 that don't exist locally.

### Step 6: Access Your Website

Your website is now live at:

```
http://your-unique-bucket-name.s3-website-us-east-1.amazonaws.com
```

Replace `us-east-1` with your chosen region.

## Adding CloudFront (Recommended)

CloudFront provides:

- HTTPS support
- Global CDN for faster loading
- Custom domain support
- DDoS protection

### Option A: Using AWS Console (Easier)

1. Go to CloudFront in AWS Console
2. Click "Create Distribution"
3. Configure:
   - **Origin Domain**: Select your S3 bucket
   - **Origin Path**: Leave empty
   - **Viewer Protocol Policy**: Redirect HTTP to HTTPS
   - **Allowed HTTP Methods**: GET, HEAD
   - **Cache Policy**: CachingOptimized
   - **Default Root Object**: `index.html`
4. Click "Create Distribution"
5. Wait 10-15 minutes for deployment
6. Access via CloudFront URL (e.g., `d1234abcd.cloudfront.net`)

### Option B: Using AWS CLI

```bash
aws cloudfront create-distribution \
  --origin-domain-name your-unique-bucket-name.s3.amazonaws.com \
  --default-root-object index.html
```

### Configure Error Pages for SPA Routing

In CloudFront Console:

1. Go to your distribution
2. Click "Error Pages" tab
3. Create custom error response:
   - **HTTP Error Code**: 403
   - **Response Page Path**: `/index.html`
   - **HTTP Response Code**: 200
4. Repeat for 404 errors

### Invalidate CloudFront Cache After Updates

After deploying new changes:

```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

## Custom Domain Setup

### 1. Request SSL Certificate (ACM)

**Important**: Must be in `us-east-1` region for CloudFront.

```bash
aws acm request-certificate \
  --domain-name yourdomain.com \
  --subject-alternative-names www.yourdomain.com \
  --validation-method DNS \
  --region us-east-1
```

### 2. Validate Certificate

1. Go to ACM in AWS Console
2. Click on your certificate
3. Add the CNAME records to your domain's DNS

### 3. Add Custom Domain to CloudFront

1. Go to your CloudFront distribution
2. Edit settings
3. Add Alternate Domain Names (CNAMEs): `yourdomain.com`, `www.yourdomain.com`
4. Select your SSL certificate
5. Save changes

### 4. Update DNS Records

Add these records to your domain registrar:

```
Type: A (Alias)
Name: @
Value: Your CloudFront distribution domain

Type: A (Alias)
Name: www
Value: Your CloudFront distribution domain
```

For Route 53:

```bash
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR_ZONE_ID \
  --change-batch file://dns-changes.json
```

## Automated Deployment with GitHub Actions

### Setup GitHub Secrets

1. Go to your repository on GitHub
2. Settings → Secrets and variables → Actions
3. Add secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `S3_BUCKET_NAME`
   - `CLOUDFRONT_DISTRIBUTION_ID` (optional)

### Workflow File

The `.github/workflows/deploy.yml` file is already configured. It will:

- Run on push to `main` branch
- Install dependencies
- Run tests
- Build project
- Deploy to S3
- Invalidate CloudFront cache

### Trigger Deployment

Simply push to the `main` branch:

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

## Cost Breakdown

### S3 Costs

- Storage: $0.023 per GB/month
- GET requests: $0.0004 per 1,000 requests
- Data transfer out: $0.09 per GB (first 10 TB)

### CloudFront Costs

- Data transfer out: $0.085 per GB (first 10 TB)
- HTTPS requests: $0.0100 per 10,000 requests
- Free tier: 1 TB data transfer, 10M HTTPS requests/month

### Estimated Monthly Cost

For a typical portfolio with moderate traffic:

- **Without CloudFront**: $0.50 - $2
- **With CloudFront**: $1 - $5 (but faster and more secure)

## Monitoring and Maintenance

### View S3 Metrics

```bash
aws s3api get-bucket-metrics-configuration \
  --bucket your-unique-bucket-name
```

### View CloudFront Metrics

Go to CloudFront Console → Your Distribution → Monitoring

### Set Up Billing Alerts

1. Go to AWS Billing Console
2. Create a billing alarm
3. Set threshold (e.g., $10/month)
4. Add email notification

## Troubleshooting

### Issue: 403 Forbidden Error

**Solution**: Check bucket policy is correctly applied and allows public read access.

```bash
aws s3api get-bucket-policy --bucket your-unique-bucket-name
```

### Issue: 404 on Page Refresh

**Solution**: Ensure error document is set to `index.html` for SPA routing.

For S3:

```bash
aws s3 website s3://your-unique-bucket-name \
  --index-document index.html \
  --error-document index.html
```

For CloudFront: Configure custom error responses (see above).

### Issue: Changes Not Appearing

**Solution**:

1. Clear browser cache
2. Invalidate CloudFront cache
3. Check if files were uploaded correctly:

```bash
aws s3 ls s3://your-unique-bucket-name/
```

### Issue: CORS Errors

**Solution**: Add CORS configuration to S3 bucket:

```bash
aws s3api put-bucket-cors \
  --bucket your-unique-bucket-name \
  --cors-configuration file://cors.json
```

Create `cors.json`:

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

## Security Best Practices

1. **Use IAM roles** instead of access keys when possible
2. **Enable MFA** on your AWS account
3. **Rotate access keys** regularly
4. **Use CloudFront** for DDoS protection
5. **Enable AWS CloudTrail** for audit logging
6. **Set up AWS Config** for compliance monitoring
7. **Never commit** AWS credentials to git

## Cleanup (Delete Resources)

To remove all resources and stop charges:

```bash
# Empty and delete S3 bucket
aws s3 rm s3://your-unique-bucket-name --recursive
aws s3 rb s3://your-unique-bucket-name

# Delete CloudFront distribution (must disable first)
aws cloudfront get-distribution-config --id YOUR_DIST_ID > dist-config.json
# Edit dist-config.json and set "Enabled": false
aws cloudfront update-distribution --id YOUR_DIST_ID --if-match ETAG --distribution-config file://dist-config.json
# Wait for distribution to be disabled, then delete
aws cloudfront delete-distribution --id YOUR_DIST_ID --if-match ETAG
```

## Additional Resources

- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [AWS CLI Reference](https://docs.aws.amazon.com/cli/)
- [GitHub Actions AWS Deploy](https://github.com/aws-actions)

## Support

For deployment issues:

- Check AWS CloudWatch logs
- Review AWS Trusted Advisor recommendations
- Contact AWS Support (if you have a support plan)

---

**Good luck with your deployment! 🚀**
