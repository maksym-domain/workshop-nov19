var fs = require("fs");
var polyline = require("@mapbox/polyline");

let result = {
  type: "FeatureCollection",
  features: []
};

fs.readFile("../data/syd-mel-route.json", "utf8", function(err, contents) {
  let routeJson = JSON.parse(contents);
  let points = polyline.decode(routeJson.routes[0].overview_polyline.points);
  points.map(point => {});

  result.features.push({
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: points.map(p => [p[1], p[0]])
    }
  });

  fs.writeFile(
    "../data/syd-mel-route.geojson",
    JSON.stringify(result, 2, 2),
    function(err) {
      if (err) return console.log(err);
      console.log("File saved");
    }
  );
});
