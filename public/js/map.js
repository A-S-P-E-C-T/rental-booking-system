if (typeof listingData !== "undefined") {
  const [lng, lat] = listingData.geometry.coordinates;

  const map = L.map("map").setView([lat, lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`<b>${listingData.title}</b>`)
    .openPopup();
}
