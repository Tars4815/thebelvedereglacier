function copyLink(event) {
  event.preventDefault(); // Prevent the default action
  const link = event.target.getAttribute('data-link'); // Get the link from data attribute
  navigator.clipboard.writeText(link) // Copy link to clipboard
      .then(() => alert("Link copied to clipboard!"))
      .catch(err => console.error("Failed to copy: ", err));
}
// Fetch the years from belvedere_options.php
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
var orthophotoLayer, dsmLayer; // Global variables for fixed WMS layers

// Function to update WMS layers with the selected year
function updateWMSLayers(year) {
  // Update the WMS layers' URLs with the selected year
  var orthophotoParams = {
    layers: `labmgf:belvedere_${year}_orthophoto_20cm`,
    format: "image/png",
    transparent: true,
    attribution: "Orthophoto",
  };
  var dsmParams = {
    layers: `labmgf:belvedere_${year}_dsm`,
    format: "image/png",
    transparent: true,
    attribution: "DSM",
  };

  // Update the existing WMS layers without reloading them
  orthophotoLayer.setParams(orthophotoParams);
  dsmLayer.setParams(dsmParams);
}

// Function to fetch data based on the selected year
function fetchDataByYear(year) {
  // Update the WMS layers for the selected year (without reloading them)
  updateWMSLayers(year);

  // Fetch point data for the selected year
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
        L.circleMarker([point.lat, point.lon], {
          radius: 5,
          color: "red",
          fillColor: "red",
          fillOpacity: 1,
        })
          .addTo(markerLayer)
          .bindPopup(
            "<b>Label:</b> " +
              point.label +
              "<br><b>East:</b> " +
              point.east +
              "<br><b>North:</b> " +
              point.north +
              "<br><b>h:</b> " +
              point.h
          );
      });
      // Add markerLayer to map
      markerLayer.addTo(map);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// Event listener for button click
document
  .getElementById("fetchDataButton")
  .addEventListener("click", function () {
    // Get the selected year from the dropdown menu
    var selectedYear = document.getElementById("yearSelect").value;
    if (selectedYear) {
      fetchDataByYear(selectedYear);
    } else {
      alert("Please select a year.");
    }
  });

// Initialize Leaflet map
var map = L.map("map").setView([45.95345216928198, 7.911727180145279], 14);

// Add base map layer
var baselayers = {
  OSM: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    zIndex: 1,
  }),
  Esri_WorldImagery: L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }
  ),
};
baselayers.OSM.addTo(map);

// Initialize the orthophoto and DSM WMS layers for the first time (default year, e.g., 2023)
orthophotoLayer = L.tileLayer
  .wms("https://www.gis-geoserver.polimi.it/geoserver/labmgf/wms?", {
    layers: "labmgf:belvedere_2023_orthophoto_50cm", // Default year
    format: "image/png",
    transparent: true,
    // opacity: 0.5,
    attribution: "LabMGF - 2023 Orthophoto",
    zIndex: 2,
  })
  .addTo(map);

dsmLayer = L.tileLayer
  .wms("https://www.gis-geoserver.polimi.it/geoserver/labmgf/wms?", {
    layers: "labmgf:belvedere_2023_dsm_50cm", // Default year
    format: "image/png",
    transparent: true,
    attribution: "LabMGF - 2023 DSM",
    zIndex: 3,
  })
  .addTo(map);

// Define overlay layers
var overlayLayers = {
  "2023 Orthophoto": orthophotoLayer,
  "2023 DSM": dsmLayer,
};

L.control
  .layers(baselayers, overlayLayers, { position: "topright", collapsed: false })
  .addTo(map);

L.control.scale().addTo(map);

// Create a legend control
var legendControl = L.control({ position: "topleft" });

legendControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend");
  div.innerHTML = '<div id="legend-content"></div>';
  return div;
};

// Add the legend control to the map
legendControl.addTo(map);

var legendContent = document.getElementById("legend-content");
legendContent.innerHTML = ""; // Clear previous legend

// Add DSM legend
var dsmLegendUrl = `https://www.gis-geoserver.polimi.it/geoserver/labmgf/wms?service=WMS&version=1.1.0&request=GetLegendGraphic&layer=labmgf:belvedere_2023_dsm_50cm&format=image/png`;
var dsmLegend = L.control({ position: 'topleft' });

dsmLegend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML += `<img src="${dsmLegendUrl}">`;
  return div;
};

dsmLegend.addTo(map);

// legendContent.innerHTML += `<div><h5>DSM 2023</h5><br><img src="${dsmLegendUrl}" alt="DSM Legend"></div>`;


// Fetch initial point data
fetch("belvedere_surveys.php")
  .then((response) => response.json())
  .then((data) => {
    fetchedData = data;

    // Create a layer group for the markers
    var markerLayer = L.layerGroup();
    // Add markers for each point
    data.forEach((point) => {
      L.circleMarker([point.lat, point.lon], {
        radius: 3,
        color: "blue",
        fillColor: "blue",
        fillOpacity: 1,
      })
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
  var csv =
    "point_id,Label,East,North,h_ortho,Latitude,Longitude,h,survey_date,survey_year,meas_date,meas_time,meas_strategy,ds_east,ds_north,ds_h\n";
  fetchedData.forEach((point) => {
    csv += `${point.point_id},${point.label},${point.east},${point.north},${point.h},${point.lat},${point.lon},${point.h},${point.survey_date},${point.survey_year},${point.meas_date},${point.meas_time},${point.meas_strategy},${point.ds_east},${point.ds_north},${point.ds_h}\n`;
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
