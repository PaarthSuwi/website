# TraceLink AI Suite Website

A modern, enterprise-style static website for **TraceLink AI Suite**, focused on pharmaceutical supply chain intelligence and AI compliance workflows.

## Pages Included

- Home (`index.html`)
- Data Validation (`data-validation.html`)
- Zoom Meeting Intelligence (`zoom-meeting-intelligence.html`)
- Transcript Viewer (`transcript-viewer.html`)
- AI Minutes Generator (`ai-minutes-generator.html`)
- Platform Overview (`platform-overview.html`)
- Contact (`contact.html`)

---

## Run Locally (No Domain Needed)

Because this is a static HTML/CSS/JS project, you can run it locally with any simple web server.

### Option 1: Python (recommended)

```bash
python3 -m http.server 8000
```

Then open:

- `http://localhost:8000`
- or specifically `http://localhost:8000/index.html`

### Option 2: VS Code Live Server

1. Open the folder in VS Code.
2. Install **Live Server** extension.
3. Right-click `index.html` → **Open with Live Server**.

### Option 3: Node (if you prefer)

```bash
npx serve .
```

---

## Make It Public So Others Can View It

If you want people to see the website without running locally, use a static host:

### GitHub Pages

1. Push this repository to GitHub.
2. In **Settings → Pages**, set source to your default branch (root folder).
3. GitHub provides a public URL (for example: `https://your-org.github.io/your-repo/`).

### Netlify

1. Sign in to Netlify and click **Add new site → Import an existing project**.
2. Connect your repository.
3. Build command: *(leave empty)*
4. Publish directory: `.`
5. Deploy and share the generated URL.

### Vercel

1. Import the repository into Vercel.
2. Framework preset: **Other**.
3. No build command required.
4. Output directory: `.`
5. Deploy and use the generated URL.

---

## Project Structure

```text
.
├── index.html
├── data-validation.html
├── zoom-meeting-intelligence.html
├── transcript-viewer.html
├── ai-minutes-generator.html
├── platform-overview.html
├── contact.html
├── styles.css
└── script.js
```

---

## Notes

- This project is intentionally static and framework-free for easy hosting and portability.
- All styling and interactivity are contained in `styles.css` and `script.js`.
