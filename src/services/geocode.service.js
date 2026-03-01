const geocode = async (location) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
    {
      headers: {
        "User-Agent": "nomadnest-student-project",
      },
    },
  );

  const data = await res.json();

  if (!data.length) return null;

  return {
    type: "Point",
    coordinates: [
      parseFloat(data[0].lon), // longitude
      parseFloat(data[0].lat), // latitude
    ],
  };
};

export default geocode;
