const bounds = L.latLngBounds(
  [-2.178676, 40.322869], // SouthWest
  [12.364903, 51.57271], // NorthEast
);

var map = L.map("map", {
  fullscreenControl: true,
  maxBounds: bounds,
  maxBoundsViscosity: 1.0,
  minZoom: 5,
}).fitBounds(bounds);

// // Add a control to display the number of landmarks on the map
// const info = L.control({
//   position: "topright",
// });

// info.onAdd = function () {
//   this._div = L.DomUtil.create("div", "info");
//   this.update();
//   return this._div;
// };

// info.update = function (count) {
//   this._div.innerHTML =
//     "<h4>Land Parcel Count</h4>" + "<b>Total Parcels:</b> " + (count ?? 0);
// };

// // info.addTo(map)

// TopPlusOpen Grey
var TopPlusOpen_Grey = L.tileLayer(
  "https://sgx.geodatenzentrum.de/wmts_topplus_open/tile/1.0.0/web_grau/default/WEBMERCATOR/{z}/{y}/{x}.png",
  {
    maxZoom: 18,
    attribution:
      'Map data: &copy; <a href="https://www.govdata.de/dl-de/by-2-0">dl-de/by-2-0</a>',
  },
);
TopPlusOpen_Grey.addTo(map);

// OpenStreetMap
var OSM = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
});

// Esri World Imagery
var Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 19,
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
  },
);
// Esri_WorldImagery.addTo(map);

// Esri_NatGeoWorldMap
var Esri_NatGeoWorldMap = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC",
    maxZoom: 16,
  },
);

// CartoDB Positron
var CartoDB_Positron = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 20,
  },
);

// OpenTopoMap
var OpenTopoMap = L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 17,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
);

// OpenAIP Basemap
var OpenAIP = L.tileLayer(
  "https://{s}.tile.maps.openaip.net/geowebcache/service/tms/1.0.0/openaip_basemap@EPSG%3A900913@png/{z}/{x}/{y}.{ext}",
  {
    attribution:
      '<a href="https://www.openaip.net/">openAIP Data</a> (CC BY-NC-SA)',
    ext: "png",
    minZoom: 4,
    maxZoom: 14,
    tms: true,
    detectRetina: true,
    subdomains: "12",
  },
);


// Conflict WMS Layer
const conflicts = L.tileLayer.wms(
  "http://localhost:8080/geoserver/risk_dashboard/wms",
  {
    layers: "risk_dashboard:manager_conflictevent",
    format: "image/png",
    transparent: true,
    version: "1.1.1",
  }
);
conflicts.addTo(map);


// SURPII Buildings WMS Layer
const surpiiBuildings = L.tileLayer.wms(
  "http://localhost:8080/geoserver/risk_dashboard/wms",
  {
    layers: "risk_dashboard:manager_surpii_building",
    format: "image/png",
    transparent: true,
    version: "1.1.1",
    attribution: "GeoServer",
  },
);

// SURPII Roads WMS Layer
map.createPane("roadsPane");
map.getPane("roadsPane").style.zIndex = 450;
map.getPane("roadsPane").style.pointerEvents = "none";

const surpiiRoads = L.tileLayer.wms(
  "http://localhost:8080/geoserver/risk_dashboard/wms",
  {
    layers: "risk_dashboard:manager_surpii_road",
    format: "image/png",
    transparent: true,
    version: "1.1.1",
  },
);

surpiiRoads.addTo(map);

// River WMS Layer
const rivers = L.tileLayer.wms(
  "http://localhost:8080/geoserver/risk_dashboard/wms",
  {
    layers: "risk_dashboard:manager_river",
    format: "image/png",
    transparent: true,
    version: "1.1.1",
    attribution: "GeoServer",
  },
);
rivers.addTo(map);


// IDP WMS Layer
const idps = L.tileLayer.wms(
  "http://localhost:8080/geoserver/risk_dashboard/wms",
  {
    layers: "risk_dashboard:manager_idp",
    format: "image/png",
    transparent: true,
    version: "1.1.1",
  },
);
idps.addTo(map);


