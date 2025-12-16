# Contributing to PakAlert

First off, thank you for considering contributing to PakAlert! It's people like you that make PakAlert such a great tool for the Pakistani community.

## 🌟 Ways to Contribute

### 1. Reporting Bugs
If you find a bug, please create an issue with:
- Clear bug description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Your environment (OS, browser, Node version)

### 2. Suggesting Features
We love new ideas! Create an issue with:
- Feature description
- Why it would be useful
- How it should work
- Mockups or examples (if applicable)

### 3. Code Contributions
- Fix bugs
- Implement new features
- Improve documentation
- Add tests
- Optimize performance

### 4. Documentation
- Fix typos
- Improve explanations
- Add examples
- Translate to Urdu

## 🚀 Getting Started

### 1. Fork the Repository
Click the "Fork" button at the top right of the repository page.

### 2. Clone Your Fork
```bash
git clone https://github.com/YOUR_USERNAME/pakalert.git
cd pakalert
```

### 3. Add Upstream Remote
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/pakalert.git
```

### 4. Create a Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 5. Set Up Development Environment

#### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm start
```

## 📝 Coding Guidelines

### JavaScript/React Style
- Use ES6+ features
- Use functional components with hooks
- Use meaningful variable names
- Add comments for complex logic
- Follow existing code structure

### Naming Conventions
```javascript
// Components: PascalCase
const WeatherCard = () => {};

// Functions: camelCase
const fetchWeatherData = () => {};

// Constants: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';

// Files: PascalCase for components, camelCase for utilities
WeatherCard.jsx
apiClient.js
```

### Code Structure
```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 2. Constants
const API_URL = process.env.REACT_APP_API_URL;

// 3. Component
const MyComponent = ({ theme, data }) => {
  // 3.1 State
  const [loading, setLoading] = useState(false);
  
  // 3.2 Effects
  useEffect(() => {
    // Effect logic
  }, []);
  
  // 3.3 Handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // 3.4 Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 4. Export
export default MyComponent;
```

### CSS/Styling
- Use Tailwind CSS classes
- Follow mobile-first approach
- Ensure dark/light theme compatibility
- Test responsive design

```jsx
// Good
<div className={`p-4 rounded-lg ${
  theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'
}`}>

// Avoid inline styles unless absolutely necessary
```

## ✅ Before Submitting

### 1. Test Your Changes
```bash
# Frontend
cd frontend
npm test
npm run build  # Ensure build succeeds

# Backend
cd backend
npm test
node server.js  # Ensure server starts
```

### 2. Run Linters
```bash
# Frontend
cd frontend
npm run lint

# Backend
cd backend
npm run lint
```

### 3. Check Code Quality
- [ ] Code follows project style guidelines
- [ ] No console.log() statements (use console.error/warn if needed)
- [ ] No commented-out code
- [ ] Proper error handling
- [ ] Meaningful commit messages

### 4. Update Documentation
- [ ] Update README.md if needed
- [ ] Add JSDoc comments for functions
- [ ] Update API_DOCUMENTATION.md for API changes

## 📤 Submitting Changes

### 1. Commit Your Changes
```bash
git add .
git commit -m "feat: add AI weather predictions"

# Use conventional commit messages:
# feat: new feature
# fix: bug fix
# docs: documentation changes
# style: formatting changes
# refactor: code restructuring
# test: adding tests
# chore: maintenance tasks
```

### 2. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 3. Create Pull Request
1. Go to the original repository
2. Click "New Pull Request"
3. Select your fork and branch
4. Fill out the PR template:
   - Description of changes
   - Related issue number
   - Testing done
   - Screenshots (if UI changes)

### Pull Request Template
```markdown
## Description
Brief description of what this PR does

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issue
Closes #(issue number)

## Testing
Describe how you tested your changes

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
```

## 🔍 Code Review Process

1. **Automated Checks**: GitHub Actions will run tests and linters
2. **Maintainer Review**: Project maintainer will review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged!

### Review Response Time
- Bug fixes: 1-2 days
- Features: 3-5 days
- Documentation: 1-2 days

## 🐛 Bug Report Template

```markdown
**Describe the Bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node Version: [e.g., 18.0.0]

**Additional Context**
Any other information about the problem.
```

## 💡 Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the Solution**
What you want to happen.

**Describe Alternatives**
Other solutions you've considered.

**Additional Context**
Any other context or screenshots.
```

## 🎨 Design Guidelines

### UI/UX Principles
- **Clarity**: Information should be easy to understand
- **Consistency**: Use established patterns
- **Feedback**: Provide visual feedback for actions
- **Accessibility**: Support keyboard navigation and screen readers
- **Performance**: Optimize for fast loading

### Color Palette
```css
/* Light Theme */
Primary: #3b82f6 (blue-500)
Success: #22c55e (green-500)
Warning: #eab308 (yellow-500)
Error: #ef4444 (red-500)
Background: #ffffff
Text: #1e293b (slate-900)

/* Dark Theme */
Primary: #60a5fa (blue-400)
Success: #4ade80 (green-400)
Warning: #facc15 (yellow-400)
Error: #f87171 (red-400)
Background: #0f172a (slate-950)
Text: #f1f5f9 (slate-100)
```

## 📚 Resources

### Learning Resources
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Socket.IO Guide](https://socket.io/docs/)

### Project-Specific
- [OpenWeather API Docs](https://openweathermap.org/api)
- [Google Gemini AI Docs](https://ai.google.dev/)
- [Framer Motion](https://www.framer.com/motion/)

## ❓ Questions?

- Create an issue with the "question" label
- Email: t.usman36412@gmail.com

## 🏆 Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Added to CONTRIBUTORS.md

Thank you for making PakAlert better! 🙏

---

**Happy Coding!** 💻✨
