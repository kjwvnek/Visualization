import WorldMap from './src/world_map'
import worldGeometryAfricaData from './data/world_geometry_africa.json'
import worldGeometryAsiaData from './data/world_geometry_asia.json'
import worldGeometryEuropeData from './data/world_geometry_europe.json'
import worldGeometryNorthAmericaData from './data/world_geometry_north_america.json'
import worldGeometrySouthAmericaData from './data/world_geometry_south_america.json'
import worldGeometryOceanicaData from './data/world_geometry_oceania.json'
import './index.scss'


const worldGeometryData = [
  ...worldGeometryAfricaData.features,
  ...worldGeometryAsiaData.features,
  ...worldGeometryEuropeData.features,
  ...worldGeometryNorthAmericaData.features,
  ...worldGeometrySouthAmericaData.features,
  ...worldGeometryOceanicaData.features
];

console.log('=== Geometry Data ===')
console.log(worldGeometryData);

const worldMap = new WorldMap();

worldMap.render(
  document.getElementById('map-holder'), 
  'map-holder',
  worldGeometryData
);
