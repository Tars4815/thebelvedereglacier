<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta name="description" content="">
	<meta name="author" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
	<title>Belvedere Glacier</title>
	<link rel="stylesheet" type="text/css" href="./libs/potree/potree.css">
	<link rel="stylesheet" type="text/css" href="./libs/jquery-ui/jquery-ui.min.css">
	<link rel="stylesheet" type="text/css" href="./libs/openlayers3/ol.css">
	<link rel="stylesheet" type="text/css" href="./libs/spectrum/spectrum.css">
	<link rel="stylesheet" type="text/css" href="./libs/jstree/themes/mixed/style.css">
	<link rel="stylesheet" type="text/css" href="./libs/Cesium/Widgets/CesiumWidget/CesiumWidget.css">
	<!-- Custom styles for this template -->
	<link rel="stylesheet" type="text/css" href="./css/style.css">
</head>

<body>
	<script src="./libs/jquery/jquery-3.1.1.min.js"></script>
	<script src="./libs/spectrum/spectrum.js"></script>
	<script src="./libs/jquery-ui/jquery-ui.min.js"></script>
	<script src="./libs/other/BinaryHeap.js"></script>
	<script src="./libs/tween/tween.min.js"></script>
	<script src="./libs/d3/d3.js"></script>
	<script src="./libs/proj4/proj4.js"></script>
	<script src="./libs/openlayers3/ol.js"></script>
	<script src="./libs/i18next/i18next.js"></script>
	<script src="./libs/jstree/jstree.js"></script>
	<script src="./libs/potree/potree.js"></script>
	<script src="./libs/plasio/js/laslaz.js"></script>
	<script src="./libs/Cesium/Cesium.js"></script>
	<script src="https://fastly.jsdelivr.net/npm/echarts@5/dist/echarts.min.js"></script>

	<!-- Import POINTCLOUD-->
	<script type="module" src="viewer.js"></script>
	<!-- Import ANNOTATIONS-->
	<script src="annotations.js"></script>
	<!-- Import main js-->
	<script type="module" src="main.js"></script>

	<!-- Defining the dropdown menu for selecting Survey years-->
	<div class="surveys-menu-container">
		<select id="yearDropdown">
			<option value="">Select Survey Year</option>
		</select>
		<button id="loadAnnotationsBtn">Load GNSS Measurements</button>
		<button id="removeAnnotationsBtn">Remove</button>
	</div>
	<div id="gcp-chart">
		<div id="chart-container"></div>
		<button id="close-btn">X</button>
	</div>	

	<!-- Loading settings for Potree viewer -->
	<div class="potree_container" style="position: relative; height:100%; width: 100%;">
		<div id="potree_render_area">
			<div id="cesiumContainer" style="position: absolute; width: 100%; height: 100%; background-color:black"></div>
		</div>
		<div id="potree_sidebar_container" style="width: 50%; height: 100%;"></div>
		
		<!-- Hotspots Dropup -->
		<div class="controls">
			<div class="hotspot-controls">
				<div id="prev" data-title="Previous Annotation" data-action="prev-annotation">
					<div id="prevDiv"><img id="prevIcon" src="libs/potree/resources/icons/arrow_left.svg" /></div>
				</div>
				<div id="hotspots" class="hotspot-name" data-action="toggle-annotation-list"><b id="hotspotName">Explore</b></div>
				<div id="next" data-title="Next Annotation" data-action="next-annotation">
					<div id="nextDiv"><img id="nextIcon" src="libs/potree/resources/icons/arrow_right.svg" /></div>
				</div>
				<div id="lists" class="list hotspots-list visible">
					<ul class="js-scrollable" id="hotspotList">
						<!-- Hotspot items will be dynamically inserted here -->
					</ul>
				</div>
			</div>
		</div>
	</div>
	
	<script type="module">
		// List of years for point clouds
		const years = [
			"1977", "1991", "2001", "2009", "2015",
			"2016", "2017", "2018", "2019", "2020",
			"2021", "2022", "2023"
		];

		const hotspotList = document.getElementById('hotspotList');
		const hotspotNameElem = document.getElementById('hotspotName');
		let currentIndex = 0;

		// Function to change the hotspot name
		const changeHotspotName = (newName) => {
			hotspotNameElem.innerHTML = newName;
		};

		// Function to handle visibility of point clouds based on the selected year
		const handlePointCloudVisibility = (year) => {
			years.forEach(y => {
				potreeViewer.scene.pointclouds.find(element => element.name === y).visible = (y === year);
			});
			changeHotspotName(year);
		};

		// Function to get the next index based on the direction
		const getNextIndex = (index, direction) => {
			return direction === 'next' ? (index + 1) % years.length : (index === 0 ? years.length - 1 : index - 1);
		};

		// Function to change the scene based on the selected year
		const changeScene = (direction) => {
			currentIndex = getNextIndex(currentIndex, direction);
			handlePointCloudVisibility(years[currentIndex]);
		};

		// Function to initialize the year click handlers and hide list functionality
		const setupYearClickHandlers = () => {
			years.forEach((year, index) => {
				const listItem = document.createElement('li');
				listItem.id = `li${index + 1}`;
				listItem.className = 'link';
				listItem.innerHTML = `<a data-hotspot-target="${index}" title="${year}">${year}</a>`;
				
				listItem.addEventListener('click', () => {
					handlePointCloudVisibility(year);
					document.getElementById('lists').style.display = 'none';
				});
				
				hotspotList.appendChild(listItem);
			});
		};

		// Event listeners for previous and next buttons
		document.getElementById('prev').addEventListener('click', () => changeScene('prev'));
		document.getElementById('next').addEventListener('click', () => changeScene('next'));

		// Toggle the visibility of the hotspots list
		document.getElementById('hotspots').addEventListener('click', () => {
			document.getElementById('lists').classList.toggle('visible');
		});

		// Initialize the setup
		setupYearClickHandlers();
	</script>
</body>

</html>