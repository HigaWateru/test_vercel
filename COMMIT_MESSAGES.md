# 📝 Suggested Conventional Commits

## Git Commit Messages cho các thay đổi SEO

Dưới đây là các commit messages được khuyến nghị theo tiêu chuẩn Conventional Commits:

### 1. HTML & Meta Tags Optimization
```
feat(seo): optimize index.html with comprehensive meta tags

- Add language attribute (vi) for Vietnamese content
- Add meta description with target keywords
- Add meta robots with index, follow directives
- Add canonical URL meta tag
- Add Open Graph tags for social media sharing
- Add Twitter Card meta tags
- Add security headers (CSP, X-Frame-Options, etc)
- Add preload/prefetch for critical resources
- Add manifest.json link for PWA support
- BREAKING CHANGE: Lang attribute changed from 'en' to 'vi'
```

### 2. Create useHead Hook
```
feat(hooks): create useHead hook for dynamic meta tags management

- Implement dynamic title update per page
- Implement dynamic meta description update
- Implement dynamic meta keywords update
- Implement dynamic canonical URL update
- Implement dynamic Open Graph tags update
- Implement dynamic Twitter Card tags update
- Implement dynamic structured data (JSON-LD) injection
- Support custom meta tags per page
```

### 3. Add Breadcrumb Component with Schema
```
feat(components): add Breadcrumb component with structured data

- Create Breadcrumb component with semantic HTML
- Generate BreadcrumbList schema automatically
- Add generateBreadcrumbs utility function
- Add generateBreadcrumbSchema utility function
- Support dynamic breadcrumb generation based on route
- Add itemScope and itemProp for structured data
- Add aria-label for accessibility
```

### 4. Create Structured Data Schemas
```
feat(utils): add JSON-LD structured data schemas

- Create Organization schema for company/app info
- Create Website schema for site search action
- Create SoftwareApplication schema for app description
- Add utility functions for schema generation
- Support multiple schema types per page
- Follow schema.org specifications
```

### 5. Update Pages with Dynamic Meta Tags
```
feat(pages): implement dynamic SEO meta tags on all pages

- Add useHead to Login page
- Add useHead to Register page
- Add useHead to ProjectList page with breadcrumb
- Add useHead to ProjectDetail page with breadcrumb
- Add useHead to MyTask page with breadcrumb
- Add useHead to NotFound page
- Customize title, description, keywords per page
- Add canonical URLs for each page
```

### 6. Create Sitemap & Robots.txt
```
feat(seo): create sitemap.xml and robots.txt for crawlability

- Generate comprehensive sitemap.xml with all routes
- Add changefreq and priority for each URL
- Add mobile:mobile tag for mobile-optimized pages
- Create robots.txt with proper directives
- Allow/disallow crawling based on routes
- Add sitemap reference in robots.txt
- Set Crawl-delay for different user agents
```

### 7. Create Manifest & .htaccess
```
feat(pwa): create manifest.json and .htaccess for PWA & performance

- Create manifest.json for PWA support
- Add multiple icon sizes (192x192, 512x512)
- Configure display mode and colors
- Create .htaccess for server optimization
- Enable GZIP compression
- Configure browser caching with expiration
- Set security headers
- Implement URL rewriting for SPA routing
```

### 8. Optimize Accessibility
```
feat(a11y): enhance accessibility with ARIA labels and semantic HTML

- Update Header with role and aria-labels
- Update Footer with role and aria-labels
- Update Breadcrumb with itemScope for schema
- Add aria-current for active navigation items
- Add alt text with project names for images
- Add loading="lazy" for image optimization
- Improve heading hierarchy (H1 > H2 > H3)
- Add role="list" for breadcrumb navigation
```

### 9. Optimize Performance in Vite
```
feat(build): optimize Vite build configuration for performance

- Implement manual code splitting for vendors
- Split vendor-react, vendor-antd, vendor-redux chunks
- Create separate chunks for each route
- Enable CSS code splitting
- Configure Terser for JS minification
- Set chunk size warning limit
- Optimize dependencies pre-bundling
- Enable compressed size reporting
```

### 10. Add Schema Data Injection
```
feat(main): inject Organization and Website schemas in app root

- Add Organization schema to document head
- Add Website schema to document head
- Follow JSON-LD format
- Support dynamic schema updates
- Initialize schemas on app startup
```

---

## Full Git History Example

```bash
# 1. Optimize HTML
git commit -am "feat(seo): optimize index.html with comprehensive meta tags"

# 2. Create useHead hook
git commit -am "feat(hooks): create useHead hook for dynamic meta tags management"

# 3. Add Breadcrumb
git commit -am "feat(components): add Breadcrumb component with structured data"

# 4. Add schemas
git commit -am "feat(utils): add JSON-LD structured data schemas"

# 5. Update pages
git commit -am "feat(pages): implement dynamic SEO meta tags on all pages"

# 6. Create sitemap
git commit -am "feat(seo): create sitemap.xml and robots.txt for crawlability"

# 7. Create manifest
git commit -am "feat(pwa): create manifest.json and .htaccess for PWA & performance"

# 8. Accessibility
git commit -am "feat(a11y): enhance accessibility with ARIA labels and semantic HTML"

# 9. Vite optimization
git commit -am "feat(build): optimize Vite build configuration for performance"

# 10. Schema injection
git commit -am "feat(main): inject Organization and Website schemas in app root"

# 11. Update package.json
git commit -am "docs(package): add analyze script for bundle size analysis"
```

---

## Commit Message Template

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (formatting, etc)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to build process, dependencies, etc

### Scope
- `seo`: SEO-related changes
- `a11y`: Accessibility changes
- `pwa`: PWA-related changes
- `build`: Build configuration
- `perf`: Performance optimization
- `components`: React component changes
- `pages`: Page-related changes
- `hooks`: Custom hooks
- `utils`: Utility functions

### Subject
- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No dot (.) at the end

### Body
- Explain what and why, not how
- Use bullet points for multiple changes

---

## Verification Checklist

Before committing, verify:
- [ ] All files are created/modified correctly
- [ ] No syntax errors
- [ ] Types are correct (TypeScript)
- [ ] Components are properly exported
- [ ] Meta tags are applied to all pages
- [ ] Sitemap contains all routes
- [ ] Robots.txt is properly configured
- [ ] Manifest.json has valid structure
- [ ] ARIA labels are added appropriately
- [ ] Images have alt text
- [ ] Heading hierarchy is correct
- [ ] Build passes without errors
- [ ] No console warnings

---

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Commit Messages](https://seesparkbox.com/foundry/semantic_commit_messages)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)
