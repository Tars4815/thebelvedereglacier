// Fetch years from fetch_data.php and populate the dropdown
fetch("db/fetch_data.php")
  .then((response) => response.json())
  .then((years) => {
    const dropdown = document.getElementById("yearDropdown");
    years.forEach((year) => {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      dropdown.appendChild(option);
    });
  })
  .catch((error) => console.error("Error fetching years:", error));

// Add event listener to load annotations button
document
  .getElementById("loadAnnotationsBtn")
  .addEventListener("click", function () {
    const selectedYear = document.getElementById("yearDropdown").value;
    if (selectedYear) {
        fetch('db/get_points.php?year=' + selectedYear)
        .then(response => response.json())
        .then(points => {
            // Assuming 'viewer.scene' is your Potree scene object
            points.forEach(point => {
                // Convert string values to floats
                const position = [parseFloat(point.east), parseFloat(point.north), parseFloat(point.h)];
                createAnnotation(
                    point.id, // id
                    viewer.scene, // scene
                    point.label, // titleText
                    position, // position (floats)
                    [], // cameraPosition (empty)
                    [], // cameraTarget (empty)
                    '' // descriptionText (empty)
                );
            });
        })
        .catch(error => console.error('Error fetching points:', error));
} else {
    alert('Please select a year before loading annotations.');
}
});
