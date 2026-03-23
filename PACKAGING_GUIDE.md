# Desktop App Packaging Guide 📦

This guide explains how to convert the **TraceLink AI Suite** web platform into a standalone `.exe` installer at any time.

## 1. Prerequisites
To build the native app, the computer must have:
- **Node.js** (v18+)
- **Build Tools**: Run `npm install -g windows-build-tools` (as Administrator) or install C++ build tools via Visual Studio.
- **Python**: Required for native module compilation.

## 2. Configuration
The project is already pre-configured for Electron. The key files are:
- `main.js`: Controls the desktop window and backend lifecycle.
- `package.json`: Contains the `dist` script and build settings.

## 3. Building the App
Run the following commands in order:

```bash
# 1. Rebuild native modules for Electron
npm run postinstall

# 2. Build the client and package the installer
npm run dist
```

## 4. Where is the App?
After the build finishes, look in the `dist_electron` folder:
- **Installer**: `TraceLink AI Suite Setup 1.0.0.exe`
- **Portable Folder**: `win-unpacked` (runs without installation)

## 5. Troubleshooting Blank Screens
If the packaged app shows a "green screen" or blank screen:
1. Open the app.
2. Go to **Debug -> Show App Logs**.
3. Check for "Native Module Mismatch" or "Path Not Found" errors.
4. Ensure the `client/dist` folder was actually built before running `dist`.

> [!NOTE]
> Packaging native database engines like SQLite (`better-sqlite3`) requires the build machine to have local compilers. If you run into errors, ensure "Developer Mode" is enabled in Windows Settings.
