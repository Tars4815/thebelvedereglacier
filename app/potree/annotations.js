/**
 * Create and add a Potree annotation to the scene with the provided information.
 *
 * @param {number} id - Unique identifier for the annotation.
 * @param {object} scene - The Potree scene in which the annotation will be added.
 * @param {string} titleText - Text for the title of the annotation.
 * @param {number[]} position - Array containing x, y, z coordinates of the annotation position.
 * @param {number[]} cameraPosition - Array containing x, y, z coordinates of the camera position.
 * @param {number[]} cameraTarget - Array containing x, y, z coordinates of the camera target.
 * @param {string} descriptionText - Text for the description of the annotation.
 * @throws {Error} Will throw an error if there's an issue creating or adding the annotation to the scene.
 */
function createAnnotation(
  id,
  scene,
  titleText,
  position,
  cameraPosition,
  cameraTarget,
  descriptionText
) {
  // Create title and description elements
  let titleElement = $(`<span>${titleText}</span>`);
  let graphPanel = document.getElementById("gcp-chart");
  titleElement.click((event) => {
    console.log("Titolo: " + titleText);
    graphPanel.style.visibility = "visible";
    // Fetch displacement data for the annotation's point label and populate the graph
    fetchVelocitytData(titleText, graphPanel);
  });
  let descriptionElement = $("<div></div>").html(descriptionText);
  // Create Potree.Annotation instance
  let annotation = new Potree.Annotation({
    position: position,
    title: titleElement,
    cameraPosition: cameraPosition,
    cameraTarget: cameraTarget,
    description: descriptionElement,
  });
  // Assigning unique ID from database
  annotation.customId = id;
  // Set the annotation to be visible
  annotation.visible = true;
  // Add the annotation to the scene
  scene.annotations.add(annotation);
  // Override toString method for the title element
  titleElement.toString = () => titleText;
}

// Function to generate the ECharts graph
function generateEChartsGraph(data, panelElement, pointLabel) {
  // Process data for the graph
  const xAxisData = data.map((entry) => entry.survey_year);
  const seriesData = data.map((entry) => parseFloat(entry.v));
  console.log(seriesData);
  console.log(xAxisData);

  // Create a container div for the ECharts graph
  const chartContainer = document.createElement("div");
  chartContainer.id = "movement-chart";
  chartContainer.style.width = "100%";
  chartContainer.style.height = "100%";

  // Append the chart container to the panel element
  panelElement.appendChild(chartContainer);

  // Initialize ECharts instance
  const chart = echarts.init(chartContainer);

  // ECharts options
  const option = {
    textStyle: {
      color: "#fff",
    },
    title: {
      text: "Velocity over time for point " + pointLabel,
      textStyle: {
        color: "#fff",
      },
      textAlign: "auto",
      padding: 10,
      left: "center",
    },
    xAxis: {
      type: "category",
      data: xAxisData,
    },
    yAxis: {
      type: "value",
      name: "Velocity (m/d)",
      yAxis: seriesData,
    },
    dataView: { readOnly: false },
    tooltip: {
      trigger: "axis",
      valueFormatter: (value) => parseFloat(value).toFixed(3) + ' m/d',
    },
    toolbox: {
      feature: {
        saveAsImage: {},
        showTitle: true,
        dataZoom: {
          yAxisIndex: "none",
        },
        magicType: { type: ["line", "bar"] },
        restore: {},
      },
    },
    series: [
      {
        data: seriesData,
        type: "line",
      },
    ],
  };

  // Set ECharts options and render the chart
  chart.setOption(option);
}

// Function to fetch displacement data for the clicked annotation's point label
function fetchVelocitytData(pointLabel, panelElement) {
  fetch(`db/fetch_velocity_data.php?pointLabel=${pointLabel}`)
      .then((response) => response.json())
      .then((data) => {
          console.log(pointLabel, data);
          // Check if data is available
          if (data && data.length > 0) {
              // Remove existing chart if it exists
              const existingChart = panelElement.querySelector('#movement-chart');
              if (existingChart) {
                  existingChart.remove();
              }
              // Clean the innerHTML of the panel element
              panelElement.innerHTML = '';
              // Generate the ECharts graph with the fetched data
              generateEChartsGraph(data, panelElement, pointLabel);
          } else {
              console.warn("No velocity data found for the point label:", pointLabel);
              // Optionally, display a message indicating no data found
              panelElement.innerHTML = "No velocity data found for the point label: " + pointLabel;
          }
      })
      .catch((error) =>
          console.error("Error fetching displacement data:", error)
      );
}

