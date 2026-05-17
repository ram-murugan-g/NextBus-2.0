// =====================================================
// BUS SIMULATOR - Core real-time simulation engine
// Simulates 30 Chennai public buses moving along routes
// Broadcasts via Socket.IO every 2 seconds
// =====================================================

// 12 Chennai Routes with real coordinates
const ROUTES = [
  {
    id: 'route_21c', name: '21C', displayName: '21C: Central → Koyambedu',
    start: 'Chennai Central', end: 'Koyambedu', color: '#3B82F6',
    points: [
      { lat: 13.0827, lng: 80.2707, name: 'Chennai Central' },
      { lat: 13.0732, lng: 80.2609, name: 'Egmore' },
      { lat: 13.0850, lng: 80.2101, name: 'Anna Nagar' },
      { lat: 13.0696, lng: 80.1948, name: 'Koyambedu' },
      { lat: 13.0524, lng: 80.2120, name: 'Vadapalani' },
      { lat: 13.0418, lng: 80.2341, name: 'T Nagar' },
      { lat: 13.0237, lng: 80.2283, name: 'Saidapet' },
      { lat: 13.0067, lng: 80.2206, name: 'Guindy' }
    ]
  },
  {
    id: 'route_5', name: '5', displayName: '5: Parrys → Anna Nagar',
    start: 'Parrys Corner', end: 'Anna Nagar', color: '#10B981',
    points: [
      { lat: 13.0878, lng: 80.2785, name: 'Parrys Corner' },
      { lat: 13.1143, lng: 80.2895, name: 'Washermanpet' },
      { lat: 13.1271, lng: 80.2920, name: 'Tondiarpet' },
      { lat: 13.1186, lng: 80.2337, name: 'Perambur' },
      { lat: 13.1246, lng: 80.2150, name: 'Kolathur' },
      { lat: 13.0850, lng: 80.2101, name: 'Anna Nagar' }
    ]
  },
  {
    id: 'route_27e', name: '27E', displayName: '27E: Egmore → Velachery',
    start: 'Egmore', end: 'Velachery', color: '#8B5CF6',
    points: [
      { lat: 13.0732, lng: 80.2609, name: 'Egmore' },
      { lat: 13.0588, lng: 80.2756, name: 'Triplicane' },
      { lat: 13.0634, lng: 80.2795, name: 'Chepauk' },
      { lat: 13.0500, lng: 80.2824, name: 'Marina Beach' },
      { lat: 13.0338, lng: 80.2619, name: 'Mylapore' },
      { lat: 13.0067, lng: 80.2570, name: 'Adyar' },
      { lat: 13.0003, lng: 80.2667, name: 'Besant Nagar' },
      { lat: 12.9830, lng: 80.2594, name: 'Thiruvanmiyur' },
      { lat: 12.9750, lng: 80.2209, name: 'Velachery' }
    ]
  },
  {
    id: 'route_15', name: '15', displayName: '15: T.Nagar → Poonamallee',
    start: 'T Nagar', end: 'Poonamallee', color: '#F59E0B',
    points: [
      { lat: 13.0418, lng: 80.2341, name: 'T Nagar' },
      { lat: 13.0524, lng: 80.2120, name: 'Vadapalani' },
      { lat: 13.0352, lng: 80.2120, name: 'Ashok Nagar' },
      { lat: 13.0410, lng: 80.1994, name: 'KK Nagar' },
      { lat: 13.0355, lng: 80.1585, name: 'Porur' },
      { lat: 13.0487, lng: 80.1077, name: 'Poonamallee' }
    ]
  },
  {
    id: 'route_airport', name: 'M70', displayName: 'M70: Airport Express',
    start: 'Anna Nagar', end: 'Tambaram', color: '#EF4444',
    points: [
      { lat: 13.0850, lng: 80.2101, name: 'Anna Nagar' },
      { lat: 13.0696, lng: 80.1948, name: 'Koyambedu' },
      { lat: 13.0067, lng: 80.2206, name: 'Guindy' },
      { lat: 13.0045, lng: 80.2017, name: 'Alandur' },
      { lat: 12.9675, lng: 80.1491, name: 'Pallavaram' },
      { lat: 12.9516, lng: 80.1462, name: 'Chromepet' },
      { lat: 12.9249, lng: 80.1275, name: 'Tambaram' }
    ]
  },
  {
    id: 'route_m9', name: 'M9', displayName: 'M9: Marina → Velachery',
    start: 'Marina Beach', end: 'Velachery', color: '#06B6D4',
    points: [
      { lat: 13.0500, lng: 80.2824, name: 'Marina Beach' },
      { lat: 13.0551, lng: 80.2637, name: 'Royapettah' },
      { lat: 13.0338, lng: 80.2619, name: 'Mylapore' },
      { lat: 13.0067, lng: 80.2570, name: 'Adyar' },
      { lat: 12.9830, lng: 80.2594, name: 'Thiruvanmiyur' },
      { lat: 12.9750, lng: 80.2209, name: 'Velachery' },
      { lat: 13.0045, lng: 80.2017, name: 'Alandur' }
    ]
  },
  {
    id: 'route_12d', name: '12D', displayName: '12D: Perambur → Guindy',
    start: 'Perambur', end: 'Guindy', color: '#F97316',
    points: [
      { lat: 13.1186, lng: 80.2337, name: 'Perambur' },
      { lat: 13.0850, lng: 80.2101, name: 'Anna Nagar' },
      { lat: 13.0524, lng: 80.2120, name: 'Vadapalani' },
      { lat: 13.0410, lng: 80.1994, name: 'KK Nagar' },
      { lat: 13.0352, lng: 80.2120, name: 'Ashok Nagar' },
      { lat: 13.0237, lng: 80.2283, name: 'Saidapet' },
      { lat: 13.0067, lng: 80.2206, name: 'Guindy' }
    ]
  },
  {
    id: 'route_29c', name: '29C', displayName: '29C: Central → Tondiarpet',
    start: 'Chennai Central', end: 'Tondiarpet', color: '#EC4899',
    points: [
      { lat: 13.0827, lng: 80.2707, name: 'Chennai Central' },
      { lat: 13.0878, lng: 80.2785, name: 'Parrys Corner' },
      { lat: 13.1143, lng: 80.2895, name: 'Washermanpet' },
      { lat: 13.1271, lng: 80.2920, name: 'Tondiarpet' }
    ]
  },
  // 4 new routes
  {
    id: 'route_47a', name: '47A', displayName: '47A: Koyambedu → Tambaram',
    start: 'Koyambedu', end: 'Tambaram', color: '#84CC16',
    points: [
      { lat: 13.0696, lng: 80.1948, name: 'Koyambedu' },
      { lat: 13.0355, lng: 80.1585, name: 'Porur' },
      { lat: 13.0045, lng: 80.2017, name: 'Alandur' },
      { lat: 12.9675, lng: 80.1491, name: 'Pallavaram' },
      { lat: 12.9516, lng: 80.1462, name: 'Chromepet' },
      { lat: 12.9249, lng: 80.1275, name: 'Tambaram' }
    ]
  },
  {
    id: 'route_23b', name: '23B', displayName: '23B: Kolathur → Marina',
    start: 'Kolathur', end: 'Marina Beach', color: '#A855F7',
    points: [
      { lat: 13.1246, lng: 80.2150, name: 'Kolathur' },
      { lat: 13.1186, lng: 80.2337, name: 'Perambur' },
      { lat: 13.0827, lng: 80.2707, name: 'Chennai Central' },
      { lat: 13.0878, lng: 80.2785, name: 'Parrys Corner' },
      { lat: 13.0634, lng: 80.2795, name: 'Chepauk' },
      { lat: 13.0500, lng: 80.2824, name: 'Marina Beach' }
    ]
  },
  {
    id: 'route_11c', name: '11C', displayName: '11C: T.Nagar → Adyar',
    start: 'T Nagar', end: 'Adyar', color: '#14B8A6',
    points: [
      { lat: 13.0418, lng: 80.2341, name: 'T Nagar' },
      { lat: 13.0338, lng: 80.2619, name: 'Mylapore' },
      { lat: 13.0551, lng: 80.2637, name: 'Royapettah' },
      { lat: 13.0067, lng: 80.2570, name: 'Adyar' },
      { lat: 13.0003, lng: 80.2667, name: 'Besant Nagar' }
    ]
  },
  {
    id: 'route_52d', name: '52D', displayName: '52D: Anna Nagar → Velachery',
    start: 'Anna Nagar', end: 'Velachery', color: '#FB923C',
    points: [
      { lat: 13.0850, lng: 80.2101, name: 'Anna Nagar' },
      { lat: 13.0418, lng: 80.2341, name: 'T Nagar' },
      { lat: 13.0237, lng: 80.2283, name: 'Saidapet' },
      { lat: 13.0067, lng: 80.2570, name: 'Adyar' },
      { lat: 12.9830, lng: 80.2594, name: 'Thiruvanmiyur' },
      { lat: 12.9750, lng: 80.2209, name: 'Velachery' }
    ]
  }
];

