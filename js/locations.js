// ========================================
// Locations Page - Map and Location Cards
// ========================================

let map;

// Initialize Leaflet map
function initMap() {
    // Create map centered on Chicago
    map = L.map('map').setView([41.8781, -87.6298], 11);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Load location data
    fetch('../locations.json')
        .then(res => res.json())
        .then(locations => {
            // Add markers to map
            locations.forEach((loc, index) => {
                const marker = L.marker([loc.lat, loc.lng]).addTo(map);

                marker.bindPopup(`
                    <div style="min-width: 200px;">
                        <h3 style="margin: 0 0 0.5rem 0; color: #2C2C2C; font-size: 1.1rem;">${loc.name}</h3>
                        <p style="margin: 0; color: #666; font-size: 0.9rem;">${loc.address}</p>
                        <a href="https://www.google.com/maps/dir/?api=1&destination=${loc.name}"
                           target="_blank"
                           style="display: inline-block; margin-top: 0.5rem; color: #D4AF37; text-decoration: none; font-weight: 600;">
                           Get Directions →
                        </a>
                    </div>
                `);

                // Open first marker
                if (index === 0) {
                    marker.openPopup();
                }
            });

            // Render location cards
            renderLocationCards(locations);
        })
        .catch(error => {
            console.error('Error loading locations:', error);
            // Fallback to embedded data if fetch fails
            renderLocationCards(getEmbeddedLocations());
        });
}

// Fallback embedded locations data
function getEmbeddedLocations() {
    return [
        { name: "Beatrix Market – Loop", address: "155 N Upper Stetson Ave, Chicago, IL", lat: 41.885871, lng: -87.622917 },
        { name: "Beatrix Market – Streeterville", address: "671 N St Clair St, Chicago, IL", lat: 41.894501, lng: -87.622482 },
        { name: "Swadesi Cafe", address: "328 S Jefferson St #120, Chicago, IL", lat: 41.876968, lng: -87.642433 },
        { name: "Marriott Downtown Magnificent Mile", address: "540 N Michigan Ave, Chicago, IL", lat: 41.892430, lng: -87.624050 },
        { name: "Marriott Marquis McCormick Place", address: "2121 S Prairie Ave, Chicago, IL", lat: 41.852264, lng: -87.619019 },
        { name: "Sheraton Grand Chicago Riverwalk", address: "301 E North Water St, Chicago, IL", lat: 41.890579, lng: -87.617859 },
        { name: "Bombay Eats / Bombay Wraps – Streeterville", address: "330 E Ohio St, Chicago, IL", lat: 41.892982, lng: -87.617058 },
        { name: "Bombay Eats / Bombay Wraps – Loop", address: "122 N Wells St, Chicago, IL", lat: 41.883610, lng: -87.633980 },
        { name: "Patel Brothers – Naperville", address: "1568 W Ogden Ave, Naperville, IL", lat: 41.780624, lng: -88.181419 },
        { name: "Patel Brothers – Schaumburg", address: "430 W Higgins Rd, Schaumburg, IL", lat: 42.053539, lng: -88.084435 },
        { name: "Patel Brothers – Niles", address: "9555 N Milwaukee Ave, Niles, IL", lat: 42.047207, lng: -87.827728 },
        { name: "Bawarchi Biryani – Schaumburg", address: "766 S Roselle Rd, Schaumburg, IL", lat: 42.016720, lng: -88.079010 }
    ];
}

// Render location cards with template styling
function renderLocationCards(locations) {
    const container = document.getElementById('locations-list');
    if (!container) return;

    container.innerHTML = '';

    locations.forEach(location => {
        const card = document.createElement('div');
        card.className = 'location-card';

        // If the location object provides an `image` property, normalize it to
        // a root-relative URL so images load correctly regardless of the page
        // folder (e.g. /assets/foo.jpg). Otherwise fall back to the gradient
        // + emoji placeholder.
        const imageUrl = location.image
            ? (location.image.startsWith('/') || location.image.startsWith('http') ? location.image : '/' + location.image)
            : null;

        const imageHtml = imageUrl
            ? `<div class="location-image" style="background-image: url('${imageUrl}');"></div>`
            : `<div class="location-image" style="background: linear-gradient(135deg, #E6D5F5, #D4AF37); display: flex; align-items: center; justify-content: center; font-size: 3rem; color: white;">📍</div>`;

        card.innerHTML = `
            ${imageHtml}
            <div class="location-info">
                <h3>${location.name}</h3>
                <p><strong>📍 Address:</strong><br>${location.address}</p>
                <div style="margin-top: 1.5rem;">
                    <a href="https://www.google.com/maps/dir/?api=1&destination=${location.name}"
                       target="_blank"
                       class="cta-button"
                       style="display: inline-block; padding: 0.8rem 1.5rem; font-size: 0.9rem; text-decoration: none;">
                       Get Directions
                    </a>
                </div>
            </div>
        `;

        // Click card to zoom map
        card.addEventListener('click', (e) => {
            // Don't zoom if clicking the button
            if (e.target.tagName === 'A') return;

            map.setView([location.lat, location.lng], 15);

            // Open popup
            map.eachLayer(layer => {
                if (layer instanceof L.Marker) {
                    const pos = layer.getLatLng();
                    if (pos.lat === location.lat && pos.lng === location.lng) {
                        layer.openPopup();
                    }
                }
            });

            // Scroll to map
            document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'center' });
        });

        container.appendChild(card);
    });
}

// Run on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
} else {
    initMap();
}

