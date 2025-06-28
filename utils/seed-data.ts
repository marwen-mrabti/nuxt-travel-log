import db from "~/lib/db";
import { location } from "~/lib/db/schema";

const userId = "add user id here";

const seedLocations = [
  {
    name: "Central Park",
    slug: "central-park-nyc",
    description: "A sprawling urban oasis in the heart of Manhattan, featuring lakes, meadows, and iconic landmarks like Bethesda Fountain.",
    lat: 40.7829,
    long: -73.9654,
  },
  {
    name: "Golden Gate Bridge",
    slug: "golden-gate-bridge",
    description: "Iconic suspension bridge connecting San Francisco to Marin County, offering breathtaking views of the bay.",
    lat: 37.8199,
    long: -122.4783,
  },
  {
    name: "Times Square",
    slug: "times-square",
    description: "The bustling commercial intersection known as 'The Crossroads of the World' with bright lights and billboards.",
    lat: 40.7580,
    long: -73.9855,
  },
  {
    name: "Statue of Liberty",
    slug: "statue-of-liberty",
    description: "Symbol of freedom and democracy, standing tall on Liberty Island in New York Harbor.",
    lat: 40.6892,
    long: -74.0445,
  },
  {
    name: "Hollywood Sign",
    slug: "hollywood-sign",
    description: "Iconic landmark overlooking Los Angeles, representing the glamour of the entertainment industry.",
    lat: 34.1341,
    long: -118.3215,
  },
  {
    name: "Space Needle",
    slug: "space-needle-seattle",
    description: "Futuristic observation tower built for the 1962 World's Fair, offering panoramic views of Seattle.",
    lat: 47.6205,
    long: -122.3493,
  },
  {
    name: "Mount Rushmore",
    slug: "mount-rushmore",
    description: "Monumental sculpture carved into granite featuring four U.S. presidents in the Black Hills of South Dakota.",
    lat: 43.8791,
    long: -103.4591,
  },
  {
    name: "Navy Pier",
    slug: "navy-pier-chicago",
    description: "Entertainment destination on Lake Michigan featuring shops, restaurants, and the iconic Ferris wheel.",
    lat: 41.8917,
    long: -87.6086,
  },
  {
    name: "French Quarter",
    slug: "french-quarter-new-orleans",
    description: "Historic neighborhood known for its vibrant nightlife, jazz music, and distinctive Creole architecture.",
    lat: 29.9584,
    long: -90.0644,
  },
  {
    name: "Pike Place Market",
    slug: "pike-place-market",
    description: "Historic public market featuring fresh seafood, local produce, and the famous fish-throwing vendors.",
    lat: 47.6097,
    long: -122.3331,
  },
  {
    name: "Millennium Park",
    slug: "millennium-park-chicago",
    description: "Urban cultural park featuring Cloud Gate sculpture and hosting numerous festivals and concerts.",
    lat: 41.8826,
    long: -87.6226,
  },
  {
    name: "Venice Beach",
    slug: "venice-beach-la",
    description: "Bohemian beachfront known for its boardwalk, street performers, and vibrant street art.",
    lat: 33.9850,
    long: -118.4695,
  },
  {
    name: "Brooklyn Bridge",
    slug: "brooklyn-bridge",
    description: "Historic suspension bridge spanning the East River, connecting Manhattan and Brooklyn.",
    lat: 40.7061,
    long: -73.9969,
  },
  {
    name: "Fisherman's Wharf",
    slug: "fishermans-wharf-sf",
    description: "Waterfront neighborhood famous for sea lions, street performers, and fresh seafood restaurants.",
    lat: 37.8080,
    long: -122.4177,
  },
  {
    name: "Art Institute of Chicago",
    slug: "art-institute-chicago",
    description: "World-renowned art museum housing an impressive collection of Impressionist and Post-Impressionist works.",
    lat: 41.8796,
    long: -87.6237,
  },
  {
    name: "Beacon Hill",
    slug: "beacon-hill-boston",
    description: "Historic neighborhood featuring cobblestones streets, gas-lit lamps, and Federal-style architecture.",
    lat: 42.3588,
    long: -71.0707,
  },
  {
    name: "The Strip",
    slug: "las-vegas-strip",
    description: "Famous stretch of Las Vegas Boulevard featuring world-class casinos, shows, and entertainment.",
    lat: 36.1147,
    long: -115.1728,
  },
  {
    name: "South Beach",
    slug: "south-beach-miami",
    description: "Glamorous beach destination known for Art Deco architecture, nightlife, and pristine sandy beaches.",
    lat: 25.7823,
    long: -80.1303,
  },
  {
    name: "Rodeo Drive",
    slug: "rodeo-drive-beverly-hills",
    description: "Luxury shopping street in Beverly Hills featuring high-end boutiques and designer stores.",
    lat: 34.0677,
    long: -118.4000,
  },
  {
    name: "The Riverwalk",
    slug: "san-antonio-riverwalk",
    description: "Network of walkways along the San Antonio River with shops, restaurants, and boat tours.",
    lat: 29.4246,
    long: -98.4951,
  },
  {
    name: "Pearl District",
    slug: "pearl-district-portland",
    description: "Trendy neighborhood known for galleries, boutiques, restaurants, and converted warehouse lofts.",
    lat: 45.5343,
    long: -122.6831,
  },
  {
    name: "Fremont Street",
    slug: "fremont-street-vegas",
    description: "Historic downtown Las Vegas street featuring the famous LED canopy and vintage casinos.",
    lat: 36.1699,
    long: -115.1423,
  },
  {
    name: "The High Line",
    slug: "high-line-nyc",
    description: "Elevated linear park built on former railway tracks, featuring gardens and art installations.",
    lat: 40.7480,
    long: -74.0048,
  },
  {
    name: "Lombard Street",
    slug: "lombard-street-sf",
    description: "The 'crookedest street in the world' with eight sharp turns and beautiful landscaping.",
    lat: 37.8021,
    long: -122.4187,
  },
  {
    name: "Lincoln Road",
    slug: "lincoln-road-miami",
    description: "Pedestrian mall in South Beach featuring outdoor dining, shopping, and people-watching.",
    lat: 25.7907,
    long: -80.1378,
  },
  {
    name: "The Magnificent Mile",
    slug: "magnificent-mile-chicago",
    description: "Upscale shopping district on Michigan Avenue featuring luxury stores and iconic architecture.",
    lat: 41.8955,
    long: -87.6244,
  },
  {
    name: "Gasworks Park",
    slug: "gasworks-park-seattle",
    description: "Unique park built around remnants of a former gas plant, offering skyline views and green space.",
    lat: 45.5343,
    long: -122.6831,
  },
  {
    name: "The Domain",
    slug: "the-domain-austin",
    description: "Upscale outdoor shopping center featuring luxury retailers, restaurants, and residential spaces.",
    lat: 30.4001,
    long: -97.7209,
  },
  {
    name: "Faneuil Hall",
    slug: "faneuil-hall-boston",
    description: "Historic marketplace and meeting hall known as the 'Cradle of Liberty' with shops and food vendors.",
    lat: 42.3601,
    long: -71.0544,
  },
  {
    name: "The Battery",
    slug: "the-battery-charleston",
    description: "Historic defensive seawall and promenade lined with antebellum mansions and palmetto trees.",
    lat: 32.7702,
    long: -79.9269,
  },
  {
    name: "Pearl Harbor",
    slug: "pearl-harbor-hawaii",
    description: "Historic naval base and memorial site commemorating the December 7, 1941 attack.",
    lat: 21.3649,
    long: -157.9763,
  },
  {
    name: "Napa Valley",
    slug: "napa-valley-california",
    description: "World-renowned wine region featuring rolling vineyards, wineries, and gourmet dining.",
    lat: 38.5025,
    long: -122.2654,
  },
  {
    name: "The Alamo",
    slug: "the-alamo-san-antonio",
    description: "Historic mission and fortress, site of the famous 1836 battle during the Texas Revolution.",
    lat: 29.4260,
    long: -98.4861,
  },
  {
    name: "Antelope Canyon",
    slug: "antelope-canyon-arizona",
    description: "Stunning slot canyon on Navajo land known for its wave-like structure and light beams.",
    lat: 36.8619,
    long: -111.3743,
  },
  {
    name: "Bourbon Street",
    slug: "bourbon-street-new-orleans",
    description: "Famous street in the French Quarter known for its vibrant nightlife, jazz clubs, and Mardi Gras celebrations.",
    lat: 29.9584,
    long: -90.0644,
  },
];

async function seedDatabase() {
  try {
    console.log("Starting to seed location data...");

    // Insert locations with the specified userId
    const locationsToInsert = seedLocations.map(loc => ({
      ...loc,
      userId,
    }));

    // Insert all locations
    const result = await db.insert(location).values(locationsToInsert);

    console.log(`Successfully seeded ${seedLocations.length} locations!`);
    console.log("Seed data inserted with userId:", userId);

    return result;
  }
  catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run the seed function
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("Database seeding completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Database seeding failed:", error);
      process.exit(1);
    });
}

export { seedDatabase, seedLocations };
