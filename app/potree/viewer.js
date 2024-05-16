import * as THREE from "./libs/three.js/build/three.module.js";

window.cesiumViewer = new Cesium.Viewer("cesiumContainer", {
  useDefaultRenderLoop: false,
  animation: false,
  baseLayerPicker: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  infoBox: false,
  sceneModePicker: false,
  selectionIndicator: false,
  timeline: false,
  navigationHelpButton: false,
  imageryProvider: Cesium.createOpenStreetMapImageryProvider({url: "https://a.tile.openstreetmap.org/",}),
});

cesiumViewer.terrainProvider = new Cesium.CesiumTerrainProvider({
  url: "https://api.maptiler.com/tiles/terrain-quantized-mesh/?key=2hTOFLPdXApzq9gVeMKq", // get your own key at https://cloud.maptiler.com/
});

let cp = new Cesium.Cartesian3(
  4303414.154026048,
  552161.235598733,
  4660771.704035539
);
cesiumViewer.camera.setView({
  destination: cp,
  orientation: {
    heading: 10,
    pitch: -Cesium.Math.PI_OVER_TWO * 0.5,
    roll: 0.0,
  },
});

window.potreeViewer = new Potree.Viewer(
  document.getElementById("potree_render_area"),
  {
    useDefaultRenderLoop: false,
  }
);
potreeViewer.setEDLEnabled(true);
potreeViewer.setFOV(60);
potreeViewer.setPointBudget(3_000_000);
potreeViewer.setMinNodeSize(50);
potreeViewer.loadSettingsFromURL();
potreeViewer.setBackground(null);
potreeViewer.useHQ = true;

potreeViewer.setDescription(`
		Explore the glacier pointclouds over time, load the Ground Control Points annotations and check out the velocity trends by clicking on the target of interest. Best performances on Google Chrome`);

potreeViewer.loadGUI(() => {
  potreeViewer.setLanguage("en");
  // $("#menu_appearance").next().show();
  // $("#menu_tools").next().show();
  // $("#menu_scene").next().show();
  let section = $(
    `<h3 id="menu_meta" class="accordion-header ui-widget"><span>Credits</span></h3><div class="accordion-content ui-widget pv-menu-list"></div>`
  );
  let content = section.last();
  content.html(`
    <div class="pv-menu-list">
        <li><b>Long-term photogrammetric monitoring of the Belvedere glacier</b></li>
        <li>This project aims at a thorough and accurate 4D monitoring of the Belvedere Glacier with photogrammetric approaches, exploiting different spatial (from centimetric to metric) and temporal resolution (from daily to 10-year periods) and with different platforms (UAVs, aerial photogrammetry, terrestrial time-lapse cameras)</li>
        <li>Since 2015, an extensive and continuous monitoring activity was carried out with UAVs-based photogrammetry and in-situ GNSS measurements (Ioli et al, 2022). Every year, fixed-wing UAVs and quadcopters were used to remotely sense the glacier and build high-resolution photogrammetric models in order to estimate annual variations of ice volume and ice flow velocities.</li>
        <li>Moreover, to reconstruct the long-term evolution of the glacier, from 1977 up to now, we used historical images acquired for regional mapping purposes. Historic analog images were digitalized and processed with a modern photogrammetric approach to derive the glacier 3D morphology in 1977, 1991 and 2001 (De Gaetani et al., 2021).</li>
        <li>All the point clouds are available as Open-Data on Zenodo from here <a href="https://zenodo.org/record/7842348" target="_blank">https://zenodo.org/record/7842348</a></li>
        <li>Ioli, F.; Bianchi, A.; Cina, A.; De Michele, C.; Maschio, P.; Passoni, D.; Pinto, L. <i>Mid-Term Monitoring of Glacier’s Variations with UAVs: The Example of the Belvedere Glacier.</i> Remote Sens. 2022, 14, 28. <a href="https://doi.org/10.3390/rs14010028" target="_blank">https://doi.org/10.3390/rs14010028</a></li>
        <li>De Gaetani, C.I.; Ioli, F.; Pinto, L. <i>Aerial and UAV Images for Photogrammetric Analysis of Belvedere Glacier Evolution in the Period 1977–2019.</i> Remote Sens. 2021, 13, 3787. <a href="https://doi.org/10.3390/rs13183787" target="_blank">https://doi.org/10.3390/rs13183787</a></li>
    </div>
    `);
  content.show();
  section.first().click(() => content.slideToggle());
  section.insertBefore($("#menu_appearance"));
});