// 30-bus fleet across all routes
const BUS_FLEET = [
  // Route 21C — 4 buses
  { id: 'bus_001', number: 'TN01-A-1234', routeId: 'route_21c', capacity: 72, name: 'Pallavan Express' },
  { id: 'bus_002', number: 'TN09-A-4521', routeId: 'route_21c', capacity: 72, name: 'Pallavan Express II' },
  { id: 'bus_003', number: 'TN09-A-8843', routeId: 'route_21c', capacity: 60, name: 'Central Cruiser' },
  { id: 'bus_004', number: 'TN09-A-2267', routeId: 'route_21c', capacity: 72, name: 'Koyambedu Flash' },
  // Route 5 — 3 buses
  { id: 'bus_005', number: 'TN01-B-5678', routeId: 'route_5', capacity: 60, name: 'Metro Feeder 5' },
  { id: 'bus_006', number: 'TN09-B-3349', routeId: 'route_5', capacity: 60, name: 'North Chennai Link' },
  { id: 'bus_007', number: 'TN09-B-7712', routeId: 'route_5', capacity: 50, name: 'Parrys Runner' },
  // Route 27E — 3 buses
  { id: 'bus_008', number: 'TN01-C-9012', routeId: 'route_27e', capacity: 72, name: 'Southern Express' },
  { id: 'bus_009', number: 'TN09-C-1156', routeId: 'route_27e', capacity: 72, name: 'Marina Liner' },
  { id: 'bus_010', number: 'TN09-C-5523', routeId: 'route_27e', capacity: 60, name: 'Velachery Connect' },
  // Route 15 — 3 buses
  { id: 'bus_011', number: 'TN01-D-3456', routeId: 'route_15', capacity: 50, name: 'Porur Link' },
  { id: 'bus_012', number: 'TN09-D-6634', routeId: 'route_15', capacity: 50, name: 'Poonamallee Star' },
  { id: 'bus_013', number: 'TN09-D-9901', routeId: 'route_15', capacity: 60, name: 'KK Nagar Express' },
  // Route Airport M70 — 2 buses
  { id: 'bus_014', number: 'TN01-E-7890', routeId: 'route_airport', capacity: 45, name: 'Airport Shuttle' },
  { id: 'bus_015', number: 'TN09-E-2278', routeId: 'route_airport', capacity: 45, name: 'Tambaram Flyer' },
  // Route M9 — 3 buses
  { id: 'bus_016', number: 'TN01-F-2345', routeId: 'route_m9', capacity: 60, name: 'Marina Express' },
  { id: 'bus_017', number: 'TN09-F-5567', routeId: 'route_m9', capacity: 60, name: 'Adyar Cruiser' },
  { id: 'bus_018', number: 'TN09-F-8890', routeId: 'route_m9', capacity: 72, name: 'Coastal Rider' },
  // Route 12D — 3 buses
  { id: 'bus_019', number: 'TN01-G-6789', routeId: 'route_12d', capacity: 72, name: 'City Connector' },
  { id: 'bus_020', number: 'TN09-G-1123', routeId: 'route_12d', capacity: 72, name: 'Guindy Runner' },
  { id: 'bus_021', number: 'TN09-G-4456', routeId: 'route_12d', capacity: 60, name: 'Perambur Link' },
  // Route 29C — 2 buses
  { id: 'bus_022', number: 'TN01-H-0123', routeId: 'route_29c', capacity: 50, name: 'North Link' },
  { id: 'bus_023', number: 'TN09-H-3344', routeId: 'route_29c', capacity: 50, name: 'Tondiarpet Star' },
  // Route 47A — 2 buses
  { id: 'bus_024', number: 'TN09-J-7789', routeId: 'route_47a', capacity: 60, name: 'South Connector' },
  { id: 'bus_025', number: 'TN09-J-1122', routeId: 'route_47a', capacity: 50, name: 'Tambaram Direct' },
  // Route 23B — 2 buses
  { id: 'bus_026', number: 'TN09-K-5566', routeId: 'route_23b', capacity: 60, name: 'Marina Kolathur' },
  { id: 'bus_027', number: 'TN09-K-8899', routeId: 'route_23b', capacity: 72, name: 'Central Bay Link' },
  // Route 11C — 2 buses
  { id: 'bus_028', number: 'TN09-L-2233', routeId: 'route_11c', capacity: 50, name: 'Adyar Express' },
  { id: 'bus_029', number: 'TN09-L-5566', routeId: 'route_11c', capacity: 50, name: 'Mylapore Loop' },
  // Route 52D — 1 bus
  { id: 'bus_030', number: 'TN09-M-9900', routeId: 'route_52d', capacity: 60, name: 'AnNagar Velachery' }
];

