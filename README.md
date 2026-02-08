# 🌱 Plant Finder

A beautiful web app to discover the perfect plants for your garden. Filter by climate, light, soil type, and special traits to find plants that will thrive in your conditions.

**Live at:** https://plants.entazis.dev

## Features

- **50+ Curated Plants** - Comprehensive database with detailed information
- **Smart Filtering** - Filter by:
  - Climate (drought, rainy, humid, coastal, mountainous, tropical, temperate, arctic)
  - Light conditions (full sun, partial shade, full shade)
  - Soil type (sandy, clay, loamy, rocky, wet/marshy)
  - Special traits (drought-tolerant, frost-resistant, pollinator-friendly, etc.)
- **Search** - Find plants by name or description
- **Categories** - Browse by plant type (herbs, perennials, succulents, shrubs, trees, etc.)
- **Care Level Filter** - Find plants matching your experience level
- **Beautiful Design** - Natural, earthy color palette with soft shapes
- **Detailed Plant Profiles** - Click any plant for full details, growing tips, and conditions
- **Responsive** - Works beautifully on mobile, tablet, and desktop

## Tech Stack

- Pure HTML, CSS, JavaScript (no frameworks needed!)
- JSON-based plant database
- CSS Grid/Flexbox for responsive layout
- Google Fonts (Quicksand + Playfair Display)

## Deployment

### Quick Deploy (with sudo access)

```bash
chmod +x deploy.sh
./deploy.sh
```

### Manual Deployment

1. Copy nginx config:
```bash
sudo cp /tmp/plants.conf /etc/nginx/sites-available/plants.conf
```

2. Enable the site:
```bash
sudo ln -sf /etc/nginx/sites-available/plants.conf /etc/nginx/sites-enabled/plants.conf
```

3. Test and reload nginx:
```bash
sudo nginx -t && sudo systemctl reload nginx
```

## Local Development

Just serve the files with any static server:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve
```

Then open http://localhost:8000

## Repository

https://github.com/entazis/plant-finder

## License

MIT
