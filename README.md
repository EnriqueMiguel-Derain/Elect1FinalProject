# PartsHub (plain HTML, CSS, JavaScript version)

Stage 1 of the capstone: the same app as the React plan, built with the tools from Modules 2 to 6.
Stage 2 will port it to React + Vite + Tailwind.

## Run it
ES modules and `fetch` need a local server (opening index.html by double-click will not work).
- VS Code: install "Live Server", right-click `index.html`, "Open with Live Server", or
- Terminal: `python -m http.server 5500` in this folder, then open http://localhost:5500

## What works now
- Landing page (hero, features, category cards, Top Picks, banner, footer), Catalog page, and Inventory page with hash-based navigation and a responsive menu
- Catalog: search, category filter, price/name sort, "Add to Inventory" buttons; owned parts show an Owned badge and the header shows an item count
- Inventory: add, edit, delete, search, filter by category, sort
- Form validation with messages, toast feedback, empty state, stock badges
- Data saved in localStorage; catalog loaded with fetch from `data/catalog.json`

## Module map (for your presentation)
| File | Concepts |
|---|---|
| index.html | Module 2: semantic HTML, forms, viewport meta tag |
| css/style.css | Modules 3 and 4: variables, Flexbox, Grid, mobile-first media queries |
| js/main.js | Module 6: async/await, fetch, try...catch, modules |
| js/inventory.js | Module 5/6: DOM, events, array methods, destructuring, spread, template literals |
| js/store.js, storage.js, availability.js, components.js, icons.js, ui.js | Module 6: export/import, shared state, reusable render helpers |
| js/catalog.js, home.js | Module 6: fetch data, array methods, event delegation |

## How it ports to React later
| Plain version | React version |
|---|---|
| index.html sections | Page components (Home, Inventory) |
| `render()` building HTML strings | JSX returned from components, driven by state |
| `parts` array + saveParts() | useReducer/Context + useLocalStorage |
| `getStockStatus`, `getAvailability` | Copied over unchanged |
| hash navigation in main.js | React Router |
| css/style.css | Tailwind classes |

## Next features
Projects and BOM, PC Builder with compatibility checks, shopping list, dashboard.
