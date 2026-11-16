export interface ElectoralArea {
  id: string;
  name: string;
  shortLabel: string;
  mapLabel: string;
  polygon: [number, number][];
  labelPos: [number, number];
  expectedCount: number;
}

export interface PollingStation {
  id: string;
  code: string;
  name: string;
  electoralAreaId: string;
  electoralAreaName: string;
  x: number;
  y: number;
  lat: number;
  lng: number;
  registeredVoters: number;
  verifiedTurnout: number;
  presidingOfficer: string;
  status: 'Nominal' | 'Monitoring' | 'Incident';
}

export interface IncidentReport {
  id: string;
  title: string;
  stationId: string;
  stationName: string;
  electoralAreaName: string;
  severity: 'Low' | 'Medium' | 'High';
  suspectsCount: number;
  timestamp: string;
  notes: string;
  resolved: boolean;
}

export const CONSTITUENCY_BOUNDARY: [number, number][] = [
  [372, 468],
  [380, 392],
  [384, 326],
  [398, 258],
  [428, 198],
  [478, 142],
  [538, 92],
  [596, 48],
  [652, 92],
  [678, 146],
  [646, 206],
  [622, 274],
  [598, 344],
  [578, 412],
  [564, 444],
  [486, 452],
  [420, 462],
];

export const ELECTORAL_AREAS: ElectoralArea[] = [
  {
    id: '37-military-hospital',
    name: '37 Military Hospital',
    shortLabel: '37 Military\nHospital',
    mapLabel: '37 MILITARY HOSPITAL',
    polygon: [
      [548, 178],
      [604, 118],
      [652, 92],
      [678, 146],
      [646, 206],
      [622, 274],
      [598, 332],
      [524, 304],
      [540, 238],
    ],
    labelPos: [604, 218],
    expectedCount: 9,
  },
  {
    id: 'hot-coffee',
    name: 'Hot Coffee',
    shortLabel: 'Hot\nCoffee',
    mapLabel: 'HOT COFFEE',
    polygon: [
      [476, 182],
      [548, 178],
      [540, 238],
      [524, 278],
      [464, 272],
    ],
    labelPos: [506, 226],
    expectedCount: 15,
  },
  {
    id: 'kanda',
    name: 'Kanda',
    shortLabel: 'Kanda',
    mapLabel: 'KANDA',
    polygon: [
      [524, 304],
      [598, 332],
      [578, 412],
      [564, 444],
      [502, 448],
      [508, 360],
    ],
    labelPos: [548, 374],
    expectedCount: 7,
  },
  {
    id: 'ko-oho',
    name: 'Ko-Oho',
    shortLabel: 'Ko-Oho',
    mapLabel: 'KO-OHO',
    polygon: [
      [428, 198],
      [478, 142],
      [512, 114],
      [496, 180],
      [476, 182],
      [468, 212],
    ],
    labelPos: [466, 168],
    expectedCount: 10,
  },
  {
    id: 'kusuntuline',
    name: 'Kusuntuline',
    shortLabel: 'Kusuntuline',
    mapLabel: 'KUSUNTULINE',
    polygon: [
      [384, 326],
      [398, 258],
      [458, 266],
      [450, 332],
    ],
    labelPos: [418, 298],
    expectedCount: 10,
  },
  {
    id: 'nima-441',
    name: 'Nima 441',
    shortLabel: 'Nima 441',
    mapLabel: 'NIMA 441',
    polygon: [
      [512, 114],
      [538, 92],
      [572, 134],
      [548, 178],
      [496, 180],
    ],
    labelPos: [534, 140],
    expectedCount: 14,
  },
  {
    id: 'nima-east',
    name: 'Nima East',
    shortLabel: 'Nima East',
    mapLabel: 'NIMA EAST',
    polygon: [
      [450, 332],
      [524, 304],
      [508, 360],
      [502, 448],
      [438, 458],
    ],
    labelPos: [474, 384],
    expectedCount: 13,
  },
  {
    id: 'nima-research',
    name: 'Nima Research',
    shortLabel: 'Nima\nResearch',
    mapLabel: 'NIMA RESEARCH',
    polygon: [
      [398, 258],
      [428, 198],
      [468, 212],
      [476, 182],
      [464, 272],
      [458, 266],
    ],
    labelPos: [436, 236],
    expectedCount: 11,
  },
  {
    id: 'nima-video-land',
    name: 'Nima Video Land',
    shortLabel: 'Nima\nVideo\nLand',
    mapLabel: 'NIMA VIDEO LAND',
    polygon: [
      [458, 266],
      [464, 272],
      [524, 278],
      [524, 304],
      [450, 332],
    ],
    labelPos: [488, 298],
    expectedCount: 8,
  },
  {
    id: 'nima-west',
    name: 'Nima West',
    shortLabel: 'Nima\nWest',
    mapLabel: 'NIMA WEST',
    polygon: [
      [372, 468],
      [380, 392],
      [384, 326],
      [450, 332],
      [438, 458],
      [420, 462],
    ],
    labelPos: [408, 396],
    expectedCount: 11,
  },
  {
    id: 'ruga',
    name: 'Ruga',
    shortLabel: 'Ruga',
    mapLabel: 'RUGA',
    polygon: [
      [538, 92],
      [596, 48],
      [652, 92],
      [604, 118],
      [572, 134],
    ],
    labelPos: [592, 92],
    expectedCount: 5,
  },
];

