import { useMemo, useState, useRef } from 'react';
import {
  ELECTORAL_AREAS,
  POLLING_STATIONS,
  PollingStation,
  IncidentReport,
} from './data/constituencyData';
import {
  INITIAL_ACTIVITY_STAGES,
  INITIAL_STADIUM_INCIDENTS,
  STADIUM_LOCATIONS,
  ActivityStage,
  StadiumLocation,
  VenueCategory,
  VenueIncident,
} from './data/capeCoastStadiumData';
import { DashboardMode, OperationsHeader } from './components/OperationsHeader';
import { PollingStationsSidebar } from './components/PollingStationsSidebar';
import { ConstituencyMap } from './components/ConstituencyMap';
import { ElectoralAreaChart } from './components/ElectoralAreaChart';
import { KpiColumn } from './components/KpiColumn';
import { OperationsDrawer } from './components/OperationsDrawer';
import { StadiumSidebar } from './components/StadiumSidebar';
import { StadiumLayerState, StadiumMap } from './components/StadiumMap';
import { StadiumPersonnelChart } from './components/StadiumPersonnelChart';
import { ActivityCrawlBar } from './components/ActivityCrawlBar';
import { StadiumOperationsDrawer } from './components/StadiumOperationsDrawer';

export default function App() {
  const [mode, setMode] = useState<DashboardMode>('stadium');

  // --- Cape Coast Stadium State ---
  const [stadiumSearch, setStadiumSearch] = useState('');
  const [stadiumCategory, setStadiumCategory] = useState<VenueCategory | 'all'>('all');
  const [selectedStadiumLoc, setSelectedStadiumLoc] =
    useState<StadiumLocation | null>(null);
  const [stadiumIncidents, setStadiumIncidents] = useState<VenueIncident[]>(
    INITIAL_STADIUM_INCIDENTS
  );
  const [activityStages, setActivityStages] = useState<ActivityStage[]>(
    INITIAL_ACTIVITY_STAGES
  );
  const [stadiumDrawerOpen, setStadiumDrawerOpen] = useState(false);
  const [stadiumDrawerTab, setStadiumDrawerTab] = useState<'incidents' | 'stages'>(
    'incidents'
  );
  const [stadiumIncidentTarget, setStadiumIncidentTarget] =
    useState<StadiumLocation | null>(null);
  const [stadiumLayers, setStadiumLayers] = useState<StadiumLayerState>({
    roadCheckpoints: true,
    barricadeGates: true,
    stadiumStands: true,
    zoneLabels: true,
    blinkingIncidents: true,
  });

  // --- Ayawaso East Constituency State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<PollingStation | null>(
    null
  );
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [incidentTargetStation, setIncidentTargetStation] =
    useState<PollingStation | null>(null);
  const [layers, setLayers] = useState({
    roadNetwork: true,
    constituencyBoundary: true,
    electoralAreas: true,
    areaLabels: true,
    pollingStations: true,
  });

  const sidebarContainerRef = useRef<HTMLDivElement>(null);

  // --- Cape Coast Stadium Derived Data ---
  const filteredStadiumLocations = useMemo(() => {
    const q = stadiumSearch.trim().toLowerCase();
    return STADIUM_LOCATIONS.filter((loc) => {
      if (stadiumCategory !== 'all' && loc.category !== stadiumCategory) {
        return false;
      }
      if (!q) return true;
      return (
        loc.name.toLowerCase().includes(q) ||
        loc.code.toLowerCase().includes(q) ||
        loc.categoryLabel.toLowerCase().includes(q) ||
        loc.zoneSector.toLowerCase().includes(q)
      );
    });
  }, [stadiumSearch, stadiumCategory]);

  const totalStadiumPersonnel = useMemo(
    () =>
      filteredStadiumLocations.reduce(
        (acc, loc) => acc + loc.personnelCount,
        0
      ),
    [filteredStadiumLocations]
  );

  const activeStadiumIncidentsCount = useMemo(
    () => stadiumIncidents.filter((i) => !i.resolved).length,
    [stadiumIncidents]
  );

  const stadiumSuspectsCount = useMemo(
    () =>
      stadiumIncidents
        .filter((i) => !i.resolved)
        .reduce((acc, i) => acc + i.suspectsCount, 0),
    [stadiumIncidents]
  );

  // --- Ayawaso East Derived Data ---
  const stationsWithStatus = useMemo(() => {
    const activeIncidentStationIds = new Set(
      incidents.filter((i) => !i.resolved).map((i) => i.stationId)
    );
    return POLLING_STATIONS.map((station) => ({
      ...station,
      status: activeIncidentStationIds.has(station.id)
        ? ('Incident' as const)
        : ('Nominal' as const),
    }));
  }, [incidents]);

  const selectedArea = useMemo(
    () => ELECTORAL_AREAS.find((a) => a.id === selectedAreaId) ?? null,
    [selectedAreaId]
  );

  const filteredStations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return stationsWithStatus.filter((station) => {
      if (selectedAreaId && station.electoralAreaId !== selectedAreaId) {
        return false;
      }
      if (!q) return true;
      return (
        station.name.toLowerCase().includes(q) ||
        station.electoralAreaName.toLowerCase().includes(q) ||
        station.code.toLowerCase().includes(q)
      );
    });
  }, [stationsWithStatus, selectedAreaId, searchQuery]);

  const stationCountsByArea = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const area of ELECTORAL_AREAS) {
      counts[area.id] = 0;
    }
    const q = searchQuery.trim().toLowerCase();
    for (const st of stationsWithStatus) {
      if (
        !q ||
        st.name.toLowerCase().includes(q) ||
        st.electoralAreaName.toLowerCase().includes(q) ||
        st.code.toLowerCase().includes(q)
      ) {
        counts[st.electoralAreaId] = (counts[st.electoralAreaId] ?? 0) + 1;
      }
    }
    return counts;
  }, [stationsWithStatus, searchQuery]);

  const activeIncidentsCount = useMemo(
    () => incidents.filter((i) => !i.resolved).length,
    [incidents]
  );

  const totalSuspectsCount = useMemo(
    () =>
      incidents
        .filter((i) => !i.resolved)
        .reduce((acc, inc) => acc + inc.suspectsCount, 0),
    [incidents]
  );

  const handleFocusSearch = () => {
    const input = sidebarContainerRef.current?.querySelector('input');
    if (input) {
      input.focus();
    }
  };

  // --- Handlers: Cape Coast Stadium ---
  const handleAddStadiumIncident = (
    payload: Omit<VenueIncident, 'id' | 'timestamp'>
  ) => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    setStadiumIncidents((prev) => [
      {
        ...payload,
        id: `st-inc-${Date.now()}`,
        timestamp: `${hh}:${mm} GMT`,
      },
      ...prev,
    ]);
  };

  const handleToggleStadiumIncidentResolved = (id: string) => {
    setStadiumIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id ? { ...inc, resolved: !inc.resolved } : inc
      )
    );
  };

  const handleDeleteStadiumIncident = (id: string) => {
    setStadiumIncidents((prev) => prev.filter((inc) => inc.id !== id));
  };

  const handleToggleStage = (id: string) => {
    setActivityStages((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
  };

  const handleAddStage = (stageLabel: string, message: string) => {
    setActivityStages((prev) => [
      ...prev,
      {
        id: `stage-${Date.now()}`,
        stageLabel,
        message,
        active: true,
      },
    ]);
  };

  const handleDeleteStage = (id: string) => {
    setActivityStages((prev) => prev.filter((s) => s.id !== id));
  };

  const handleExportStadiumCsv = () => {
    const headers = [
      'Code',
      'Category',
      'Location',
      'Sector',
      'Officers Deployed',
      'Screened Count',
      'Commander',
      'Search Protocol',
    ];
    const rows = filteredStadiumLocations.map((l) => [
      l.code,
      `"${l.categoryLabel}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.zoneSector}"`,
      l.personnelCount,
      l.screenedCount,
      `"${l.commander}"`,
      `"${l.searchProtocol}"`,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'cape-coast-stadium-operations-2026.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  // --- Handlers: Ayawaso East ---
  const handleToggleArea = (areaId: string) => {
    setSelectedAreaId((prev) => {
      const next = prev === areaId ? null : areaId;
      if (next && selectedStation && selectedStation.electoralAreaId !== next) {
        setSelectedStation(null);
      }
      return next;
    });
  };

  const handleAddIncident = (
    payload: Omit<IncidentReport, 'id' | 'timestamp'>
  ) => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    setIncidents((prev) => [
      {
        ...payload,
        id: `inc-${Date.now()}`,
        timestamp: `${hh}:${mm} GMT`,
      },
      ...prev,
    ]);
  };

  const handleExportCsv = () => {
    const headers = [
      'Code',
      'Electoral Area',
      'Polling Station',
      'Registered Voters',
      'Verified Turnout (%)',
      'Presiding Officer',
      'Latitude',
      'Longitude',
      'Status',
    ];
    const rows = filteredStations.map((s) => [
      s.code,
      `"${s.electoralAreaName}"`,
      `"${s.name.replace(/"/g, '""')}"`,
      s.registeredVoters,
      s.verifiedTurnout,
      `"${s.presidingOfficer}"`,
      s.lat,
      s.lng,
      s.status,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ayawaso-east-polling-stations-2026.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const isStadiumFiltered =
    stadiumCategory !== 'all' || stadiumSearch.trim().length > 0;
  const isConstituencyFiltered =
    selectedAreaId !== null || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col bg-[#020F18] text-[#E6EFF6]">
      <OperationsHeader
        mode={mode}
        onChangeMode={setMode}
        selectedFilterLabel={
          mode === 'stadium'
            ? stadiumCategory !== 'all'
              ? stadiumCategory
              : null
            : selectedArea?.name ?? null
        }
        onClearFilter={() => {
          if (mode === 'stadium') {
            setStadiumCategory('all');
            setStadiumSearch('');
          } else {
            setSelectedAreaId(null);
            setSearchQuery('');
          }
        }}
        onOpenDrawer={() => {
          if (mode === 'stadium') {
            setStadiumIncidentTarget(selectedStadiumLoc);
            setStadiumDrawerTab('incidents');
            setStadiumDrawerOpen(true);
          } else {
            setIncidentTargetStation(selectedStation);
            setDrawerOpen(true);
          }
        }}
      />

      {mode === 'stadium' ? (
        <>
          <main className="flex-1 min-h-0 p-2 grid grid-cols-1 lg:grid-cols-[270px_1fr_240px] xl:grid-cols-[310px_1fr_275px] gap-2">
            <div ref={sidebarContainerRef} className="min-h-[380px] lg:min-h-0 h-full">
              <StadiumSidebar
                locations={filteredStadiumLocations}
                totalCount={STADIUM_LOCATIONS.length}
                searchQuery={stadiumSearch}
                onSearchChange={setStadiumSearch}
                categoryFilter={stadiumCategory}
                onCategoryChange={setStadiumCategory}
                selectedLocationId={selectedStadiumLoc?.id ?? null}
                onSelectLocation={(loc) => setSelectedStadiumLoc(loc)}
                incidents={stadiumIncidents}
              />
            </div>

            <div className="flex flex-col gap-2 min-h-0">
              <div className="flex-1 min-h-[380px] lg:min-h-0">
                <StadiumMap
                  locations={filteredStadiumLocations}
                  selectedLocation={selectedStadiumLoc}
                  onSelectLocation={setSelectedStadiumLoc}
                  incidents={stadiumIncidents}
                  onReportIncidentAtLocation={(loc) => {
                    setStadiumIncidentTarget(loc);
                    setStadiumDrawerTab('incidents');
                    setStadiumDrawerOpen(true);
                  }}
                  layers={stadiumLayers}
                  onToggleLayer={(key) =>
                    setStadiumLayers((prev) => ({ ...prev, [key]: !prev[key] }))
                  }
                  onFocusSearch={handleFocusSearch}
                />
              </div>

              <div className="h-[168px] shrink-0">
                <StadiumPersonnelChart
                  locations={STADIUM_LOCATIONS}
                  selectedLocationId={selectedStadiumLoc?.id ?? null}
                  onSelectLocation={(loc) => setSelectedStadiumLoc(loc)}
                />
              </div>
            </div>

            <div className="min-h-0">
              <KpiColumn
                primaryLabel="# Venue Zones"
                primaryValue={filteredStadiumLocations.length}
                primaryTotal={STADIUM_LOCATIONS.length}
                secondaryLabel="Police & Stewards"
                secondaryValue={totalStadiumPersonnel}
                incidentsCount={activeStadiumIncidentsCount}
                suspectsCount={stadiumSuspectsCount}
                isFiltered={isStadiumFiltered}
                onResetFilter={() => {
                  setStadiumCategory('all');
                  setStadiumSearch('');
                }}
                onOpenIncidents={() => {
                  setStadiumIncidentTarget(selectedStadiumLoc);
                  setStadiumDrawerTab('incidents');
                  setStadiumDrawerOpen(true);
                }}
              />
            </div>
          </main>

          <ActivityCrawlBar
            stages={activityStages}
            onManageStages={() => {
              setStadiumDrawerTab('stages');
              setStadiumDrawerOpen(true);
            }}
          />

          <StadiumOperationsDrawer
            open={stadiumDrawerOpen}
            initialTab={stadiumDrawerTab}
            onClose={() => setStadiumDrawerOpen(false)}
            locations={STADIUM_LOCATIONS}
            preselectedLocation={stadiumIncidentTarget}
            incidents={stadiumIncidents}
            onAddIncident={handleAddStadiumIncident}
            onToggleIncidentResolved={handleToggleStadiumIncidentResolved}
            onDeleteIncident={handleDeleteStadiumIncident}
            stages={activityStages}
            onToggleStage={handleToggleStage}
            onAddStage={handleAddStage}
            onDeleteStage={handleDeleteStage}
            onExportCsv={handleExportStadiumCsv}
          />
        </>
      ) : (
        <>
          <main className="flex-1 min-h-0 p-2 grid grid-cols-1 lg:grid-cols-[270px_1fr_240px] xl:grid-cols-[310px_1fr_275px] gap-2">
            <div ref={sidebarContainerRef} className="min-h-[380px] lg:min-h-0 h-full">
              <PollingStationsSidebar
                stations={filteredStations}
                totalCount={stationsWithStatus.length}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedStationId={selectedStation?.id ?? null}
                onSelectStation={(st) => setSelectedStation(st)}
                selectedAreaName={selectedArea?.name ?? null}
                onClearAreaFilter={() => setSelectedAreaId(null)}
              />
            </div>

            <div className="flex flex-col gap-2 min-h-0">
              <div className="flex-1 min-h-[380px] lg:min-h-0">
                <ConstituencyMap
                  stations={filteredStations}
                  allStations={stationsWithStatus}
                  selectedAreaId={selectedAreaId}
                  onSelectArea={handleToggleArea}
                  selectedStation={selectedStation}
                  onSelectStation={setSelectedStation}
                  incidents={incidents}
                  onReportIncidentAtStation={(st) => {
                    setIncidentTargetStation(st);
                    setDrawerOpen(true);
                  }}
                  layers={layers}
                  onToggleLayer={(key) =>
                    setLayers((prev) => ({ ...prev, [key]: !prev[key] }))
                  }
                  onFocusSearch={handleFocusSearch}
                />
              </div>

              <div className="h-[172px] shrink-0">
                <ElectoralAreaChart
                  areas={ELECTORAL_AREAS}
                  selectedAreaId={selectedAreaId}
                  onSelectArea={handleToggleArea}
                  stationCounts={stationCountsByArea}
                />
              </div>
            </div>

            <div className="min-h-0">
              <KpiColumn
                primaryLabel="# Polling Station"
                primaryValue={filteredStations.length}
                primaryTotal={stationsWithStatus.length}
                secondaryLabel="#Electoral Area"
                secondaryValue={selectedAreaId ? 1 : ELECTORAL_AREAS.length}
                incidentsCount={activeIncidentsCount}
                suspectsCount={totalSuspectsCount}
                isFiltered={isConstituencyFiltered}
                onResetFilter={() => {
                  setSelectedAreaId(null);
                  setSearchQuery('');
                }}
                onOpenIncidents={() => {
                  setIncidentTargetStation(selectedStation);
                  setDrawerOpen(true);
                }}
              />
            </div>
          </main>

          <OperationsDrawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            allStations={stationsWithStatus}
            preselectedStation={incidentTargetStation}
            incidents={incidents}
            onAddIncident={handleAddIncident}
            onToggleIncidentResolved={(id) =>
              setIncidents((prev) =>
                prev.map((inc) =>
                  inc.id === id ? { ...inc, resolved: !inc.resolved } : inc
                )
              )
            }
            onDeleteIncident={(id) =>
              setIncidents((prev) => prev.filter((inc) => inc.id !== id))
            }
            onExportCsv={handleExportCsv}
          />
        </>
      )}
    </div>
  );
}
