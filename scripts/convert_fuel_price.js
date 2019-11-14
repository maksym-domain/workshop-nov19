var fs = require("fs");
var polyline = require("@mapbox/polyline");

let result = {
  type: "FeatureCollection",
  features: []
};

fs.readFile("../data/fuel_price.json", "ascii", function(err, contents) {
  let data = JSON.parse(contents);

  console.log(data.stations.length);
  result.features = data.stations.map(x => ({
    type: "Feature",
    properties: {
      code: x.code,
      brand: x.brand,
      name: x.name,
      address: x.address,
    },
    geometry: {
      type: "Point",
      coordinates: [x.location.longitude, x.location.latitude]
    }
  }));

  const hash = result.features.reduce((result, obj) => {
    result[obj.properties.code] = obj;
    return result;
  }, {});

  data.prices.map(x => {
    console.log(hash[x.stationcode]);
    hash[x.stationcode].properties[x.fueltype] = x.price;
    console.log(x.stationcode, x.fueltype, x.price);
  });

  fs.writeFile(
    "../data/fuel_price_converted.geojson",
    JSON.stringify({ fuel_price: result }, 2, 2),
    function(err) {
      if (err) return console.log(err);
      console.log("File saved");
    }
  );
});
