#!/usr/bin/env bash
# Build a debug APK for Lumina from scratch.
# Installs the Android SDK command-line tools if missing, builds the web app,
# syncs Capacitor, and assembles the debug APK.
#
# Usage:  bash scripts/build-apk.sh
# Output: app/android/app/build/outputs/apk/debug/app-debug.apk
#         (also copied to releases/Lumina-<version>-debug.apk)
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")/.." && pwd)"          # .../app
ROOT_DIR="$(cd "$APP_DIR/.." && pwd)"                 # repo root
export ANDROID_HOME="${ANDROID_HOME:-$HOME/android-sdk}"
export ANDROID_SDK_ROOT="$ANDROID_HOME"

# 1. Android SDK (command-line tools + platform/build-tools)
if [ ! -x "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" ]; then
  echo "==> Installing Android command-line tools"
  mkdir -p "$ANDROID_HOME/cmdline-tools"
  tmp="$(mktemp -d)"
  curl -sSL -o "$tmp/cmdtools.zip" \
    "https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip"
  unzip -q -o "$tmp/cmdtools.zip" -d "$ANDROID_HOME/cmdline-tools"
  mv "$ANDROID_HOME/cmdline-tools/cmdline-tools" "$ANDROID_HOME/cmdline-tools/latest"
fi
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

echo "==> Accepting licenses & installing SDK packages"
yes 2>/dev/null | sdkmanager --licenses >/dev/null 2>&1 || true
sdkmanager "platform-tools" "platforms;android-35" "build-tools;35.0.0" >/dev/null

# 2. Web build
cd "$APP_DIR"
echo "==> Building web bundle"
pnpm install --frozen-lockfile 2>/dev/null || pnpm install
pnpm build

# 3. Capacitor android project
if [ ! -d "$APP_DIR/android" ]; then
  echo "==> Adding Android platform"
  pnpm exec cap add android
fi
echo "sdk.dir=$ANDROID_HOME" > "$APP_DIR/android/local.properties"
echo "==> Syncing Capacitor"
pnpm exec cap sync android

# 4. Assemble APK
echo "==> Assembling debug APK"
cd "$APP_DIR/android"
./gradlew assembleDebug --no-daemon

# 5. Publish artifact
VERSION="$(node -p "require('$APP_DIR/package.json').version" 2>/dev/null || echo 1.0)"
mkdir -p "$ROOT_DIR/releases"
cp app/build/outputs/apk/debug/app-debug.apk "$ROOT_DIR/releases/Lumina-${VERSION}-debug.apk"
echo "==> Done: releases/Lumina-${VERSION}-debug.apk"
