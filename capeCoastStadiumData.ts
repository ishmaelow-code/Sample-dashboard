export type VenueCategory = 'checkpoint' | 'gate' | 'stand';

export interface StadiumLocation {
  id: string;
  code: string;
  name: string;
  shortLabel: string;
  category: VenueCategory;
  categoryLabel: string;
  zoneSector: string;
  x: number;
  y: number;
  personnelCount: number;
  screenedCount: number;
  capacityOrLimit: string;
  commander: string;
  searchProtocol: string;
}

export interface StadiumStandPolygon {
  id: string;
  locationId: string;
  label: string;
  subLabel: string;
  kind: 'vip' | 'delegates' | 'supporters' | 'arena';
  polygon: [number, number][];
  labelPos: [number, number];
}

export interface VenueIncident {
  id: string;
  title: string;
  locationId: string;
  locationName: string;
  categoryLabel: string;
  severity: 'Low' | 'Medium' | 'High';
  suspectsCount: number;
  timestamp: string;
  notes: string;
  resolved: boolean;
}

export interface ActivityStage {
  id: string;
  stageLabel: string;
  message: string;
  active: boolean;
}

export const STADIUM_STAND_POLYGONS: StadiumStandPolygon[] = [
  {
    id: 'poly-vip',
    locationId: 'stand-vip-west',
    label: 'VIP / PARTY LEADERS',
    subLabel: 'West Covered Stand',
    kind: 'vip',
    polygon: [
      [352, 185],
      [410, 175],
      [410, 345],
      [352, 335],
      [338, 260],
    ],
    labelPos: [376, 260],
  },
  {
    id: 'poly-delegates-nw',
    locationId: 'stand-delegates-nw',
    label: 'DELEGATES STAND',
    subLabel: 'North-West Sector',
    kind: 'delegates',
    polygon: [
      [365, 172],
      [415, 134],
      [495, 122],
      [495, 170],
      [415, 174],
    ],
    labelPos: [435, 152],
  },
  {
    id: 'poly-women-n',
    locationId: 'stand-women-north',
    label: "WOMEN'S WING",
    subLabel: 'North Stand',
    kind: 'delegates',
    polygon: [
      [500, 122],
      [585, 134],
      [632, 172],
      [585, 174],
      [500, 170],
    ],
    labelPos: [562, 152],
  },
  {
    id: 'poly-youth-sw',
    locationId: 'stand-youth-sw',
    label: 'YOUTH WING',
    subLabel: 'South-West Sector',
    kind: 'delegates',
    polygon: [
      [365, 348],
      [415, 346],
      [495, 350],
      [495, 398],
      [415, 386],
    ],
    labelPos: [435, 368],
  },
  {
    id: 'poly-supporters-se',
    locationId: 'stand-supporters-se',
    label: 'SUPPORTERS OVERFLOW',
    subLabel: 'South-East Terrace',
    kind: 'supporters',
    polygon: [
      [500, 350],
      [585, 346],
      [632, 348],
      [585, 386],
      [500, 398],
    ],
    labelPos: [562, 368],
  },
  {
    id: 'poly-supporters-east',
    locationId: 'stand-supporters-east',
    label: 'SUPPORTERS STAND',
    subLabel: 'East Popular Stand',
    kind: 'supporters',
    polygon: [
      [590, 175],
      [648, 185],
      [662, 260],
      [648, 335],
      [590, 345],
    ],
    labelPos: [624, 260],
  },
  {
    id: 'poly-arena',
    locationId: 'stand-main-arena',
    label: 'MAIN CONGRESS ARENA',
    subLabel: 'Podium & Ballot Booths',
    kind: 'arena',
    polygon: [
      [426, 192],
      [574, 192],
      [574, 328],
      [426, 328],
    ],
    labelPos: [500, 260],
  },
];

// Barricaded perimeter fence around the Cape Coast Stadium compound
export const BARRICADE_PERIMETER: [number, number][] = [
  [308, 150],
  [380, 96],
  [500, 82],
  [620, 96],
  [692, 150],
  [712, 260],
  [692, 370],
  [620, 424],
  [500, 438],
  [380, 424],
  [308, 370],
  [288, 260],
];

