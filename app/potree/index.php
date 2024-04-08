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
	<!-- INCLUDE ADDITIONAL DEPENDENCIES HERE -->
	<!-- Custom styles for this template -->
	<link rel="stylesheet" type="text/css" href="css/style.css">
	<!-- Defining header with title -->
	<!-- <div id="header_panel">
		<div id="header_title">
		</div>
	</div> -->
	<!-- Defining the dropdown menu for selecting Survey years-->
	<div class="surveys-menu-container">
		<select id="yearDropdown">
			<option value="">Select Year</option>
		</select>
		<button id="loadAnnotationsBtn">Load Annotations</button>
	</div>
	<!--Loading settings for Potree viewer-->
	<div class="potree_container" style="position: relative; height:100%; width: 100%;">
		<div id="potree_render_area">
		</div>
		<div id="potree_sidebar_container" style="width: 50%; height: 100%;"> </div>
		<!--Hotspots Dropup-->
		<div class="controls">
			<div class="hotspot-controls">
				<div id="prev" data-title="Previous Annotation" data-action="prev-annotation">
					<div id="prevDiv"><img id="prevIcon" src="libs/potree/resources/icons/arrow_left.svg" /></div>
				</div>
				<div id="hotspots" class="hotspot-name" data-action="toggle-annotation-list"><b
						id="hotspotName">Explore</b></div>
				<div id="next" data-title="Next Annotation" data-action="next-annotation">
					<div id="nextDiv"><img id="nextIcon" src="libs/potree/resources/icons/arrow_right.svg" /></div>
				</div>
				<div id="lists" class="list hotspots-list visible">
					<ul class="js-scrollable">
						<li id="li1" class="link"><a data-hotspot-target="0" title="1977">1977</a></li>
						<li id="li2" class="link"><a data-hotspot-target="1" title="1999">1999</a></li>
						<li id="li3" class="link"><a data-hotspot-target="2" title="2001">2001</a></li>
						<li id="li4" class="link"><a data-hotspot-target="3" title="2009">2009</a></li>
						<li id="li5" class="link"><a data-hotspot-target="4" title="2015">2015</a></li>
						<li id="li6" class="link"><a data-hotspot-target="5" title="2016">2016</a></li>
						<li id="li7" class="link"><a data-hotspot-target="6" title="2017">2017</a></li>
						<li id="li8" class="link"><a data-hotspot-target="7" title="2018">2018</a></li>
						<li id="li9" class="link"><a data-hotspot-target="8" title="2019">2019</a></li>
						<li id="li10" class="link"><a data-hotspot-target="9" title="2020">2020</a></li>
						<li id="li11" class="link"><a data-hotspot-target="10" title="2021">2021</a></li>
						<li id="li12" class="link"><a data-hotspot-target="11" title="2022">2022</a></li>
						<li id="li13" class="link"><a data-hotspot-target="12" title="2023">2023</a></li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<!-- Import POINTCLOUD-->
	<script src="pointcloud.js"></script>
	<!-- Import ANNOTATIONS-->
	<script src="annotations.js"></script>
	<!--Import ORIENTED IMAGES-->
	<!-- <script src="src/orientedcameras.js"></script> -->
	<!-- Import main js-->
	<script src="main.js"></script>
	<script>
		//Function to change Touch to HotspotName
		function changeHotspotName(newName) {
			document.getElementById('hotspotName').innerHTML = newName;
		}

	</script>
	<script type="module">

		/* Hotspots Control Dropup*/
		$("#hotspots").click(function () {
			$("#lists").toggle();

		});


		// Function to handle visibility of point clouds based on the selected year
		function handlePointCloudVisibility(year) {
			const years = [
				"1977", "1991", "2001", "2009", "2015",
				"2016", "2017", "2018", "2019", "2020",
				"2021", "2022", "2023"
			];

			// Hide all point clouds except the selected year
			years.forEach(y => {
				viewer.scene.pointclouds.find(element => element.name === y).visible = (y === year);
			});

			// Update the hotspot name
			changeHotspotName(year);
		}

		// Define functions for each year
		function item1() {
			handlePointCloudVisibility("1977");
		}
		function item2() {
			handlePointCloudVisibility("1991");
		}
		function item3() {
			handlePointCloudVisibility("2001");
		}
		function item4() {
			handlePointCloudVisibility("2009");
		}
		function item5() {
			handlePointCloudVisibility("2015");
		}
		function item6() {
			handlePointCloudVisibility("2016");
		}
		function item7() {
			handlePointCloudVisibility("2017");
		}
		function item8() {
			handlePointCloudVisibility("2018");
		}
		function item9() {
			handlePointCloudVisibility("2019");
		}
		function item10() {
			handlePointCloudVisibility("2020");
		}
		function item11() {
			handlePointCloudVisibility("2021");
		}
		function item12() {
			handlePointCloudVisibility("2022");
		}
		function item13() {
			handlePointCloudVisibility("2023");
		}

		//Hotspot Dropup's Click Selection
		$("#li1").click(function () {
			item1();
		});
		$("#li2").click(function () {
			item2();
		});
		$("#li3").click(function () {
			item3();
		});
		$("#li4").click(function () {
			item4();
		});
		$("#li5").click(function () {
			item5();
		});
		$("#li6").click(function () {
			item6();
		});
		$("#li7").click(function () {
			item7();
		});
		$("#li8").click(function () {
			item8();
		});
		$("#li9").click(function () {
			item9();
		});
		$("#li10").click(function () {
			item10();
		});
		$("#li11").click(function () {
			item11();
		});
		$("#li12").click(function () {
			item12();
		});
		$("#li13").click(function () {
			item13();
		});

		//Hotspot Dropup's Prev/Next Selection
		const functions = [];
		functions.push(item1);
		functions.push(item2);
		functions.push(item3);
		functions.push(item4);
		functions.push(item5);
		functions.push(item6);
		functions.push(item7);
		functions.push(item8);
		functions.push(item9);
		functions.push(item10);
		functions.push(item11);
		functions.push(item12);
		functions.push(item13);

		const length = functions.length;

		const getNextIdx = (idx = 0, length, direction) => {
			switch (direction) {
				case 'next': return (idx + 1) % length;
				case 'prev': return (idx == 0) && length - 1 || idx - 1;
				default: return idx;
			}
		}

		let idx; // idx is undefined, so getNewScene will take 0 as default
		const getNewScene = (direction) => {
			idx = getNextIdx(idx, length, direction);
			var sceneFunction = functions[idx];
			return sceneFunction();
		}

		$("#prev").click(function () {
			getNewScene('prev');
		});

		$("#next").click(function () {
			getNewScene('next');
		});

		//Temp solution to hide list when a hotspot is selected
		function hideList(listItem) {
			var openLink = document.getElementById(listItem);
			openLink.addEventListener('click', clickHandler, false);
			function clickHandler() {
				var submenu = document.getElementById('lists');
				submenu.style.display = 'none';
			}
		}

		hideList('li1');
		hideList('li2');
		hideList('li3');
		hideList('li4');
		hideList('li5');
		hideList('li6');
		hideList('li7');
		hideList('li8');
		hideList('li9');
		hideList('li10');
		hideList('li11');
		hideList('li12');
		hideList('li13');
	</script>
</body>

</html>