// [Municipalities] Fetch municipalities polygon data
// Municipality styles
const municipalityStyle = {
  color: "#ff9900",
  weight: 2,
  opacity: 1,
  fillColor: "#ff9900",
  fillOpacity: 0.15,
};

const municipalityHighlightStyle = {
  color: "#04cefb",
  weight: 2,
  opacity: 0.1,
  fillColor: "#04cefb",
  fillOpacity: 0.1,
};

let highlightedMunicipalityLayer = null;

// Municipality layer
const municipalities = L.geoJSON(null, {
  style: municipalityStyle,

  onEachFeature(feature, layer) {
    layer.on({
      mouseover(e) {
        if (highlightedMunicipalityLayer) {
          municipalities.resetStyle(highlightedMunicipalityLayer);
        }

        highlightedMunicipalityLayer = e.target;
        highlightedMunicipalityLayer.setStyle(municipalityHighlightStyle);
      },

      mouseout() {
        if (highlightedMunicipalityLayer) {
          municipalities.resetStyle(highlightedMunicipalityLayer);
          highlightedMunicipalityLayer = null;
        }
      },
    });

    if (feature.properties) {
      const props = feature.properties;

      layer.bindPopup(`
            <strong>Municipality:</strong> ${props.name}<br>
            <strong>Urban Type:</strong> ${props.urban_type}<br>
            <strong>Region:</strong> ${props.admin1_name}
        `);
    }
  },
});

// Load municipalities
fetch("/api/municipalities/")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to load municipalities.");
    }
    return response.json();
  })
  .then((data) => {
    municipalities.addData(data);

    // Show municipalities by default
    municipalities.addTo(map);

    // Zoom to municipalities on first load
    // map.fitBounds(municipalities.getBounds());
  })
  .catch((error) => {
    console.error(error);
  });

  // Historical Flood Extent WMS Layer
const floods = L.tileLayer.wms(
  "http://localhost:8080/geoserver/risk_dashboard/wms",
  {
    layers: "risk_dashboard:manager_floodextent",
    format: "image/png",
    transparent: true,
    version: "1.1.1",
  }
);

// floods.addTo(map);

// [Admin Boundaries] Fetch admin boundaries polygon data
var adminBoundariesStyle = {
  color: "#000000",
  weight: 2,
  opacity: 0.8,
  fillColor: "#333333",
  fillOpacity: 0.1,
};

var adminHighlightStyle = {
  color: "#04cefb",
  weight: 2,
  opacity: 0.1,
  fillColor: "#04cefb",
  fillOpacity: 0.1,
};

let highlightedLayer = null;

var adminBoundaries = L.geoJSON(null, {
  style: adminBoundariesStyle,
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "";
      for (var k in feature.properties) {
        content +=
          "<strong>" + k + ":</strong> " + feature.properties[k] + "<br/>";
      }
      layer.bindPopup(content);
    }
  },
}).addTo(map);

fetch("api/administrative-boundaries/")
  .then((response) => response.json())
  .then((data) => {
    adminBoundaries.addData(data);
  });


// [District Boundaries] Fetch district boundaries polygon data
var districtBoundariesStyle = {
  color: "#971f1f",
  weight: 1,
  opacity: 0.8,
  fillColor: "#333333",
  fillOpacity: 0.1,
  dashArray: "5, 5",
};
var districtHighlightStyle = {
  color: "#04cefb",
  weight: 2,
  opacity: 0.1,
  fillColor: "#04cefb",
  fillOpacity: 0.1,
};  

let highlightedDistrictLayer = null;

var districtBoundaries = L.geoJSON(null, {
  style: districtBoundariesStyle,
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "";
      for (var k in feature.properties) {
        content +=
          "<strong>" + k + ":</strong> " + feature.properties[k] + "<br/>";
      }
      layer.bindPopup(content);
    }
  },
}).addTo(map);

fetch("api/districts/")
  .then((response) => response.json())
  .then((data) => {
    districtBoundaries.addData(data);
  });

// [LAND PARCELS] Fetch land parcels polygon data
var landParcelsStyle = {
  color: "#00FF00",
  weight: 2,
  opacity: 0.7,
  fillColor: "#00FF00",
  fillOpacity: 0.3,
};

