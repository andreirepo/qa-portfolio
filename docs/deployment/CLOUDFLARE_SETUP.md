# Cloudflare Domain with AWS S3 + CloudFront Setup

This guide shows you how to use your Cloudflare-hosted domain with your AWS-hosted portfolio.

## Overview

You have two main options:

1. **Option A (Recommended)**: Use CloudFront + Cloudflare DNS (Best performance)
2. **Option B**: Use S3 directly + Cloudflare Proxy (Simpler, but slower)

## Option A: CloudFront + Cloudflare DNS (Recommended)

This setup gives you the best of both worlds: AWS CloudFront's CDN + Cloudflare's DNS.

### Step 1: Deploy to AWS S3

```bash
# Build your project
npm run build

# Create S3 bucket
aws s3 mb s3://your-portfolio-bucket --region us-east-1

# Enable static website hosting
aws s3 website s3://your-portfolio-bucket \
  --index-document index.html \
  --error-document index.html

# Update bucket-policy.json with your bucket name, then apply
aws s3api put-bucket-policy \
  --bucket your-portfolio-bucket \
  --policy file://bucket-policy.json

# Upload files
aws s3 sync dist/ s3://your-portfolio-bucket --delete
```

### Step 2: Request SSL Certificate in AWS ACM

**Important**: Certificate MUST be in `us-east-1` region for CloudFront!

```bash
# Request certificate for your domain
aws acm request-certificate \
  --domain-name yourdomain.com \
  --subject-alternative-names www.yourdomain.com \
  --validation-method DNS \
  --region us-east-1
```

Note the Certificate ARN from the output.

### Step 3: Get DNS Validation Records

```bash
# Get certificate details
aws acm describe-certificate \
  --certificate-arn arn:aws:acm:us-east-1:ACCOUNT_ID:certificate/CERT_ID \
  --region us-east-1
```

You'll see output like:

```json
{
  "Name": "_abc123.yourdomain.com",
  "Type": "CNAME",
  "Value": "_xyz456.acm-validations.aws."
}
```

### Step 4: Add Validation Records to Cloudflare

1. Log in to Cloudflare Dashboard
2. Select your domain
3. Go to **DNS** → **Records**
4. Click **Add record**
5. Add the CNAME record from ACM:
   - **Type**: CNAME
   - **Name**: `_abc123` (just the subdomain part)
   - **Target**: `_xyz456.acm-validations.aws.`
   - **Proxy status**: DNS only (gray cloud, not proxied)
   - **TTL**: Auto
6. Click **Save**

Wait 5-10 minutes for validation to complete.

### Step 5: Create CloudFront Distribution

#### Using AWS Console (Easier):

1. Go to CloudFront in AWS Console
2. Click **Create Distribution**
3. Configure:

**Origin Settings:**

- **Origin Domain**: Select your S3 bucket
- **Origin Path**: Leave empty
- **Name**: Leave default
- **Origin Access**: Public (or use OAC for better security)

**Default Cache Behavior:**

- **Viewer Protocol Policy**: Redirect HTTP to HTTPS
- **Allowed HTTP Methods**: GET, HEAD
- **Cache Policy**: CachingOptimized

**Settings:**

- **Alternate Domain Names (CNAMEs)**:
  - `yourdomain.com`
  - `www.yourdomain.com`
- **Custom SSL Certificate**: Select your ACM certificate
- **Default Root Object**: `index.html`

**Custom Error Responses** (Important for React Router):

- Click **Create Custom Error Response**
- **HTTP Error Code**: 403
- **Response Page Path**: `/index.html`
- **HTTP Response Code**: 200
- **TTL**: 300
- Repeat for 404 error code

4. Click **Create Distribution**
5. Wait 10-15 minutes for deployment
6. Note your CloudFront domain (e.g., `d1234abcd.cloudfront.net`)

#### Using AWS CLI:

```bash
# Create distribution (basic config)
aws cloudfront create-distribution \
  --origin-domain-name your-portfolio-bucket.s3.amazonaws.com \
  --default-root-object index.html
```

For full configuration with custom domain, use the AWS Console or create a JSON config file.

### Step 6: Configure Cloudflare DNS

1. Go to Cloudflare Dashboard → Your Domain → **DNS**
2. Add/Update these records:

**For root domain (yourdomain.com):**

- **Type**: CNAME
- **Name**: `@`
- **Target**: `d1234abcd.cloudfront.net` (your CloudFront domain)
- **Proxy status**: DNS only (gray cloud) ⚠️ Important!
- **TTL**: Auto

**For www subdomain:**

- **Type**: CNAME
- **Name**: `www`
- **Target**: `d1234abcd.cloudfront.net`
- **Proxy status**: DNS only (gray cloud) ⚠️ Important!
- **TTL**: Auto

**Why DNS only?**

- CloudFront already provides CDN and SSL
- Proxying through Cloudflare would create double CDN (slower)
- CloudFront handles HTTPS with your ACM certificate

### Step 7: Configure Cloudflare SSL/TLS Settings

1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode to **Full** (not Full Strict, since we're using CloudFront's cert)

### Step 8: Test Your Setup

```bash
# Test DNS resolution
nslookup yourdomain.com

# Test HTTPS
curl -I https://yourdomain.com

# Test in browser
open https://yourdomain.com
```

### Step 9: Invalidate CloudFront Cache (After Updates)

```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

---

## Option B: S3 + Cloudflare Proxy (Simpler)

This option uses Cloudflare as the CDN instead of CloudFront.

### Step 1: Deploy to S3 (Same as Option A)

```bash
npm run build
aws s3 mb s3://your-portfolio-bucket --region us-east-1
aws s3 website s3://your-portfolio-bucket \
  --index-document index.html \
  --error-document index.html
