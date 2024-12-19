/* Loading oriented images chunks */
/* First chunk of images */
/* Setting the paths for camera parameters and images list for left camera*/
const cameraParamsSX = "../assets/img_selected/camera_sx/24mm_sx.xml";
const imageParamsSX = "../assets/img_selected/camera_sx/orientedimages.txt";

Potree.OrientedImageLoader.load(cameraParamsSX, imageParamsSX, potreeViewer).then(images => {
    images.visible = true;
    potreeViewer.scene.addOrientedImages(images);
    images.name = 'camera_sx';
});

/* Second chunk of images */
/* Setting the paths for camera parameters and images list for right camera*/
const cameraParamsDX = "../assets/img_selected/camera_dx/35mm_dx.xml";
const imageParamsDX = "../assets/img_selected/camera_dx/orientedimages.txt";

Potree.OrientedImageLoader.load(cameraParamsDX, imageParamsDX, potreeViewer).then(images => {
    images.visible = true;
    potreeViewer.scene.addOrientedImages(images);
    images.name = 'camera_dx';
});