var landParcels = L.geoJSON(null, {
  style: landParcelsStyle,
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "";
      // add type label for popup
      content += "<strong>Type:</strong> Land Parcel<br/>";
      for (var k in feature.properties) {
        content +=
          "<strong>" + k + ":</strong> " + feature.properties[k] + "<br/>";
      }
      layer.bindPopup(content);
      layer.on("click", function (e) {
        layer.openPopup();
      });
    }
  },
}).addTo(map);
fetch("api/landparcels/")
  .then((response) => response.json())
  .then((data) => {
    landParcels.addData(data);
    info.update(data.count);
  });

// [BUILDINGS] Fetch buildings polygon data
var buildingsStyle = {
  color: "#0000FF",
  weight: 2,
  opacity: 0.7,
  fillColor: "#0000FF",
  fillOpacity: 0.3,
};
var buildings = L.geoJSON(null, {
  style: buildingsStyle,
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "";
      // add type label for popup
      content += "<strong>Type:</strong> Building<br/>";
      for (var k in feature.properties) {
        content +=
          "<strong>" + k + ":</strong> " + feature.properties[k] + "<br/>";
      }
      layer.bindPopup(content);
      layer.on("click", function (e) {
        layer.openPopup();
      });
    }
  },
}).addTo(map);
fetch("api/buildings/")
  .then((response) => response.json())
  .then((data) => {
    buildings.addData(data);
  });

// [ROADS] Fetch roads line data
var roadsStyle = {
  color: "#FF0000",
  weight: 3,
  opacity: 0.8,
};

var roads = L.geoJSON(null, {
  style: roadsStyle,
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "";
      for (var k in feature.properties) {
        content +=
          "<strong>" + k + ":</strong> " + feature.properties[k] + "<br/>";
      }
      layer.bindPopup(content);
    }
  },
}).addTo(map);

fetch("api/roads/")
  .then((response) => response.json())
  .then((data) => {
    roads.addData(data);
  });

// [LANDMARKS] Fetch landmarks point data
// Point layer
var landmarksStyle = {
  color: "#000",
  radius: 8,
  fillColor: "#000",
  weight: 1,
  opacity: 1,
};
var landmarks = L.geoJSON(null, {
  pointToLayer: function (feature, latlng) {
    return L.circleMarker(latlng, landmarksStyle);
  },
  onEachFeature: function (feature, layer) {
    if (feature.properties) {
      var content = "";
      for (var k in feature.properties) {
        content +=
          "<strong>" + k + ":</strong> " + feature.properties[k] + "<br/>";
      }
      layer.bindPopup(content);
    }
  },
}).addTo(map);

fetch("api/landmarks/")
  .then((response) => response.json())
  .then((data) => {
    landmarks.addData(data);
    info.update(data.count);
  });

// Add layer control
var baseMaps = {
  "TopPlusOpen Grey": TopPlusOpen_Grey,
  "Esri World Imagery": Esri_WorldImagery,
  "Esri Nat Geo WorldMap": Esri_NatGeoWorldMap,
  OpenStreetMap: OSM,
  "CartoDB Positron": CartoDB_Positron,
  OpenTopoMap: OpenTopoMap,
};

var overlays = {
  Municipalities: municipalities,
  // "Land Parcels": landParcels,
  "Google Buildings": surpiiBuildings,
  "SURPII Roads": surpiiRoads,
  Rivers: rivers,
  "IDP Settlements": idps,
  Insurgency: conflicts,
  "Historical Flood Extent": floods,
  // Buildings: buildings,
  // Roads: roads,
  // Landmarks: landmarks,
  Regions: adminBoundaries,
  Districts: districtBoundaries,
};

var layerControl = L.control.layers(baseMaps, overlays).addTo(map);

var scale = L.control
  .scale((position = "bottomleft"), (metric = true), (imperial = false))
  .addTo(map);

// search control for landmarks
// var allLayers = L.featureGroup([roads, landmarks]).addTo(map)

