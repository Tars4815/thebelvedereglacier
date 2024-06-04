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

    <!-- Import POINTCLOUD -->
    <script type="module" src="viewer.js"></script>
    <!-- Import ANNOTATIONS -->
    <script src="annotations.js"></script>
    <!-- Import main js -->
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
            <div id="cesiumContainer" style="position: absolute; width: 100%; height: 100%; background-color:black">
            </div>
        </div>
        <div id="potree_sidebar_container" style="width: 50%; height: 100%;"></div>

    </div>

    <script>
		const years = ["1977", "1991", "2001", "2009", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"];

		// Create the hotspot controls dynamically
		function createHotspotControls() {
			const hotspotControls = document.createElement('div');
			hotspotControls.classList.add('controls');
			hotspotControls.innerHTML = `
				<div class="hotspot-controls">
					<div id="prev" data-title="Previous Annotation" data-action="prev-annotation">
						<div id="prevDiv"><img id="prevIcon" src="libs/potree/resources/icons/arrow_left.svg" /></div>
					</div>
					<div id="hotspots" class="hotspot-name" data-action="toggle-annotation-list"><b id="hotspotName">Explore</b></div>
					<div id="next" data-title="Next Annotation" data-action="next-annotation">
						<div id="nextDiv"><img id="nextIcon" src="libs/potree/resources/icons/arrow_right.svg" /></div>
					</div>
					<div id="lists" class="list hotspots-list visible">
						<ul class="js-scrollable">
							${years.map(year => `<li class="link"><a data-hotspot-target="${year}" title="${year}">${year}</a></li>`).join('')}
						</ul>
					</div>
				</div>
			`;
			return hotspotControls;
		}

		// Append the dynamically created hotspot controls to the document
		document.body.appendChild(createHotspotControls());

		// Event binding for the dynamically created hotspot links
		document.querySelectorAll('.hotspots-list .link a').forEach(link => {
			link.addEventListener('click', function () {
				const year = this.getAttribute('data-hotspot-target');
				handlePointCloudVisibility(year);
				changeHotspotName(year);
				document.getElementById('lists').style.display = 'none'; // Hide the list after selecting a year
			});
		});
		
		// Function to get a point cloud object by its name
		function get_pointcloud_by_name(name) {
			return potreeViewer.scene.pointclouds.find(element => element.name === name);
		}

		// Function to handle visibility of point clouds based on the selected year
		function handlePointCloudVisibility(year) {
			// Hide all point clouds except the selected year
			years.forEach(y => {
				const pointCloud = get_pointcloud_by_name(y);
				if (pointCloud) {
					// Cast to string for comparison
					pointCloud.visible = (y.toString() === year.toString());
				} else {
					console.log(`Point cloud for year ${y} not found`);
				}
			});
		}

        // Function to change Touch to HotspotName
        function changeHotspotName(newName) {
            document.getElementById('hotspotName').innerHTML = newName;
        }

		$(".link a").click(function () {
			const year = $(this).data('hotspot-target');
			// Hide all point clouds except the selected year
			handlePointCloudVisibility(year);
			// Update the hotspot name
			changeHotspotName(year);			
			$("#lists").hide(); 
		});

        // Hotspots Control Dropup toggle
        $("#hotspots").click(function () {
            $("#lists").toggle();
        });

        // Prev/Next functionality
        let currentIndex = 0;
        function changeScene(direction) {
            if (direction === 'next') {
                currentIndex = (currentIndex + 1) % years.length;
            } else if (direction === 'prev') {
                currentIndex = (currentIndex - 1 + years.length) % years.length;
            }
            handlePointCloudVisibility(years[currentIndex]);
			changeHotspotName(years[currentIndex]);			
        }

        $("#prev").click(function () {
            changeScene('prev');
        });

        $("#next").click(function () {
            changeScene('next');
        });
    </script>
</body>

</html>
