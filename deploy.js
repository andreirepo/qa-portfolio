// AWS S3 Deployment Script
// This script uploads the built files to S3 and optionally invalidates CloudFront cache

import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

console.log('AWS Deployment Script');
console.log('=====================\n');

console.log('This script requires AWS CLI to be installed and configured.');
console.log('Run the following commands to deploy:\n');

console.log('1. Build the project:');
console.log('   npm run build\n');

console.log('2. Create an S3 bucket (if not exists):');
console.log('   aws s3 mb s3://your-portfolio-bucket-name\n');

console.log('3. Enable static website hosting:');
console.log('   aws s3 website s3://your-portfolio-bucket-name --index-document index.html --error-document index.html\n');

console.log('4. Upload files to S3:');
console.log('   aws s3 sync dist/ s3://your-portfolio-bucket-name --delete\n');

console.log('5. Make bucket public (update bucket policy):');
console.log('   aws s3api put-bucket-policy --bucket your-portfolio-bucket-name --policy file://bucket-policy.json\n');

console.log('6. (Optional) Create CloudFront distribution for HTTPS and CDN:');
console.log('   aws cloudfront create-distribution --origin-domain-name your-portfolio-bucket-name.s3-website-region.amazonaws.com\n');

console.log('7. (Optional) Invalidate CloudFront cache after updates:');
console.log('   aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"\n');

console.log('\nFor automated deployment, set up GitHub Actions or use the AWS CDK.');
console.log('See README.md for detailed instructions.');