let ioInstance = null;
const activeBuses = new Map();
let simulationInterval = null;

// Linear interpolation between two points
const lerp = (p1, p2, t) => ({
  lat: p1.lat + (p2.lat - p1.lat) * t,
  lng: p1.lng + (p2.lng - p1.lng) * t
});

// Calculate bearing (direction) between two points
const getBearing = (p1, p2) => {
  const dLng = (p2.lng - p1.lng) * Math.PI / 180;
  const lat1 = p1.lat * Math.PI / 180;
  const lat2 = p2.lat * Math.PI / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
};

// ETA in minutes based on remaining segments
const calcETA = (bus) => {
  const pts = bus.routePoints;
  const remaining = bus.direction === 1
    ? pts.length - 1 - bus.currentIndex
    : bus.currentIndex;
  return Math.max(1, Math.ceil(remaining * (3 + Math.random() * 2)));
};

// Get nearest stop name
const getNearestStop = (bus) => {
  const pts = bus.routePoints;
  const idx = Math.min(bus.currentIndex + (bus.direction === 1 ? 1 : 0), pts.length - 1);
  return pts[idx]?.name || 'Unknown';
};

const initializeSimulation = () => {
  BUS_FLEET.forEach(bus => {
    const route = ROUTES.find(r => r.id === bus.routeId);
    if (!route) return;
    // Stagger start positions so buses on same route don't overlap
    const startIdx = Math.floor(Math.random() * (route.points.length - 1));
    const startDir = Math.random() > 0.5 ? 1 : -1;
    activeBuses.set(bus.id, {
      vehicleId: bus.id,
      busNumber: bus.number,
      busName: bus.name,
      routeId: bus.routeId,
      routeName: route.name,
      routeDisplayName: route.displayName,
      routeStart: route.start,
      routeEnd: route.end,
      routeColor: route.color,
      routePoints: route.points,
      currentIndex: startIdx,
      progress: Math.random(),
      direction: startDir,
      bearing: 0,
      lat: route.points[startIdx].lat,
      lng: route.points[startIdx].lng,
      speed: Math.round(18 + Math.random() * 22),
      passengerCount: Math.floor(bus.capacity * (0.25 + Math.random() * 0.6)),
      capacity: bus.capacity,
      status: 'running',
      nextStop: route.points[startIdx + 1]?.name || route.end,
      eta: Math.ceil(2 + Math.random() * 20),
      lastUpdated: Date.now(),
      isDriverControlled: false
    });
  });
};

