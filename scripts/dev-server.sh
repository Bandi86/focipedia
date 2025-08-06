#!/bin/bash

# Focipedia Dev Server Manager
# Prevents multiple dev servers from running and ensures pnpm usage

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[DEV-SERVER]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if pnpm is installed
check_pnpm() {
    if ! command -v pnpm &> /dev/null; then
        print_error "pnpm is not installed. Please install it first:"
        echo "npm install -g pnpm"
        exit 1
    fi
}

# Check if dev server is already running
check_running_dev_server() {
    local running_processes=$(pgrep -f "next dev\|npm run dev\|pnpm run dev" 2>/dev/null || true)
    
    if [ ! -z "$running_processes" ]; then
        print_warning "Dev server is already running!"
        echo "Running processes:"
        ps -p $running_processes -o pid,ppid,cmd --no-headers
        echo ""
        read -p "Do you want to kill the existing dev server and start a new one? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Killing existing dev servers..."
            pkill -f "next dev" 2>/dev/null || true
            pkill -f "npm run dev" 2>/dev/null || true
            pkill -f "pnpm run dev" 2>/dev/null || true
            sleep 2
            print_success "Existing dev servers killed"
        else
            print_status "Keeping existing dev server. Exiting..."
            exit 0
        fi
    fi
}

# Check if port 3000 is available
check_port() {
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "Port 3000 is already in use!"
        echo "Processes using port 3000:"
        lsof -i :3000
        echo ""
        read -p "Do you want to kill the process using port 3000? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Killing process on port 3000..."
            lsof -ti :3000 | xargs kill -9 2>/dev/null || true
            sleep 2
            print_success "Port 3000 freed"
        else
            print_warning "Dev server will use a different port"
        fi
    fi
}

# Main function
main() {
    print_status "Starting Focipedia Dev Server Manager..."
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ] || [ ! -d "src" ]; then
        print_error "This script must be run from the frontend directory"
        print_status "Changing to frontend directory..."
        cd apps/frontend
    fi
    
    # Check pnpm
    check_pnpm
    
    # Check for running dev servers
    check_running_dev_server
    
    # Check port availability
    check_port
    
    print_status "Starting dev server with pnpm..."
    print_status "Using: pnpm run dev"
    
    # Start the dev server
    pnpm run dev
}

# Run main function
main "$@" 