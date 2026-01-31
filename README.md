# QA Engineer Portfolio

A modern, responsive portfolio website for Quality Assurance Engineers built with React, TypeScript, Tailwind CSS, and Framer Motion.

> **� Documentation:** All guides and documentation are now organized in the [`/docs`](./docs/) folder. See the [Documentation Index](./docs/README.md) for easy navigation.

> **�🚀 New here? Start with [START_HERE.md](./docs/setup/START_HERE.md) for a guided setup!**
>
> **📱 Have a Cloudflare domain?** See [QUICK_DEPLOY_CLOUDFLARE.md](./docs/deployment/QUICK_DEPLOY_CLOUDFLARE.md) for fast deployment with automatic GitHub Actions!

## Features

- 🎨 Modern, clean design with dark mode support
- 📱 Fully responsive across all devices
- ⚡ Fast performance with Vite
- 🎭 Smooth animations with Framer Motion
- 📊 Project showcase with detailed metrics
- 🧪 Comprehensive test coverage
- 🚀 Easy deployment to AWS S3 + CloudFront
- 📝 JSON-based content management (no backend needed)

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router
- **Icons**: Lucide React
- **Testing**: Vitest + React Testing Library
- **Deployment**: AWS S3 + CloudFront

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd qa-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage report
- `npm run lint` - Lint code with ESLint

## Customization

### Update Your Information

1. **Projects**: Edit `src/data/projects.json` to add/modify your projects
2. **Skills**: Edit `src/data/skills.json` to update your skills
3. **Contact Info**: Update `src/components/Contact.tsx` with your contact details
4. **Personal Info**: Modify `src/components/Hero.tsx` and `src/components/About.tsx`

### Styling

- Colors and theme: `tailwind.config.js`
- Global styles: `src/index.css`
- Component-specific styles: Inline Tailwind classes

## Testing

The project includes comprehensive tests using Vitest and React Testing Library.

Run tests:
```bash
npm test
```

Generate coverage report:
```bash
npm run test:coverage
```

## Deployment

### Using Cloudflare Domain?

If you have a domain hosted on Cloudflare, see **[CLOUDFLARE_SETUP.md](./docs/deployment/CLOUDFLARE_SETUP.md)** for detailed instructions on connecting your Cloudflare domain to AWS.

### Automated Deployment with GitHub Actions

For automatic deployment on every PR merge, see **[CICD_SETUP.md](./docs/deployment/CICD_SETUP.md)** for complete CI/CD setup instructions.

## Deployment to AWS

### Option 1: Manual Deployment

#### Step 1: Build the Project
```bash
npm run build
```

#### Step 2: Install and Configure AWS CLI

Install AWS CLI:
- **Windows**: Download from https://aws.amazon.com/cli/
- **macOS**: `brew install awscli`
- **Linux**: `sudo apt-get install awscli`

Configure AWS credentials:
```bash
aws configure
```

Enter your:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (e.g., us-east-1)
- Default output format (json)

#### Step 3: Create S3 Bucket
```bash
aws s3 mb s3://your-portfolio-bucket-name
```

Replace `your-portfolio-bucket-name` with your desired bucket name (must be globally unique).

#### Step 4: Enable Static Website Hosting
```bash
aws s3 website s3://your-portfolio-bucket-name \
  --index-document index.html \
  --error-document index.html
```

#### Step 5: Update Bucket Policy

Edit `bucket-policy.json` and replace `your-portfolio-bucket-name` with your actual bucket name.

Apply the policy:
```bash
aws s3api put-bucket-policy \
  --bucket your-portfolio-bucket-name \
  --policy file://bucket-policy.json
```

#### Step 6: Upload Files
```bash
aws s3 sync dist/ s3://your-portfolio-bucket-name --delete
```

Your site is now live at: `http://your-portfolio-bucket-name.s3-website-us-east-1.amazonaws.com`

#### Step 7 (Optional): Add CloudFront for HTTPS and CDN

Create CloudFront distribution:
```bash
aws cloudfront create-distribution \
  --origin-domain-name your-portfolio-bucket-name.s3.amazonaws.com \
  --default-root-object index.html
```

Or use the AWS Console:
1. Go to CloudFront in AWS Console
2. Create Distribution
3. Set Origin Domain to your S3 bucket
4. Set Default Root Object to `index.html`
5. Enable HTTPS
6. Create distribution

