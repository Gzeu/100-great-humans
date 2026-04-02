# 100 Great Humans Web App

Next.js web application for exploring the 100 Great Humans dataset.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## 📁 Features

- **Dataset Explorer**: Browse and search through 100 historical figures
- **Agent Details**: View comprehensive profiles and system prompts
- **TypeScript SDK Integration**: Uses the same SDK from the main repository
- **Responsive Design**: Works on desktop and mobile devices
- **Modern Stack**: Next.js 14, TypeScript, Tailwind CSS

## 🌐 Deployment

The app is configured for easy deployment to Vercel:

1. **Connect your GitHub account** to Vercel
2. **Import repository**: `https://github.com/Gzeu/100-great-humans`
3. **Deploy**: Vercel will automatically detect Next.js app and deploy

## 📊 Technical Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS for rapid UI development
- **TypeScript**: Full type safety and IntelliSense support
- **SDK Integration**: Direct import from `../src/agents.ts`
- **Deployment**: Optimized for Vercel platform

## 🔧 Development

```bash
# Local development
npm run dev

# Build optimization
npm run build

# Type checking
npm run lint
```

## 📱 Repository Structure

```
app/
├── layout.tsx          # Root layout component
├── page.tsx           # Home page with overview
├── globals.css         # Tailwind CSS styles
└── (future pages)    # Additional app pages

src/                       # Shared TypeScript SDK
├── agents.ts           # Core SDK implementation
├── index.ts            # SDK exports
└── (other SDK files)  # Reusable across projects

package.json               # Next.js app configuration
next.config.js             # Next.js configuration
vercel.json               # Vercel deployment settings
.vercelignore            # Files to exclude from deployment
tailwind.config.js         # Tailwind configuration
postcss.config.js          # PostCSS configuration
```

## 🎯 Usage

The web app provides:

1. **Quick Overview**: Statistics and feature highlights
2. **Agent Search**: Find historical figures by name, domain, era
3. **Detailed Profiles**: Complete biographical information
4. **System Prompts**: Ready-to-use LLM prompts for each agent
5. **SDK Integration**: Demonstrates TypeScript SDK usage

## 🚀 Ready for Production

The web app is fully configured and ready for deployment to Vercel or any Next.js hosting platform.
