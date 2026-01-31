# QA Portfolio - Setup & Deployment Checklist

Use this checklist to track your progress from setup to deployment.

## ✅ Initial Setup

- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] Git installed
- [ ] Code editor installed (VS Code recommended)
- [ ] Project folder opened in editor
- [ ] Dependencies installed (`npm install`)
- [ ] Development server running (`npm run dev`)
- [ ] Site loads at http://localhost:5173
- [ ] All sections visible (Hero, About, Projects, Skills, Contact)
- [ ] Dark mode toggle works
- [ ] Navigation works
- [ ] Tests pass (`npm test`)

## 📝 Content Customization

### Personal Information
- [ ] Update name in `src/components/Hero.tsx`
- [ ] Update title/role in `src/components/Hero.tsx`
- [ ] Update intro text in `src/components/Hero.tsx`
- [ ] Update about section in `src/components/About.tsx`
- [ ] Update testing philosophy in `src/components/About.tsx`

### Contact Information
- [ ] Update email in `src/components/Contact.tsx`
- [ ] Update LinkedIn URL in `src/components/Contact.tsx`
- [ ] Update GitHub URL in `src/components/Contact.tsx`
- [ ] Update Twitter/X URL in `src/components/Contact.tsx`
- [ ] Update availability status in `src/components/Contact.tsx`

### Projects
- [ ] Review sample projects in `src/data/projects.json`
- [ ] Add your first project
- [ ] Add your second project
- [ ] Add your third project
- [ ] Update project metrics (test cases, coverage, bugs found)
- [ ] Add GitHub links to projects
- [ ] Add report/documentation links
- [ ] Update testing types for each project
- [ ] Update technologies used
- [ ] Add achievements for each project

### Skills
- [ ] Review skill categories in `src/data/skills.json`
- [ ] Update Test Automation skills
- [ ] Update Programming skills
- [ ] Update API Testing skills
- [ ] Update Performance Testing skills
- [ ] Update CI/CD & DevOps skills
- [ ] Update Testing Frameworks skills
- [ ] Adjust skill levels (0-100)
- [ ] Add new skill categories if needed
- [ ] Remove irrelevant skills

### Meta Information
- [ ] Update page title in `index.html`
- [ ] Update meta description in `index.html`
- [ ] Update project name in `package.json`
- [ ] Update project description in `package.json`

## 🎨 Optional Customizations

### Styling
- [ ] Review color scheme in `tailwind.config.js`
- [ ] Change primary color (pass) if desired
- [ ] Change secondary color (fail) if desired
- [ ] Adjust font family if desired
- [ ] Modify spacing/sizing if needed

### Content
- [ ] Add more projects (4+)
- [ ] Add certifications section (optional)
- [ ] Add blog section (optional)
- [ ] Add testimonials (optional)
- [ ] Add resume download link (optional)

### Features
- [ ] Add Google Analytics (optional)
- [ ] Add contact form (optional)
- [ ] Add newsletter signup (optional)
- [ ] Add social media feed (optional)

## 🧪 Testing & Quality

- [ ] Run all tests (`npm test`)
- [ ] All tests passing
- [ ] Run linter (`npm run lint`)
- [ ] No linting errors
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on mobile device
- [ ] Test dark mode
- [ ] Test all navigation links
- [ ] Test project modals
- [ ] Test contact links
- [ ] Check for console errors
- [ ] Run Lighthouse audit (95+ score target)
- [ ] Check accessibility (WCAG AA)

## 🚀 Pre-Deployment

- [ ] Build project (`npm run build`)
- [ ] Build succeeds without errors
- [ ] Preview production build (`npm run preview`)
- [ ] Production build works correctly
- [ ] All images optimized
- [ ] All links working
- [ ] Meta tags correct
- [ ] Favicon added (optional)

## ☁️ AWS Setup

### AWS Account
- [ ] AWS account created
- [ ] Payment method added
- [ ] IAM user created (for manual deployment)
- [ ] IAM user created (for GitHub Actions - separate user)
- [ ] Access keys generated
- [ ] AWS CLI installed
- [ ] AWS CLI configured (`aws configure`)
- [ ] Credentials tested

### SSL Certificate
- [ ] ACM certificate requested (us-east-1 region)
- [ ] Certificate ARN saved
- [ ] DNS validation records obtained
- [ ] Validation records added to Cloudflare
- [ ] Certificate validated and issued

### S3 Bucket
- [ ] S3 bucket created
- [ ] Bucket name chosen (globally unique)
- [ ] Static website hosting enabled
- [ ] Index document set to `index.html`
- [ ] Error document set to `index.html`
- [ ] Bucket policy updated with your bucket name
- [ ] Bucket policy applied
- [ ] Bucket is public

### Initial Deployment
- [ ] Files uploaded to S3 (`aws s3 sync dist/ s3://your-bucket`)
- [ ] Website accessible via S3 URL
- [ ] All pages load correctly
- [ ] All assets load correctly
- [ ] No 403/404 errors

## 🌐 CloudFront Setup (Recommended)

- [ ] CloudFront distribution created
- [ ] Origin set to S3 bucket
- [ ] Default root object set to `index.html`
- [ ] HTTPS enabled
- [ ] ACM certificate attached to distribution
- [ ] Alternate domain names (CNAMEs) added
- [ ] Custom error responses configured (403 → /index.html)
- [ ] Custom error responses configured (404 → /index.html)
- [ ] Distribution deployed (wait 10-15 min)
- [ ] CloudFront domain noted (e.g., d1234.cloudfront.net)
- [ ] Website accessible via CloudFront URL
- [ ] HTTPS working

