import { test, expect } from '@playwright/test';

test.describe('Portfolio E2E Tests', () => {
  test('should load homepage and display hero section', async ({ page }) => {
    await page.goto('/');
    
    // Check if hero section loads
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText(/Andrei|QA|Engineer/i);
    
    // Check if navigation is present
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should navigate to different sections', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation links
    const sections = ['About', 'Projects', 'Skills', 'Contact'];
    
    for (const section of sections) {
      const link = page.locator(`nav a:has-text("${section}")`);
      if (await link.isVisible()) {
        await link.click();
        await page.waitForTimeout(500); // Wait for smooth scroll
        
        // Check if section is visible
        const sectionElement = page.locator(`#${section.toLowerCase()}, [data-section="${section.toLowerCase()}"]`).first();
        await expect(sectionElement).toBeVisible();
      }
    }
  });

  test('should display projects section', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to projects section
    const projectsLink = page.locator('nav a:has-text("Projects")');
    if (await projectsLink.isVisible()) {
      await projectsLink.click();
      await page.waitForTimeout(500);
    }
    
    // Check if projects are displayed
    const projectsSection = page.locator('[data-section="projects"], #projects').first();
    await expect(projectsSection).toBeVisible();
  });

  test('should have working contact form', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to contact section
    const contactLink = page.locator('nav a:has-text("Contact")');
    if (await contactLink.isVisible()) {
      await contactLink.click();
      await page.waitForTimeout(500);
    }
    
    // Check if contact section is visible
    const contactSection = page.locator('[data-section="contact"], #contact').first();
    await expect(contactSection).toBeVisible();
    
    // Check for contact information or form
    const hasContactInfo = await page.locator('a[href^="mailto:"], a[href^="tel:"], form').count() > 0;
    expect(hasContactInfo).toBeTruthy();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');
    
    // Check if mobile navigation works (hamburger menu)
    const mobileMenu = page.locator('[data-testid="mobile-menu"], .mobile-menu, button[aria-label*="menu"]').first();
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await expect(page.locator('nav')).toBeVisible();
    }
    
    // Check if content is still visible on mobile
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    await page.goto('/');
    
    // Check essential meta tags
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /.+/);
  });

  test('should load without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out known non-critical errors
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('404') &&
      !error.includes('net::ERR_')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});