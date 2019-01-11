import heritageData from './worldHeritage'

console.log(heritageData)

var data = heritageData.map(function(heritage) {
  return {
    name: heritage.fields.name_en,
    country: heritage.fields.country_en,
    description: heritage.fields.short_description_en,
    coordinate: [
      heritage.fields.longitude,
      heritage.fields.latitude
    ]
  };
});

export default data
