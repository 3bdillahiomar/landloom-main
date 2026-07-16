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

// Add click popup for IDP WMS layer
function getFeatureInfoUrl(map, layer, latlng) {
  const point = map.latLngToContainerPoint(latlng, map.getZoom());
  const size = map.getSize();
  const bounds = map.getBounds();
  const sw = map.options.crs.project(bounds.getSouthWest());
  const ne = map.options.crs.project(bounds.getNorthEast());

  const params = {
    service: "WMS",
    request: "GetFeatureInfo",
    srs: "EPSG:3857",
    styles: "",
    transparent: true,
    version: "1.1.1",
    format: "image/png",
    bbox: `${sw.x},${sw.y},${ne.x},${ne.y}`,
    height: size.y,
    width: size.x,
    layers: layer.wmsParams.layers,
    query_layers: layer.wmsParams.layers,
    info_format: "application/json",
    feature_count: 1,
    x: Math.round(point.x),
    y: Math.round(point.y),
  };

  return `/api/geoserver-proxy/${L.Util.getParamString(params, "", true)}`;
}

map.on("click", function (e) {
  if (!map.hasLayer(idps)) {
    return;
  }

  fetch(getFeatureInfoUrl(map, idps, e.latlng))
    .then((response) => response.json())
    .then((data) => {
      const feature = data.features?.[0];

      if (!feature) {
        return;
      }

      const props = feature.properties || {};

      L.popup({ maxWidth: 320 })
        .setLatLng(e.latlng)
        .setContent(`
          <strong>Settlement:</strong> ${props.settlementName || "N/A"}<br>
          <strong>Settlement ID:</strong> ${props.settlementDTMId || "N/A"}<br>
          <strong>Urban Name:</strong> ${props.urbanName || "N/A"}<br>
          <strong>Region:</strong> ${props.admin1Name || "N/A"}<br>
          <strong>District:</strong> ${props.admin2Name || "N/A"}<br>
          <strong>Class:</strong> ${props.settlementClass || "N/A"}<br>
          <strong>IDP Individuals:</strong> ${props.idpIndividuals ?? "N/A"}<br>
          <strong>IDP Households:</strong> ${props.idpHouseholds ?? "N/A"}<br>
        `)
        .openOn(map);
    })
    .catch((error) => {
      console.error("IDP GetFeatureInfo error:", error);
    });
});



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

const conflictBufferLayer = L.geoJSON(null, {
  style: {
    color: "#ff7800",
    weight: 2,
    opacity: 1,
    fillColor: "#ff7800",
    fillOpacity: 0.2,
  },
}).addTo(map);

function getConflictFeatureInfoUrl(map, layer, latlng) {
  const point = map.latLngToContainerPoint(latlng, map.getZoom());
  const size = map.getSize();
  const bounds = map.getBounds();
  const sw = map.options.crs.project(bounds.getSouthWest());
  const ne = map.options.crs.project(bounds.getNorthEast());

  const params = {
    service: "WMS",
    request: "GetFeatureInfo",
    srs: "EPSG:3857",
    styles: "",
    transparent: true,
    version: "1.1.1",
    format: "image/png",
    bbox: `${sw.x},${sw.y},${ne.x},${ne.y}`,
    height: size.y,
    width: size.x,
    layers: layer.wmsParams.layers,
    query_layers: layer.wmsParams.layers,
    info_format: "application/json",
    feature_count: 1,
    x: Math.round(point.x),
    y: Math.round(point.y),
  };

  return `/api/geoserver-proxy/${L.Util.getParamString(params, "", true)}`;
}

map.on("click", function (e) {
  if (!map.hasLayer(conflicts)) {
    return;
  }

  fetch(getConflictFeatureInfoUrl(map, conflicts, e.latlng))
    .then((response) => response.json())
    .then((data) => {
      const feature = data.features?.[0];

      if (!feature) {
        conflictBufferLayer.clearLayers();
        return;
      }

      const props = feature.properties || {};
      const clickedPoint = turf.point([e.latlng.lng, e.latlng.lat]);
      const buffer = turf.buffer(clickedPoint, 0.5, { units: "kilometers" });

      conflictBufferLayer.clearLayers();
      conflictBufferLayer.addData(buffer);

      L.popup({ maxWidth: 320 })
        .setLatLng(e.latlng)
        .setContent(`
          <strong>Event:</strong> ${props.event_type || props.eventType || "N/A"}<br>
          <strong>Sub Event:</strong> ${props.sub_event_type || props.subEventType || "N/A"}<br>
          <strong>Location:</strong> ${props.location || "N/A"}<br>
          <strong>Region:</strong> ${props.admin1 || props.admin1Name || "N/A"}<br>
          <strong>District:</strong> ${props.admin2 || props.admin2Name || "N/A"}<br>
          <strong>Date:</strong> ${props.event_date || props.eventDate || "N/A"}<br>
          <strong>Fatalities:</strong> ${props.fatalities ?? "N/A"}<br>
          <strong>Actor 1:</strong> ${props.actor1 || "N/A"}<br>
          <strong>Actor 2:</strong> ${props.actor2 || "N/A"}
        `)
        .openOn(map);
    })
    .catch((error) => {
      console.error("Conflict GetFeatureInfo error:", error);
      conflictBufferLayer.clearLayers();
    });
});


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
// fetch("api/landparcels/")
//   .then((response) => response.json())
//   .then((data) => {
//     landParcels.addData(data);
//     info.update(data.count);
//   });

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

// fetch("api/landmarks/")
//   .then((response) => response.json())
//   .then((data) => {
//     landmarks.addData(data);
//     info.update(data.count);
//   });

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
  InsurgencyBuffer: conflictBufferLayer,
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


// Add event listener for idp settlement selection




