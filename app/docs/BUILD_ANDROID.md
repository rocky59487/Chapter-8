# Building the Lumina Android APK

Lumina is a Vite + React single-page app. For Android we wrap the built web
bundle in a native WebView using [Capacitor](https://capacitorjs.com/). The
same `dist/` output that ships to the web is packaged into the APK — there is
no separate mobile codebase.

> The web app uses a **hash router** and `base: './'`, so it runs correctly
> from the `file://`-style origin used inside the Capacitor WebView.

---

## 1. Prerequisites

Install these once on the build machine:

- **Node 22** and **pnpm** (`corepack enable` or `npm i -g pnpm`).
- **JDK 17** (required by the Android Gradle Plugin used by Capacitor 8).
- **Android Studio** (latest stable), which bundles the **Android SDK**.
  - Open Android Studio → *More Actions → SDK Manager* and install:
    - Android SDK Platform (API 34 or newer)
    - Android SDK Build-Tools
    - Android SDK Platform-Tools
    - Android SDK Command-line Tools
  - Set the `ANDROID_HOME` (a.k.a. `ANDROID_SDK_ROOT`) environment variable to
    the SDK location, e.g.:
    ```bash
    export ANDROID_HOME="$HOME/Android/Sdk"
    export PATH="$ANDROID_HOME/platform-tools:$PATH"
    ```

> This repository does **not** include the Android SDK, so the APK cannot be
> built in CI/sandbox environments without the SDK installed first.

---

## 2. Install dependencies & build the web app

From the `app/` directory:

```bash
pnpm install
pnpm build          # tsc --noEmit && vite build  ->  app/dist
```

`pnpm build` must succeed before any native sync — Capacitor copies whatever is
in `dist/` into the native project.

---

## 3. Add the Android platform (first time only)

```bash
pnpm cap:add:android   # = cap add android
```

This generates an `android/` Gradle project (git-ignored). Re-running is
harmless but normally only needed once. Configuration comes from
`capacitor.config.ts` (appId `com.lumina.learn`, appName `Lumina`,
webDir `dist`).

---

## 4. Sync the web build into the native project

Every time you rebuild the web app, copy it into Android:

```bash
pnpm cap:sync          # = cap sync   (copies dist/ + updates native plugins)
```

Shortcut that does build + sync in one step:

```bash
pnpm apk               # = pnpm build && cap sync android
```

---

## 5. Produce the APK

### Option A — Android Studio (recommended for signing/release)

```bash
npx cap open android
```

In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
When it finishes, click the *locate* link in the notification.

### Option B — Command line (debug APK)

```bash
cd android
./gradlew assembleDebug      # use gradlew.bat on Windows
```

### Where the APK lands

```
app/android/app/build/outputs/apk/debug/app-debug.apk
```

For a release build use `./gradlew assembleRelease` (requires a configured
signing key) — the artifact appears under `.../apk/release/`.

Install on a connected device/emulator with:

```bash
adb install -r app/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 6. Offline / PWA support

The web build also ships as an installable PWA:

- `public/manifest.webmanifest` — name, theme/background color `#070d18`,
  `display: standalone`, `start_url: ./`, and icons.
- `public/sw.js` — a minimal **cache-first** service worker (same-origin GET
  requests, network fallback, navigation falls back to the cached shell).
- `src/registerSW.ts` — registers the worker **only in production**
  (`import.meta.env.PROD`) and only when `serviceWorker` is supported.

Inside the Android WebView this provides resilient offline loading of the app
shell and assets after the first launch.

---

## Concept: the "downloadable course pack" model

Lumina separates the **app shell** from **course content**:

- The **APK** contains only the player/shell (UI, navigation, the engine that
  renders lessons, quizzes, and interactions).
- A **course pack is plain JSON** (lessons, problems, media references, etc.)
  that is **loaded at runtime** — bundled, fetched, or imported by the user.

Implications:

- **Updating or adding courses does NOT require a new APK.** You publish a new
  or updated JSON pack and the installed app picks it up. No Play Store review
  cycle for content changes.
- The shell version (APK) only needs to change when the *engine* changes —
  e.g. a new interaction type or a breaking schema bump.
- Packs can be cached by the service worker for offline study once downloaded.
- Versioning the pack schema lets an older shell gracefully ignore content it
  doesn't understand, while newer shells render the new features.

This keeps the native binary small and stable while course authoring stays a
fast, content-only workflow.
