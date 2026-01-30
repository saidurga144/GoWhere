# Git Setup Guide

## 📥 Install Git

### Windows
1. **Download Git for Windows**
   - Visit: https://git-scm.com/download/win
   - Download the latest installer (64-bit recommended)

2. **Run the Installer**
   - Accept default settings
   - Choose "Use Git Bash Here" during installation
   - Complete installation

3. **Verify Installation**
   ```bash
   git --version
   ```
   Should show: `git version X.X.X...`

### macOS
```bash
# Using Homebrew (easiest)
brew install git

# Or download from:
# https://git-scm.com/download/mac
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install git
```

---

## 🚀 Initialize Git in This Project

After installing Git, run these commands:

```bash
# Navigate to project directory
cd "c:\Users\Sai Kumar\Downloads\gowhere_-personalized-travel-discovery"

# Initialize Git repository
git init

# Configure Git (one time)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: GoWhere travel app with authentication and AI recommendations"

# (Optional) Set default branch to main
git branch -M main
```

---

## 📝 Quick Git Commands

### Basic Commands
```bash
# Check status
git status

# Add changes
git add .                    # Add all files
git add filename.txt         # Add specific file

# Commit changes
git commit -m "Your message"

# View history
git log

# See what changed
git diff
```

### Branching
```bash
# Create new branch
git branch feature-name
git checkout feature-name

# Or create and switch in one command
git checkout -b feature-name

# Switch to main
git checkout main

# Merge branch into main
git merge feature-name
```

### Remote (GitHub/GitLab)
```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/gowhere.git

# Push to GitHub
git push -u origin main

# Pull latest changes
git pull origin main
```

---

## 🔗 Connect to GitHub (Optional)

### Create Repository on GitHub
1. Go to https://github.com/new
2. Name: `gowhere` (or your preference)
3. Click "Create repository"
4. Copy the HTTPS or SSH URL

### Push to GitHub
```bash
# Add remote
git remote add origin https://github.com/YOUR_USERNAME/gowhere.git

# Rename branch to main (if needed)
git branch -M main

# Push initial commit
git push -u origin main
```

---

## 📋 Good Commit Messages

### Format
```
[Type] Short description (50 chars)

Longer explanation (if needed)
- Bullet point 1
- Bullet point 2
```

### Types
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting (no code change)
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Build, dependencies

### Examples
```bash
git commit -m "feat: Add onboarding validation for travel preferences"
git commit -m "fix: Resolve NetworkError when calling AI API"
git commit -m "docs: Add mobile responsive guide"
git commit -m "refactor: Optimize component props structure"
```

---

## 🛡️ What's Already Ignored

The `.gitignore` file is configured to exclude:
- ✅ `node_modules/` (dependencies)
- ✅ `dist/` (build output)
- ✅ `.env` (environment variables)
- ✅ `.vscode/`, `.idea/` (IDE files)
- ✅ OS files (`.DS_Store`, `Thumbs.db`)
- ✅ Backend Python files (`__pycache__/`, `*.pyc`)

**Never commit:**
- API keys (use `.env`)
- Passwords
- Large files (> 100MB)
- Sensitive data

---

## 🔐 Protect Sensitive Files

### Create `.env.example`
```bash
# .env.example (check this into git)
VITE_GEMINI_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
FIREBASE_API_KEY=your_key_here
```

### Create `.env` (don't check in)
```bash
# .env (gitignored - local only)
VITE_GEMINI_API_KEY=abc123...
GEMINI_API_KEY=abc123...
FIREBASE_API_KEY=xyz789...
```

---

## 📊 Current Repository Structure

```
gowhere/
├── .git/                    ← Created after git init
├── .gitignore              ← ✅ Already set up
├── node_modules/           ← ✅ Ignored
├── src/
│   ├── components/
│   ├── services/
│   └── ...
├── backend/
│   ├── app.py
│   └── venv/               ← ✅ Ignored
├── .env                    ← ✅ Ignored
├── .env.example            ← ✅ Check in
└── package.json
```

---

## 🚨 Troubleshooting

### "git: command not found"
→ Git is not installed. See installation section above.

### "fatal: not a git repository"
→ Run `git init` in project directory

### "Please tell me who you are"
→ Run these commands:
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

### "Permission denied (publickey)"
→ Use HTTPS instead of SSH when cloning/pushing:
```bash
git remote add origin https://github.com/username/repo.git
```

---

## 📚 Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Quick Start](https://docs.github.com/en/get-started/quickstart)
- [Git Cheat Sheet](https://github.github.com/training-kit/downloads/github-git-cheat-sheet.pdf)
- [Interactive Git Learning](https://learngitbranching.js.org/)

---

## ✅ Next Steps

1. **Install Git** (download from git-scm.com)
2. **Run initialization commands** (see above)
3. **Create GitHub account** (optional but recommended)
4. **Push to GitHub** (optional)

---

**After completing setup, your project will be version controlled!** 🎉

You can now:
- Track all changes with `git log`
- Revert to previous versions if needed
- Collaborate with team members
- Deploy to production with confidence
