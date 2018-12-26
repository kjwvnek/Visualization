import DimensionalWorldMap from './src/worldMap'
import worldGeometryAfricaData from './data/worldGeometryAfrica.json'
import worldGeometryAsiaData from './data/worldGeometryAsia.json'
import worldGeometryEuropeData from './data/worldGeometryEurope.json'
import worldGeometryNorthAmericaData from './data/worldGeometryNorthAmerica.json'
import worldGeometryOceaniaData from './data/worldGeometryOceania.json'
import worldGeometrySouthAmerica from './data/worldGeometrySouthAmerica.json'
import './index.scss'

const geometryData = [
  ...worldGeometryAfricaData.features,
  ...worldGeometryAsiaData.features,
  ...worldGeometryEuropeData.features,
  ...worldGeometryNorthAmericaData.features,
  ...worldGeometryOceaniaData.features,
  ...worldGeometrySouthAmerica.features
];

const worldMap = new DimensionalWorldMap({
  holderId: 'map-holder-svg',
  geometryData,
  width: 960,
  height: 500,
  rotateX: 0,
  rotateY: -25,
  rotateZ: 0,
  classNames: {
    segment: '__map-segment',
    graticule: '__map-graticule'
  }
});

worldMap.render3D();
//worldMap.rotate3D([0, -25, 0], -1, [.1, 0, 0]);