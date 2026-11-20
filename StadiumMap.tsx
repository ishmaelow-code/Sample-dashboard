import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ChevronUp,
  ChevronDown,
  Home,
  Layers,
  Plus,
  Minus,
  LocateFixed,
  X,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import {
  BARRICADE_PERIMETER,
  CAPE_COAST_ROAD_LABELS,
  STADIUM_LOCATIONS,
  STADIUM_STAND_POLYGONS,
  StadiumLocation,
  VenueIncident,
} from '../data/capeCoastStadiumData';

export interface StadiumLayerState {
  roadCheckpoints: boolean;
  barricadeGates: boolean;
  stadiumStands: boolean;
  zoneLabels: boolean;
  blinkingIncidents: boolean;
}

interface StadiumMapProps {
  locations: StadiumLocation[];
  selectedLocation: StadiumLocation | null;
  onSelectLocation: (location: StadiumLocation | null) => void;
  incidents: VenueIncident[];
  onReportIncidentAtLocation: (location: StadiumLocation) => void;
  layers: StadiumLayerState;
  onToggleLayer: (key: keyof StadiumLayerState) => void;
  onFocusSearch: () => void;
}

const VIEWBOX_W = 1000;
const VIEWBOX_H = 520;

export function StadiumMap({
  locations,
  selectedLocation,
  onSelectLocation,
  incidents,
  onReportIncidentAtLocation,
  layers,
  onToggleLayer,
  onFocusSearch,
}: StadiumMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1.04);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<StadiumLocation | null>(null);
  const [toolbarExpanded, setToolbarExpanded] = useState(true);
  const [layersOpen, setLayersOpen] = useState(false);

  const visibleIds = new Set(locations.map((l) => l.id));

  const activeIncidentsByLocation = incidents.reduce<Record<string, VenueIncident[]>>(
    (acc, inc) => {
      if (!inc.resolved) {
        acc[inc.locationId] = acc[inc.locationId] ?? [];
        acc[inc.locationId].push(inc);
      }
      return acc;
    },
    {}
  );

  const resetExtent = useCallback(() => {
    setZoom(1.04);
    setPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (!selectedLocation) return;
    const targetZoom = Math.max(zoom, 1.48);
    const dx = (VIEWBOX_W / 2 - selectedLocation.x) * targetZoom * 0.55;
    const dy = (VIEWBOX_H / 2 - selectedLocation.y) * targetZoom * 0.55;
    setZoom(targetZoom);
    setPan({
      x: Math.max(-340, Math.min(340, dx)),
      y: Math.max(-220, Math.min(220, dy)),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation?.id]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.16 : -0.16;
    setZoom((prev) => Math.max(0.9, Math.min(3.8, Number((prev + delta).toFixed(2)))));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: Math.max(-420, Math.min(420, dragStartRef.current.panX + dx)),
      y: Math.max(-280, Math.min(280, dragStartRef.current.panY + dy)),
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  const pointsToString = (pts: [number, number][]) =>
    pts.map(([x, y]) => `${x},${y}`).join(' ');

  const checkpoints = STADIUM_LOCATIONS.filter((l) => l.category === 'checkpoint');
  const gates = STADIUM_LOCATIONS.filter((l) => l.category === 'gate');

  const selectedLocationIncidents = selectedLocation
    ? activeIncidentsByLocation[selectedLocation.id] ?? []
    : [];

  return (
    <section
      ref={containerRef}
      aria-label="Cape Coast Sports Stadium Security & Operations Map"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`relative w-full h-full bg-[#061824] border border-[#0E344D] overflow-hidden select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full block"
      >
        <defs>
          <pattern id="stadiumGrid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#0B2739" strokeWidth="0.65" />
            <path
              d="M 22 0 L 22 44 M 0 22 L 44 22"
              fill="none"
              stroke="#09202F"
              strokeWidth="0.4"
            />
          </pattern>

          <filter id="barricadeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect width={VIEWBOX_W} height={VIEWBOX_H} fill="#061824" />

        <g
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) translate(${VIEWBOX_W / 2}px, ${VIEWBOX_H / 2}px) scale(${zoom}) translate(${-VIEWBOX_W / 2}px, ${-VIEWBOX_H / 2}px)`,
            transition: isDragging ? 'none' : 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Base Urban Grid + Coastal/Lagoon Context */}
          <rect x="-250" y="-150" width="1500" height="820" fill="url(#stadiumGrid)" />

          {/* Cape Coast Lagoon water silhouette to the south-west/south */}
          <path
            d="M -60 470 Q 120 445 250 495 T 490 520 L -60 540 Z"
            fill="#042235"
            opacity="0.7"
          />

          {/* Secondary Cape Coast Road Network */}
          <g stroke="#0D354C" strokeWidth="1.2" fill="none" opacity="0.85">
            <path d="M 40 90 L 220 130 L 340 80 L 498 42" />
            <path d="M 740 40 L 808 92 L 920 150" />
            <path d="M 70 290 L 210 260 L 288 260" />
            <path d="M 712 260 L 840 250 L 960 220" />
            <path d="M 240 420 L 360 460 L 525 486" />
            <path d="M 680 410 L 820 445 L 950 475" />
          </g>

          {/* Major Approach Roads Manned by Police */}
          <g stroke="#145A7A" strokeWidth="4" strokeLinecap="round" fill="none">
            {/* North Pedu Stadium Access Rd */}
            <path d="M 498 -10 L 498 82" />
            {/* West N1 Cape Coast - Takoradi Hwy */}
            <path d="M -20 100 L 132 162 L 308 150" />
            {/* North-East Jukwa / Abura Rd */}
            <path d="M 940 30 L 808 92 L 692 150" />
            {/* South-West UCC / Apewosika Link */}
            <path d="M 20 475 L 164 388 L 308 370" />
            {/* East Kotokuraba - Robert Mensah Rd */}
            <path d="M 980 370 L 862 320 L 712 260" />
            {/* South Cape Coast Bypass */}
            <path d="M 380 424 L 525 486 L 780 515" />
            {/* Outer Stadium Ring Road */}
            <ellipse
              cx="500"
              cy="260"
              rx="234"
              ry="194"
              stroke="#124A66"
              strokeWidth="2.8"
            />
          </g>

          {/* Arterial Centerlines */}
          <g stroke="#2184AA" strokeWidth="1" fill="none" opacity="0.65">
            <path d="M 498 -10 L 498 82" />
            <path d="M -20 100 L 132 162 L 308 150" />
            <path d="M 940 30 L 808 92 L 692 150" />
            <path d="M 20 475 L 164 388 L 308 370" />
            <path d="M 980 370 L 862 320 L 712 260" />
            <path d="M 380 424 L 525 486 L 780 515" />
          </g>

          {/* Road & Neighborhood Labels */}
          {layers.zoneLabels && (
            <g fill="#5B95B2" fontSize="9.5" fontWeight="500">
              {CAPE_COAST_ROAD_LABELS.map((r) => (
                <text
                  key={r.name}
                  x={r.x}
                  y={r.y}
                  textAnchor="middle"
                  transform={`rotate(${r.rotate} ${r.x} ${r.y})`}
                >
                  {r.name}
                </text>
              ))}
              <text x="115" y="75" fill="#6DA6C2" fontSize="11">Pedu / N1 Corridor</text>
              <text x="860" y="55" fill="#6DA6C2" fontSize="11">Abura</text>
              <text x="108" y="452" fill="#6DA6C2" fontSize="11">UCC / Apewosika</text>
              <text x="885" y="410" fill="#6DA6C2" fontSize="11">Kotokuraba</text>
            </g>
          )}

          {/* Barricaded Stadium Security Perimeter */}
          {layers.barricadeGates && (
            <g>
              <polygon
                points={pointsToString(BARRICADE_PERIMETER)}
                fill="rgba(22, 42, 68, 0.35)"
                stroke="#B266FF"
                strokeWidth="2.4"
                strokeDasharray="8 4"
                filter="url(#barricadeGlow)"
              />
              {/* Secondary inner steel barricade ring */}
              <polygon
                points={pointsToString(BARRICADE_PERIMETER)}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="1"
                strokeDasharray="2 6"
              />
            </g>
          )}

          {/* Stadium Outer Bowl Shell */}
          <ellipse
            cx="500"
            cy="260"
            rx="172"
            ry="142"
            fill="#072235"
            stroke="#1B5577"
            strokeWidth="2"
          />

          {/* Stadium Stands & Main Congress Arena */}
          {layers.stadiumStands && (
            <g>
              {STADIUM_STAND_POLYGONS.map((stand) => {
                const loc = STADIUM_LOCATIONS.find((l) => l.id === stand.locationId);
                const isSelected = selectedLocation?.id === stand.locationId;
                const isDimmed = locations.length < STADIUM_LOCATIONS.length && !visibleIds.has(stand.locationId);

                const fillMap = {
                  vip: isSelected ? 'rgba(245, 166, 35, 0.35)' : 'rgba(234, 179, 43, 0.18)',
                  delegates: isSelected ? 'rgba(78, 198, 176, 0.32)' : 'rgba(56, 189, 248, 0.14)',
                  supporters: isSelected ? 'rgba(139, 92, 246, 0.32)' : 'rgba(99, 102, 241, 0.15)',
                  arena: isSelected ? 'rgba(78, 198, 176, 0.28)' : 'rgba(16, 185, 129, 0.12)',
                };

                const strokeMap = {
                  vip: '#F5A623',
                  delegates: '#38BDF8',
                  supporters: '#A78BFA',
                  arena: '#4EC6B0',
                };

                return (
                  <g
                    key={stand.id}
                    opacity={isDimmed ? 0.35 : 1}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (loc) onSelectLocation(loc);
                    }}
                    onMouseEnter={() => loc && setHoveredLocation(loc)}
                    onMouseLeave={() => setHoveredLocation(null)}
                    className="cursor-pointer"
                  >
                    <polygon
                      points={pointsToString(stand.polygon)}
                      fill={fillMap[stand.kind]}
                      stroke={isSelected ? '#FFFFFF' : strokeMap[stand.kind]}
                      strokeWidth={isSelected ? 2 : 1.25}
                      strokeLinejoin="round"
                    />
                  </g>
                );
              })}

              {/* Running Track & Ballot Booths Grid inside Main Congress Arena */}
              <rect
                x="420"
                y="186"
                width="160"
                height="148"
                rx="24"
                fill="none"
                stroke="#1E6C8C"
                strokeWidth="1.2"
                strokeDasharray="4 3"
                pointerEvents="none"
              />
              {/* Podium */}
              <rect
                x="434"
                y="236"
                width="20"
                height="48"
                rx="2"
                fill="#EAB32B"
                opacity="0.7"
                pointerEvents="none"
              />
              {/* Ballot Booths */}
              <g fill="#4EC6B0" opacity="0.65" pointerEvents="none">
                {[0, 1, 2, 3, 4, 5].map((row) => (
                  <g key={row}>
                    <rect x="526" y={208 + row * 18} width="12" height="10" rx="1.5" />
                    <rect x="546" y={208 + row * 18} width="12" height="10" rx="1.5" />
                  </g>
                ))}
              </g>

              {/* Stand Labels */}
              {layers.zoneLabels &&
                STADIUM_STAND_POLYGONS.map((stand) => (
                  <g key={`lbl-${stand.id}`} pointerEvents="none">
                    <text
                      x={stand.labelPos[0]}
                      y={stand.labelPos[1] - 2}
                      textAnchor="middle"
                      fill="#04121C"
                      stroke="#04121C"
                      strokeWidth="2.5"
                      fontSize="7.6"
                      fontWeight="700"
                    >
                      {stand.label}
                    </text>
                    <text
                      x={stand.labelPos[0]}
                      y={stand.labelPos[1] - 2}
                      textAnchor="middle"
                      fill="#E5F1F8"
                      fontSize="7.6"
                      fontWeight="700"
                    >
                      {stand.label}
                    </text>
                    <text
                      x={stand.labelPos[0]}
                      y={stand.labelPos[1] + 8}
                      textAnchor="middle"
                      fill="#9CC2D6"
                      fontSize="6.5"
                    >
                      {stand.subLabel}
                    </text>
                  </g>
                ))}
            </g>
          )}

          {/* Barricaded Entry Gate Markers */}
          {layers.barricadeGates &&
            gates.map((gate) => {
              if (!visibleIds.has(gate.id)) return null;
              const isSelected = selectedLocation?.id === gate.id;

              return (
                <g
                  key={gate.id}
                  transform={`translate(${gate.x}, ${gate.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLocation(gate);
                  }}
                  onMouseEnter={() => setHoveredLocation(gate)}
                  onMouseLeave={() => setHoveredLocation(null)}
                  className="cursor-pointer"
                >
                  <circle r="13" fill="transparent" />
                  {isSelected && (
                    <circle
                      r="12"
                      fill="rgba(245, 166, 35, 0.25)"
                      stroke="#F5A623"
                      strokeWidth="1.5"
                    />
                  )}
                  {/* Barricade Gate Block */}
                  <rect
                    x="-8"
                    y="-5"
                    width="16"
                    height="10"
                    rx="2"
                    fill="#F59E0B"
                    stroke="#04121C"
                    strokeWidth="1.2"
                  />
                  {/* Barricade Stripes */}
                  <path d="M -5 -5 L -2 5 M 1 -5 L 4 5" stroke="#04121C" strokeWidth="1.4" />
                  {layers.zoneLabels && (
                    <text
                      y="-9"
                      textAnchor="middle"
                      fill="#FCD34D"
                      fontSize="7.5"
                      fontWeight="700"
                    >
                      {gate.code}
                    </text>
                  )}
                </g>
              );
            })}

          {/* Police Road Checkpoints & Search Posts */}
          {layers.roadCheckpoints &&
            checkpoints.map((cp) => {
              if (!visibleIds.has(cp.id)) return null;
              const isSelected = selectedLocation?.id === cp.id;

              return (
                <g
                  key={cp.id}
                  transform={`translate(${cp.x}, ${cp.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLocation(cp);
                  }}
                  onMouseEnter={() => setHoveredLocation(cp)}
                  onMouseLeave={() => setHoveredLocation(null)}
                  className="cursor-pointer"
                >
                  <circle r="15" fill="transparent" />
                  {/* Search zone perimeter */}
                  <circle
                    r="13"
                    fill="rgba(56, 189, 248, 0.10)"
                    stroke="#38BDF8"
                    strokeWidth="0.9"
                    strokeDasharray="2 2"
                  />
                  {isSelected && (
                    <circle
                      r="15"
                      fill="rgba(78, 198, 176, 0.2)"
                      stroke="#4EC6B0"
                      strokeWidth="1.6"
                    />
                  )}
                  {/* Police Shield Polygon */}
                  <path
                    d="M 0 -8 L 7 -4 L 6 4 L 0 8 L -6 4 L -7 -4 Z"
                    fill="#0EA5E9"
                    stroke="#03121C"
                    strokeWidth="1.3"
                  />
                  <circle r="2.2" fill="#FFFFFF" />
                  {layers.zoneLabels && (
                    <text
                      y="17"
                      textAnchor="middle"
                      fill="#7DD3FC"
                      fontSize="7.5"
                      fontWeight="700"
                    >
                      {cp.code}
                    </text>
                  )}
                </g>
              );
            })}

          {/* Blinking Incident Alert Icons at Incident Locations */}
          {layers.blinkingIncidents &&
            STADIUM_LOCATIONS.map((loc) => {
              const locIncidents = activeIncidentsByLocation[loc.id];
              if (!locIncidents || locIncidents.length === 0) return null;

              return (
                <g
                  key={`inc-marker-${loc.id}`}
                  transform={`translate(${loc.x}, ${loc.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectLocation(loc);
                  }}
                  className="cursor-pointer"
                >
                  {/* Expanding beacon pulse ring */}
                  <circle
                    r="12"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2"
                    className="animate-incident-ring"
                  />
                  {/* Blinking crimson alert triangle */}
                  <g className="animate-incident-blink">
                    <path
                      d="M 0 -13 L 12 9 L -12 9 Z"
                      fill="#EF4444"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                      strokeLinejoin="round"
                    />
                    <rect x="-1.1" y="-6" width="2.2" height="7.5" rx="1" fill="#FFFFFF" />
                    <circle cx="0" cy="4.8" r="1.4" fill="#FFFFFF" />
                  </g>
                </g>
              );
            })}
        </g>
      </svg>

      {/* Top-Left Map Symbology Legend (Clean Inline Strip) */}
      <div className="pointer-events-none absolute top-3 left-3 z-10 bg-[#041826]/90 border border-[#12405D] px-3 py-1.5 rounded flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11px] text-[#C5D9E6]">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rotate-45 bg-[#0EA5E9] inline-block border border-[#03121C]" />
          Police Search Post
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-2 bg-[#F59E0B] inline-block rounded-[1px]" />
          Barricaded Gate
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]/60 border border-[#38BDF8] inline-block" />
          Stands
        </span>
        <span className="inline-flex items-center gap-1.5 text-[#FCA5A5]">
          <span className="w-2.5 h-2.5 bg-[#EF4444] rounded-full inline-block" />
          Blinking Incident
        </span>
      </div>

      {/* Hover Tooltip */}
      {hoveredLocation && hoveredLocation.id !== selectedLocation?.id && (
        <div className="pointer-events-none absolute top-12 left-3 z-20 bg-[#041927]/95 border border-[#1B4B6B] px-3 py-2 rounded shadow-lg max-w-xs">
          <div className="text-[11px] font-semibold text-[#F5A623]">
            {hoveredLocation.categoryLabel} · {hoveredLocation.code}
          </div>
          <div className="text-xs text-white font-medium mt-0.5">
            {hoveredLocation.name}
          </div>
          <div className="text-[11px] text-[#8EB0C7] font-mono-tabular mt-0.5">
            {hoveredLocation.personnelCount} officers · {hoveredLocation.screenedCount.toLocaleString()} screened
          </div>
        </div>
      )}

      {/* Selected Location Inspector Card */}
      {selectedLocation && (
        <div className="absolute bottom-3 left-3 z-20 w-[335px] max-w-[calc(100%-24px)] bg-[#051E30]/96 border border-[#1E587D] rounded shadow-2xl p-3.5 text-left">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#F5A623] truncate">
                {selectedLocation.categoryLabel} · {selectedLocation.code}
              </div>
              <h3 className="text-sm font-semibold text-white leading-snug mt-0.5">
                {selectedLocation.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onSelectLocation(null)}
              aria-label="Close location details"
              className="p-1 text-[#89ACC2] hover:text-white hover:bg-[#0D334D] rounded cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-[#103852] grid grid-cols-2 gap-y-2 gap-x-3 text-xs">
            <div>
              <span className="text-[#7EA2B8] block">Personnel Deployed</span>
              <span className="font-mono-tabular text-[#E6F1F8] font-medium">
                {selectedLocation.personnelCount} Officers
              </span>
            </div>
            <div>
              <span className="text-[#7EA2B8] block">Persons / Vehicles Screened</span>
              <span className="font-mono-tabular text-[#4EC6B0] font-medium">
                {selectedLocation.screenedCount.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[#7EA2B8] block">Commander</span>
              <span className="text-[#E6F1F8] font-medium truncate block">
                {selectedLocation.commander}
              </span>
            </div>
            <div>
              <span className="text-[#7EA2B8] block">Deployment Setup</span>
              <span className="text-[#E6F1F8] font-medium truncate block">
                {selectedLocation.capacityOrLimit}
              </span>
            </div>
          </div>

          <div className="mt-2 text-xs text-[#9BBCD0] flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4EC6B0] shrink-0" aria-hidden="true" />
            <span className="truncate">{selectedLocation.searchProtocol}</span>
          </div>

          {selectedLocationIncidents.length > 0 && (
            <div className="mt-2.5 p-2 rounded bg-[#3B1219]/80 border border-[#7F1D1D] text-xs space-y-1">
              <div className="font-semibold text-[#FCA5A5]">
                Active Blinking Alert ({selectedLocationIncidents.length})
              </div>
              {selectedLocationIncidents.map((inc) => (
                <div key={inc.id} className="text-[#FEE2E2]">
                  {inc.title} · {inc.timestamp}
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 pt-2.5 border-t border-[#103852] flex items-center justify-between gap-2">
            <span className="text-[11px] text-[#7B9DB3] truncate">
              {selectedLocation.zoneSector}
            </span>
            <button
              type="button"
              onClick={() => onReportIncidentAtLocation(selectedLocation)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#FCA5A5] bg-[#3B1219] hover:bg-[#521822] border border-[#7F1D1D] rounded transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Log Incident</span>
            </button>
          </div>
        </div>
      )}

      {/* Top-Right GIS Toolbar */}
      <div className="absolute top-3 right-3 z-20 flex flex-col bg-[#061C2B]/95 border border-[#144361] rounded shadow-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setToolbarExpanded((v) => !v)}
          title={toolbarExpanded ? 'Collapse map tools' : 'Expand map tools'}
          aria-label={toolbarExpanded ? 'Collapse map tools' : 'Expand map tools'}
          className="w-8 h-8 flex items-center justify-center text-[#B8D1E0] hover:text-white hover:bg-[#0C3149] transition-colors cursor-pointer"
        >
          {toolbarExpanded ? (
            <ChevronUp className="w-4 h-4" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          )}
        </button>

        {toolbarExpanded && (
          <div className="flex flex-col border-t border-[#144361] divide-y divide-[#10364F]">
            <button
              type="button"
              onClick={onFocusSearch}
              title="Search checkpoints, gates & stands"
              aria-label="Focus zone search"
              className="w-8 h-8 flex items-center justify-center text-[#B8D1E0] hover:text-white hover:bg-[#0C3149] transition-colors cursor-pointer"
            >
              <LocateFixed className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={resetExtent}
              title="Reset stadium map extent"
              aria-label="Reset stadium map extent"
              className="w-8 h-8 flex items-center justify-center text-[#B8D1E0] hover:text-white hover:bg-[#0C3149] transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setLayersOpen((v) => !v)}
              title="Toggle stadium map layers"
              aria-label="Toggle stadium map layers"
              aria-expanded={layersOpen}
              className={`w-8 h-8 flex items-center justify-center transition-colors cursor-pointer ${
                layersOpen
                  ? 'bg-[#124566] text-[#4EC6B0]'
                  : 'text-[#B8D1E0] hover:text-white hover:bg-[#0C3149]'
              }`}
            >
              <Layers className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Layers Popover */}
      {layersOpen && (
        <div className="absolute top-3 right-13 z-20 w-56 bg-[#051D2E]/96 border border-[#1B4F70] rounded shadow-xl p-3">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#113A54]">
            <span className="text-xs font-semibold text-[#E2EFF7]">Venue Layers</span>
            <button
              type="button"
              onClick={() => setLayersOpen(false)}
              aria-label="Close layers panel"
              className="text-[#87A8BD] hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>
          <div className="space-y-1.5 text-xs">
            {(
              [
                ['roadCheckpoints', 'Police Road Checkpoints'],
                ['barricadeGates', 'Barricaded Perimeter & Gates'],
                ['stadiumStands', 'Delegates & Supporters Stands'],
                ['blinkingIncidents', 'Blinking Incident Icons'],
                ['zoneLabels', 'Zone & Road Labels'],
              ] as [keyof StadiumLayerState, string][]
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-2 py-1 text-[#CBE0ED] hover:text-white cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={layers[key]}
                  onChange={() => onToggleLayer(key)}
                  className="accent-[#4EC6B0] rounded cursor-pointer"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Bottom-Right Zoom Controls */}
      <div className="absolute bottom-7 right-3 z-20 flex flex-col bg-[#061C2B]/95 border border-[#144361] rounded shadow-lg overflow-hidden divide-y divide-[#10364F]">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(3.8, Number((z + 0.28).toFixed(2))))}
          aria-label="Zoom in"
          title="Zoom in"
          className="w-8 h-8 flex items-center justify-center text-[#B8D1E0] hover:text-white hover:bg-[#0C3149] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.9, Number((z - 0.28).toFixed(2))))}
          aria-label="Zoom out"
          title="Zoom out"
          className="w-8 h-8 flex items-center justify-center text-[#B8D1E0] hover:text-white hover:bg-[#0C3149] transition-colors cursor-pointer"
        >
          <Minus className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Bottom Venue Attribution Bar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-2.5 py-1 flex items-center justify-between text-[10px] text-[#7D9FB5] bg-gradient-to-t from-[#031019]/85 to-transparent">
        <span>Cape Coast Sports Stadium · Central Region Venue Operations</span>
        <span className="font-mono-tabular">Zoom {Math.round(zoom * 100)}%</span>
      </div>
    </section>
  );
}
