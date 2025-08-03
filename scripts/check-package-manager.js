#!/usr/bin/env node

/**
 * Script to ensure only pnpm is used for package management
 */

const fs = require("fs")
const path = require("path")

function checkForNpmLockFile() {
  const lockFile = path.join(process.cwd(), "package-lock.json")
  if (fs.existsSync(lockFile)) {
    console.error("❌ Found package-lock.json! This project uses pnpm.")
    console.error(
      'Please remove package-lock.json and run "pnpm install" instead.'
    )
    process.exit(1)
  }
}

function checkForYarnLockFile() {
  const lockFile = path.join(process.cwd(), "yarn.lock")
  if (fs.existsSync(lockFile)) {
    console.error("❌ Found yarn.lock! This project uses pnpm.")
    console.error('Please remove yarn.lock and run "pnpm install" instead.')
    process.exit(1)
  }
}

function main() {
  console.log("🔍 Checking package manager consistency...")
  checkForNpmLockFile()
  checkForYarnLockFile()
  console.log("✅ Package manager check passed! Using pnpm correctly.")
}

if (require.main === module) {
  main()
}