const STATION_NAMES_BY_AREA: Record<string, string[]> = {
  '37-military-hospital': [
    "Day Care Centre 37 Military Hospital 'A'",
    "Warrant Officers Quarters 37 'A'",
    "Officers Mess 37 Military Hospital 1 'A'",
    "Flag Staff House JHS, Kanda",
    "Officers Mess 37 Military Hospital 1 'B'",
    "Officers Mess 37 Military Hospital 2 'A'",
    "Officers Mess 37 Military Hospital 2 'B'",
    "Day Care Centre 37 Military Hospital 'B'",
    "Warrant Officers Quarters 37 'B'",
  ],
  'hot-coffee': [
    "Hot Coffee Central Mosque 'A'",
    "Hot Coffee Central Mosque 'B'",
    "Nima Cluster of Schools Blk 1 'A'",
    "Nima Cluster of Schools Blk 1 'B'",
    "Al-Azhariya Islamic School 'A'",
    "Al-Azhariya Islamic School 'B'",
    "Hot Coffee Market Square 'A'",
    "Hot Coffee Market Square 'B'",
    "Zongo Lane Open Space 'A'",
    "Zongo Lane Open Space 'B'",
    "Darul Hadith Basic School 'A'",
    "Darul Hadith Basic School 'B'",
    "Hot Coffee Community Borehole 'A'",
    "Hot Coffee Community Borehole 'B'",
    "Nima Junction Taxi Rank",
  ],
  'kanda': [
    "Kanda Estate Primary School 'A'",
    "Kanda Estate Primary School 'B'",
    "Kanda Cluster JHS 'A'",
    "Kanda Cluster JHS 'B'",
    "Ghana Broadcasting Corp Gate 'A'",
    "Kanda Highway Community Park",
    "Kanda Post Office Forecourt",
  ],
  'ko-oho': [
    "Ko-Oho Mosque Forecourt 'A'",
    "Ko-Oho Mosque Forecourt 'B'",
    "Nima West Presby Primary 'A'",
    "Nima West Presby Primary 'B'",
    "Ko-Oho Tailors Shade 'A'",
    "Ko-Oho Tailors Shade 'B'",
    "Alhaji Gariba Junction 'A'",
    "Alhaji Gariba Junction 'B'",
    "Ko-Oho Youth Centre 'A'",
    "Ko-Oho Youth Centre 'B'",
  ],
  'kusuntuline': [
    "Kusuntuline Community Shed 'A'",
    "Kusuntuline Community Shed 'B'",
    "Nima Roundabout Clinic Gate 'A'",
    "Nima Roundabout Clinic Gate 'B'",
    "Kansukrom Islamic Basic 'A'",
    "Kansukrom Islamic Basic 'B'",
    "Kusuntuline Bridge Open Space 'A'",
    "Kusuntuline Bridge Open Space 'B'",
    "Salaga Street Corner 'A'",
    "Salaga Street Corner 'B'",
  ],
  'nima-441': [
    "Nima 441 Bus Stop 'A'",
    "Nima 441 Bus Stop 'B'",
    "441 Central Lorry Park 'A'",
    "441 Central Lorry Park 'B'",
    "Mamobi-Nima Link School 'A'",
    "Mamobi-Nima Link School 'B'",
    "Nima 441 Quranic Institute 'A'",
    "Nima 441 Quranic Institute 'B'",
    "441 Police Post Forecourt 'A'",
    "441 Police Post Forecourt 'B'",
    "Gutter Junction Shade 'A'",
    "Gutter Junction Shade 'B'",
    "441 Pharmacy Lane 'A'",
    "441 Pharmacy Lane 'B'",
  ],
  'nima-east': [
    "Nima East Assemblies of God 'A'",
    "Nima East Assemblies of God 'B'",
    "Kanda-Nima Footbridge 'A'",
    "Kanda-Nima Footbridge 'B'",
    "St. Francis Xavier R/C Primary 'A'",
    "St. Francis Xavier R/C Primary 'B'",
    "Nima East Chief's Palace 'A'",
    "Nima East Chief's Palace 'B'",
    "Ayawaso East MCE Forecourt 'A'",
    "Ayawaso East MCE Forecourt 'B'",
    "Nima East Community Library 'A'",
    "Nima East Community Library 'B'",
    "Paloma Lane Junction",
  ],
  'nima-research': [
    "Nima Research Academy 'A'",
    "Nima Research Academy 'B'",
    "Nima Polyclinic Entrance 'A'",
    "Nima Polyclinic Entrance 'B'",
    "Research Road Mosque 'A'",
    "Research Road Mosque 'B'",
    "Nima Main Market East 'A'",
    "Nima Main Market East 'B'",
    "Alhaji Futa Memorial 'A'",
    "Alhaji Futa Memorial 'B'",
    "Research Corner Kiosk",
  ],
  'nima-video-land': [
    "Nima Video Land Square 'A'",
    "Nima Video Land Square 'B'",
    "Nima Palace Cinema Forecourt 'A'",
    "Nima Palace Cinema Forecourt 'B'",
    "Video Land Youth Pavilion 'A'",
    "Video Land Youth Pavilion 'B'",
    "Nima Central Water Stand 'A'",
    "Nima Central Water Stand 'B'",
  ],
  'nima-west': [
    "Nima West Basic School 'A'",
    "Nima West Basic School 'B'",
    "Circle-Nima Odaw Link 'A'",
    "Circle-Nima Odaw Link 'B'",
    "Nima West Methodist Church 'A'",
    "Nima West Methodist Church 'B'",
    "Ring Road Central Overpass 'A'",
    "Ring Road Central Overpass 'B'",
    "Nima West Football Park 'A'",
    "Nima West Football Park 'B'",
    "Alajo-Nima Boundary Post",
  ],
  'ruga': [
    "Ruga Kraal Open Space 'A'",
    "Ruga Kraal Open Space 'B'",
    "Ruga Cattle Market Gate 'A'",
    "Ruga Cattle Market Gate 'B'",
    "Kawai Bridge North Post",
  ],
};

