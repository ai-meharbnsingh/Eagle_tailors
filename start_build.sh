#!/bin/bash

# ================================================
# Eagle Tailors - Quick Start Build Script
# ================================================
# 
# This script sets up the project and starts Claude CLI
# to build the complete application.
#
# Usage:
#   chmod +x start_build.sh
#   ./start_build.sh
#
# ================================================

echo ""
echo "🦅 ═══════════════════════════════════════════════════════════"
echo "   EAGLE TAILORS - Automated Build System"
echo "   ईगल टेलर्स - स्वचालित निर्माण प्रणाली"
echo "═══════════════════════════════════════════════════════════ 🦅"
echo ""

# Check if Claude CLI is installed
if ! command -v claude &> /dev/null; then
    echo "❌ Claude CLI not found!"
    echo "   Install it first: npm install -g @anthropic-ai/claude-cli"
    exit 1
fi

# Create project directory
PROJECT_DIR="$HOME/eagle-tailors"
echo "📁 Creating project directory: $PROJECT_DIR"
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Copy instruction file
echo "📋 Copying build instructions..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cp "$SCRIPT_DIR/eagle_tailors_cli_instructions.md" "$PROJECT_DIR/BUILD_INSTRUCTIONS.md"

# Create CLAUDE.md for automatic context
echo "📝 Creating CLAUDE.md..."
cat > CLAUDE.md << 'EOF'
# Eagle Tailors Project

## Quick Context
This is a Tailor Shop Management System. Read BUILD_INSTRUCTIONS.md for complete specs.

## Your Task
Build the COMPLETE Phase 1 application as specified in BUILD_INSTRUCTIONS.md.

## Rules
- Create ALL files completely (no placeholders)
- Install all dependencies
- Setup database automatically
- Test everything works
- Do NOT ask for confirmation - just build

## Tech Stack
- Backend: Node.js + Express + TypeScript
- Frontend: React + Vite + TypeScript + Tailwind
- Database: PostgreSQL

## Start Command
Read BUILD_INSTRUCTIONS.md and execute everything.
EOF

echo ""
echo "✅ Setup complete!"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "🚀 TO START THE BUILD:"
echo ""
echo "   Option 1: Auto-mode (recommended for walk-away build)"
echo "   ─────────────────────────────────────────────────────"
echo "   cd $PROJECT_DIR"
echo "   claude --dangerously-skip-permissions"
echo ""
echo "   Then paste:"
echo "   \"Read BUILD_INSTRUCTIONS.md and build the complete Eagle Tailors application. Create all files, setup database, install dependencies. Do not ask questions - just build everything.\""
echo ""
echo ""
echo "   Option 2: Interactive mode"
echo "   ─────────────────────────────────────────────────────"
echo "   cd $PROJECT_DIR"
echo "   claude"
echo ""
echo "   Then paste the same prompt above."
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📍 Project location: $PROJECT_DIR"
echo "📄 Instructions: $PROJECT_DIR/BUILD_INSTRUCTIONS.md"
echo ""
echo "🦅 Happy building! Enjoy your walk!"
echo ""
