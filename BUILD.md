# How to Generate your TraceLink AI Suite .exe

I have configured everything for a professional, native Windows installation. To create your installer, just follow these 2 simple steps on your terminal:

## 1. Build the Frontend
This prepares the React app for packaging.
```bash
npm run build:client
```

## 2. Create the Installer
This will generate a `dist_electron/` folder containing your `TraceLink AI Suite Setup 1.0.0.exe`.
```bash
npm run dist
```

---

## 🎁 What you get after installation:
- **Desktop Icon**: A proper shortcut on your desktop.
- **Start Menu**: Integrated into your Windows start menu.
- **Persistent Memory**: The app saves its data folder in `%APPDATA%\tracelink-ai-suite\`, so your files and database are always safe.
- **Auto-Start**: The intelligence server boots automatically in the background when you open the app.
- **Smart Brain**: The app will automatically analyze your previous validations and meetings to show you health trends and risks.
- **Troubleshooting**: If you ever see a blank screen, you can check the logs at `%APPDATA%\tracelink-ai-suite\app.log`.