// const searchControl = new L.Control.Search({
//   layer: allLayers,
//   propertyName: "name", // property to search for
//   marker: false, // do not add a marker on the map
//   moveToLocation: function (latlng, title, map) {
//     // zoom to the location of the found feature
//     map.setView(latlng, 15);
//   },
// });
// searchControl.on("search:locationfound", function (e) {
//   e.layer.openPopup();
// });
// map.addControl(searchControl);

// // locate user
// function onLocationFound(e) {
//   L.marker(e.latlng).addTo(map).bindPopup("You are here").openPopup();

//   L.circle(e.latlng, {
//     radius: e.accuracy,
//     color: "#136AEC",
//     fillColor: "#136AEC",
//     fillOpacity: 0.15,
//   }).addTo(map);

//   map.setView(e.latlng, 15);
// }

// function onLocationError(e) {
//   alert("Unable to get your location: " + e.message);
// }

// map.on("locationfound", onLocationFound);
// map.on("locationerror", onLocationError);

// map.locate({
//     setView: true,
//     maxZoom: 15,
//     enableHighAccuracy: true,
// });

// // Measurement Tool
// L.control.measure({
//     position: "topright",
//     primaryLengthUnit: "kilometers",
//     secondaryAreaUnit: "hectares",
// }).addTo(map);

// Add a legend control to the map
const legend = L.control({
  position: "topright",
});

legend.onAdd = function () {
  this._div = L.DomUtil.create("div", "info legend");
  updateLegend(this._div);
  return this._div;
};

function getLayerColor(layer) {
  // Case 1: GeoJSON layer with a style function
  if (layer.options && typeof layer.options.style === "function") {
    const style = layer.options.style();

    return style.fillColor || style.color || style.stroke || "#000";
  }

  // Case 2: GeoJSON/vector layer with direct style object
  if (layer.options && layer.options.style) {
    const style = layer.options.style;

    return style.fillColor || style.color || style.stroke || "#000";
  }

  // Case 3: Normal Leaflet vector layer
  if (layer.options) {
    return layer.options.fillColor || layer.options.color || "#000";
  }

  return "#000";
}


// Update the legend based on the currently visible layers
function updateLegend(div) {
  let html = "<h4>Legend</h4>";

  const legendStyles = {
    Municipalities: {
      type: "box",
      color: "#ff9900",
    },
    "SURPII Buildings": {
      type: "box",
      color: "#ff0000",
    },
    "SURPII Roads": {
      type: "line",
      color: "#b6b3b3",
    },
    "IDP Settlements": {
      type: "point",
      color: "#aee1af",
    },
    Insurgency: {
      type: "point",
      color: "#2334b7",
    },
    Rivers: {
      type: "line",
      color: "#2E86DE",
    },
    "Historical Flood Extent": {
      type: "box",
      color: "#6ec5ff",
    },
    Regions: {
      type: "line",
      color: "#555555",
    },
    Districts: {
      type: "line",
      color: "#971f1f",
    },
  };

  Object.keys(overlays).forEach(function (name) {
    const layer = overlays[name];

    if (map.hasLayer(layer)) {
      const style = legendStyles[name];

      if (!style) return;

      html += `
        <div class="legend-item">
          ${
            style.type === "box"
              ? `<span class="legend-color" style="background:${style.color};"></span>`
              : style.type === "line"
                ? `<span class="legend-line" style="border-top:3px solid ${style.color};"></span>`
                : `<span class="legend-point" style="background:${style.color};"></span>`
          }
          <span class="legend-name">${name}</span>
        </div>
      `;
    }
  });

  div.innerHTML = html;
}


map.on("overlayadd", function () {
  updateLegend(legend._div);
});

map.on("overlayremove", function () {
  updateLegend(legend._div);
});

legend.addTo(map);


