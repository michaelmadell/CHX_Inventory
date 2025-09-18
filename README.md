# CHX_Inventory

A modern Enclosure Inventory Management system built with React, TypeScript, Vite (frontend), and Node.js + Express (backend), designed for managing and visualizing detailed hardware inventory information for CoreStation HX5 and related systems.

---

## Overview

**CHX_Inventory** is a full-stack application for viewing and managing inventory data for hardware enclosures. It fetches hardware, node, power, fan, switch, firmware, and location information from configured enclosures and presents it in a rich, interactive web UI.

- **Frontend:** React, TypeScript, TailwindCSS, Vite
- **Backend:** Node.js, Express, Axios
- **Data Source:** JSON files (can be extended to API-backed dynamic data)
- **Features:** Tabbed multi-enclosure browsing, node/fan/PSU details, modal dialogs, management/switch info, and more.

---

## Features

- **Tabbed Browsing:** Quickly switch between multiple enclosures using tabs.
- **Detailed Hardware Information:** See info for nodes, fans, PSUs, switch, firmware, and physical location.
- **Interactive UI:** Click nodes for deep-dive modals, hover to reveal sensitive fields, responsive design.
- **Backend Proxy:** Securely proxy and cache API calls to enclosure devices with token management.

---

## Project Structure

```
CHX_Inventory/
├── Inv-Frontend/          # Frontend React app (Vite, TypeScript)
│   ├── src/
│   │   ├── components/    # UI components (EnclosureDetails, NodeModal, etc.)
│   │   ├── types.ts       # Shared TypeScript types/interfaces
│   │   ├── App.tsx        # Main app
│   │   └── ...
│   ├── public/            # Static assets (logos, images)
│   └── ...
├── Inv-Backend/           # Backend Node.js/Express API proxy
│   ├── config.json        # Enclosure connection config (IP, user, etc.)
│   ├── enclosureManager.js# Token management, proxy logic
│   └── index.js           # Express server/API routes
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Frontend Setup

```sh
cd Inv-Frontend
npm install
npm run dev
```
- App runs at `http://localhost:5173` by default.
- Inventory data is loaded from `/data/index.json` and referenced enclosure JSON files.

### Backend Setup

```sh
cd Inv-Backend
npm install
node index.js
```
- Server runs at `http://localhost:4000` by default.
- Configure enclosures in `config.json` (see file for example).

---

## Configuration

### Frontend Data

- Expects `/data/index.json` listing enclosure data files (e.g., `["ENCL001.json", ...]`).
- Each data file matches the `EnclosureData` interface in `src/types.ts`.

### Backend Proxy (API Integration)

- `Inv-Backend/config.json`: List your enclosure IPs, usernames, and passwords.
- The backend will fetch/refresh tokens and securely proxy API calls.
- Example API proxy endpoint:
  ```
  POST /api/proxy/:enclosureId
  {
    "method": "GET",
    "url": "api/hardware/details"
  }
  ```

---

## Customization & Extending

- **Add Enclosure Data:** Place new JSON files in the appropriate data directory and list them in `index.json`.
- **API Integration:** Adapt the backend to map your enclosure API structure.
- **Styling:** TailwindCSS classes can be easily customized in components and `src/index.css`.

---

## Key Files

- **Frontend:**
  - `src/App.tsx` — Main logic for loading and displaying enclosure tabs/details
  - `src/components/EnclosureDetails.tsx` — Detailed view for all enclosure components
  - `src/types.ts` — TypeScript interfaces for all data objects
- **Backend:**
  - `enclosureManager.js` — Handles token refresh and proxy logic
  - `index.js` — Express app entrypoint

---

## Screenshots

> _(Add screenshots or animated GIFs here for a visual overview)_

---

## License

MIT (or your preferred license)

---

## Credits

- [Lucide React Icons](https://lucide.dev)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- Amulet Hotkey / CoreStation HX5 branding

---

## Contact

For questions or contributions, open an issue or contact the maintainer.
