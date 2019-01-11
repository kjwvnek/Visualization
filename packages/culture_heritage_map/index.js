import geometryData from './data/geometry'
import heritageData from './data/heritage'
import HomeView from './modules/HomeView'
import WorldMapView from './modules/WorldMapView'
import './index.scss'

var rootEl = document.getElementById('root');

var homeView = new HomeView();
var worldMapView = new WorldMapView({
  geometry: geometryData,
  width: window.innerWidth,
  height: window.innerHeight,
  rotation: {
    x: 0,
    y: -25,
    z: 0
  },
  classNames: {
    background: '__map-background',
    segment: '__map-segment',
    grid: '__map-grid',
    marker: '__map-marker',
    segment_group: '__map-segment-group',
    grid_group: '__map-grid-group',
    marker_group: '__map-marker-group'
  }
});

// render
homeView.render(rootEl);
worldMapView.renderSVG(homeView.mapHolderEl, { marker: heritageData }, '3D');
var rotationTimer = worldMapView.animate([0, -25, 0], [20, -25, 0], worldMapView.rotate, 3200, true);

// bind events
homeView.btnDetailMapEl.addEventListener('click', function() {
  homeView.btnDetailMapEl.disabled = true;
  rotationTimer.stop();

  worldMapView
    .transformToPlaneMap()
    .then(function() {
      
    })
});