aws s3api put-bucket-policy \
  --bucket your-portfolio-bucket \
  --policy file://bucket-policy.json
aws s3 sync dist/ s3://your-portfolio-bucket --delete
```

### Step 2: Get S3 Website Endpoint

Your S3 website endpoint will be:

```
your-portfolio-bucket.s3-website-us-east-1.amazonaws.com
```

Test it in browser to ensure it works.

### Step 3: Configure Cloudflare DNS

1. Go to Cloudflare Dashboard → Your Domain → **DNS**
2. Add these records:

**For root domain:**

- **Type**: CNAME
- **Name**: `@`
- **Target**: `your-portfolio-bucket.s3-website-us-east-1.amazonaws.com`
- **Proxy status**: Proxied (orange cloud) ✅
- **TTL**: Auto

**For www subdomain:**

- **Type**: CNAME
- **Name**: `www`
- **Target**: `your-portfolio-bucket.s3-website-us-east-1.amazonaws.com`
- **Proxy status**: Proxied (orange cloud) ✅
- **TTL**: Auto

### Step 4: Configure Cloudflare SSL/TLS

1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode to **Flexible** (Cloudflare to visitor: HTTPS, Cloudflare to S3: HTTP)

### Step 5: Configure Cloudflare Page Rules (Optional)

For better caching:

1. Go to **Rules** → **Page Rules**
2. Create rule for `yourdomain.com/*`:
   - **Cache Level**: Standard
   - **Browser Cache TTL**: 4 hours
   - **Edge Cache TTL**: 2 hours

### Step 6: Test

```bash
# Test
curl -I https://yourdomain.com
open https://yourdomain.com
```

---

## Comparison: Option A vs Option B

| Feature              | Option A (CloudFront) | Option B (S3 + CF Proxy) |
| -------------------- | --------------------- | ------------------------ |
| **Performance**      | Excellent (AWS CDN)   | Good (Cloudflare CDN)    |
| **Setup Complexity** | Medium                | Easy                     |
| **SSL Certificate**  | AWS ACM (free)        | Cloudflare (free)        |
| **Cost**             | $1-5/month            | $0.50-2/month            |
| **Custom Domain**    | Yes                   | Yes                      |
| **HTTPS**            | Yes                   | Yes                      |
| **Cache Control**    | Full control          | Via Cloudflare           |
| **Best For**         | Production sites      | Simple portfolios        |

---

## Troubleshooting

### Issue: "This site can't be reached"

**Solution:**

- Check DNS propagation: https://dnschecker.org
- Wait 24-48 hours for full propagation
- Clear browser cache

### Issue: SSL Certificate Pending Validation

**Solution:**

- Verify CNAME record added to Cloudflare
- Ensure Proxy status is "DNS only" for validation record
- Wait 10-15 minutes

### Issue: 403 Forbidden Error

**Solution:**

- Check S3 bucket policy allows public read
- Verify bucket website hosting is enabled
- Check CloudFront error pages configured

### Issue: 404 on Page Refresh

**Solution:**

- Configure CloudFront custom error responses (403 → /index.html, 404 → /index.html)
- For S3 only: Set error document to `index.html`

### Issue: Changes Not Appearing

**Solution:**

```bash
# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"

# Or purge Cloudflare cache
# Go to Cloudflare Dashboard → Caching → Purge Everything
```

### Issue: Mixed Content Warnings

**Solution:**

- Ensure all resources use HTTPS
- Check Cloudflare SSL/TLS mode is correct
- Verify CloudFront uses HTTPS

---

## Cloudflare Additional Features

### Enable Cloudflare Features (Optional)

1. **Auto Minify**: CSS, JavaScript, HTML
   - Go to **Speed** → **Optimization**
   - Enable Auto Minify

2. **Brotli Compression**:
   - Go to **Speed** → **Optimization**
   - Enable Brotli

3. **Rocket Loader** (Optional):
   - Can speed up JavaScript loading
   - Test thoroughly as it may break some sites

4. **Always Use HTTPS**:
   - Go to **SSL/TLS** → **Edge Certificates**
   - Enable "Always Use HTTPS"

5. **HSTS** (HTTP Strict Transport Security):
   - Go to **SSL/TLS** → **Edge Certificates**
   - Enable HSTS (after testing HTTPS works)

---

## Cost Breakdown

### Option A (CloudFront + Cloudflare DNS)

- S3 Storage: ~$0.50/month
- CloudFront: ~$1-3/month (1TB free tier first year)
- Cloudflare DNS: Free
- **Total: $1.50-3.50/month**

### Option B (S3 + Cloudflare Proxy)

- S3 Storage: ~$0.50/month
- S3 Data Transfer: ~$0.50-1/month
- Cloudflare: Free
- **Total: $1-1.50/month**

---

## Recommended Setup

For a professional portfolio, I recommend **Option A (CloudFront + Cloudflare DNS)** because:

✅ Better performance (AWS CDN)
✅ More control over caching
✅ Better for future scaling
✅ Professional SSL setup
✅ Better analytics via CloudWatch

---

## Quick Reference Commands

```bash
# Deploy to S3
npm run build
aws s3 sync dist/ s3://your-bucket --delete

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR_ID \
  --paths "/*"

# Check certificate status
aws acm describe-certificate \
  --certificate-arn YOUR_ARN \
  --region us-east-1

# List CloudFront distributions
aws cloudfront list-distributions
```

---

## Next Steps

1. Choose Option A or Option B
2. Follow the steps above
3. Test your domain
4. Set up GitHub Actions (see updated workflow)
5. Enjoy your live portfolio!

**Need help?** Check the troubleshooting section or AWS/Cloudflare documentation.