// Deterministic pseudo-random helper so markers always stay cleanly inside each Electoral Area polygon
function seededFraction(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function pointInPolygon(x: number, y: number, poly: [number, number][]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1];
    const xj = poly[j][0], yj = poly[j][1];
    const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi + 1e-9) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function generatePointsInsidePolygon(poly: [number, number][], count: number, seedBase: number): [number, number][] {
  const xs = poly.map((p) => p[0]);
  const ys = poly.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const cx = xs.reduce((a, b) => a + b, 0) / xs.length;
  const cy = ys.reduce((a, b) => a + b, 0) / ys.length;

  const points: [number, number][] = [];
  let attempt = 0;

  while (points.length < count && attempt < 400) {
    attempt++;
    const rx = minX + 6 + seededFraction(seedBase + attempt * 7) * Math.max(4, maxX - minX - 12);
    const ry = minY + 6 + seededFraction(seedBase + attempt * 13 + 3) * Math.max(4, maxY - minY - 12);

    // Pull slightly inward from polygon edges so pins sit cleanly inside borders
    const px = rx * 0.86 + cx * 0.14;
    const py = ry * 0.86 + cy * 0.14;

    if (pointInPolygon(px, py, poly)) {
      const tooClose = points.some(([ox, oy]) => (ox - px) ** 2 + (oy - py) ** 2 < 110);
      if (!tooClose || attempt > 240) {
        points.push([Math.round(px * 10) / 10, Math.round(py * 10) / 10]);
      }
    }
  }

  while (points.length < count) {
    const angle = (points.length / count) * Math.PI * 2;
    points.push([Math.round((cx + Math.cos(angle) * 10) * 10) / 10, Math.round((cy + Math.sin(angle) * 10) * 10) / 10]);
  }

  return points;
}

