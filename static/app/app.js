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

map.createPane("baseMapPane");
map.getPane("baseMapPane").style.zIndex = 200;

map.createPane("droughtPane");
map.getPane("droughtPane").style.zIndex = 350;
map.getPane("droughtPane").style.pointerEvents = "none";

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

// // CartoDB Positron
// var CartoDB_Positron = L.tileLayer(
//   "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
//   {
//     attribution:
//       '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
//     subdomains: "abcd",
//     maxZoom: 20,
//   },
// );

// OpenTopoMap
var OpenTopoMap = L.tileLayer(
  "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 17,
    attribution:
      'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
  },
);

// // OpenAIP Basemap
// var OpenAIP = L.tileLayer(
//   "https://{s}.tile.maps.openaip.net/geowebcache/service/tms/1.0.0/openaip_basemap@EPSG%3A900913@png/{z}/{x}/{y}.{ext}",
//   {
//     attribution:
//       '<a href="https://www.openaip.net/">openAIP Data</a> (CC BY-NC-SA)',
//     ext: "png",
//     minZoom: 4,
//     maxZoom: 14,
//     tms: true,
//     detectRetina: true,
//     subdomains: "12",
//   },
// );


// Section: WMS Layers

// GeoServer endpoints for local and production environments
const isLocalDevelopment = ["localhost", "127.0.0.1"].includes(
  window.location.hostname
);

const geoserverRoot = isLocalDevelopment
  ? "http://localhost:8080/geoserver"
  : "/geoserver";

const geoserverUrl = `${geoserverRoot}/drought/wms`;

const riskDashboardWmsUrl =
  `${geoserverRoot}/risk_dashboard/wms`;


// Drought WMS Layer
const droughtLayers = {
    2015: L.tileLayer.wms(geoserverUrl, {
        layers: "drought:PDI_Yearly_Classified_2015_masked",
        format: "image/png",
        transparent: true,
        version: "1.1.1",
        opacity: 0.75, 
        pane: "droughtPane"
    }),

    2016: L.tileLayer.wms(geoserverUrl, {
        layers: "drought:PDI_Yearly_Classified_2016_masked",
        format: "image/png",
        transparent: true,
        version: "1.1.1",
        opacity: 0.75,
        pane: "droughtPane"
    }),

    2017: L.tileLayer.wms(geoserverUrl, {
        layers: "drought:PDI_Yearly_Classified_2017_masked",
        format: "image/png",
        transparent: true,
        version: "1.1.1",
        opacity: 0.75,
        pane: "droughtPane"
    }),

    2018: L.tileLayer.wms(geoserverUrl, {
        layers: "drought:PDI_Yearly_Classified_2018_masked",
        format: "image/png",
        transparent: true,
        version: "1.1.1",
        opacity: 0.75,
        pane: "droughtPane"
    }),

    2019: L.tileLayer.wms(geoserverUrl, {
        layers: "drought:PDI_Yearly_Classified_2019_masked",
        format: "image/png",
        transparent: true,
        version: "1.1.1",
        opacity: 0.75,
        pane: "droughtPane"
    }),

    2020: L.tileLayer.wms(geoserverUrl, {
        layers: "drought:PDI_Yearly_Classified_2020_masked",
        format: "image/png",
        transparent: true,
        version: "1.1.1",
        opacity: 0.75,
        pane: "droughtPane"
    }),

    2021: L.tileLayer.wms(geoserverUrl, {
        layers: "drought:PDI_Yearly_Classified_2021_masked",
        format: "image/png",
        transparent: true,
        version: "1.1.1",
        opacity: 0.75,
        pane: "droughtPane"
    }),

    2022: L.tileLayer.wms(geoserverUrl, {
        layers: "drought:PDI_Yearly_Classified_2022_masked",
        format: "image/png",
        transparent: true,
        version: "1.1.1",
        opacity: 0.75,
        pane: "droughtPane"
    }),

    2023: L.tileLayer.wms(geoserverUrl, {
        layers: "drought:PDI_Yearly_Classified_2023_masked",
        format: "image/png",
        transparent: true,
        version: "1.1.1",
        opacity: 0.75,
        pane: "droughtPane"
    }),

    2024: L.tileLayer.wms(geoserverUrl, {
        layers: "drought:PDI_Yearly_Classified_2024_masked",
        format: "image/png",
        transparent: true,
        version: "1.1.1",
        opacity: 0.75,
        pane: "droughtPane"
    }),

    2025: L.tileLayer.wms(geoserverUrl, {
        layers: "drought:PDI_Yearly_Classified_2025_masked",
        format: "image/png",
        transparent: true,
        version: "1.1.1",
        opacity: 0.75,
        pane: "droughtPane"
    })
};
let droughtLayer = droughtLayers[2015];
// droughtLayer.addTo(map);

