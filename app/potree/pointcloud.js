// Function to load point cloud data
function loadPointCloud(url, name, visible = false) {
    Potree.loadPointCloud(url, name, e => {
        let pointcloud = e.pointcloud;
        let material = pointcloud.material;
        material.size = 0.6;
        material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
        material.shape = Potree.PointShape.CIRCLE;
        material.activeAttributeName = "rgba"; // change this value to "classification" and uncomment the next 2 lines if you desire to show the classified point cloud
        pointcloud.visible = visible;
        scene.addPointCloud(pointcloud);
    });
}


// Define constants for point cloud URLs
const pointCloudURLs = [
    { url: "./assets/pointclouds/1977/metadata.json", name: "1977", visible: true },
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
];

// Load Potree viewer and define appearance settings
window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));
viewer.setEDLEnabled(true);
viewer.setFOV(60);
viewer.setPointBudget(2_000_000);
viewer.setDescription("");

viewer.loadGUI(() => {
    viewer.setLanguage('en');
    //viewer.toggleSidebar();
    $("#menu_appearance").next().show();
    $("#menu_tools").next().show();
    let section = $(`<h3 id="menu_meta" class="accordion-header ui-widget"><span>Credits</span></h3><div class="accordion-content ui-widget pv-menu-list"></div>`);
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
    content.hide();
    section.first().click(() => content.slideToggle());
    section.insertBefore($('#menu_appearance'));
});

// Define scene
let scene = new Potree.Scene();
viewer.setScene(scene);

// Load basemap pointcloud
loadPointCloud("./assets/pointclouds/2009_all/metadata.json", "Background", true);

// Load all point cloud data
pointCloudURLs.forEach(({ url, name, visible }) => {
    loadPointCloud(url, name, visible);
    viewer.scene.view.setView([418775.227, 5092016.318, 4084.847], [416658.847, 5090327.441, 2838.766]);
});