const OFFICER_SURNAMES = [
  'Mensah', 'Boateng', 'Appiah', 'Osei', 'Abubakar', 'Sulemana',
  'Mohammed', 'Ibrahim', 'Tetteh', 'Addo', 'Asante', 'Nkrumah',
  'Iddrisu', 'Alhassan', 'Yakubu', 'Quartey', 'Amankwah', 'Frimpong',
];

const OFFICER_INITIALS = ['K.', 'A.', 'M.', 'S.', 'F.', 'E.', 'R.', 'H.', 'Y.', 'I.'];

export const POLLING_STATIONS: PollingStation[] = (() => {
  const result: PollingStation[] = [];
  let globalIdx = 1;

  ELECTORAL_AREAS.forEach((area, areaIdx) => {
    const names = STATION_NAMES_BY_AREA[area.id] ?? [];
    const coords = generatePointsInsidePolygon(area.polygon, names.length, (areaIdx + 1) * 100);

    names.forEach((stationName, idx) => {
      const [x, y] = coords[idx];
      const seed = globalIdx * 17 + areaIdx * 31;
      const registeredVoters = 380 + Math.floor(seededFraction(seed) * 410);
      const verifiedTurnout = Math.round((46 + seededFraction(seed + 5) * 32) * 10) / 10;

      // Approximate real Ayawaso East lat/lng mapping (5.570 to 5.595 N, -0.212 to -0.178 W)
      const lat = Math.round((5.596 - (y / 500) * 0.028) * 10000) / 10000;
      const lng = Math.round((-0.228 + (x / 1000) * 0.056) * 10000) / 10000;

      const areaNum = String(areaIdx + 1).padStart(2, '0');
      const stNum = String(idx + 1).padStart(2, '0');

      const officer = `${OFFICER_INITIALS[globalIdx % OFFICER_INITIALS.length]} ${OFFICER_SURNAMES[(globalIdx * 3) % OFFICER_SURNAMES.length]}`;

      result.push({
        id: `${area.id}-${idx + 1}`,
        code: `C13${areaNum}${stNum}`,
        name: stationName,
        electoralAreaId: area.id,
        electoralAreaName: area.name,
        x,
        y,
        lat,
        lng,
        registeredVoters,
        verifiedTurnout,
        presidingOfficer: officer,
        status: 'Nominal',
      });

      globalIdx++;
    });
  });

  return result;
})();

export const SURROUNDING_LABELS: { name: string; x: number; y: number; sub?: string }[] = [
  { name: 'Kpehe', x: 312, y: 24 },
  { name: 'Mamobi', x: 492, y: 22 },
  { name: 'Accra New', sub: 'Town', x: 360, y: 162 },
  { name: 'Ayawaso', sub: 'Central\nMunicipal', x: 274, y: 316 },
  { name: 'Kokomlemle', x: 280, y: 392 },
  { name: 'Asylum', sub: 'Down', x: 342, y: 496 },
  { name: 'North Ridge', x: 506, y: 486 },
  { name: 'Cantonments', x: 702, y: 394 },
  { name: 'Labone', sub: 'Estate', x: 806, y: 480 },
  { name: 'Airport', x: 874, y: 22 },
];

export const CIRCLE_LABELS: { name: string; x: number; y: number }[] = [
  { name: 'Afua Circle', x: 726, y: 136 },
  { name: 'Sankara\nCircle', x: 582, y: 458 },
  { name: 'Kwame\nNkrumah\nCircle', x: 214, y: 492 },
];
