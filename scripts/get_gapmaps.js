const fetch = require("node-fetch");
const fs = require("fs");

const query = {
  south: -37.8306367,
  north: -33.8686336,
  east: 151.2172237,
  west: 144.8906258,
  zoom: 15,
  limit: 500,
  displayPoiTypeIds: ["b5b7ff94-6761-4bf9-8010-fc38b261fd9e"],
  gapMapsCategoryIds: [95]
};

fetch("https://cre-poi-api.domain.com.au/api/v1/publicpoi/poi-geojson", {
  method: "post",
  body: JSON.stringify(query),
  headers: { "Content-Type": "application/json" }
})
  .then(res => res.json())
  .then(json => {
    console.log(json);

    fs.writeFile("../data/McDonlads.geojson", JSON.stringify(json, 2, 2), function(
      err
    ) {
      if (err) return console.log(err);
      console.log("File saved");
    });
  });
