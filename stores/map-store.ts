import type { MglEvent } from "@indoorequal/vue-maplibre-gl";

import { LngLatBounds } from "maplibre-gl";
import { defineStore } from "pinia";
import { computed, ref, watchEffect } from "vue";

import type { T_SelectLocation } from "~/lib/db/schema";
import type { T_LocationInfo } from "~/server/api/locations.post";

export const useMapStore = defineStore("map", () => {
  const colorMode = useColorMode();
  const route = useRoute();

  // 🔁 State
  const activeLocations = ref<T_SelectLocation[]>([]);
  const activeLocation = ref<T_SelectLocation | undefined>();
  const hoveredLocation = ref<T_LocationInfo | null>(null);
  const newLocationCords = useState("map-newLocationCords", () => ({
    lng: -0.001545,
    lat: 51.477928,
  }));

  const mapInstance = ref<any>(null);
  const mapBounds = ref<LngLatBounds | null>(null);

  const setMapInstance = (map: any) => {
    mapInstance.value = map;
  };

  // 🔧 Actions
  const setLocations = (newLocations: T_SelectLocation[]) => {
    activeLocations.value = newLocations;
  };

  const setLocation = (newLocation: T_SelectLocation | undefined) => {
    activeLocation.value = newLocation;
  };

  const setHoveredLocation = (newHoveredLocation: T_LocationInfo | null) => {
    hoveredLocation.value = newHoveredLocation;
  };

  // 🗺️ Map navigation logic
  watchEffect(() => {
    if (!mapInstance)
      return;

    const routeName = route.name;

    if (routeName === "dashboard" && activeLocations.value.length > 0) {
      if (hoveredLocation.value) {
        mapInstance.value.flyTo({
          center: [hoveredLocation.value.long, hoveredLocation.value.lat],
          speed: 0.5,
          zoom: 7,
          curve: 1.3,
          essential: true,
        });
      }
      else if (activeLocations.value.length > 1) {
        const firstPoint = activeLocations.value[0];
        if (!firstPoint) {
          mapInstance.value.flyTo({
            center: [newLocationCords.value.lng, newLocationCords.value.lat],
            speed: 0.5,
            zoom: 7,
            curve: 1.3,
            essential: true,
          });
          return;
        }

        mapBounds.value = activeLocations.value.reduce((bounds, point) => {
          return bounds.extend([point.long, point.lat]);
        }, new LngLatBounds(
          [firstPoint.long, firstPoint.lat],
          [firstPoint.long, firstPoint.lat],
        ));
        mapInstance.value.fitBounds(mapBounds.value, {
          centre: [firstPoint.long, firstPoint.lat],
          padding: 60,
          duration: 1000,
          maxZoom: 10,
          zoom: 2,
          curve: 1.3,
          essential: true,
        });
      }
    }
    else if (routeName === "dashboard-location-slug" && activeLocation.value) {
      mapInstance.value.flyTo({
        center: [activeLocation.value.long, activeLocation.value.lat],
        speed: 0.8,
        zoom: 8,
        curve: 1.3,
        essential: true,
      });
    }
    else if (routeName === "dashboard-add") {
      mapInstance.value.flyTo({
        center: [newLocationCords.value.lng, newLocationCords.value.lat],
        speed: 0.8,
        zoom: 6,
        curve: 1.3,
        essential: true,
      });
    }
  });

  // 🖱️ Click to set new cords (for Add page)
  function handleOnDoubleClick(mglEvent: MglEvent<"dblclick">) {
    if (activeLocation.value || activeLocations.value.length)
      return;
    newLocationCords.value.lat = mglEvent.event.lngLat.lat;
    newLocationCords.value.lng = mglEvent.event.lngLat.lng;
  }

  // 🎨 Map theme
  const mapStyle = computed(() =>
    colorMode.value === "dark"
      ? "https://tiles.openfreemap.org/styles/dark"
      : "https://tiles.openfreemap.org/styles/liberty",
  );

  return {
    // State
    activeLocations,
    activeLocation,
    hoveredLocation,
    newLocationCords,
    mapStyle,
    // Actions
    setMapInstance,
    setLocations,
    setLocation,
    setHoveredLocation,
    handleOnDoubleClick,
  };
});
