# ThinkLab Academy Website

## About
ThinkLab Academy is Egypt's first non-profit organization dedicated to serving Egyptian students from all backgrounds with comprehensive academic resources, instructional videos, and extracurricular opportunities.

## Features
- 📚 Study materials and instructional videos
- 🎓 Scholarship and university guidance
- 🏆 Competition preparation resources
- 📝 Test prep for SAT, IELTS, TOEFL, ACT
- 🌐 Centralized opportunity database

## Project Structure
```
thinklab-academy/
├── index.html (or home.html)
├── materials.html
├── opportunities.html
├── videos.html
├── contact.html
├── Logo.png
├── vercel.json
├── .gitignore
└── README.md
```

## Deployment

### GitHub
1. Create a new repository on GitHub
2. Initialize git in your project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect settings
5. Click "Deploy"

### Custom Domain
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update your domain's DNS settings with the provided nameservers or add the A/CNAME records

## Local Development
Simply open `index.html` in a web browser, or use a local server:
```bash
python -m http.server 8000
# or
npx serve
```

## Contact
For questions or support, visit our website or contact us through the Contact page.

## License
© 2025 ThinkLab Academy. All Rights Reserved.