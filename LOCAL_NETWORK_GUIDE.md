# Local Network Access Guide 🌐

This guide explains how to make the **TraceLink AI Suite** accessible to everyone in your office via the local WiFi/Network.

## 1. Fast Launch (Host Machine)
To start the platform on your computer and make it available to others:

```bash
# This builds the latest frontend and starts the unified server
npm run platform:build
```

The terminal will show your **Network URL** (e.g., `http://192.168.1.15:5000`).

## 2. Connecting from Other Devices
Anyone on the same WiFi or Ethernet network can simply open their browser and go to that Network URL.

- **URL Format**: `http://YOUR_IP_ADDRESS:5000`
- **Devices**: Works on Windows, Mac, Linux, and even iPad/Tablets.

## 3. Persistent Memory
All data uploaded (CSV files, meeting transcripts) and all AI results are saved in the central database on **your machine**.
- Shared users will see the same analytics and history.
- The "Smart Brain" (Intelligence module) will analyze data from all users.

## 4. Cloud Access (Optional)
If you want office members to access the app while traveling (outside the office WiFi), you can use a tunnel:

1. Install localtunnel: `npm install -g localtunnel`
2. Start the app: `npm run platform:build`
3. Start the tunnel: `lt --port 5000`
4. Share the provided `.loca.lt` URL with your team.

> [!TIP]
> Keep this terminal open while the office is working. If you close the terminal, the platform will go offline for everyone.
