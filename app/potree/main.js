document.addEventListener("DOMContentLoaded", () => {
  const yearSelect = document.getElementById("year");
  const monthSelect = document.getElementById("month");
  const daySelect = document.getElementById("day");
  const loadImagesButton = document.getElementById("loadImagesButton");

  if (!yearSelect || !monthSelect || !daySelect || !loadImagesButton) {
    console.error("Year, month, day select elements or load button not found");
    return;
  }

  const currentYear = new Date().getFullYear();
  const earliestYear = 2022; // Change this to the earliest year you want

  // Populate year dropdown
  for (let year = currentYear; year >= earliestYear; year--) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }

  // Populate month dropdown
  for (let month = 1; month <= 12; month++) {
    const option = document.createElement("option");
    option.value = month.toString().padStart(2, "0");
    option.textContent = month;
    monthSelect.appendChild(option);
  }

  // Function to populate day dropdown
  const populateDays = (year, month) => {
    daySelect.innerHTML = "";
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const option = document.createElement("option");
      option.value = day.toString().padStart(2, "0");
      option.textContent = day;
      daySelect.appendChild(option);
    }
  };

  // Initialize days for the default selected month and year
  populateDays(currentYear, new Date().getMonth() + 1);

  yearSelect.addEventListener("change", () => {
    populateDays(parseInt(yearSelect.value), parseInt(monthSelect.value));
  });

  monthSelect.addEventListener("change", () => {
    populateDays(parseInt(yearSelect.value), parseInt(monthSelect.value));
  });

  let imageFilenameSX = ``;
  let imageFilenameDX = ``;

  // Function to update image filenames and load images
  const handleDropdownChange = () => {
    const selectedYear = yearSelect.value.slice(-2);
    const selectedMonth = monthSelect.value;
    const selectedDay = daySelect.value;
    /*console.log(
      `Selected date: ${selectedYear}-${selectedMonth}-${selectedDay}`
    );*/

    imageFilenameSX = `img${selectedDay}${selectedMonth}${selectedYear}_sx.jpg`;
    imageFilenameDX = `img${selectedDay}${selectedMonth}${selectedYear}_dx.jpg`;
  };

  yearSelect.addEventListener("change", handleDropdownChange);
  monthSelect.addEventListener("change", handleDropdownChange);
  daySelect.addEventListener("change", handleDropdownChange);

  
  // Function to load oriented images
  const loadOrientedImages = (camera, imageFileName) => {
    const cameraParams = `../assets/img_selected/camera_${camera}/${camera}.xml`;
    const imageParams =  `../assets/img_selected/camera_${camera}/orientedimages.txt`;

    Potree.OrientedImageLoader.load(cameraParams, imageParams, potreeViewer)
      .then((images) => {
        console.log(images);
        console.log(images.images[0]);
        images.images[0].id = imageFileName;
        console.log(images.images[0]);
        images.visible = true;
        potreeViewer.scene.addOrientedImages(images);
        images.name = `camera_${camera}`;
        console.log(`Loaded images for camera ${camera}`);
      })
      .catch((error) => {
        console.error(`Error loading images for camera ${camera}`, error);
      });
  };

  // Load images when the button is clicked
  loadImagesButton.addEventListener("click", () => {
    loadOrientedImages("sx", imageFilenameSX);
    loadOrientedImages("dx", imageFilenameDX);
  });

  // Initialize images on page load
  handleDropdownChange();

});
