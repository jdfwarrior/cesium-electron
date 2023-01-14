<script setup lang="ts">
import { useCesium } from "@/composition/useCesium";
import TheToolbar from "@/components/TheToolbar.vue";
const cesium = useCesium();

function loadSampleData() {
  const start = new Date("2023-01-01").toISOString();
  const end = new Date("2023-01-10").toISOString();

  const doc = {
    id: "document",
    version: "1.0",
    clock: {
      interval: `${start}/${end}`,
      currentTime: start,
      multiplier: 10,
      range: "LOOP_STOP",
    },
  };

  const billboard = {
    id: "entity1",
    name: "Sample Entity Billboard",
    description: `This is a sample entity with a billboard on it located near Huntsville, AL.`,
    position: {
      cartographicDegrees: [-86, 34, 100],
    },
    billboard: {
      scale: { number: 1 },
      image: {
        uri: "/favicon.ico",
      },
    },
  };

  const ellipse = {
    id: "entity2",
    name: "Green circle at height",
    description: "I'm an ellipse that was copied from the Cesium Sandcastle",
    position: {
      cartographicDegrees: [-111.0, 40.0, 150000.0],
    },
    ellipse: {
      semiMinorAxis: 100000.0,
      semiMajorAxis: 100000.0,
      height: 200000.0,
      material: {
        solidColor: {
          color: {
            rgba: [0, 255, 0, 150],
          },
        },
      },
    },
  };

  const cylinder = {
    id: "entity3",
    name: "Red cone",
    position: {
      cartographicDegrees: [-105.0, 40.0, 200000.0],
    },
    cylinder: {
      length: 400000.0,
      topRadius: 0.0,
      bottomRadius: 200000.0,
      material: {
        solidColor: {
          color: {
            rgba: [255, 0, 0, 150],
          },
        },
      },
    },
  };

  const path = {
    id: "entity4",
    name: "Path with GPS flight data",
    description:
      "This is just a sample entity and doesn't contain actual GPS data. The path is created with 3 points with associated time values that Cesium is interpolating the rest of the positions. This entity should also show dynamic position values in the info panel if the clock is ticking.",
    availability: `${start}/${end}`,
    path: {
      material: {
        polylineOutline: {
          color: { rgba: [255, 0, 255, 255] },
          outlineColor: { rgba: [0, 255, 255, 255] },
          outlineWidth: 5,
        },
      },
      width: 5,
      trailTime: 1000,
      resolution: 5,
    },
    billboard: {
      image: {
        uri: "/favicon.ico",
      },
      scale: { number: 1.5 },
    },
    position: {
      cartographicDegrees: [
        0, -113, 32, 100, 100000, -97, 33, 100, 200000, -82, 40, 100,
      ],
      epoch: start,
    },
  };

  const ellipsoid = {
    id: "entity5",
    name: "ellipsoid with yellow outline",
    position: {
      cartographicDegrees: [-101.0, 26.0, 300000.0],
    },
    ellipsoid: {
      radii: {
        cartesian: [200000.0, 200000.0, 200000.0],
      },
      fill: false,
      outline: true,
      outlineColor: {
        rgba: [255, 255, 0, 255],
      },
      slicePartitions: 24,
      stackPartitions: 36,
    },
  };

  cesium.process([doc, billboard, ellipse, cylinder, path, ellipsoid]);
}

const menuItems = [
  { id: "samples", text: "Load Sample Date", click: loadSampleData },
];
</script>

<template>
  <the-toolbar top left>
    <button @click="cesium.home" title="Go to home location">
      <fa-icon icon="home" />
    </button>
    <button v-context="{ event: 'click', items: menuItems }">
      <fa-icon icon="chevron-down" />
    </button>
  </the-toolbar>
</template>
