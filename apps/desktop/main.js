const electron = require('electron');
const path = require('path');
const fs = require('fs');
console.log('Type of require("electron"):', typeof electron);
const { app, BrowserWindow, Menu, tray, shell } = electron;
const isDev = (app && typeof app.isPackaged !== 'undefined') ? !app.isPackaged : process.env.NODE_ENV !== 'production';

let mainWindow;

// ─── Logging Setup ──────────────────────────────────────────────────
const logPath = path.join(app.getPath('userData'), 'app.log');
function log(msg) {
    const time = new Date().toISOString();
    const entry = `[${time}] ${msg}\n`;
    fs.appendFileSync(logPath, entry);
    console.log(msg);
}

log(`App starting... isDev: ${isDev}`);
log(`Entry path: ${__dirname}`);
log(`Resources path: ${process.resourcesPath}`);

// ─── Server Setup ───────────────────────────────────────────────────
function startServer() {
    try {
        log('Initializing backend server...');
        // Force PORT 5000
        process.env.PORT = '5000';
        process.env.NODE_ENV = isDev ? 'development' : 'production';

        const serverPath = isDev
            ? path.join(__dirname, '..', 'server', 'index.js')
            : path.join(process.resourcesPath, 'app.asar.unpacked', 'apps', 'server', 'index.js');

        log(`Loading server from: ${serverPath}`);

        if (!fs.existsSync(serverPath)) {
            log(`CRITICAL: Server file NOT FOUND at ${serverPath}`);
            return;
        }

        // Use require to run the server in the same process
        // This avoids needing a separate Node.js installation on the user's machine
        require(serverPath);
        log('Server module loaded successfully');
    } catch (err) {
        log(`CRITICAL: Server initialization failed: ${err.message}`);
        log(err.stack);
    }
}

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        title: 'TraceLink AI Suite',
        backgroundColor: '#051b1a', // The "Green Screen" background
        show: false,
        icon: path.join(__dirname, 'assets', 'icon.ico'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    const targetUrl = isDev ? 'http://localhost:3000' : 'http://localhost:5000';
    log(`Loading URL: ${targetUrl}`);

    // Enable DevTools for debugging the Green Screen
    mainWindow.webContents.openDevTools();

    // Add a simple menu with Reload and DevTools
    const template = [
        {
            label: 'Debug',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                {
                    label: 'Show App Logs',
                    click: () => {
                        shell.openPath(logPath);
                    }
                }
            ]
        }
    ];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    // Wait for server to potentially start
    const loadApp = (retries = 0) => {
        mainWindow.loadURL(targetUrl).catch(err => {
            log(`Load failure at ${targetUrl}: ${err.message}`);
            if (retries < 10) {
                log(`Retrying (${retries + 1}/10) in 2s...`);
                setTimeout(() => loadApp(retries + 1), 2000);
            } else {
                log(`CRITICAL: All retries failed for ${targetUrl}`);
                // Try to load the file directly as a last resort
                const fallbackPath = path.join(__dirname, '..', 'client', 'dist', 'index.html');
                log(`Attempting fallback to physical file: ${fallbackPath}`);
                mainWindow.loadFile(fallbackPath).catch(e => {
                    log(`Double failure: ${e.message}`);
                });
            }
        });
    };

    loadApp();

    mainWindow.once('ready-to-show', () => {
        log('Window ready to show');
        mainWindow.show();
    });

    mainWindow.webContents.on('did-finish-load', () => {
        log('Page load finished');
    });

    mainWindow.webContents.on('did-fail-load', (e, code, desc) => {
        log(`Page failed to load: ${desc} (code: ${code})`);
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
}

// ─── Life Cycle ─────────────────────────────────────────────────────
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore();
            mainWindow.focus();
        }
    });

    app.whenReady().then(() => {
        log('App ready');
        startServer();
        createWindow();

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) createWindow();
        });
    });
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