// IDP WMS Layer
const idps = L.tileLayer.wms(
  riskDashboardWmsUrl,
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
  riskDashboardWmsUrl,
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
          <strong>Actor 1:</strong> ${props.actor1 || "N/A"}<br >
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
map.createPane("buildingsPane");
map.getPane("buildingsPane").style.zIndex = 500;
map.getPane("buildingsPane").style.pointerEvents = "none";

const surpiiBuildings = L.tileLayer.wms(
  riskDashboardWmsUrl,
  {
    layers: "risk_dashboard:manager_surpii_building",
    pane: "buildingsPane",
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
  riskDashboardWmsUrl,
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
  riskDashboardWmsUrl,
  {
    layers: "risk_dashboard:manager_river",
    format: "image/png",
    transparent: true,
    version: "1.1.1",
    attribution: "GeoServer",
  },
);
rivers.addTo(map);


// Section: Flood-exposure decision layers (municipality-filtered) -------------
// Buildings / roads / IDP sites that intersect the historical flood extent, for
// the municipality picked in the sidebar dropdown. Exposure is precomputed onto
// a flood_exposed flag (manage.py compute_exposure). Buildings can be tens of
// thousands of footprints, so they come from GeoServer as a filtered WMS layer;
// roads and IDP sites come from /api/exposure/ as GeoJSON.
// Basis: maximum observed flood extent (binary, no return period).
const EXPOSURE_DEFAULT_MUNICIPALITY = "Belet Weyne";

function exposureBuildingsFilter(municipalityName) {
  const safe = String(municipalityName).replace(/'/g, "''");
  return `flood_exposed = true AND UrbanName = '${safe}'`;
}

const floodedBuildings = L.tileLayer.wms(riskDashboardWmsUrl, {
  layers: "risk_dashboard:manager_surpii_building",
  cql_filter: exposureBuildingsFilter(EXPOSURE_DEFAULT_MUNICIPALITY),
  format: "image/png",
  transparent: true,
  version: "1.1.1",
  pane: "buildingsPane",
  attribution: "GeoServer",
});

// Flood-exposed roads mirror the OSM Roads SLD (#b6b3b3) so they read as the same
// family; flood-exposed IDP sites use a distinct orange (#e6b031) so they stand
// out against the green "IDP Settlements" base layer.
const floodedRoads = L.geoJSON(null, {
  style: {
    color: "#b6b3b3",
    weight: 1.2,
    opacity: 1,
    lineCap: "round",
    lineJoin: "round",
  },
  onEachFeature(feature, layer) {
    const props = feature.properties || {};
    layer.bindPopup(`
      <strong>Flood-exposed road</strong><br>
      Class: ${props.highway || "N/A"}<br>
      District: ${props.admin2Name || "N/A"}
    `);
  },
});

const floodedIdps = L.geoJSON(null, {
  pointToLayer(feature, latlng) {
    return L.circleMarker(latlng, {
      radius: 5,
      color: "#232323",
      weight: 1,
      fillColor: "#e6b031",
      fillOpacity: 1,
    });
  },
  onEachFeature(feature, layer) {
    const props = feature.properties || {};
    layer.bindPopup(`
      <strong>Flood-exposed IDP settlement</strong><br>
      Settlement: ${props.settlementName || "N/A"}<br>
      Individuals: ${props.idpIndividuals ?? "N/A"}<br>
      Households: ${props.idpHouseholds ?? "N/A"}
    `);
  },
});


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
  riskDashboardWmsUrl,
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
  // "CartoDB Positron": CartoDB_Positron,
  // OpenTopoMap: OpenTopoMap,
};

var overlays = {
  Municipalities: municipalities,
  // "Land Parcels": landParcels,
  "Google Buildings": surpiiBuildings,
  "OSM Roads": surpiiRoads,
  Rivers: rivers,
  "IDP Settlements": idps,
  Insurgency: conflicts,
  InsurgencyBuffer: conflictBufferLayer,
  "Historical Flood Extent": floods,
  "Annual Drought Severity": droughtLayer,
  "Flood-exposed Buildings": floodedBuildings,
  "Flood-exposed Roads": floodedRoads,
  "Flood-exposed IDP Sites": floodedIdps,
  // Buildings: buildings,
  // Roads: roads,
  // Landmarks: landmarks,
  Regions: adminBoundaries,
  Districts: districtBoundaries,
};

// Grouped view for the layer control: general map layers, then one group per
// municipality holding its flood-exposure layers. The flat `overlays` object
// above still drives the legend and the drought-year swap. The group name is
// retargeted at runtime by setExposureGroupLabel() when the city changes.
const EXPOSURE_GROUP_SUFFIX = " — hazard-exposed";
const EXPOSURE_GROUP = EXPOSURE_DEFAULT_MUNICIPALITY + EXPOSURE_GROUP_SUFFIX;

var groupedOverlays = {
  "Map layers": {
    Municipalities: municipalities,
    "Google Buildings": surpiiBuildings,
    "OSM Roads": surpiiRoads,
    Rivers: rivers,
    "IDP Settlements": idps,
    Insurgency: conflicts,
    InsurgencyBuffer: conflictBufferLayer,
    "Historical Flood Extent": floods,
    "Annual Drought Severity": droughtLayer,
    Regions: adminBoundaries,
    Districts: districtBoundaries,
  },
};
groupedOverlays[EXPOSURE_GROUP] = {
  "Flood-exposed Buildings": floodedBuildings,
  "Flood-exposed Roads": floodedRoads,
  "Flood-exposed IDP Sites": floodedIdps,
};

var layerControl = L.control.groupedLayers(baseMaps, groupedOverlays, {
  groupCheckboxes: true,
});

// Turn each group into a collapsible accordion card. leaflet-groupedlayercontrol
// has no such feature, so we style the groups (see home.html) and add the toggle
// here. Per-city hazard groups share one collapse key ("__hazard__") so the state
// survives the city rename; hazard groups start collapsed, the rest start open.
const groupCollapseState = {};

function groupCollapseKey(name) {
  return name.endsWith(EXPOSURE_GROUP_SUFFIX) ? "__hazard__" : name;
}

// Re-apply the stored collapsed/expanded state after each DOM rebuild.
function enhanceLayerGroups(control) {
  const container = control && control._container;
  if (!container) {
    return;
  }

  container
    .querySelectorAll(".leaflet-control-layers-group")
    .forEach(function (group) {
      const nameEl = group.querySelector(".leaflet-control-layers-group-name");
      if (!nameEl) {
        return;
      }
      const key = groupCollapseKey(nameEl.textContent.trim());
      if (groupCollapseState[key] === undefined) {
        groupCollapseState[key] = key === "__hazard__";
      }
      group.classList.toggle("lgc-collapsed", groupCollapseState[key]);
    });
}

(function () {
  const originalUpdate = layerControl._update;
  layerControl._update = function () {
    originalUpdate.call(this);
    enhanceLayerGroups(this);
  };
})();

layerControl.addTo(map);

// One delegated toggle handler on the control container (which survives the
// group DOM rebuilds); clicking a group name expands/collapses that group.
layerControl._container.addEventListener("click", function (event) {
  const nameEl =
    event.target.closest &&
    event.target.closest(".leaflet-control-layers-group-name");
  if (!nameEl || !layerControl._container.contains(nameEl)) {
    return;
  }
  // don't let the click toggle the group's select-all checkbox
  event.preventDefault();
  event.stopPropagation();

  const group = nameEl.closest(".leaflet-control-layers-group");
  const key = groupCollapseKey(nameEl.textContent.trim());
  groupCollapseState[key] = !group.classList.contains("lgc-collapsed");
  group.classList.toggle("lgc-collapsed", groupCollapseState[key]);
});

// Keep drought layer above the basemap
map.on("baselayerchange", function () {
    if (map.hasLayer(droughtLayer)) {
        droughtLayer.bringToFront();
    }
});

// Handle drought year selection change
document.getElementById("droughtYearList").addEventListener("change", function () {
    const year = this.value;

    // Was the drought layer currently displayed?
    const wasVisible = map.hasLayer(droughtLayer);

    // Remove the current layer
    if (wasVisible) {
        map.removeLayer(droughtLayer);
    }

    // Switch to the selected year
    droughtLayer = droughtLayers[year];

    // Add the new layer back if it was previously visible
    if (wasVisible) {
        droughtLayer.addTo(map);
    }
});

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
    "Google Buildings": {
      type: "box",
      color: "#ff0000",
    },
    "OSM Roads": {
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
    "Annual Drought Severity": {
      type: "raster",
      color: "raster",
    },
    "Flood-exposed Buildings": {
      type: "box",
      color: "#ff0000",
    },
    "Flood-exposed Roads": {
      type: "line",
      color: "#b6b3b3",
    },
    "Flood-exposed IDP Sites": {
      type: "point",
      color: "#e6b031",
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
  // console.log(Object.keys(overlays));
  // console.log(legendStyles);
  
  // Loop through the overlays and add legend items for visible layers
  Object.keys(overlays).forEach(function (name) {
    const layer = overlays[name];
    console.log(name, map.hasLayer(layer));

    if (map.hasLayer(layer)) {
      const style = legendStyles[name];
      console.log("Style:", name, style);
      if (!style) return;

if (style.type === "raster") {
  const selectedYear = document.getElementById("droughtYearList").value;

    html += `
        <div class="legend-item">
            <strong>Annual Drought Severity (${selectedYear})</strong>
        </div>


        <div class="legend-item">
            <span class="legend-color" style="background:#d2fbd2"></span>
            <span class="legend-name">No Drought</span>
        </div>

        <div class="legend-item">
            <span class="legend-color" style="background:#ffffbe"></span>
            <span class="legend-name">Mild Drought</span>
        </div>

        <div class="legend-item">
            <span class="legend-color" style="background:#e6987b"></span>
            <span class="legend-name">Moderate Drought</span>
        </div>

        <div class="legend-item">
            <span class="legend-color" style="background:#d03a27"></span>
            <span class="legend-name">Severe Drought</span>
        </div>

        <div class="legend-item">
            <span class="legend-color" style="background:#930905"></span>
            <span class="legend-name">Extreme Drought</span>
        </div>
    `;

} else {

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


// Add event listener for Drought Year selection
document
    .getElementById("droughtYearList")
    .addEventListener("change", function () {

        const year = this.value;

        const wasVisible = map.hasLayer(droughtLayer);

        if (wasVisible) {
            map.removeLayer(droughtLayer);
        }

        droughtLayer = droughtLayers[year];

        overlays["Annual Drought Severity"] = droughtLayer;

        if (wasVisible) {
            droughtLayer.addTo(map);
        }

        updateLegend(legend._div);

    });


// Section: Flood-exposure loader --------------------------------------------
// Refreshes the derived layers, the KPI card and the download links whenever
// the municipality selection changes. Default city: Beledweyne.

function setExposureDownloadLinks(municipalityName) {
  document.querySelectorAll("[data-exposure-download]").forEach(function (link) {
    const layer = link.getAttribute("data-exposure-download");
    const format = link.getAttribute("data-exposure-format") || "json";

    const params = new URLSearchParams({
      municipality: municipalityName,
      layer: layer,
      download: "1",
    });

    if (format === "csv") {
      params.set("format", "csv");
    }

    link.href = "/api/exposure/?" + params.toString();
  });
}

function renderExposureSummary(summary) {
  const box = document.getElementById("exposureSummary");
  if (!box || !summary) {
    return;
  }

  const asInt = function (value) {
    return Number(value || 0).toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });
  };

  const setKpi = function (key, value) {
    const el = box.querySelector('[data-kpi="' + key + '"]');
    if (el) {
      el.textContent = value;
    }
  };

  const roadsKm = (summary.flood_roads_length_m || 0) / 1000;

  // Use the server's canonical name (handles alias input like "Beledweyne").
  if (summary.municipality) {
    setExposureGroupLabel(summary.municipality);
  }

  setKpi("city", summary.municipality || "");
  setKpi("buildings", asInt(summary.flood_buildings_count));
  setKpi(
    "roads",
    roadsKm.toLocaleString(undefined, { maximumFractionDigits: 1 })
  );
  setKpi("idps", asInt(summary.flood_idp_individuals));
  setKpi("conflict", asInt(summary.conflict_events_recent));

  const note = box.querySelector('[data-kpi="note"]');
  if (note) {
    note.textContent = summary.stale
      ? "Summary not yet computed — run: python manage.py compute_exposure"
      : "Basis: " + (summary.basis || "historical flood extent") + ".";
  }
}

function loadExposureGeoJson(municipalityName, layerKey, leafletLayer) {
  return fetch(
    "/api/exposure/?municipality=" +
      encodeURIComponent(municipalityName) +
      "&layer=" +
      layerKey
  )
    .then(function (response) {
      return response.ok ? response.json() : null;
    })
    .then(function (data) {
      leafletLayer.clearLayers();
      if (data && data.features && data.features.length) {
        leafletLayer.addData(data);
      }
    })
    .catch(function (error) {
      console.error("Exposure layer " + layerKey + " failed:", error);
      leafletLayer.clearLayers();
    });
}

// Rename the layer-control group so it always reads "<selected city> — hazard-exposed".
// leaflet-groupedlayercontrol has no public rename API: each entry in _layers carries
// its own `group` object, so we retarget the three flood-exposure entries and re-render.
// _update() rebuilds from map state, so checkbox and collapsed/expanded state survive.
function setExposureGroupLabel(municipalityName) {
  if (
    !layerControl ||
    !Array.isArray(layerControl._layers) ||
    typeof layerControl._update !== "function"
  ) {
    return;
  }

  const label = municipalityName + EXPOSURE_GROUP_SUFFIX;
  const exposureLayers = [floodedBuildings, floodedRoads, floodedIdps];
  let changed = false;

  layerControl._layers.forEach(function (entry) {
    if (
      entry &&
      entry.group &&
      exposureLayers.indexOf(entry.layer) !== -1 &&
      entry.group.name !== label
    ) {
      entry.group.name = label;
      changed = true;
    }
  });

  if (changed) {
    layerControl._update();
  }
}

function loadExposure(municipalityName) {
  const name = municipalityName || EXPOSURE_DEFAULT_MUNICIPALITY;

  setExposureGroupLabel(name);

  // Buildings: repoint the GeoServer WMS filter at the selected city.
  floodedBuildings.setParams({ cql_filter: exposureBuildingsFilter(name) });

  // Roads and IDP sites: small enough to serve as GeoJSON.
  loadExposureGeoJson(name, "roads", floodedRoads);
  loadExposureGeoJson(name, "idps", floodedIdps);

  setExposureDownloadLinks(name);

  fetch("/api/exposure/summary/?municipality=" + encodeURIComponent(name))
    .then(function (response) {
      return response.json();
    })
    .then(renderExposureSummary)
    .catch(function (error) {
      console.error("Exposure summary failed:", error);
    });

  if (legend && legend._div) {
    updateLegend(legend._div);
  }
}

// Flood-exposure layers start OFF - the user enables them from the layer control.
// loadExposure still runs on first load so the KPI card, the download links and the
// (buffered) roads / IDP data are ready the moment a layer is switched on.
loadExposure(EXPOSURE_DEFAULT_MUNICIPALITY);

// Refresh flood-exposure when the municipality selection changes (this is a
// second listener on #municipalityList; the existing one handles highlight/zoom).
document
  .getElementById("municipalityList")
  .addEventListener("change", function (e) {
    loadExposure(e.target.value || EXPOSURE_DEFAULT_MUNICIPALITY);
  });


// Section: Accordion filter panel ---------------------------------------------
// Progressive enhancement over the four native <select> filters. The selects
// stay in the DOM as the single source of truth (IDs, option values and the
// existing change-listeners untouched); this builds a compact accordion UI over
// them and drives them by dispatching a bubbling "change" event.
(function () {
  const sectionsHost = document.getElementById("fpSections");
  const chipsHost = document.getElementById("fpChips");
  const searchInput = document.getElementById("fpSearch");
  if (!sectionsHost || !chipsHost) {
    return;
  }

  const FILTERS = [
    { id: "municipalityList", label: "Municipality", searchable: true, open: true },
    { id: "districtBoundaryList", label: "District", searchable: true, open: false, collapsible: true },
    { id: "administrativeBoundaryList", label: "Region", searchable: true, open: false, collapsible: true },
    { id: "droughtYearList", label: "Drought Year", searchable: false, open: false },
  ];

  // Long option lists (District ~90, Region ~18) show only the first few, with a
  // "Show N more" toggle.
  const FP_LIMIT = 5;

  const controls = [];

  function realOptions(select) {
    return Array.prototype.filter.call(select.options, function (o) {
      return o.value !== "";
    });
  }

  function fireChange(select) {
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function setSectionOpen(ctl, open) {
    ctl.header.setAttribute("aria-expanded", open ? "true" : "false");
    ctl.body.hidden = !open;
  }

  function syncControl(ctl) {
    ctl.options.forEach(function (o) {
      o.input.checked = ctl.select.value === o.input.value;
    });
  }

  // Decide each option row's visibility from the current search query and, for
  // collapsible sections, the "Show more" state.
  function refreshRows(ctl) {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const limited = ctl.cfg.collapsible && !ctl.moreExpanded && !query;
    let shown = 0;
    let hiddenByLimit = 0;

    ctl.options.forEach(function (o) {
      let visible = !query || o.label.indexOf(query) !== -1;
      if (visible && limited && shown >= FP_LIMIT) {
        visible = false;
        hiddenByLimit += 1;
      }
      if (visible) {
        shown += 1;
      }
      o.row.classList.toggle("fp-hidden", !visible);
    });

    if (ctl.moreBtn) {
      const showBtn =
        ctl.cfg.collapsible && !query && (hiddenByLimit > 0 || ctl.moreExpanded);
      ctl.moreBtn.hidden = !showBtn;
      ctl.moreBtn.textContent = ctl.moreExpanded
        ? "Show fewer"
        : "Show " + hiddenByLimit + " more";
    }
  }

  function renderChips() {
    chipsHost.innerHTML = "";
    controls.forEach(function (ctl) {
      const value = ctl.select.value;
      if (!value) {
        return;
      }
      const selectedOption = Array.prototype.find.call(
        ctl.select.options,
        function (o) {
          return o.value === value;
        }
      );
      const text = selectedOption ? selectedOption.textContent.trim() : value;

      const chip = document.createElement("span");
      chip.className = "fp-chip";

      const labelSpan = document.createElement("span");
      labelSpan.className = "fp-chip-label";
      labelSpan.textContent = text;

      const clearBtn = document.createElement("button");
      clearBtn.type = "button";
      clearBtn.className = "fp-chip-x";
      clearBtn.setAttribute(
        "aria-label",
        "Clear " + ctl.cfg.label + " filter (" + text + ")"
      );
      clearBtn.textContent = "×";
      clearBtn.addEventListener("click", function () {
        ctl.select.value = "";
        syncControl(ctl);
        fireChange(ctl.select);
        renderChips();
      });

      chip.appendChild(labelSpan);
      chip.appendChild(clearBtn);
      chipsHost.appendChild(chip);
    });
  }

  FILTERS.forEach(function (cfg) {
    const select = document.getElementById(cfg.id);
    if (!select) {
      return;
    }

    select.classList.add("fp-native");
    select.setAttribute("aria-hidden", "true");
    select.setAttribute("tabindex", "-1");

    const opts = realOptions(select);
    const bodyId = "fp-body-" + cfg.id;
    const headerId = "fp-header-" + cfg.id;

    const section = document.createElement("div");
    section.className = "fp-section";

    const header = document.createElement("button");
    header.type = "button";
    header.className = "fp-header";
    header.id = headerId;
    header.setAttribute("aria-controls", bodyId);
    header.setAttribute("aria-expanded", cfg.open ? "true" : "false");
    header.innerHTML =
      '<span class="fp-title">' +
      cfg.label +
      ' <span class="fp-count">(' +
      opts.length +
      ")</span></span>" +
      '<span class="fp-icon" aria-hidden="true"></span>';

    const body = document.createElement("div");
    body.className = "fp-body";
    body.id = bodyId;
    body.setAttribute("role", "group");
    body.setAttribute("aria-labelledby", headerId);
    body.hidden = !cfg.open;

    const ctl = {
      cfg: cfg,
      select: select,
      header: header,
      body: body,
      options: [],
      preSearchOpen: cfg.open,
    };

    ctl.options = opts.map(function (opt) {
      const row = document.createElement("label");
      row.className = "fp-option";

      const input = document.createElement("input");
      input.type = "radio";
      input.name = "fp-" + cfg.id;
      input.value = opt.value;
      input.checked = select.value === opt.value;

      const box = document.createElement("span");
      box.className = "fp-box";

      const text = document.createElement("span");
      text.className = "fp-option-label";
      text.textContent = opt.textContent.trim();

      row.appendChild(input);
      row.appendChild(box);
      row.appendChild(text);
      body.appendChild(row);

      input.addEventListener("change", function () {
        if (input.checked && select.value !== input.value) {
          select.value = input.value;
          fireChange(select);
        }
      });

      return { label: text.textContent.toLowerCase(), input: input, row: row };
    });

    if (cfg.collapsible) {
      const moreBtn = document.createElement("button");
      moreBtn.type = "button";
      moreBtn.className = "fp-more";
      moreBtn.hidden = true;
      moreBtn.addEventListener("click", function () {
        ctl.moreExpanded = !ctl.moreExpanded;
        refreshRows(ctl);
      });
      body.appendChild(moreBtn);
      ctl.moreBtn = moreBtn;
      ctl.moreExpanded = false;
    }

    header.addEventListener("click", function () {
      const open = header.getAttribute("aria-expanded") !== "true";
      setSectionOpen(ctl, open);
      if (!searchInput || !searchInput.value.trim()) {
        ctl.preSearchOpen = open;
      }
    });

    section.appendChild(header);
    section.appendChild(body);
    sectionsHost.appendChild(section);

    select.addEventListener("change", function () {
      syncControl(ctl);
      // If the current selection sits past the collapsed limit, expand so it shows.
      if (ctl.cfg.collapsible && !ctl.moreExpanded) {
        const idx = ctl.options.findIndex(function (o) {
          return o.input.checked;
        });
        if (idx >= FP_LIMIT) {
          ctl.moreExpanded = true;
        }
      }
      refreshRows(ctl);
      renderChips();
    });

    refreshRows(ctl);
    controls.push(ctl);
  });

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      const query = searchInput.value.trim().toLowerCase();

      controls.forEach(function (ctl) {
        if (!ctl.cfg.searchable) {
          return;
        }

        refreshRows(ctl);
        const anyMatch = ctl.options.some(function (o) {
          return !o.row.classList.contains("fp-hidden");
        });

        setSectionOpen(ctl, query ? anyMatch : ctl.preSearchOpen);
      });
    });
  }

  renderChips();
})();




