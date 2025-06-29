export type Coordinates = {
  lng: number;
  lat: number;
};

export function useCords() {
  const cords = useState<Coordinates>("cords", () => ({
    lng: -0.12574000,
    lat: 51.50853000,
  })); // london coordinates

  return cords;
}
