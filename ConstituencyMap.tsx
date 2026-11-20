import React, { useRef, useState, useEffect, useCallback } from 'react';
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
} from 'lucide-react';
import {
  CONSTITUENCY_BOUNDARY,
  ELECTORAL_AREAS,
  SURROUNDING_LABELS,
  CIRCLE_LABELS,
  PollingStation,
  IncidentReport,
} from '../data/constituencyData';

interface MapLayerState {
  roadNetwork: boolean;
  constituencyBoundary: boolean;
  electoralAreas: boolean;
  areaLabels: boolean;
  pollingStations: boolean;
}

interface ConstituencyMapProps {
  stations: PollingStation[];
  allStations: PollingStation[];
  selectedAreaId: string | null;
  onSelectArea: (areaId: string) => void;
  selectedStation: PollingStation | null;
  onSelectStation: (station: PollingStation | null) => void;
  incidents: IncidentReport[];
  onReportIncidentAtStation: (station: PollingStation) => void;
  layers: MapLayerState;
  onToggleLayer: (key: keyof MapLayerState) => void;
  onFocusSearch: () => void;
}

const VIEWBOX_W = 1000;
const VIEWBOX_H = 520;

export function ConstituencyMap({
  stations,
  allStations,
  selectedAreaId,
  onSelectArea,
  selectedStation,
  onSelectStation,
  incidents,
  onReportIncidentAtStation,
  layers,
  onToggleLayer,
  onFocusSearch,
}: ConstituencyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1.08);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const [hoveredAreaId, setHoveredAreaId] = useState<string | null>(null);
  const [hoveredStation, setHoveredStation] = useState<PollingStation | null>(null);
  const [toolbarExpanded, setToolbarExpanded] = useState(true);
  const [layersOpen, setLayersOpen] = useState(false);

  const incidentStationIds = new Set(
    incidents.filter((inc) => !inc.resolved).map((inc) => inc.stationId)
  );

  const resetExtent = useCallback(() => {
    setZoom(1.08);
    setPan({ x: 0, y: 0 });
  }, []);

  // Center map smoothly when a station is chosen from the sidebar
  useEffect(() => {
    if (!selectedStation) return;
    const targetZoom = Math.max(zoom, 1.85);
    const dx = (VIEWBOX_W / 2 - selectedStation.x) * targetZoom * 0.65;
    const dy = (VIEWBOX_H / 2 - selectedStation.y) * targetZoom * 0.65;
    setZoom(targetZoom);
    setPan({
      x: Math.max(-320, Math.min(320, dx)),
      y: Math.max(-220, Math.min(220, dy)),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStation?.id]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.18 : -0.18;
    setZoom((prev) => Math.max(0.95, Math.min(4.2, Number((prev + delta).toFixed(2)))));
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

  const visibleStationIds = new Set(stations.map((s) => s.id));

  return (
    <section
      ref={containerRef}
      aria-label="Ayawaso East Constituency GIS Map"
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`relative w-full h-full bg-[#061824] border border-[#0E344D] overflow-hidden select-none ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
    >
      {/* Interactive SVG Map Canvas */}
      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full block"
      >
        <defs>
          {/* Subtle Urban Grid Pattern */}
          <pattern id="urbanGrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="#0B2739"
              strokeWidth="0.7"
            />
            <path
              d="M 24 0 L 24 48 M 0 24 L 48 24"
              fill="none"
              stroke="#09202F"
              strokeWidth="0.45"
            />
          </pattern>

          <filter id="purpleGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base Marine-Dark Background */}
        <rect width={VIEWBOX_W} height={VIEWBOX_H} fill="#061824" />

        {/* Pan & Zoom Transform Group */}
        <g
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) translate(${VIEWBOX_W / 2}px, ${VIEWBOX_H / 2}px) scale(${zoom}) translate(${-VIEWBOX_W / 2}px, ${-VIEWBOX_H / 2}px)`,
            transition: isDragging ? 'none' : 'transform 180ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Subtle Urban Street Grid Layer */}
          {layers.roadNetwork && (
            <g>
              <rect x="-250" y="-150" width="1500" height="820" fill="url(#urbanGrid)" />

              {/* Secondary Accra Street Network */}
              <g stroke="#0D354C" strokeWidth="1.15" fill="none" opacity="0.88">
                <path d="M 110 80 L 240 160 L 320 260 L 350 470" />
                <path d="M 150 210 L 385 180 L 490 95 L 620 20" />
                <path d="M 180 340 L 390 295 L 545 275 L 770 305 L 940 340" />
                <path d="M 260 40 L 320 140 L 395 250 L 465 375 L 520 510" />
                <path d="M 430 15 L 490 110 L 560 220 L 645 360 L 720 510" />
                <path d="M 650 30 L 710 150 L 790 280 L 870 430" />
                <path d="M 140 430 L 310 410 L 470 390 L 660 365 L 890 385" />
                <path d="M 400 130 L 610 170 L 820 120" />
                <path d="M 550 25 L 515 170 L 455 320 L 410 475" />
                <path d="M 690 240 L 850 220 L 960 250" />
                <path d="M 160 120 L 310 95 L 440 50" />
                <path d="M 620 430 L 770 465 L 910 490" />
              </g>

              {/* Major Arterial Highways (Ring Road Central, Independence Ave, Achimota Rd, Giffard Rd) */}
              <g stroke="#145675" strokeWidth="3.2" strokeLinecap="round" fill="none">
                {/* Ring Road Central */}
                <path d="M 100 505 Q 230 480 370 468 T 575 445 T 890 485" />
                {/* Independence Avenue (37 / Afua Circle to Sankara Circle) */}
                <path d="M 745 20 L 680 145 L 615 290 L 575 445 L 510 530" />
                {/* Achimota / Nima Highway */}
                <path d="M 490 5 L 598 48 L 680 145" />
                {/* Giffard Road */}
                <path d="M 680 145 L 930 175" />
                {/* New Town Road / N6 */}
                <path d="M 355 15 L 365 160 L 330 295 L 235 488" />
                {/* Kanda Highway */}
                <path d="M 485 110 L 515 245 L 500 448" />
              </g>

              {/* Arterial Centerlines */}
              <g stroke="#1E7B9E" strokeWidth="0.9" fill="none" opacity="0.7">
                <path d="M 100 505 Q 230 480 370 468 T 575 445 T 890 485" />
                <path d="M 745 20 L 680 145 L 615 290 L 575 445 L 510 530" />
                <path d="M 680 145 L 930 175" />
                <path d="M 355 15 L 365 160 L 330 295 L 235 488" />
              </g>

              {/* Roundabouts (Afua Circle, Sankara Circle, Kwame Nkrumah Circle) */}
              <g fill="#082436" stroke="#1E7B9E" strokeWidth="1.8">
                <circle cx="680" cy="145" r="7" />
                <circle cx="575" cy="445" r="7" />
                <circle cx="235" cy="488" r="10" />
              </g>

              {/* Road Labels */}
              <g fill="#4F89A6" fontSize="9.5" fontFamily="Plus Jakarta Sans, sans-serif">
                <text x="295" y="484" transform="rotate(-7 295 484)">Ring Road Central</text>
                <text x="615" y="340" transform="rotate(-68 615 340)">Independence Avenue</text>
                <text x="805" y="160" transform="rotate(7 805 160)">Giffard Road</text>
                <text x="336" y="255" transform="rotate(-76 336 255)">New Town Road</text>
                <text x="615" y="55" transform="rotate(36 615 55)">Achimota Road</text>
              </g>

              {/* N6 Highway Shield */}
              <g transform="translate(216, 224)">
                <rect width="20" height="14" rx="2.5" fill="#136A8A" stroke="#45A2C4" strokeWidth="0.8" />
                <text
                  x="10"
                  y="10"
                  textAnchor="middle"
                  fill="#E4F2F8"
                  fontSize="8.5"
                  fontWeight="600"
                >
                  N6
                </text>
              </g>

              {/* Circle Labels */}
              {CIRCLE_LABELS.map((c) => (
                <text
                  key={c.name}
                  x={c.x}
                  y={c.y}
                  textAnchor="middle"
                  fill="#6CA3BE"
                  fontSize="9"
                  fontWeight="500"
                >
                  {c.name.split('\n').map((line, i) => (
                    <tspan key={i} x={c.x} dy={i === 0 ? 0 : 10}>
                      {line}
                    </tspan>
                  ))}
                </text>
              ))}

              {/* Surrounding Neighborhood Labels */}
              {SURROUNDING_LABELS.map((lbl) => (
                <text
                  key={lbl.name}
                  x={lbl.x}
                  y={lbl.y}
                  textAnchor="middle"
                  fill="#7BB4CE"
                  fontSize="12"
                  fontWeight="500"
                  opacity="0.85"
                >
                  <tspan x={lbl.x}>{lbl.name}</tspan>
                  {lbl.sub &&
                    lbl.sub.split('\n').map((line, idx) => (
                      <tspan key={idx} x={lbl.x} dy="13">
                        {line}
                      </tspan>
                    ))}
                </text>
              ))}
            </g>
          )}

          {/* Electoral Area Sub-Polygons */}
          {layers.electoralAreas && (
            <g>
              {ELECTORAL_AREAS.map((area) => {
                const isSelected = selectedAreaId === area.id;
                const isHovered = hoveredAreaId === area.id;
                const isDimmed = selectedAreaId !== null && !isSelected;

                return (
                  <polygon
                    key={area.id}
                    points={pointsToString(area.polygon)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectArea(area.id);
                    }}
                    onMouseEnter={() => setHoveredAreaId(area.id)}
                    onMouseLeave={() => setHoveredAreaId(null)}
                    fill={
                      isSelected
                        ? 'rgba(78, 198, 176, 0.20)'
                        : isHovered
                          ? 'rgba(245, 166, 35, 0.14)'
                          : isDimmed
                            ? 'rgba(15, 23, 42, 0.35)'
                            : 'rgba(84, 71, 152, 0.14)'
                    }
                    stroke={isSelected ? '#4EC6B0' : '#D97706'}
                    strokeWidth={isSelected ? 1.8 : 1.15}
                    strokeLinejoin="round"
                    className="cursor-pointer transition-colors duration-150"
                  />
                );
              })}
            </g>
          )}

          {/* Constituency Outer Boundary Polygon (Glowing Purple/Violet) */}
          {layers.constituencyBoundary && (
            <polygon
              points={pointsToString(CONSTITUENCY_BOUNDARY)}
              fill="rgba(99, 71, 179, 0.10)"
              stroke="#B266FF"
              strokeWidth="2.8"
              strokeLinejoin="round"
              filter="url(#purpleGlow)"
              pointerEvents="none"
            />
          )}

          {/* Electoral Area Labels */}
          {layers.areaLabels && (
            <g pointerEvents="none">
              {ELECTORAL_AREAS.map((area) => {
                const isSelected = selectedAreaId === area.id;
                return (
                  <g key={`lbl-${area.id}`}>
                    <text
                      x={area.labelPos[0]}
                      y={area.labelPos[1]}
                      textAnchor="middle"
                      fill="#04121C"
                      stroke="#04121C"
                      strokeWidth="2.5"
                      fontSize="8.8"
                      fontWeight="600"
                      letterSpacing="0.03em"
                    >
                      {area.mapLabel}
                    </text>
                    <text
                      x={area.labelPos[0]}
                      y={area.labelPos[1]}
                      textAnchor="middle"
                      fill={isSelected ? '#67E8D0' : '#DCE9F2'}
                      fontSize="8.8"
                      fontWeight="600"
                      letterSpacing="0.03em"
                    >
                      {area.mapLabel}
                    </text>
                  </g>
                );
              })}
              <text
                x="440"
                y="260"
                textAnchor="middle"
                fill="#A8D4E8"
                fontSize="12"
                fontWeight="600"
                opacity="0.7"
              >
                Nima
              </text>
            </g>
          )}

          {/* 113 Polling Station Markers */}
          {layers.pollingStations && (
            <g>
              {allStations.map((st) => {
                const isVisible = visibleStationIds.has(st.id);
                if (!isVisible) return null;

                const isSelected = selectedStation?.id === st.id;
                const isHovered = hoveredStation?.id === st.id;
                const hasIncident = incidentStationIds.has(st.id);

                return (
                  <g
                    key={st.id}
                    transform={`translate(${st.x}, ${st.y})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStation(st);
                    }}
                    onMouseEnter={() => setHoveredStation(st)}
                    onMouseLeave={() => setHoveredStation(null)}
                    className="cursor-pointer"
                  >
                    {/* Hit area */}
                    <circle r="7.5" fill="transparent" />

                    {/* Selection Halo */}
                    {isSelected && (
                      <circle
                        r="8"
                        fill="rgba(78, 198, 176, 0.25)"
                        stroke="#4EC6B0"
                        strokeWidth="1.5"
                      />
                    )}

                    {/* Pin Marker */}
                    <circle
                      r={isSelected ? 4.4 : isHovered ? 4 : hasIncident ? 4.2 : 2.9}
                      fill={
                        hasIncident
                          ? '#EF4444'
                          : isSelected
                            ? '#4EC6B0'
                            : '#F97316'
                      }
                      stroke="#03121C"
                      strokeWidth="0.9"
                    />
                  </g>
                );
              })}
            </g>
          )}
        </g>
      </svg>

      {/* Hover Tooltip */}
      {hoveredStation && hoveredStation.id !== selectedStation?.id && (
        <div className="pointer-events-none absolute top-3 left-3 z-20 bg-[#041927]/95 border border-[#1B4B6B] px-3 py-2 rounded shadow-lg max-w-xs">
          <div className="text-[11px] font-semibold text-[#F5A623]">
            {hoveredStation.electoralAreaName}
          </div>
          <div className="text-xs text-white font-medium mt-0.5">
            {hoveredStation.name}
          </div>
          <div className="text-[11px] text-[#8EB0C7] font-mono-tabular mt-0.5">
            {hoveredStation.code} · {hoveredStation.registeredVoters} voters
          </div>
        </div>
      )}

      {/* Selected Polling Station Inspector Popup */}
      {selectedStation && (
        <div className="absolute bottom-3 left-3 z-20 w-[310px] max-w-[calc(100%-24px)] bg-[#051E30]/96 border border-[#1E587D] rounded shadow-2xl p-3.5 text-left">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#F5A623] truncate">
                {selectedStation.electoralAreaName}
              </div>
              <h3 className="text-sm font-semibold text-white leading-snug mt-0.5">
                {selectedStation.name}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onSelectStation(null)}
              aria-label="Close station details"
              className="p-1 text-[#89ACC2] hover:text-white hover:bg-[#0D334D] rounded cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-[#103852] grid grid-cols-2 gap-y-2 gap-x-3 text-xs">
            <div>
              <span className="text-[#7EA2B8] block">Station Code</span>
              <span className="font-mono-tabular text-[#E6F1F8] font-medium">
                {selectedStation.code}
              </span>
            </div>
            <div>
              <span className="text-[#7EA2B8] block">Registered Voters</span>
              <span className="font-mono-tabular text-[#E6F1F8] font-medium">
                {selectedStation.registeredVoters.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-[#7EA2B8] block">Verified Turnout</span>
              <span className="font-mono-tabular text-[#4EC6B0] font-medium">
                {selectedStation.verifiedTurnout}%
              </span>
            </div>
            <div>
              <span className="text-[#7EA2B8] block">Presiding Officer</span>
              <span className="text-[#E6F1F8] font-medium truncate block">
                {selectedStation.presidingOfficer}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[#103852] flex items-center justify-between gap-2">
            <span className="font-mono-tabular text-[11px] text-[#7B9DB3]">
              {selectedStation.lat.toFixed(4)}° N, {Math.abs(selectedStation.lng).toFixed(4)}° W
            </span>
            <button
              type="button"
              onClick={() => onReportIncidentAtStation(selectedStation)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#FCA5A5] bg-[#3B1219] hover:bg-[#521822] border border-[#7F1D1D] rounded transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Log Incident</span>
            </button>
          </div>
        </div>
      )}

      {/* Top-Right GIS Toolbar (matches reference layout) */}
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
              title="Search polling stations"
              aria-label="Focus polling station search"
              className="w-8 h-8 flex items-center justify-center text-[#B8D1E0] hover:text-white hover:bg-[#0C3149] transition-colors cursor-pointer"
            >
              <LocateFixed className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={resetExtent}
              title="Reset default map extent"
              aria-label="Reset map extent"
              className="w-8 h-8 flex items-center justify-center text-[#B8D1E0] hover:text-white hover:bg-[#0C3149] transition-colors cursor-pointer"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setLayersOpen((v) => !v)}
              title="Toggle GIS map layers"
              aria-label="Toggle GIS map layers"
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
        <div className="absolute top-3 right-13 z-20 w-52 bg-[#051D2E]/96 border border-[#1B4F70] rounded shadow-xl p-3">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#113A54]">
            <span className="text-xs font-semibold text-[#E2EFF7]">Map Layers</span>
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
                ['pollingStations', 'Polling Stations (113)'],
                ['electoralAreas', 'Electoral Areas (11)'],
                ['constituencyBoundary', 'Constituency Boundary'],
                ['areaLabels', 'Area Labels'],
                ['roadNetwork', 'Road & Street Grid'],
              ] as [keyof MapLayerState, string][]
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
          onClick={() => setZoom((z) => Math.min(4.2, Number((z + 0.3).toFixed(2))))}
          aria-label="Zoom in"
          title="Zoom in"
          className="w-8 h-8 flex items-center justify-center text-[#B8D1E0] hover:text-white hover:bg-[#0C3149] transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.95, Number((z - 0.3).toFixed(2))))}
          aria-label="Zoom out"
          title="Zoom out"
          className="w-8 h-8 flex items-center justify-center text-[#B8D1E0] hover:text-white hover:bg-[#0C3149] transition-colors cursor-pointer"
        >
          <Minus className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      {/* Bottom Cartographic Attribution Bar */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-2.5 py-1 flex items-center justify-between text-[10px] text-[#7D9FB5] bg-gradient-to-t from-[#031019]/85 to-transparent">
        <span>Ayawaso East Constituency GIS · Greater Accra Region</span>
        <span className="font-mono-tabular">Zoom {Math.round(zoom * 100)}%</span>
      </div>
    </section>
  );
}
