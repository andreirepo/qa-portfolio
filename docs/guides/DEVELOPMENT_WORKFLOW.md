# Development Workflow Guide

This guide outlines the development workflow and quality gates for the QA Portfolio project.

## 🔧 Development Setup

### Prerequisites

- Node.js 18+
- Git
- VS Code (recommended)

### Initial Setup

```bash
# Clone and install
git clone <repo-url>
cd qa-portfolio
npm install

# Start development
npm run dev
```

## 🛡️ Quality Gates

### Pre-commit Hooks (Husky)

Every commit automatically runs:

- **Lint-staged**: Formats and lints only changed files
- **Type checking**: Ensures TypeScript compilation
- **Commit message validation**: Enforces conventional commit format

### Commit Message Format

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore, perf, ci, build, revert
```

Examples:

- `feat(auth): add login functionality`
- `fix: resolve build issue`
- `docs: update README`

## 🧪 Testing Strategy

### Unit Tests (Vitest)

```bash
npm run test          # Run once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

### E2E Tests (Playwright)

```bash
npm run test:e2e         # Headless
npm run test:e2e:headed  # With browser
npm run test:e2e:ui      # Interactive UI
```

### Local CI Testing

```bash
./scripts/test-ci.sh  # Test full CI pipeline locally
```

## 🚀 CI/CD Pipeline

### Pull Request Workflow

1. **Linting**: ESLint checks code quality
2. **Build**: TypeScript compilation + Vite build
3. **E2E Tests**: Playwright tests across browsers
4. **Review**: Manual code review required

### Deployment Workflow

1. **Merge to main**: Triggers automatic deployment
2. **Build & Test**: Same as PR workflow
3. **Deploy**: Automatic deployment to LightSail
4. **Verify**: Health check on live site

## 📝 Available Scripts

### Development

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run preview` - Preview production build

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - TypeScript type checking

### Testing

- `npm run test` - Unit tests
- `npm run test:e2e` - E2E tests
- `npm run test:coverage` - Test coverage

### Deployment

- `npm run deploy` - Build and deploy

## 🔄 Development Workflow

### Feature Development

1. **Create branch**: `git checkout -b feat/feature-name`
2. **Develop**: Make changes with frequent commits
3. **Test locally**: Run tests and linting
4. **Push**: `git push origin feat/feature-name`
5. **Create PR**: Open pull request for review
6. **Review**: Address feedback and CI checks
7. **Merge**: Squash and merge to main
8. **Deploy**: Automatic deployment to production

### Hotfix Workflow

1. **Create hotfix**: `git checkout -b fix/issue-name`
2. **Fix quickly**: Minimal changes to resolve issue
3. **Test**: Ensure fix works and doesn't break anything
4. **Fast-track**: Quick review and merge
5. **Deploy**: Immediate deployment

## 🛠️ Tools & Configuration

### Code Formatting

- **Prettier**: Automatic code formatting
- **ESLint**: Code quality and consistency
- **Husky**: Git hooks for quality gates
- **Lint-staged**: Run tools on staged files only

### Testing

- **Vitest**: Fast unit testing
- **Playwright**: Reliable E2E testing
- **Testing Library**: Component testing utilities

### Build & Deploy

- **Vite**: Fast build tool
- **TypeScript**: Type safety
- **Docker**: Containerized deployment
- **GitHub Actions**: CI/CD automation

## 🚨 Troubleshooting

### Common Issues

**Pre-commit hooks failing:**

```bash
# Fix linting issues
npm run lint:fix

# Fix type errors
npm run type-check
```

**E2E tests failing:**

```bash
# Update browser binaries
npx playwright install

# Run in headed mode to debug
npm run test:e2e:headed
```

**Build failing:**

```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Getting Help

1. Check this documentation
2. Review error messages carefully
3. Run tests locally before pushing
4. Ask for help in PR comments

## 📊 Quality Metrics

### Code Coverage

- **Target**: >80% for unit tests
- **E2E Coverage**: Critical user flows
- **Reports**: Generated automatically

### Performance

- **Build time**: <2 minutes
- **Test time**: <30 seconds
- **Bundle size**: <500KB gzipped

### Reliability

- **CI success rate**: >95%
- **Deployment success**: >99%
- **Zero-downtime deployments**: Always