const tick = () => {
  activeBuses.forEach((bus, id) => {
    if (bus.status === 'stopped') return;

    const pts = bus.routePoints;
    bus.progress += 0.04;

    if (bus.progress >= 1) {
      bus.progress = 0;
      bus.currentIndex += bus.direction;

      if (bus.currentIndex >= pts.length - 1) {
        bus.direction = -1;
        bus.currentIndex = pts.length - 1;
      } else if (bus.currentIndex <= 0) {
        bus.direction = 1;
        bus.currentIndex = 0;
      }
    }

    const cur = pts[bus.currentIndex];
    const nextIdx = Math.max(0, Math.min(bus.currentIndex + bus.direction, pts.length - 1));
    const nxt = pts[nextIdx];
    const pos = lerp(cur, nxt, bus.progress);

    bus.lat = pos.lat;
    bus.lng = pos.lng;
    bus.bearing = getBearing(cur, nxt);
    bus.eta = calcETA(bus);
    bus.nextStop = getNearestStop(bus);
    bus.lastUpdated = Date.now();

    // Simulate passenger changes
    if (Math.random() < 0.08) {
      const delta = Math.floor(Math.random() * 5) - 2;
      bus.passengerCount = Math.max(0, Math.min(bus.capacity, bus.passengerCount + delta));
    }

    activeBuses.set(id, bus);
  });

  if (ioInstance) {
    ioInstance.emit('bus:update', Array.from(activeBuses.values()).map(b => ({
      vehicleId: b.vehicleId,
      busNumber: b.busNumber,
      busName: b.busName,
      routeName: b.routeName,
      routeDisplayName: b.routeDisplayName,
      routeStart: b.routeStart,
      routeEnd: b.routeEnd,
      routeColor: b.routeColor,
      lat: b.lat,
      lng: b.lng,
      bearing: b.bearing,
      speed: b.speed,
      passengerCount: b.passengerCount,
      capacity: b.capacity,
      status: b.status,
      nextStop: b.nextStop,
      eta: b.eta,
      lastUpdated: b.lastUpdated,
      isDriverControlled: b.isDriverControlled
    })));
  }
};