export const STADIUM_LOCATIONS: StadiumLocation[] = [
  // Police Checkpoints on Approach Roads
  {
    id: 'cp-pedu',
    code: 'POL-01',
    name: 'Pedu Junction Police Checkpoint',
    shortLabel: 'Pedu\nRd',
    category: 'checkpoint',
    categoryLabel: 'Police Search Post',
    zoneSector: 'North Approach · Stadium Access Rd',
    x: 498,
    y: 42,
    personnelCount: 16,
    screenedCount: 642,
    capacityOrLimit: 'Full Vehicle & Bag Search',
    commander: 'DSP K. Mensah-Bonsu',
    searchProtocol: 'Accreditation check + boot & body scan',
  },
  {
    id: 'cp-n1-west',
    code: 'POL-02',
    name: 'N1 Takoradi–Cape Coast Barrier',
    shortLabel: 'N1\nWest',
    category: 'checkpoint',
    categoryLabel: 'Police Search Post',
    zoneSector: 'West Approach · N1 Highway',
    x: 132,
    y: 162,
    personnelCount: 14,
    screenedCount: 518,
    capacityOrLimit: 'Convoy & Bus Screening',
    commander: 'ASP F. Quansah',
    searchProtocol: 'Metal detector wand + delegate pass check',
  },
  {
    id: 'cp-abura',
    code: 'POL-03',
    name: 'Abura Outer Search Post',
    shortLabel: 'Abura\nPost',
    category: 'checkpoint',
    categoryLabel: 'Police Search Post',
    zoneSector: 'North-East · Jukwa Rd Link',
    x: 808,
    y: 92,
    personnelCount: 12,
    screenedCount: 389,
    capacityOrLimit: 'Stop & Search Barrier',
    commander: 'Insp. M. Sackey',
    searchProtocol: 'Vehicle trunk inspection & prohibited item check',
  },
  {
    id: 'cp-ucc',
    code: 'POL-04',
    name: 'UCC Apewosika Screening Gate',
    shortLabel: 'UCC\nLink',
    category: 'checkpoint',
    categoryLabel: 'Police Search Post',
    zoneSector: 'South-West · UCC Link Rd',
    x: 164,
    y: 388,
    personnelCount: 12,
    screenedCount: 412,
    capacityOrLimit: 'Pedestrian & Shuttle Search',
    commander: 'Insp. R. Odoom',
    searchProtocol: 'Bag search & wristband verification',
  },
  {
    id: 'cp-kotokuraba',
    code: 'POL-05',
    name: 'Kotokuraba Approach Barrier',
    shortLabel: 'Kotoku-\nraba',
    category: 'checkpoint',
    categoryLabel: 'Police Search Post',
    zoneSector: 'East · Robert Mensah Link',
    x: 862,
    y: 320,
    personnelCount: 14,
    screenedCount: 495,
    capacityOrLimit: 'Supporters Bus Screening',
    commander: 'ASP E. Nyarko',
    searchProtocol: 'Crowd channeling & contraband search',
  },
  {
    id: 'cp-lagoon',
    code: 'POL-06',
    name: 'Lagoon View South Roadblock',
    shortLabel: 'Lagoon\nSouth',
    category: 'checkpoint',
    categoryLabel: 'Police Search Post',
    zoneSector: 'South · Cape Coast Bypass',
    x: 525,
    y: 486,
    personnelCount: 10,
    screenedCount: 274,
    capacityOrLimit: 'Restricted Access Corridor',
    commander: 'Sgt. H. Baidoo',
    searchProtocol: 'Emergency & official vehicle clearance',
  },

  // Barricaded Entry Gates
  {
    id: 'gate-a-vip',
    code: 'GATE-A',
    name: 'Gate A · Barricaded VIP & Party Leaders Entry',
    shortLabel: 'Gate A\nVIP',
    category: 'gate',
    categoryLabel: 'Barricaded Entry',
    zoneSector: 'West Barricade Perimeter',
    x: 292,
    y: 260,
    personnelCount: 12,
    screenedCount: 186,
    capacityOrLimit: 'Steel Barricade + Scanner Arch',
    commander: 'Supt. A. Arthur',
    searchProtocol: 'VIP tag verification + walkthrough scanner',
  },
  {
    id: 'gate-b-delegates',
    code: 'GATE-B',
    name: 'Gate B · Barricaded Delegates Accreditation',
    shortLabel: 'Gate B\nDel.',
    category: 'gate',
    categoryLabel: 'Barricaded Entry',
    zoneSector: 'North-West Barricade',
    x: 380,
    y: 96,
    personnelCount: 14,
    screenedCount: 940,
    capacityOrLimit: '4 Biometric Screening Lanes',
    commander: 'ASP G. Essien',
    searchProtocol: 'QR accreditation + full pat-down search',
  },
  {
    id: 'gate-c-supporters',
    code: 'GATE-C',
    name: 'Gate C · Barricaded Supporters Entry',
    shortLabel: 'Gate C\nSupp.',
    category: 'gate',
    categoryLabel: 'Barricaded Entry',
    zoneSector: 'East Barricade Perimeter',
    x: 708,
    y: 260,
    personnelCount: 14,
    screenedCount: 1420,
    capacityOrLimit: 'Double Steel Chute',
    commander: 'Insp. D. Koomson',
    searchProtocol: 'Supporter bag & bottle ban enforcement',
  },
  {
    id: 'gate-d-youth-women',
    code: 'GATE-D',
    name: "Gate D · Youth & Women's Wing Screening Gate",
    shortLabel: 'Gate D\nWing',
    category: 'gate',
    categoryLabel: 'Barricaded Entry',
    zoneSector: 'North-East Barricade',
    x: 620,
    y: 96,
    personnelCount: 10,
    screenedCount: 685,
    capacityOrLimit: '2 Dedicated Wing Lanes',
    commander: 'C/Insp. P. Forson',
    searchProtocol: 'Delegate badge scan + handheld metal check',
  },
  {
    id: 'gate-e-emergency',
    code: 'GATE-E',
    name: 'Gate E · Media, Observers & Emergency Barricade',
    shortLabel: 'Gate E\nMedia',
    category: 'gate',
    categoryLabel: 'Barricaded Entry',
    zoneSector: 'South Barricade Perimeter',
    x: 500,
    y: 438,
    personnelCount: 8,
    screenedCount: 215,
    capacityOrLimit: 'Press & Ambulance Corridor',
    commander: 'Sgt. Y. Tawiah',
    searchProtocol: 'Press kit inspection & clear ambulance lane',
  },

  // Stadium Stands & Main Congress Arena
  {
    id: 'stand-vip-west',
    code: 'STD-VIP',
    name: 'West Covered Stand · Party Leaders & NEC',
    shortLabel: 'VIP\nStand',
    category: 'stand',
    categoryLabel: 'Delegates Stand',
    zoneSector: 'Stadium West Wing',
    x: 376,
    y: 260,
    personnelCount: 10,
    screenedCount: 186,
    capacityOrLimit: '186 / 250 Leaders Seated',
    commander: 'Supt. A. Arthur',
    searchProtocol: 'Inner cordon · VIP & NEC only',
  },
  {
    id: 'stand-delegates-nw',
    code: 'STD-DEL',
    name: 'North-West Stand · National & Regional Delegates',
    shortLabel: 'Del.\nNW',
    category: 'stand',
    categoryLabel: 'Delegates Stand',
    zoneSector: 'Stadium North-West Sector',
    x: 435,
    y: 152,
    personnelCount: 8,
    screenedCount: 860,
    capacityOrLimit: '860 / 1,100 Delegates',
    commander: 'Insp. B. Paintsil',
    searchProtocol: 'Accredited delegate seating only',
  },
  {
    id: 'stand-women-north',
    code: 'STD-WMN',
    name: "North Terrace · Women's Wing Delegates",
    shortLabel: "Women's\nStand",
    category: 'stand',
    categoryLabel: 'Delegates Stand',
    zoneSector: 'Stadium North Sector',
    x: 562,
    y: 152,
    personnelCount: 6,
    screenedCount: 520,
    capacityOrLimit: '520 / 700 Delegates',
    commander: 'Sgt. M. Abban',
    searchProtocol: 'Ballot queue marshaling active',
  },
  {
    id: 'stand-youth-sw',
    code: 'STD-YTH',
    name: 'South-West Stand · Youth Wing Delegates',
    shortLabel: 'Youth\nStand',
    category: 'stand',
    categoryLabel: 'Delegates Stand',
    zoneSector: 'Stadium South-West Sector',
    x: 435,
    y: 368,
    personnelCount: 8,
    screenedCount: 640,
    capacityOrLimit: '640 / 800 Delegates',
    commander: 'Insp. T. Eshun',
    searchProtocol: 'Youth organizer voting queue marshaled',
  },
  {
    id: 'stand-supporters-east',
    code: 'STD-SUP',
    name: 'East Popular Stand · General Supporters',
    shortLabel: 'Support.\nEast',
    category: 'stand',
    categoryLabel: 'Supporters Stand',
    zoneSector: 'Stadium East Wing',
    x: 624,
    y: 260,
    personnelCount: 12,
    screenedCount: 2450,
    capacityOrLimit: '2,450 / 4,000 Supporters',
    commander: 'ASP C. Amoah',
    searchProtocol: 'Standing crowd stewards + inner barrier',
  },
  {
    id: 'stand-supporters-se',
    code: 'STD-OVF',
    name: 'South-East Terrace · Supporters Overflow',
    shortLabel: 'Support.\nSE',
    category: 'stand',
    categoryLabel: 'Supporters Stand',
    zoneSector: 'Stadium South-East Sector',
    x: 562,
    y: 368,
    personnelCount: 6,
    screenedCount: 910,
    capacityOrLimit: '910 / 1,500 Supporters',
    commander: 'Sgt. K. Owusu',
    searchProtocol: 'Separated from delegate ballot corridor',
  },
  {
    id: 'stand-main-arena',
    code: 'ARENA-1',
    name: 'Central Pitch · Congress Podium & Ballot Booths',
    shortLabel: 'Main\nArena',
    category: 'stand',
    categoryLabel: 'Congress Arena',
    zoneSector: 'Stadium Center Pitch',
    x: 500,
    y: 260,
    personnelCount: 14,
    screenedCount: 310,
    capacityOrLimit: '12 Ballot Booths Active',
    commander: 'EC Chief Returning Officer',
    searchProtocol: 'Strict ballot box & podium perimeter',
  },
];

