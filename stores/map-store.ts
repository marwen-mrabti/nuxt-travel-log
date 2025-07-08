import { LngLatBounds } from "maplibre-gl";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

import type { T_LongLat, T_MapPoint } from "~/lib/types";

import { EDIT_PAGES, GREENWICH_Coords } from "~/lib/constants";

export const useMapStore = defineStore("map", () => {
  const colorMode = useColorMode();
  const route = useRoute();

  // 🔁 State
  const dataIsLoading = ref(false);
  const mapPoints = ref<T_MapPoint[]>([]);
  const selectedPoint = ref<T_MapPoint | null>(null);
  const hoveredPoint = ref<T_MapPoint | null>(null);
  const newLocationCoords = ref<T_LongLat>(GREENWICH_Coords);

  const mapInstance = ref<any>(null);
  const mapBounds = ref<LngLatBounds | null>(null);
  const setMapInstance = (map: any) => {
    if (!map)
      return;
    mapInstance.value = map;
  };

  const setNewLocationCoords = (newCoords: T_LongLat) => {
    newLocationCoords.value = newCoords;
  };

  // 🗺️ Map navigation logic
  effect(() => {
    if (!mapInstance.value)
      return;

    const routeName = route.name;

    if (routeName === "dashboard" && mapPoints.value?.length > 0) {
      if (hoveredPoint.value) {
        mapInstance.value.flyTo({
          center: [hoveredPoint.value.long, hoveredPoint.value.lat],
          speed: 0.5,
          zoom: 7,
          curve: 1.3,
          essential: true,
        });
      }
      else if (mapPoints.value.length > 1) {
        const firstPoint = mapPoints.value[0];
        if (!firstPoint) {
          mapInstance.value.flyTo({
            center: [GREENWICH_Coords.long, GREENWICH_Coords.lat],
            speed: 0.5,
            zoom: 7,
            curve: 1.3,
            essential: true,
          });
          return;
        }

        mapBounds.value = mapPoints.value.reduce((bounds, point) => {
          return bounds.extend([point.long, point.lat]);
        }, new LngLatBounds(
          [firstPoint.long, firstPoint.lat],
          [firstPoint.long, firstPoint.lat],
        ));
        mapInstance.value.fitBounds(mapBounds.value, {
          padding: 100,
          duration: 1000,
          maxZoom: 10,
          zoom: 2,
          curve: 1.3,
          essential: true,
        });
      }
    }
    else if (routeName === "dashboard-location-slug" && selectedPoint.value) {
      mapInstance.value.flyTo({
        center: [selectedPoint.value.long, selectedPoint.value.lat],
        speed: 0.8,
        zoom: 8,
        curve: 1.3,
        essential: true,
      });
    }
    else if (EDIT_PAGES.has(String(routeName))) {
      mapInstance.value.flyTo({
        center: [newLocationCoords.value.long, newLocationCoords.value.lat],
        speed: 0.8,
        zoom: 7,
        curve: 1.3,
        essential: true,
      });
    }
  });

  // 🖱️ Click to set new cords (for Add page)
  function handleOnDoubleClick(mglEvent: any) {
    const { lng: long, lat } = mglEvent.event.lngLat;
    setNewLocationCoords({ long, lat });
  }

  // 🎨 Map theme
  const mapStyle = computed(() =>
    colorMode.value === "dark"
      ? "/styles/dark.json"
      : "https://tiles.openfreemap.org/styles/liberty",
  );

  return {
    // State
    dataIsLoading,
    mapPoints,
    selectedPoint,
    hoveredPoint,
    newLocationCoords,
    mapStyle,
    // Actions
    setMapInstance,
    setNewLocationCoords,
    handleOnDoubleClick,
  };
});
