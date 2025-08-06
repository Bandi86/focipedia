#!/bin/bash

# Simple dev server script for Focipedia frontend
# Ensures pnpm usage and prevents multiple instances

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}[DEV]${NC} Starting Focipedia frontend dev server..."

# Check if pnpm is available
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}[ERROR]${NC} pnpm is not installed. Please install it: npm install -g pnpm"
    exit 1
fi

# Check if dev server is already running
if pgrep -f "next dev" > /dev/null; then
    echo -e "${YELLOW}[WARNING]${NC} Dev server is already running!"
    echo "Running processes:"
    pgrep -f "next dev" | xargs ps -o pid,ppid,cmd --no-headers
    echo ""
    read -p "Kill existing dev server? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}[DEV]${NC} Killing existing dev servers..."
        pkill -f "next dev" 2>/dev/null || true
        sleep 2
    else
        echo -e "${YELLOW}[INFO]${NC} Keeping existing dev server. Exiting..."
        exit 0
    fi
fi

# Check port 3000
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}[WARNING]${NC} Port 3000 is in use!"
    lsof -i :3000
    echo ""
    read -p "Kill process on port 3000? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${GREEN}[DEV]${NC} Freeing port 3000..."
        lsof -ti :3000 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
fi

echo -e "${GREEN}[DEV]${NC} Starting with pnpm run dev..."
pnpm run dev 