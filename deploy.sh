#!/bin/bash
# Deploy script for plants.entazis.dev

# Create nginx config
sudo tee /etc/nginx/sites-available/plants.conf << 'EOF'
# Rate limiting zone
limit_req_zone $binary_remote_addr zone=plants_limit:10m rate=50r/s;

server {
    listen 80;
    listen [::]:80;
    server_name plants.entazis.dev;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    server_name plants.entazis.dev;

    include snippets/ssl-entazis.conf;

    root /var/www/plant-finder;
    index index.html;

    # Rate limiting
    limit_req_status 429;
    limit_req zone=plants_limit burst=120 nodelay;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/plants.conf /etc/nginx/sites-enabled/plants.conf

# Test and reload
sudo nginx -t && sudo systemctl reload nginx

echo "Deployed! Visit https://plants.entazis.dev"