## 🌍 Cloudflare Domain Setup

### DNS Configuration
- [ ] Cloudflare account with domain
- [ ] ACM validation CNAME record added
- [ ] ACM validation CNAME set to "DNS only" (gray cloud)
- [ ] Root domain CNAME added (@ → CloudFront domain)
- [ ] Root domain set to "DNS only" (gray cloud)
- [ ] WWW subdomain CNAME added (www → CloudFront domain)
- [ ] WWW subdomain set to "DNS only" (gray cloud)

### SSL/TLS Configuration
- [ ] SSL/TLS mode set to "Full"
- [ ] "Always Use HTTPS" enabled (optional)
- [ ] HSTS enabled (optional, after testing)

### Verification
- [ ] DNS propagation complete (check dnschecker.org)
- [ ] Website accessible via custom domain
- [ ] HTTPS working on custom domain
- [ ] HTTP redirects to HTTPS
- [ ] WWW subdomain works
- [ ] No SSL warnings

## 🔄 CI/CD Setup with GitHub Actions

### GitHub Repository
- [ ] Git repository initialized
- [ ] Initial commit made
- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Repository is public or private (your choice)

### IAM User for GitHub Actions
- [ ] Separate IAM user created (`github-actions-deploy`)
- [ ] Custom policy created with minimal permissions
- [ ] Policy allows S3 operations on specific bucket
- [ ] Policy allows CloudFront invalidation
- [ ] Access keys generated for this user
- [ ] Access keys saved securely

### GitHub Secrets
- [ ] GitHub Secrets added:
  - [ ] `AWS_ACCESS_KEY_ID` (GitHub Actions IAM user)
  - [ ] `AWS_SECRET_ACCESS_KEY` (GitHub Actions IAM user)
  - [ ] `S3_BUCKET_NAME` (your bucket name)
  - [ ] `CLOUDFRONT_DISTRIBUTION_ID` (your distribution ID)

### Workflow Testing
- [ ] Workflow files reviewed:
  - [ ] `.github/workflows/deploy.yml`
  - [ ] `.github/workflows/pr-check.yml`
- [ ] Test branch created
- [ ] Test PR created
- [ ] PR Quality Checks run successfully
- [ ] PR merged
- [ ] Deploy workflow runs successfully
- [ ] Website updated with changes
- [ ] CloudFront cache invalidated

### Branch Protection (Recommended)
- [ ] Branch protection rules enabled for `main`
- [ ] Require status checks before merging
- [ ] Require branches to be up to date
- [ ] Require pull request reviews (optional)
- [ ] Include administrators in restrictions

## 📊 Post-Deployment

### Verification
- [ ] Website loads fast (< 3 seconds)
- [ ] All sections visible
- [ ] All links working
- [ ] Images loading
- [ ] Dark mode working
- [ ] Mobile responsive
- [ ] No console errors
- [ ] SEO meta tags present

### Monitoring
- [ ] CloudWatch monitoring enabled (optional)
- [ ] Billing alerts set up
- [ ] Google Analytics added (optional)
- [ ] Google Search Console added (optional)

### Sharing
- [ ] Add website URL to LinkedIn profile
- [ ] Add website URL to GitHub profile
- [ ] Add website URL to resume
- [ ] Share on social media
- [ ] Add to email signature

## 🔧 Maintenance

### Regular Updates
- [ ] Update projects as completed
- [ ] Update skills as learned
- [ ] Update contact information if changed
- [ ] Check for broken links monthly
- [ ] Update dependencies quarterly (`npm update`)
- [ ] Run security audit quarterly (`npm audit`)
- [ ] Review and update content quarterly

### Performance
- [ ] Run Lighthouse audit quarterly
- [ ] Optimize images if needed
- [ ] Review bundle size
- [ ] Check loading times

## 📈 Optimization (Optional)

- [ ] Add sitemap.xml
- [ ] Add robots.txt
- [ ] Implement lazy loading for images
- [ ] Add Open Graph tags for social sharing
- [ ] Add Twitter Card tags
- [ ] Implement structured data (JSON-LD)
- [ ] Add RSS feed (if blog added)
- [ ] Optimize for Core Web Vitals

## 🎯 Goals

- [ ] Portfolio live and accessible
- [ ] Shared with network
- [ ] Added to job applications
- [ ] Receiving traffic
- [ ] Getting positive feedback
- [ ] Landing interviews
- [ ] Achieving career goals

---

## Quick Reference

### Essential Commands
```bash
npm install          # Install dependencies
npm run dev          # Start dev server
npm test            # Run tests
npm run build       # Build for production
npm run preview     # Preview production build
```

### Deployment Commands
```bash
aws s3 sync dist/ s3://your-bucket --delete
aws cloudfront create-invalidation --distribution-id ID --paths "/*"
```

### File Locations
- Projects: `src/data/projects.json`
- Skills: `src/data/skills.json`
- Contact: `src/components/Contact.tsx`
- Personal: `src/components/Hero.tsx`, `src/components/About.tsx`

---

**Progress Tracker**

- Setup: __ / 12 items
- Content: __ / 29 items
- Testing: __ / 15 items
- AWS: __ / 13 items
- Total: __ / 69 items

**Target: 100% Complete** ✨

---

*Last Updated: November 2024*
