import type { MglEvent } from "@indoorequal/vue-maplibre-gl";

import { useMap } from "@indoorequal/vue-maplibre-gl";
import { LngLatBounds } from "maplibre-gl";
import { defineStore } from "pinia";
import { computed, ref, watchEffect } from "vue";

import type { T_SelectLocation } from "~/lib/db/schema";
import type { T_LocationInfo } from "~/server/api/locations.post";

export const useMapStore = defineStore("map", () => {
  // 🗺️ Reactive state
  const newLocationCords = useState("map-newLocationCords", () => ({
    lng: -0.001545,
    lat: 51.477928,
  }));

  const colorMode = useColorMode();
  const route = useRoute();
  const map = useMap();
  // 🔁 Controlled state
  const activeLocations = ref<T_SelectLocation[]>([]);
  const activeLocation = ref<T_LocationInfo | undefined>();
  const hoveredLocation = ref<T_LocationInfo | undefined>();

  // 🌍 Data
  const { data: infiniteData } = useInfiniteLocations();
  const locations = computed(() =>
    infiniteData.value?.pages.flatMap(page => page.data) || [],
  );
  const slug = computed(() => route.params.slug as string | undefined);
  const { data: location } = useLocation(slug);

  watchEffect(() => {
    if (map.map && !route.params.slug) {
      map.map.setZoom(4);
    }
  });

  watchEffect(() => {
    if (!map.map)
      return;

    const routeName = route.name;

    // Reset state
    activeLocations.value = [];
    activeLocation.value = undefined;

    if (routeName === "dashboard") {
      activeLocations.value = locations.value;
      if (hoveredLocation.value) {
        map.map.flyTo({
          center: [hoveredLocation.value.long, hoveredLocation.value.lat],
          zoom: 6,
          speed: 0.5,
          curve: 1.3,
          essential: true,
        });
      }
      else if (activeLocations.value.length > 1) {
        const bounds = new LngLatBounds();
        activeLocations.value.forEach((loc) => {
          bounds.extend([loc.long, loc.lat]);
        });

        map.map.fitBounds(bounds, {
          padding: 80,
          duration: 1000,
          maxZoom: 10,
        });
      }
      else if (activeLocations.value[0]) {
        const loc = activeLocations.value[0];
        map.map.flyTo({
          center: [loc.long, loc.lat],
          zoom: 4,
          speed: 0.6,
          curve: 1.3,
          essential: true,
        });
      }
    }
    else if (routeName === "dashboard-location-slug" && location.value) {
      activeLocation.value = location.value;
      map.map.flyTo({
        center: [location.value.long, location.value.lat],
        zoom: 8,
        speed: 0.8,
        curve: 1.3,
        essential: true,
      });
    }
    else if (routeName === "dashboard-add") {
      map.map.flyTo({
        center: [newLocationCords.value.lng, newLocationCords.value.lat],
        zoom: 5,
        speed: 0.8,
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
    newLocationCords,
    mapStyle,
    activeLocation,
    hoveredLocation,
    activeLocations,
    handleOnDoubleClick,
  };
});