export const startBusSimulator = (io) => {
  ioInstance = io;
  initializeSimulation();
  simulationInterval = setInterval(tick, 2000);
  console.log('🚌 Bus simulator started with', activeBuses.size, 'buses across', ROUTES.length, 'routes');
};

export const getActiveBuses = () => Array.from(activeBuses.values());

export const getRoutes = () => ROUTES;

export const addDriverBus = (tripId, vehicleId, routeId, vehicleDoc) => {
  const route = ROUTES.find(r => r.id === routeId) || ROUTES[0];
  activeBuses.set(tripId, {
    vehicleId: tripId,
    busNumber: vehicleDoc.vehicle_number,
    busName: vehicleDoc.name,
    routeId: route.id,
    routeName: route.name,
    routeDisplayName: route.displayName,
    routeStart: route.start,
    routeEnd: route.end,
    routeColor: '#FBBF24',
    routePoints: route.points,
    currentIndex: 0,
    progress: 0,
    direction: 1,
    bearing: 0,
    lat: route.points[0].lat,
    lng: route.points[0].lng,
    speed: 25,
    passengerCount: 0,
    capacity: vehicleDoc.capacity || 50,
    status: 'running',
    nextStop: route.points[1]?.name,
    eta: route.points.length * 3,
    lastUpdated: Date.now(),
    isDriverControlled: true
  });
};

export const removeDriverBus = (tripId) => {
  activeBuses.delete(tripId);
};

export const updateBusPassengers = (vehicleId, count) => {
  activeBuses.forEach((bus, key) => {
    if (bus.vehicleId === vehicleId || key === vehicleId) {
      bus.passengerCount = count;
      activeBuses.set(key, bus);
    }
  });
};

export const stopSimulator = () => {
  if (simulationInterval) clearInterval(simulationInterval);
};
