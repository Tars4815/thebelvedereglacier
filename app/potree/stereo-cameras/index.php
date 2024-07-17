<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="utf-8">
	<meta name="description" content="">
	<meta name="author" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
	<title>Belvedere Glacier | Stereo-cameras</title>
	<link rel="stylesheet" type="text/css" href="../libs/potree/potree.css">
	<link rel="stylesheet" type="text/css" href="../libs/jquery-ui/jquery-ui.min.css">
	<link rel="stylesheet" type="text/css" href="../libs/openlayers3/ol.css">
	<link rel="stylesheet" type="text/css" href="../libs/spectrum/spectrum.css">
	<link rel="stylesheet" type="text/css" href="../libs/jstree/themes/mixed/style.css">
	<link rel="stylesheet" type="text/css" href="../libs/Cesium/Widgets/CesiumWidget/CesiumWidget.css">
	<!-- Custom styles for this template -->
	<link rel="stylesheet" type="text/css" href="../css/style.css">
</head>

<body>
	<script src="../libs/jquery/jquery-3.1.1.min.js"></script>
	<script src="../libs/spectrum/spectrum.js"></script>
	<script src="../libs/jquery-ui/jquery-ui.min.js"></script>
	<script src="../libs/other/BinaryHeap.js"></script>
	<script src="../libs/tween/tween.min.js"></script>
	<script src="../libs/d3/d3.js"></script>
	<script src="../libs/proj4/proj4.js"></script>
	<script src="../libs/openlayers3/ol.js"></script>
	<script src="../libs/i18next/i18next.js"></script>
	<script src="../libs/jstree/jstree.js"></script>
	<script src="../libs/potree/potree.js"></script>
	<script src="../libs/plasio/js/laslaz.js"></script>
	<script src="../libs/Cesium/Cesium.js"></script>
	<!--Loading settings for Potree viewer-->
	<div class="potree_container" style="position: relative; height:100%; width: 100%;">
		<div class="dropdown-container">
			<label for="year">Year:</label>
			<select id="year"></select>
			<label for="month">Month:</label>
			<select id="month"></select>
			<label for="day">Day:</label>
			<select id="day"></select>
			<button id="loadImagesButton">Load Images</button>
		</div>
		<div id="potree_render_area">
			<div id="cesiumContainer" style="position: absolute; width: 100%; height: 100%; background-color:black">
			</div>
		</div>
		<div id="potree_sidebar_container" style="width: 50%; height: 100%;"> </div>
	</div>
	<!-- Import POINTCLOUD-->
	<script type="module" src="viewer.js"></script>
	<!-- Import main js-->
	<script type="module" src="main.js"></script>
	<!-- Import oriented cameras-->
	<!--<script type="module" src="orientedcameras.js"></script>-->
</body>
</html>