export const INITIAL_ACTIVITY_STAGES: ActivityStage[] = [
  {
    id: 'stage-1',
    stageLabel: 'STAGE 01 · SCREENING',
    message:
      'Police checkpoints manned on all Cape Coast approach roads — mandatory vehicle and bag searches ongoing at Pedu, N1 West, Abura & UCC barriers.',
    active: true,
  },
  {
    id: 'stage-2',
    stageLabel: 'STAGE 02 · CONGRESS',
    message:
      'Party leaders currently in Congress inside the West Covered VIP Pavilion; regional chairmen briefings underway.',
    active: true,
  },
  {
    id: 'stage-3',
    stageLabel: 'STAGE 03 · VOTING',
    message:
      "Voting for Youth and Women's National Organizers is ongoing at Central Pitch Ballot Booths 1–12.",
    active: true,
  },
  {
    id: 'stage-4',
    stageLabel: 'STAGE 04 · CROWD CONTROL',
    message:
      'Barricaded Gates A–E operating at steady throughput; Supporters seated in East Popular Stand separated from Delegate accreditation lanes.',
    active: true,
  },
];

export const INITIAL_STADIUM_INCIDENTS: VenueIncident[] = [
  {
    id: 'st-inc-1',
    title: 'Prohibited flare confiscated during vehicle search',
    locationId: 'cp-pedu',
    locationName: 'Pedu Junction Police Checkpoint',
    categoryLabel: 'Police Search Post',
    severity: 'Medium',
    suspectsCount: 1,
    timestamp: '10:42 GMT',
    notes: 'Occupant detained at Pedu screening bay for questioning; traffic moving normally.',
    resolved: false,
  },
  {
    id: 'st-inc-2',
    title: 'Queue surge at biometric accreditation chute',
    locationId: 'gate-b-delegates',
    locationName: 'Gate B · Barricaded Delegates Accreditation',
    categoryLabel: 'Barricaded Entry',
    severity: 'Low',
    suspectsCount: 0,
    timestamp: '11:08 GMT',
    notes: 'Additional 4 officers deployed to reinforce outer steel barricade.',
    resolved: false,
  },
];

export const CAPE_COAST_ROAD_LABELS = [
  { name: 'Stadium Access Rd (Pedu)', x: 530, y: 26, rotate: 0 },
  { name: 'Cape Coast–Takoradi Hwy (N1)', x: 175, y: 142, rotate: 22 },
  { name: 'Jukwa / Abura Rd', x: 790, y: 66, rotate: -26 },
  { name: 'UCC / Apewosika Link', x: 188, y: 422, rotate: -34 },
  { name: 'Kotokuraba–Robert Mensah Rd', x: 830, y: 356, rotate: 24 },
  { name: 'Cape Coast Bypass', x: 582, y: 498, rotate: -3 },
];
