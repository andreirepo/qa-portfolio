# Quick Start Guide

Get your QA Portfolio up and running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Start Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## 3. Customize Your Content

### Update Projects

Edit `src/data/projects.json`:

- Add your testing projects
- Update metrics and achievements
- Add GitHub/report links

### Update Skills

Edit `src/data/skills.json`:

- Modify skill categories
- Adjust proficiency levels
- Add new technologies

### Update Contact Information

Edit `src/components/Contact.tsx`:

- Replace email address
- Update LinkedIn, GitHub, Twitter links
- Modify availability status

### Update Personal Information

Edit these files:

- `src/components/Hero.tsx` - Your title and intro
- `src/components/About.tsx` - Your background and philosophy
- `index.html` - Page title and meta description

## 4. Test Your Changes

```bash
npm test
```

## 5. Build for Production

```bash
npm run build
```

## 6. Deploy to AWS

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed AWS deployment instructions.

Quick deploy:

```bash
# Build
npm run build

# Upload to S3 (replace with your bucket name)
aws s3 sync dist/ s3://your-bucket-name --delete
```

## Common Customizations

### Change Color Scheme

Edit `tailwind.config.js`:

```js
colors: {
  pass: '#10b981',  // Change to your preferred color
  fail: '#ef4444',
}
```

### Add New Section

1. Create component in `src/components/`
2. Import in `src/App.tsx`
3. Add to navigation in `src/components/Header.tsx`

### Modify Animations

Edit animation settings in component files using Framer Motion props:

```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.5 }}
```

## Troubleshooting

**Port already in use?**

```bash
# Kill process on port 5173
npx kill-port 5173
npm run dev
```

**Build errors?**

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Dark mode not working?**

- Clear browser localStorage
- Check browser console for errors

## Next Steps

- [ ] Customize all content with your information
- [ ] Add your own projects and achievements
- [ ] Test on mobile devices
- [ ] Run accessibility checks
- [ ] Deploy to AWS
- [ ] Set up custom domain
- [ ] Configure GitHub Actions for auto-deploy

## Resources

- [Full README](./README.md)
- [AWS Deployment Guide](./DEPLOYMENT.md)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Framer Motion Docs](https://www.framer.com/motion)

---

**Happy building! 🎉**