function loadPointCloud(url, name, visible = false) {
  Potree.loadPointCloud(url, name, (e) => {
    let pointcloud = e.pointcloud;
    let material = pointcloud.material;
    let scene = potreeViewer.scene;
    material.size = 0.7;
    material.intensityRange = [1, 100];
    material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
    material.shape = Potree.PointShape.CIRCLE;
    material.activeAttributeName = "rgba"; // change this value to "classification" and uncomment the next 2 lines if you desire to show the classified point cloud
    pointcloud.visible = visible;
    scene.addPointCloud(pointcloud);
    let pointcloudProjection =
      "+proj=utm +zone=32 +datum=WGS84 +units=m +no_defs +type=crs";
    let mapProjection = proj4.defs("WGS84");
    window.toMap = proj4(pointcloudProjection, mapProjection);
    window.toScene = proj4(mapProjection, pointcloudProjection);
    {
      let bb = potreeViewer.getBoundingBox();

      let minWGS84 = proj4(
        pointcloudProjection,
        mapProjection,
        bb.min.toArray()
      );
      let maxWGS84 = proj4(
        pointcloudProjection,
        mapProjection,
        bb.max.toArray()
      );
    }
  });
}

// Define constants for point cloud URLs
const pointCloudURLs = [
  {
    url: "./assets/pointclouds/1977/metadata.json",
    name: "1977",
    visible: true,
  },
  { url: "./assets/pointclouds/1991/metadata.json", name: "1991" },
  { url: "./assets/pointclouds/2001/metadata.json", name: "2001" },
  { url: "./assets/pointclouds/2009/metadata.json", name: "2009" },
  { url: "./assets/pointclouds/2015/metadata.json", name: "2015" },
  { url: "./assets/pointclouds/2016/metadata.json", name: "2016" },
  { url: "./assets/pointclouds/2017/metadata.json", name: "2017" },
  { url: "./assets/pointclouds/2018/metadata.json", name: "2018" },
  { url: "./assets/pointclouds/2019/metadata.json", name: "2019" },
  { url: "./assets/pointclouds/2020/metadata.json", name: "2020" },
  { url: "./assets/pointclouds/2021/metadata.json", name: "2021" },
  { url: "./assets/pointclouds/2022/metadata.json", name: "2022" },
  { url: "./assets/pointclouds/2023/metadata.json", name: "2023" },
  {
    url: "./assets/pointclouds/2009_all/metadata.json",
    name: "Background",
    visible: true,
  },
];

// Load all point cloud data
pointCloudURLs.forEach(({ url, name, visible }) => {
  loadPointCloud(url, name, visible);
  potreeViewer.scene.view.setView(
    [418775.227, 5092016.318, 4084.847],
    [416658.847, 5090327.441, 2838.766]
  );
});

function loop(timestamp) {
  requestAnimationFrame(loop);

  potreeViewer.update(potreeViewer.clock.getDelta(), timestamp);

  potreeViewer.render();

  if (window.toMap !== undefined) {
    {
      let camera = potreeViewer.scene.getActiveCamera();

      let pPos = new THREE.Vector3(0, 0, 0).applyMatrix4(camera.matrixWorld);
      let pRight = new THREE.Vector3(600, 0, 0).applyMatrix4(
        camera.matrixWorld
      );
      let pUp = new THREE.Vector3(0, 600, 0).applyMatrix4(camera.matrixWorld);
      let pTarget = potreeViewer.scene.view.getPivot();

      let toCes = (pos) => {
        let xy = [pos.x, pos.y];
        let height = pos.z;
        let deg = toMap.forward(xy);
        let cPos = Cesium.Cartesian3.fromDegrees(...deg, height);

        return cPos;
      };

      let cPos = toCes(pPos);
      let cUpTarget = toCes(pUp);
      let cTarget = toCes(pTarget);

      let cDir = Cesium.Cartesian3.subtract(
        cTarget,
        cPos,
        new Cesium.Cartesian3()
      );
      let cUp = Cesium.Cartesian3.subtract(
        cUpTarget,
        cPos,
        new Cesium.Cartesian3()
      );

      cDir = Cesium.Cartesian3.normalize(cDir, new Cesium.Cartesian3());
      cUp = Cesium.Cartesian3.normalize(cUp, new Cesium.Cartesian3());

      cesiumViewer.camera.setView({
        destination: cPos,
        orientation: {
          direction: cDir,
          up: cUp,
        },
      });
    }

    let aspect = potreeViewer.scene.getActiveCamera().aspect;
    if (aspect < 1) {
      let fovy = Math.PI * (potreeViewer.scene.getActiveCamera().fov / 180);
      cesiumViewer.camera.frustum.fov = fovy;
    } else {
      let fovy = Math.PI * (potreeViewer.scene.getActiveCamera().fov / 180);
      let fovx = Math.atan(Math.tan(0.5 * fovy) * aspect) * 2;
      cesiumViewer.camera.frustum.fov = fovx;
    }
  }

  cesiumViewer.render();
}

requestAnimationFrame(loop);

//OLD
/*
// Define scene for the bridge
let scene = new Potree.Scene();
viewer.setScene(scene);

*/
