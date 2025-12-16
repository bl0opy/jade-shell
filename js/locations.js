// ========================================
// Locations Page - Map and Location Cards
// ========================================

let map;
const chicagoCenter = [41.8781, -87.6298]; // Chicago coordinates

// Locations data
const locationsData = [
  {
    "name": "Beatrix Market – Loop",
    "address": "155 N Upper Stetson Ave, Chicago, IL",
    "lat": 41.885871,
    "lng": -87.622917
  },
  {
    "name": "Beatrix Market – Streeterville",
    "address": "671 N St Clair St, Chicago, IL",
    "lat": 41.894501,
    "lng": -87.622482
  },
  {
    "name": "Swadesi Cafe",
    "address": "328 S Jefferson St #120, Chicago, IL",
    "lat": 41.876968,
    "lng": -87.642433
  },
  {
    "name": "Marriott Downtown Magnificent Mile",
    "address": "540 N Michigan Ave, Chicago, IL",
    "lat": 41.892430,
    "lng": -87.624050
  },
  {
    "name": "Marriott Marquis McCormick Place",
    "address": "2121 S Prairie Ave, Chicago, IL",
    "lat": 41.852264,
    "lng": -87.619019
  },
  {
    "name": "Sheraton Grand Chicago Riverwalk",
    "address": "301 E North Water St, Chicago, IL",
    "lat": 41.890579,
    "lng": -87.617859
  },
  {
    "name": "Bombay Eats / Bombay Wraps – Streeterville",
    "address": "330 E Ohio St, Chicago, IL",
    "lat": 41.892982,
    "lng": -87.617058
  },
  {
    "name": "Bombay Eats / Bombay Wraps – Loop",
    "address": "122 N Wells St, Chicago, IL",
    "lat": 41.883610,
    "lng": -87.633980
  },
  {
    "name": "Patel Brothers – Naperville",
    "address": "1568 W Ogden Ave, Naperville, IL",
    "lat": 41.780624,
    "lng": -88.181419
  },
  {
    "name": "Patel Brothers – Schaumburg",
    "address": "430 W Higgins Rd, Schaumburg, IL",
    "lat": 42.053539,
    "lng": -88.084435
  },
  {
    "name": "Patel Brothers – Niles",
    "address": "9555 N Milwaukee Ave, Niles, IL",
    "lat": 42.047207,
    "lng": -87.827728
  },
  {
    "name": "Bawarchi Biryani – Schaumburg",
    "address": "766 S Roselle Rd, Schaumburg, IL",
    "lat": 42.016720,
    "lng": -88.079010
  }
];

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadLocations();
});

// Load locations
function loadLocations() {
    try {
        initMap(locationsData);
        renderLocationCards(locationsData);
    } catch (error) {
        console.error('Error loading locations:', error);
    }
}

// Initialize Leaflet map
function initMap(locations) {
    // Create map centered on Chicago
    map = L.map('map').setView(chicagoCenter, 11);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Add markers for each location
    locations.forEach((location, index) => {
        const marker = L.marker([location.lat, location.lng]).addTo(map);

        // Create popup content
        const popupContent = `
            <div style="min-width: 200px;">
                <h3 style="margin: 0 0 0.5rem 0; color: #2C2C2C; font-size: 1.1rem;">${location.name}</h3>
                <p style="margin: 0; color: #666; font-size: 0.9rem;">${location.address}</p>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}"
                   target="_blank"
                   style="display: inline-block; margin-top: 0.5rem; color: #D4AF37; text-decoration: none; font-weight: 600;">
                   Get Directions →
                </a>
            </div>
        `;

        marker.bindPopup(popupContent);

        // Open first marker by default
        if (index === 0) {
            marker.openPopup();
        }
    });
}

// Render location cards
function renderLocationCards(locations) {
    const container = document.getElementById('locations-list');

    locations.forEach(location => {
        const card = createLocationCard(location);
        container.appendChild(card);
    });
}

// Create individual location card
function createLocationCard(location) {
    const card = document.createElement('div');
    card.className = 'location-card';

    // Generate Google Street View image URL
    const streetViewUrl = `https://maps.googleapis.com/maps/api/streetview?size=400x300&location=${location.lat},${location.lng}&fov=90&heading=0&pitch=0&key=YOUR_API_KEY`;

    // Use a placeholder that shows the location name
    const placeholderUrl = `https://via.placeholder.com/400x300/8B7BA8/FFFFFF?text=${encodeURIComponent(location.name)}`;

    card.innerHTML = `
        <div class="location-image" style="background: linear-gradient(135deg, #E6D5F5, #D4AF37); display: flex; align-items: center; justify-content: center; font-size: 3rem; color: white;">
            📍
        </div>
        <div class="location-info">
            <h3>${location.name}</h3>
            <p><strong>📍 Address:</strong><br>${location.address}</p>
            <div style="margin-top: 1.5rem;">
                <a href="https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}"
                   target="_blank"
                   class="cta-button"
                   style="display: inline-block; padding: 0.8rem 1.5rem; font-size: 0.9rem; text-decoration: none;">
                   Get Directions
                </a>
            </div>
        </div>
    `;

    // Add click event to zoom to location on map
    card.addEventListener('click', () => {
        map.setView([location.lat, location.lng], 15);

        // Find and open the corresponding marker popup
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                const markerLatLng = layer.getLatLng();
                if (markerLatLng.lat === location.lat && markerLatLng.lng === location.lng) {
                    layer.openPopup();
                }
            }
        });

        // Smooth scroll to map
        document.getElementById('map').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    return card;
}

// Add hover effect cursor
const style = document.createElement('style');
style.textContent = `
    .location-card {
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .location-card:hover {
        transform: translateY(-5px) scale(1.02);
    }

    .leaflet-popup-content {
        margin: 1rem;
    }

    .leaflet-popup-content h3 {
        margin-top: 0;
    }
`;
document.head.appendChild(style);
