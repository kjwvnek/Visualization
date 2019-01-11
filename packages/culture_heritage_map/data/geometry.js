import worldGeometryAfricaData from './worldGeometryAfrica.json'
import worldGeometryAsiaData from './worldGeometryAsia.json'
import worldGeometryEuropeData from './worldGeometryEurope.json'
import worldGeometryNorthAmericaData from './worldGeometryNorthAmerica.json'
import worldGeometryOceaniaData from './worldGeometryOceania.json'
import worldGeometrySouthAmerica from './worldGeometrySouthAmerica.json'

const geometryData = {
  type: 'FeatureCollection',
  features: [
    ...worldGeometryAfricaData.features,
    ...worldGeometryAsiaData.features,
    ...worldGeometryEuropeData.features,
    ...worldGeometryNorthAmericaData.features,
    ...worldGeometryOceaniaData.features,
    ...worldGeometrySouthAmerica.features
  ]
};

export default geometryData
