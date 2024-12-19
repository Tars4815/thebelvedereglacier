// Fetch the years from belvedere.php
fetch("belvedere_options.php")
  .then((response) => response.json())
  .then((years) => {
    // Populate the dropdown menu with the fetched years
    var yearSelect = document.getElementById("yearSelect");
    years.forEach((year) => {
      var option = document.createElement("option");
      option.text = year;
      option.value = year;
      yearSelect.add(option);
    });
  })
  .catch((error) => console.error("Error fetching years:", error));


var fetchedData; // Global variable to store fetched data

// Function to fetch data based on selected year
function fetchDataByYear(year) {
  fetch(`belvedere_surveys.php?year=${year}`)
    .then((response) => response.json())
    .then((data) => {
      fetchedData = data;
      // Clear existing markers
      map.eachLayer(function (layer) {
        if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
          map.removeLayer(layer);
        }
      });
      // Add markers for each point
      var markerLayer = L.layerGroup();
      data.forEach((point) => {
        L.circleMarker([point.lat, point.lon], { radius: 5, color: 'red', fillColor: 'red', fillOpacity: 1})
          .addTo(markerLayer)
          .bindPopup("<b>Label:</b> " + point.label + "<br><b>East:</b> " + point.east + "<br><b>North:</b> " + point.north);
      });
      // Add markerLayer to map
      markerLayer.addTo(map);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// Event listener for button click
document.getElementById("fetchDataButton").addEventListener("click", function() {
  // Get the selected year from the dropdown menu
  var selectedYear = document.getElementById("yearSelect").value;
  // Fetch data based on the selected year
  fetchDataByYear(selectedYear);
});

// Initialize Leaflet map
var map = L.map("map").setView([45.95345216928198, 7.911727180145279], 14);

// Add base map layer
var baselayers = {
  OSM: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }),
  Esri_WorldImagery: L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }
  ),
};
baselayers.Esri_WorldImagery.addTo(map);

L.control
  .layers(baselayers, null, { position: "topright", collapsed: false })
  .addTo(map);

L.control.scale().addTo(map);

// Fetch point data from PHP script
fetch("belvedere_surveys.php")
  .then((response) => response.json())
  .then((data) => {
    // Store the fetched data globally
    fetchedData = data;

    // Create a layer group for the markers
    var markerLayer = L.layerGroup();
    // Add markers for each point
    data.forEach((point) => {
      L.circleMarker([point.lat, point.lon], { radius: 5, color: 'red', fillColor: 'red', fillOpacity: 1})
        .addTo(markerLayer)
        .bindPopup("<b>Label:</b> " + point.label);
    });
    // Add markerLayer to map
    markerLayer.addTo(map);

    // Adjust map height to fit viewport
    var mapContainer = document.getElementById("map");
    var headerHeight = document.querySelector("header").offsetHeight;
    mapContainer.style.height = window.innerHeight - headerHeight + "px";
  })
  .catch((error) => console.error("Error fetching data:", error));

// Function to download data as CSV
function downloadCSV() {
  // Convert JSON to CSV format
  var csv = "point_id,Label,East, North, h_ortho, Latitude,Longitude, h, survey_date, survey_year, meas_date, meas_time, meas_strategy, ds_east, dsn_north, ds_h\n";
  fetchedData.forEach((point) => {
    csv += `${point.point_id},${point.label},${point.east},${point.north},${point.h_orto},${point.lat},${point.lon},${point.h},${point.survey_date},${point.survey_year},${point.meas_date},${point.meas_time},${point.meas_strategy},${point.ds_east},${point.ds_north},${point.ds_h},\n`;
  });

  // Create a temporary anchor element to trigger the download
  var csvData = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  var csvURL = window.URL.createObjectURL(csvData);
  var tempLink = document.createElement("a");
  tempLink.href = csvURL;
  tempLink.setAttribute("download", "data.csv");
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
}