After updates, invalidate cache:
```bash
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

### Option 2: Automated Deployment with GitHub Actions

The project includes GitHub Actions workflows for:
- **PR Quality Checks**: Runs tests and linting on every pull request
- **Automatic Deployment**: Deploys to AWS when PR is merged to main

#### Quick Setup:

1. Create GitHub repository and push your code
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Add these secrets:
   - `AWS_ACCESS_KEY_ID`: Your AWS access key
   - `AWS_SECRET_ACCESS_KEY`: Your AWS secret key
   - `S3_BUCKET_NAME`: Your S3 bucket name
   - `CLOUDFRONT_DISTRIBUTION_ID`: (Optional) Your CloudFront distribution ID

4. Create a PR and merge it - deployment happens automatically!

**For detailed CI/CD setup instructions, see [CICD_SETUP.md](./CICD_SETUP.md)**

The workflows will:
- Run linter and tests on every PR
- Build and deploy on PR merge
- Invalidate CloudFront cache
- Post status comments on PRs

### Option 3: AWS CDK (Infrastructure as Code)

For a more robust setup, consider using AWS CDK:

```bash
npm install -g aws-cdk
cdk init app --language typescript
```

This allows you to define your infrastructure in code and deploy with `cdk deploy`.

## Cost Estimation

AWS S3 + CloudFront hosting is very affordable:

- **S3 Storage**: ~$0.023 per GB/month
- **S3 Requests**: Minimal for static sites
- **CloudFront**: Free tier includes 1TB data transfer/month
- **Estimated monthly cost**: $1-5 for most portfolios

## Performance

- Lighthouse Score: 95+ across all metrics
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Bundle size: < 200KB (gzipped)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Project Structure

```
qa-portfolio/
├── src/
│   ├── components/       # React components
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── ProjectModal.tsx
│   │   ├── Skills.tsx
│   │   ├── Contact.tsx
│   │   └── Footer.tsx
│   ├── data/            # JSON data files
│   │   ├── projects.json
│   │   └── skills.json
│   ├── test/            # Test files
│   │   ├── components/
│   │   └── setup.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── docs/                # Documentation
│   ├── setup/           # Setup and getting started guides
│   ├── deployment/      # Deployment guides
│   ├── guides/          # Project guides and references
│   ├── analysis/        # Analysis and review documents
│   ├── templates/       # Templates and examples
│   └── README.md        # Documentation index
├── .github/
│   └── workflows/
│       └── deploy.yml   # GitHub Actions workflow
├── bucket-policy.json   # S3 bucket policy
├── deploy.js           # Deployment helper script
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Troubleshooting

### Build Issues

If you encounter build errors:
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### AWS Deployment Issues

**403 Forbidden Error**: Check bucket policy is correctly applied
**404 on Refresh**: Ensure error document is set to `index.html` for SPA routing
**CloudFront not updating**: Invalidate the cache with `/*` path

### Dark Mode Not Persisting

Clear browser localStorage and refresh the page.

## Contributing

Feel free to fork this project and customize it for your own portfolio!

## License

MIT License - feel free to use this project for your own portfolio.

## Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review AWS documentation for deployment questions

## Additional Guides

### Setup & Getting Started
- **[START_HERE.md](./docs/setup/START_HERE.md)** - Complete guided setup for new users
- **[QUICKSTART.md](./docs/setup/QUICKSTART.md)** - Get started in 5 minutes
- **[SETUP.md](./docs/setup/SETUP.md)** - Complete setup instructions

### Deployment
- **[DEPLOYMENT.md](./docs/deployment/DEPLOYMENT.md)** - Detailed AWS deployment guide
- **[CLOUDFLARE_SETUP.md](./docs/deployment/CLOUDFLARE_SETUP.md)** - Connect your Cloudflare domain to AWS
- **[CICD_SETUP.md](./docs/deployment/CICD_SETUP.md)** - Set up automated deployment with GitHub Actions
- **[QUICK_DEPLOY_CLOUDFLARE.md](./docs/deployment/QUICK_DEPLOY_CLOUDFLARE.md)** - Fast deployment with Cloudflare

### Project Guides
- **[PROJECT_OVERVIEW.md](./docs/guides/PROJECT_OVERVIEW.md)** - Technical overview
- **[CHECKLIST.md](./docs/guides/CHECKLIST.md)** - Step-by-step checklist
- **[BRANDING_GUIDE.md](./docs/guides/BRANDING_GUIDE.md)** - Brand guidelines and styling
- **[PROJECTS_INTEGRATION_GUIDE.md](./docs/guides/PROJECTS_INTEGRATION_GUIDE.md)** - How to add and manage projects

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Animated with [Framer Motion](https://www.framer.com/motion/)
- Icons from [Lucide](https://lucide.dev/)

---

**Happy Testing! 🧪✨**