// Add event listener for administrative boundary selection
document
  .getElementById("administrativeBoundaryList")
  .addEventListener("change", function (e) {
    const selectedBoundary = e.target.value;
    if (!map.hasLayer(adminBoundaries, districtBoundaries)) {
      map.addLayer(adminBoundaries, );
    }

    if (!map.hasLayer(districtBoundaries)) {
      map.addLayer(districtBoundaries);
    }

    if (highlightedLayer) {
      highlightedLayer.setStyle(adminBoundariesStyle);
      highlightedLayer.closePopup();
      highlightedLayer = null;
    }

    adminBoundaries.eachLayer(function (layer) {
      if (layer.feature.properties.name === selectedBoundary) {
        highlightedLayer = layer;
        layer.setStyle(adminHighlightStyle);
        map.fitBounds(layer.getBounds());
        layer.bringToFront();
        popup = layer.getPopup();
        if (popup) {
          popup.setContent(
            "<strong>Region:</strong> " +
              layer.feature.properties.name
          );
          layer.openPopup();
        }
      }
    });
  });


  // Add event listener for municipality boundary selection
document
  .getElementById("municipalityList")
  .addEventListener("change", function (e) {
    const selectedMunicipality = e.target.value;

    if (!map.hasLayer(municipalities)) {
      map.addLayer(municipalities);
    }

    if (highlightedMunicipalityLayer) {
      highlightedMunicipalityLayer.setStyle(municipalityStyle);
      highlightedMunicipalityLayer.closePopup();
      highlightedMunicipalityLayer = null;
    }

    municipalities.eachLayer(function (layer) {
      if (layer.feature.properties.name === selectedMunicipality) {
        highlightedMunicipalityLayer = layer;
        layer.setStyle(municipalityHighlightStyle);
        map.fitBounds(layer.getBounds());
        layer.bringToFront();
        popup = layer.getPopup();
        if (popup) {
          popup.setContent(
            "<strong>Municipality:</strong> " +
              layer.feature.properties.name +
              "<br><strong>Urban Type:</strong> " +
              layer.feature.properties.urban_type +
              "<br><strong>Region:</strong> " +
              layer.feature.properties.admin1_name
          );
          layer.openPopup();
        }
      }
    });
  });


// Add event listener for district boundary selection
document
  .getElementById("districtBoundaryList")
  .addEventListener("change", function (e) {
    const selectedDistrict = e.target.value;

    if (!map.hasLayer(districtBoundaries)) {
      map.addLayer(districtBoundaries);
    }

    if (highlightedDistrictLayer) {
      highlightedDistrictLayer.setStyle(districtBoundariesStyle);
      highlightedDistrictLayer.closePopup();
      highlightedDistrictLayer = null;
    }

    districtBoundaries.eachLayer(function (layer) {
      if (layer.feature.properties.name === selectedDistrict) {
        highlightedDistrictLayer = layer;
        layer.setStyle(districtHighlightStyle);
        map.fitBounds(layer.getBounds());
        layer.bringToFront();
        popup = layer.getPopup();
        if (popup) {
          popup.setContent(
            "<strong>District:</strong> " + layer.feature.properties.name
          );
          layer.openPopup();
        }
      }
    });
  });



map.on("click", function (e) {
  if (!map.hasLayer(idps)) return;

  const point = map.latLngToContainerPoint(e.latlng, map.getZoom());
  const size = map.getSize();
  const bounds = map.getBounds();

  const url =
    "http://localhost:8080/geoserver/risk_dashboard/wms?" +
    L.Util.getParamString({
      service: "WMS",
      version: "1.1.1",
      request: "GetFeatureInfo",
      layers: "risk_dashboard:manager_idp",
      query_layers: "risk_dashboard:manager_idp",
      bbox: bounds.toBBoxString(),
      width: size.x,
      height: size.y,
      srs: "EPSG:4326",
      info_format: "application/json",
      x: Math.round(point.x),
      y: Math.round(point.y),
    });

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (!data.features.length) return;

      const p = data.features[0].properties;

      L.popup()
        .setLatLng(e.latlng)
        .setContent(
          `
          <h4>IDP Settlement</h4>
          <b>Settlement:</b> ${p.settlementname}<br>
          <b>DTM ID:</b> ${p.settlementdtmid}<br>
          <b>Urban:</b> ${p.urbanname}<br>
          <b>Region:</b> ${p.admin1name}<br>
          <b>District:</b> ${p.admin2name}<br>
          <b>Households:</b> ${p.idphouseholds}<br>
          <b>Individuals:</b> ${p.idpindividuals}<br>
          <b>Category:</b> ${p.populationcategory}
        `,
        )
        .openOn(map);
    });
});

