console.log('Hello from the client side :D');

const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoidGhvbWFzMzEwNyIsImEiOiJjbGhleW1pNmgwdG5xM2ZvYnFubTExaDY2In0.-wn7c6i4XKB0ON3DCMW6zg';

const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/thomas3107/clhgftbhl01ah01qubq6gbfw4', // style URL
  // center: [-118.113491, 34.111745], // starting position [lng, lat]
  // zoom: 6, // starting zoom,
  // interactive: false,
  scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add Popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    right: 100,
    left: 100,
  },
});
