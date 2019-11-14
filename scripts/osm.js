const fetch = require("node-fetch");
var osmtogeojson = require("osmtogeojson");
var fs = require("fs");

const csv = require("csv-parser");

async function getPoints() {
  let promise = new Promise((resolve, reject) => {
    const points = [];
    fs.createReadStream("../data/route_buffered.csv")
      .pipe(csv(["1", "2", "3", "4"]))
      .on("data", row => {
        const parsedValue = /\((\d+\.\d+) (-?\d+\.\d+)/.exec(row["4"]);
        if (parsedValue) {
          points.push([parseFloat(parsedValue[1]), parseFloat(parsedValue[2])]);
        }
        resolve(points);
      })
      .on("end", () => {
        console.log("CSV file successfully processed");
      });
  });
  return promise;
}

function buildQuery(points) {
  str = "";
  points.forEach(p => (str += `${[p[1]]} ${[p[0]]} `));
  str = str.trim();

  return `
[out:json][timeout:25];
(
  node["tourism"="attraction"](poly:"${str}");
);
out body;
>;
out skel qt;`;
}

function runQuery(query) {
  return fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: query
  })
    .then(res => {
      console.log(res);
      return res.json();
    })
    .then(json => {
      const geoJson = osmtogeojson(json);
      fs.writeFile(
        "../data/osm_overpass.geojson",
        JSON.stringify(geoJson, 2, 2),
        function(err) {
          if (err) return console.log(err);
          console.log("File saved");
        }
      );
    });
}

async function run() {
  var points = await getPoints();
  console.log("here", points);
  const query = buildQuery(points);
  console.log(query);
  runQuery(query);
}
run();
return;
