# Setup Instructions

Complete setup guide for the QA Portfolio project.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18 or higher ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **Code Editor** (VS Code recommended)

## Installation Steps

### 1. Navigate to Project Directory

```bash
cd qa-portfolio
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Vitest & Testing Library
- And more...

Installation takes 2-3 minutes depending on your internet speed.

### 3. Verify Installation

Check that everything installed correctly:

```bash
npm list --depth=0
```

You should see all dependencies listed without errors.

### 4. Start Development Server

```bash
npm run dev
```

You should see output like:

```
VITE v5.1.4  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 5. Open in Browser

Navigate to http://localhost:5173

You should see your portfolio site with:

- Hero section with "All Tests Passing" badge
- About section
- Projects showcase
- Skills with progress bars
- Contact information
- Dark mode toggle

## Verify Everything Works

### Run Tests

```bash
npm test
```

Expected output:

```
✓ src/test/App.test.tsx (3)
✓ src/test/components/Header.test.tsx (2)
✓ src/test/components/Projects.test.tsx (3)

Test Files  3 passed (3)
Tests  8 passed (8)
```

### Run Linter

```bash
npm run lint
```

Should complete without errors.

### Build for Production

```bash
npm run build
```

Expected output:

```
vite v5.1.4 building for production...
✓ built in 2.5s
```

This creates a `dist/` folder with optimized files.

### Preview Production Build

```bash
npm run preview
```

Opens production build at http://localhost:4173

## Project Structure Overview

```
qa-portfolio/
├── src/
│   ├── components/       # React components
│   │   ├── Header.tsx    # Navigation header
│   │   ├── Hero.tsx      # Landing section
│   │   ├── About.tsx     # About section
│   │   ├── Projects.tsx  # Projects grid
│   │   ├── ProjectModal.tsx  # Project details modal
│   │   ├── Skills.tsx    # Skills section
│   │   ├── Contact.tsx   # Contact section
│   │   └── Footer.tsx    # Footer
│   ├── data/            # JSON data files
│   │   ├── projects.json # Your projects
│   │   └── skills.json   # Your skills
│   ├── test/            # Test files
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── .github/workflows/   # GitHub Actions
├── README.md           # Main documentation
├── DEPLOYMENT.md       # AWS deployment guide
├── QUICKSTART.md       # Quick start guide
└── package.json        # Dependencies
```

## Customization Checklist

After setup, customize these files:

- [ ] `src/data/projects.json` - Add your projects
- [ ] `src/data/skills.json` - Update your skills
- [ ] `src/components/Contact.tsx` - Your contact info
- [ ] `src/components/Hero.tsx` - Your name and title
- [ ] `src/components/About.tsx` - Your background
- [ ] `index.html` - Page title and meta tags
- [ ] `package.json` - Project name and description

## Common Issues & Solutions

### Issue: `npm install` fails

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Port 5173 already in use

**Solution:**

```bash
# Kill process on port 5173
npx kill-port 5173

# Or use a different port
npm run dev -- --port 3000
```

### Issue: TypeScript errors in editor

**Solution:**

1. Ensure dependencies are installed: `npm install`
2. Restart your editor
3. In VS Code: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

### Issue: Tailwind styles not working

**Solution:**

1. Check `tailwind.config.js` is present
2. Verify `postcss.config.js` exists
3. Restart dev server: Ctrl+C, then `npm run dev`

### Issue: Tests failing

**Solution:**

```bash
# Update test snapshots
npm test -- -u

# Run tests in watch mode for debugging
npm run test:watch
```

## VS Code Setup (Recommended)

### Install Recommended Extensions

Open VS Code and install:

- ESLint
- Tailwind CSS IntelliSense
- Prettier
- Vitest

Or run:

```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension vitest.explorer
```

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## Environment Variables

For local development, you don't need any environment variables.

For AWS deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Git Setup

### Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit: QA Portfolio"
```

### Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository
3. Don't initialize with README (we already have one)

### Push to GitHub

```bash
git remote add origin https://github.com/yourusername/qa-portfolio.git
git branch -M main
git push -u origin main
```

## Next Steps

1. ✅ Complete installation
2. ✅ Verify everything works
3. 📝 Customize content with your information
4. 🎨 Adjust colors and styling (optional)
5. 🧪 Run tests to ensure everything works
6. 🚀 Deploy to AWS (see [DEPLOYMENT.md](./DEPLOYMENT.md))
7. 🌐 Set up custom domain (optional)
8. 🔄 Configure GitHub Actions for auto-deploy

## Getting Help

- **Documentation**: Check README.md, DEPLOYMENT.md, QUICKSTART.md
- **Issues**: Search existing issues on GitHub
- **Community**: React, Vite, Tailwind CSS documentation
- **AWS**: AWS documentation and support

## Performance Tips

- Keep images optimized (use WebP format)
- Lazy load images and components
- Monitor bundle size: `npm run build -- --analyze`
- Use Lighthouse for performance audits

## Security Tips

- Never commit `.env` files with real credentials
- Use GitHub Secrets for CI/CD credentials
- Keep dependencies updated: `npm audit`
- Enable 2FA on GitHub and AWS accounts

---

**You're all set! Start customizing your portfolio.** 🎉

For quick start, see [QUICKSTART.md](./QUICKSTART.md)
For deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md)
