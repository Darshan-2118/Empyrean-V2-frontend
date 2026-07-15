# Empyrean-V2
Version 2 of Empyrean, this will focus on complete redesign of the website and try to implement the hardware part and then integrate it together.
As of right now, the new design is underway and a basic structure for the project is being maintained.
This repo/folder is only being used for the frontend, and the backend will be connected using a separate repo through a .env file which is shared and maintained by the contributors of the repo.

-----
Tech-Stack used is:
Frontend (Web Dashboard)
Framework: React.js
Map Library: Leaflet.js with OpenStreetMap tiles (Google Maps API mentioned as an alternative)
Heatmap Plugin: Leaflet.heat (for pollution density visualization)
Charts/Analytics: Chart.js (Recharts also mentioned as an alternative)
Real-Time Updates: Firebase Realtime Listeners / WebSocket
Styling: CSS modules (Tailwind CSS was removed for now)
API Communication: REST API

## Local Development

### 1) Install dependencies
```bash
npm install
```

### 2) Create environment values
Copy the example file and fill in your Firebase config values:
```bash
copy .env.example .env
```

### 3) Run the app locally
```bash
npm run dev
```

Then open:
```text
http://localhost:5173/
```

### 4) Build for production
```bash
npm run build
```

### 5) Preview production build
```bash
npm run preview
```

### Notes
- The backend will be handled in the backend repository.
- Connect it to this frontend through the shared .env file when the backend is ready.