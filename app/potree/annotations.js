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
  let descriptionElement = $('<div></div>').html(descriptionText);
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
  // Fetch displacement data for the annotation's point label and populate the graph
  fetchDisplacementData(titleText, descriptionElement);
  // Override toString method for the title element
  titleElement.toString = () => titleText;
}

// Function to fetch displacement data for the clicked annotation's point label
function fetchDisplacementData(pointLabel, descriptionElement) {
  fetch('db/fetch_displacement_data.php?pointLabel=' + pointLabel)
    .then(response => response.json())
    .then(data => {
      // Check if data is available
      if (data && data.length > 0) {
        // Prepare data for the graph
        const surveyDates = data.map(entry => entry.survey_date);
        const displacements = data.map(entry => parseFloat(entry.d_mod));

        // Create a plotly graph
        const graph = document.createElement('div');
        Plotly.newPlot(graph, [{
          x: surveyDates,
          y: displacements,
          type: 'scatter',
          mode: 'lines+markers',
          marker: { color: 'blue' },
        }]);

        // Append the graph to the annotation's description
        descriptionElement.append(graph);
      } else {
        console.error('No displacement data found for the point label:', pointLabel);
      }
    })
    .catch(error => console.error('Error fetching displacement data:', error));
}
