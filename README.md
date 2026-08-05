# Solar & Wind Deployment Intelligence Platform

A working prototype implementing Milestones 1-3 of the project spec, with
**real live data** for environmental/terrain/infrastructure inputs (see
"What's real vs. estimated" below — read this before presenting to a
mentor/reviewer).

## Scope covered

**Milestone 1 — Core Setup**
- JWT authentication, 4 roles (Renewable Energy Planner, GIS Analyst, Project
  Manager, Administrator)
- Project & site management (create / edit / delete / list)

**Milestone 2 — Environmental Intelligence & Resource Prediction**
- Live environmental data engine (see sources below)
- Solar Potential Prediction Engine
- Wind Potential Prediction Engine
- Resource assessment reports (PDF / JSON / CSV)

**Milestone 3 — Site Intelligence & Optimization**
- Site Suitability Intelligence Engine — weighted scoring model matching the
  doc exactly: Renewable Resource (35%) + Geographic (25%) + Infrastructure
  (15%) + Environmental (15%) + Economic (10%)
- Energy Forecasting Engine — annual/seasonal output, homes-powered equivalent
- Deployment Optimization Engine — recommended technology + installed capacity
- Ranked portfolio dashboard (category breakdown, top sites)

## What's real vs. estimated — read this before a mentor demo

| Data | Source | Status |
|---|---|---|
| Solar irradiance, temperature, rainfall, wind speed | **NASA POWER API** | Live |
| Elevation, land slope | **Open-Meteo Elevation API** (Copernicus DEM), slope computed from real 5-point elevation sampling | Live |
| Road/transmission/substation distance, protected zone, urban land, land cover type | **OpenStreetMap Overpass API** | Live |
| Land ownership | User-provided on the form | Real (no public API exists for this — it's private property record data) |
| Existing infrastructure | User-provided on the form | Real |
| Land area | Calculated from a boundary you draw on the map (real spherical geometry) | Real |
| Turbulence intensity | Fixed representative constant (12%) | Placeholder — no free live source |
| Seasonal quarterly generation split | Fixed placeholder curve (22/28/27/23%) | Placeholder — true seasonal modeling needs historical month-level weather data this build doesn't have |
| Financial/revenue projections | Removed entirely | A generic tariff assumption would produce a false sense of precision, so this build reports physical output (kWh, homes powered) instead of dollar figures |

Every site's result includes a **Data Sources panel** showing exactly which
live API (or fallback, if one was briefly down) supplied each group of
fields — this is generated automatically by `data_simulator.py` and shown in
the UI, PDF, and CSV exports.

**Registration now takes 5-30 seconds** (it used to be instant) since it
makes 3 real network calls per site. This is expected.

## Tech stack

- **Backend:** Python, FastAPI, SQLite, PyJWT, `requests`, `fpdf2`
- **Frontend:** vanilla HTML/CSS/JS + Leaflet.js/Leaflet.draw (map), no build step
- **External APIs (all free, no signup/key required):** NASA POWER, Open-Meteo
  Elevation, OpenStreetMap Overpass, OpenStreetMap Nominatim (region search),
  Esri World Street Map (map tiles)
- **Deployment:** Docker (`backend/Dockerfile`)

## Project structure

```
Solar-Wind-Deployment-Intelligence-Platform/
├── backend/
│   ├── main.py              # FastAPI app: auth, sites, dashboard, PDF/CSV export
│   ├── scoring.py           # Solar/wind engines + M3 suitability/forecast/optimization
│   ├── data_simulator.py    # Live environmental data (NASA POWER, Open-Meteo, Overpass)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
└── README.md
```

## Running it locally in VS Code

1. Open the `Solar-Wind-Deployment-Intelligence-Platform/` folder in VS Code.

2. **Backend:**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate        # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```
   API docs at `http://localhost:8000/docs`.

3. **Frontend:**
   ```bash
   cd frontend
   python -m http.server 5500
   ```
   Visit `http://localhost:5500`.

4. Register an account, then go to **Register New Site**. Search a region
   (a live-suggestion dropdown appears), pick a match to drop a pin, then use
   the rectangle tool on the map to draw your site boundary (land area
   calculates automatically). Fill in Existing Infrastructure and Land
   Ownership, then submit — this fetches real data and can take up to ~30
   seconds.

## Running with Docker (backend only)

```bash
cd backend
docker build -t swdi-backend .
docker run -p 8000:8000 swdi-backend
```

## Known limitations / next steps

- No historical weather time-series, so seasonal forecasting is a flat
  placeholder curve rather than a real month-by-month model.
- No trained ML models (XGBoost/Random Forest, as the original doc
  mentions) — the scoring/prediction engines are rule-based formulas using
  real inputs, not models trained on historical deployment outcomes.
- SQLite is fine for a single-user prototype; a real deployment would use
  PostgreSQL + PostGIS as the original doc specifies.
- Not deployed anywhere public — runs locally only.
- Overpass API is a shared free public service and can occasionally be slow
  or rate-limited under heavy use; the app falls back gracefully (labeled)
  if so.


## Recent additions (latest build)

- **Fixed a real bug**: wind capacity factor previously used an overly conservative formula that made Solar win almost every recommendation, even at world-class wind sites. Replaced with an industry-calibrated curve (NREL/IEA-style) based on how real wind farms perform across a full year, not just a single average speed.
- **Wind direction** — real data from NASA POWER (WD10M parameter), shown as both degrees and compass direction (e.g. "245° / WSW").
- **Manual coordinate entry** — you can now type latitude/longitude directly instead of only searching a place name; the map pin and land-area box sync automatically.
- **Investment Priority** — a distinct High/Medium/Low/Not Recommended label (your doc's separately-named "Investment prioritization" output), alongside suitability category.
- **Expansion planning** — now a structured number (capacity if land/turbines doubled) instead of a generated sentence.
- **Projects** — sites can now optionally be grouped under a Project (with an auto-generated Project ID like PRJ-0001, per your doc's "Site Information" field list). Fully backward-compatible: sites can still be registered standalone with no project, exactly as before.
- Financial/revenue projections were removed entirely per a scope decision — a generic tariff assumption added false precision without real market data behind it.
