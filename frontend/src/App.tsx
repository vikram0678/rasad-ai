import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TacticalMap, TacticalMapHandle } from './components/TacticalMap';
import { SchematicMap } from './components/SchematicMap';
import { ElevationProfile } from './components/ElevationProfile';
import { DemandChart } from './components/DemandChart';
import { PlannerWorkspace } from './components/workspaces/PlannerWorkspace';
import { CopilotWorkspace } from './components/workspaces/CopilotWorkspace';
import { TelemetryWorkspace } from './components/workspaces/TelemetryWorkspace';
import { FlirThermalHud } from './components/workspaces/FlirThermalHud';
import { CopilotDrawer } from './components/modals/CopilotDrawer';
import { GuardrailsModal } from './components/modals/GuardrailsModal';
import { ScannerModal } from './components/modals/ScannerModal';
import { XaiModal } from './components/modals/XaiModal';
import { CvrptwModal } from './components/modals/CvrptwModal';
import { MultimodalModal } from './components/modals/MultimodalModal';
import { EwModal } from './components/modals/EwModal';
import { OpordModal } from './components/modals/OpordModal';
import { ConvoyTelemetryModal } from './components/modals/ConvoyTelemetryModal';
import { UavAirDropModal } from './components/modals/UavAirDropModal';
import { AvalancheThreatPanel } from './components/AvalancheThreatPanel';
import { AwsStockingTracker } from './components/AwsStockingTracker';
import { MilitarySectorId, MILITARY_SECTORS } from './data/militarySectors';
import { tacticalAudio } from './utils/audio';
import { LiveWeatherService, LocationWeather, TACTICAL_WEATHER_NODES } from './utils/liveWeatherService';
import { IplmsDashboard } from './components/iplms/IplmsDashboard';
import { RasadSahayakBot } from './components/copilot/RasadSahayakBot';
import { FORWARD_OUTPOSTS, ACTIVE_CONVOYS, AI_PREDICTIVE_INSIGHTS } from './data/mockData';
import { Outpost, OfficerRole, MilitaryOfficer } from './types';
import {
  RasadLogoIcon,
  CommandOverviewIcon,
  LogisticsPlannerIcon,
  DemandIcon,
  CopilotIcon,
  TelemetryIcon,
  CargoScanIcon,
  GuardrailIcon,
  AirBridgeIcon,
  RadioOutpostsIcon,
  AlertTriangleIcon,
  ClipboardListIcon
} from './components/icons/NavIcons';

export const MILITARY_OFFICERS: Record<OfficerRole, MilitaryOfficer> = {
  BRIGADIER: {
    id: 'BRIGADIER',
    rank: 'Brigadier',
    name: 'A. Kumar',
    roleTitle: 'Theatre Logistics Commander',
    unit: 'HQ 14 Corps (Fire & Fury)',
    hq: 'Leh Command Bunker',
    clearanceLevel: 'TOP SECRET // AIR-GAPPED',
    permissions: {
      canTriggerDefcon: true,
      canAuthorizeAirBridge: true,
      canAuthorizeConvoys: true,
      canOverrideGuardrails: true,
      canVerifyCargoOnly: false
    }
  },
  CAPTAIN: {
    id: 'CAPTAIN',
    rank: 'Captain',
    name: 'V. Sharma',
    roleTitle: 'Transport & Depot Officer',
    unit: '504 Army Service Corps Bn',
    hq: 'Central Logistics Depot Leh',
    clearanceLevel: 'SECRET // TACTICAL',
    permissions: {
      canTriggerDefcon: false,
      canAuthorizeAirBridge: false,
      canAuthorizeConvoys: true,
      canOverrideGuardrails: false,
      canVerifyCargoOnly: false
    }
  },
  SUBEDAR: {
    id: 'SUBEDAR',
    rank: 'Subedar',
    name: 'G. Singh',
    roleTitle: 'Forward Post Supply JCO',
    unit: 'DBO ALG Garrison',
    hq: 'OP_DBO Sub-Sector North',
    clearanceLevel: 'RESTRICTED // LOCAL',
    permissions: {
      canTriggerDefcon: false,
      canAuthorizeAirBridge: false,
      canAuthorizeConvoys: false,
      canOverrideGuardrails: false,
      canVerifyCargoOnly: true
    }
  }
};

interface ToastItem {
  id: number;
  message: string;
}

export type HudTheme = 'cyan' | 'nvg-green' | 'amber-flir' | 'stealth-red';

export interface ThemeOption {
  id: HudTheme;
  shortName: string;
  fullName: string;
  wavelength: string;
  desc: string;
}

export const HUD_THEMES: ThemeOption[] = [
  {
    id: 'cyan',
    shortName: 'CYAN HUD',
    fullName: 'Cyber Cyan Spectrum',
    wavelength: '480nm',
    desc: 'Blue Force Tracking & Aerospace digital telemetry'
  },
  {
    id: 'nvg-green',
    shortName: 'NVG GREEN',
    fullName: 'Phosphor Night Vision',
    wavelength: '530nm',
    desc: 'Vintage CRT radar & night-vision optical filter'
  },
  {
    id: 'amber-flir',
    shortName: 'FLIR AMBER',
    fullName: 'FLIR Thermal Recon',
    wavelength: '590nm',
    desc: 'Forward-looking infrared & drone surveillance'
  },
  {
    id: 'stealth-red',
    shortName: 'STEALTH RED',
    fullName: 'Covert Low-Signature',
    wavelength: '650nm',
    desc: 'Submarine combat station & command bunker night ops'
  }
];

export const App: React.FC = () => {
  // Navigation & View Mode
  type NavTab = 'iplms' | 'overview' | 'planner' | 'demand' | 'copilot' | 'telemetry';
  const [activeNav, setActiveNav] = useState<NavTab>('iplms');
  const [mapMode, setMapMode] = useState<'schematic' | 'gis'>('schematic');
  const [showElevation, setShowElevation] = useState<boolean>(true);
  const [showFlir, setShowFlir] = useState<boolean>(false);
  const [showHotkeysModal, setShowHotkeysModal] = useState<boolean>(false);
  const [officerRole, setOfficerRole] = useState<OfficerRole>('BRIGADIER');
  const [isConvoyTelemetryOpen, setIsConvoyTelemetryOpen] = useState<boolean>(false);
  const [selectedConvoyId, setSelectedConvoyId] = useState<string>('TRK-204');
  const [isUavAirDropOpen, setIsUavAirDropOpen] = useState<boolean>(false);
  const [showDopplerRadar, setShowDopplerRadar] = useState<boolean>(false);
  const [showAvalancheThreat, setShowAvalancheThreat] = useState<boolean>(false);
  const [selectedSectorId, setSelectedSectorId] = useState<MilitarySectorId>('SECTOR_DSDBO');
  const [showAwsTracker, setShowAwsTracker] = useState<boolean>(false);

  // Crisis Scenario War-Gaming State
  type CrisisType = 'NORMAL' | 'AVALANCHE' | 'DEFCON1' | 'GPS_SPOOF';
  const [crisisScenario, setCrisisScenario] = useState<CrisisType>('NORMAL');

  // Simulation & Outpost state
  const [simDay, setSimDay] = useState(0);
  const [selectedOutpostId, setSelectedOutpostId] = useState('op-dbo');
  const [selectedCategory, setSelectedCategory] = useState('class3_pol');
  const [resupplyApproved, setResupplyApproved] = useState(false);
  const [isSpoofed, setIsSpoofed] = useState(false);
  const [blizzardActive, setBlizzardActive] = useState(false);
  const [convoys, setConvoys] = useState(ACTIVE_CONVOYS);
  const [outposts, setOutposts] = useState<Outpost[]>(() => JSON.parse(JSON.stringify(FORWARD_OUTPOSTS)));

  // Sound feedback state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => tacticalAudio.enabled);

  // Optical Spectrum / Military HUD Theme
  const [theme, setTheme] = useState<HudTheme>(() => {
    const saved = localStorage.getItem('rasad_hud_theme') as HudTheme | null;
    return saved && ['cyan', 'nvg-green', 'amber-flir', 'stealth-red'].includes(saved)
      ? saved
      : 'cyan';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('rasad_hud_theme', theme);
  }, [theme]);

  // Live Open-Meteo Tactical Weather Telemetry
  const [weatherData, setWeatherData] = useState<Record<string, LocationWeather>>(() => LiveWeatherService.getFallbackSync());
  const [isLiveWeatherOnline, setIsLiveWeatherOnline] = useState<boolean>(false);
  const [isRefreshingWeather, setIsRefreshingWeather] = useState<boolean>(false);

  const handleFetchWeather = useCallback(async (notify = false) => {
    setIsRefreshingWeather(true);
    try {
      const res = await LiveWeatherService.fetchTacticalWeather();
      setWeatherData(res);
      const live = (Object.values(res) as LocationWeather[]).some(w => w.isLive);
      setIsLiveWeatherOnline(live);
      if (notify) {
        tacticalAudio.playSonar();
        addToast(live 
          ? `LIVE METEO SYNC: Real-time Open-Meteo telemetry received (${res.leh?.temperatureC ?? -6}°C Leh · ${res.khardungla?.temperatureC ?? -18}°C Khardung La).`
          : 'AIR-GAPPED METEO: Loaded offline tactical weather telemetry cache.'
        );
      }
    } catch {
      // fallback safe
    } finally {
      setIsRefreshingWeather(false);
    }
  }, []);

  useEffect(() => {
    handleFetchWeather(false);
    const interval = setInterval(() => handleFetchWeather(false), 120000);
    return () => clearInterval(interval);
  }, [handleFetchWeather]);

  // Operational Dispatches List (Multi-Base High-Altitude Logistics)
  const [dispatches, setDispatches] = useState([
    { id: 'DSP-041', route: 'Leh → DBO', mode: 'Road convoy (Stallion)', cargo: 'Kerosene · 4,200 L', window: '12:20 IST', subWindow: 'Khardung La crossing', status: 'Pending' },
    { id: 'DSP-042', route: 'Thoise → Siachen', mode: 'Tactical Airlift (C-17)', cargo: 'Glacial survival kits · 2.4 t', window: '13:10 IST', subWindow: 'Nubra airhead departure', status: 'Pending' },
    { id: 'DSP-043', route: 'Khalsar → Murgo', mode: 'Autonomous UAV', cargo: 'Sensor & telems kit · 45 kg', window: '13:40 IST', subWindow: 'Reading verification', status: 'Pending' },
    { id: 'DSP-044', route: 'Darbuk → DBO', mode: 'High-Mobility Tatra', cargo: 'Bukhari fuel & rations · 3.5 t', window: '14:15 IST', subWindow: 'Shyok river corridor', status: 'Approved' },
    { id: 'DSP-045', route: 'Karu → Leh Depot', mode: 'Heavy Logistics formation', cargo: 'Munitions buffer · 8.0 t', window: '15:00 IST', subWindow: 'Arterial resupply', status: 'Approved' }
  ]);

  // Decision Queue items
  const [decisions, setDecisions] = useState([
    { id: 'D-01', num: '01', title: 'Authorize convoy split', desc: 'M-204 · 2 × 2.5-ton Stallion', action: 'Authorize', cleared: false },
    { id: 'D-02', num: '02', title: 'Review fuel recommendation', desc: 'DBO · 4,200 L kerosene', action: 'Approve', cleared: false },
    { id: 'D-03', num: '03', title: 'Approve UAV medical lift', desc: 'U-01B · weather check passed', action: 'Approve', cleared: false }
  ]);

  const awaitingCount = decisions.filter(d => !d.cleared).length;

  // Modals state
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isGuardrailsOpen, setIsGuardrailsOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isXaiOpen, setIsXaiOpen] = useState(false);
  const [isCvrptwOpen, setIsCvrptwOpen] = useState(false);
  const [isMultimodalOpen, setIsMultimodalOpen] = useState(false);
  const [isEwOpen, setIsEwOpen] = useState(false);
  const [isOpordOpen, setIsOpordOpen] = useState(false);

  // Map ref and theatre expansion
  const mapRef = useRef<TacticalMapHandle | null>(null);
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);

  // Realtime clock
  const [istTime, setIstTime] = useState('');
  const [zuluTime, setZuluTime] = useState('');

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev.slice(-1), { id, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleThemeChange = (newTheme: HudTheme) => {
    if (newTheme === theme) return;
    tacticalAudio.playBlip();
    setTheme(newTheme);
    const matched = HUD_THEMES.find(t => t.id === newTheme);
    if (matched) {
      addToast(`OPTICAL SPECTRUM ENGAGED: [${matched.shortName}] — ${matched.desc} (${matched.wavelength})`);
    }
  };

  const handleToggleSound = () => {
    const next = tacticalAudio.toggle();
    setSoundEnabled(next);
    addToast(next ? 'TACTICAL AUDIO: ENGAGED' : 'TACTICAL AUDIO: MUTED');
  };

  // Crisis Scenario War-Gaming Trigger
  const handleTriggerCrisis = (scenario: CrisisType) => {
    const currentOfficer = MILITARY_OFFICERS[officerRole];
    if (scenario === 'DEFCON1' && !currentOfficer.permissions.canTriggerDefcon) {
      tacticalAudio.playAlert();
      addToast(`ACCESS RESTRICTED: Escalating to DEFCON-1 requires Flag Officer (Brigadier) clearance. [${currentOfficer.rank} ${currentOfficer.name}] not authorized.`);
      return;
    }
    setCrisisScenario(scenario);
    if (scenario === 'NORMAL') {
      tacticalAudio.playSonar();
      setIsSpoofed(false);
      setBlizzardActive(false);
      setDispatches([
        { id: 'DSP-041', route: 'Leh → DBO', mode: 'Road convoy (Stallion)', cargo: 'Kerosene · 4,200 L', window: '12:20 IST', subWindow: 'Khardung La crossing', status: 'Pending' },
        { id: 'DSP-042', route: 'Thoise → Siachen', mode: 'Tactical Airlift (C-17)', cargo: 'Glacial survival kits · 2.4 t', window: '13:10 IST', subWindow: 'Nubra airhead departure', status: 'Pending' },
        { id: 'DSP-043', route: 'Khalsar → Murgo', mode: 'Autonomous UAV', cargo: 'Sensor & telems kit · 45 kg', window: '13:40 IST', subWindow: 'Reading verification', status: 'Pending' },
        { id: 'DSP-044', route: 'Darbuk → DBO', mode: 'High-Mobility Tatra', cargo: 'Bukhari fuel & rations · 3.5 t', window: '14:15 IST', subWindow: 'Shyok river corridor', status: 'Approved' },
        { id: 'DSP-045', route: 'Karu → Leh Depot', mode: 'Heavy Logistics formation', cargo: 'Munitions buffer · 8.0 t', window: '15:00 IST', subWindow: 'Arterial resupply', status: 'Approved' }
      ]);
      setDecisions([
        { id: 'D-01', num: '01', title: 'Authorize convoy split', desc: 'M-204 · 2 × 2.5-ton Stallion', action: 'Authorize', cleared: false },
        { id: 'D-02', num: '02', title: 'Review fuel recommendation', desc: 'DBO · 4,200 L kerosene', action: 'Approve', cleared: false },
        { id: 'D-03', num: '03', title: 'Approve UAV medical lift', desc: 'DSP-043 · weather check passed', action: 'Approve', cleared: false }
      ]);
      setOutposts(prev => prev.map(o => o.id === 'op-dbo' ? { ...o, daysOfSupply: 2.1 } : o));
      addToast('OPERATIONAL STATUS NORMALIZED: Baseline Northern Command surveillance active.');
    } else if (scenario === 'AVALANCHE') {
      tacticalAudio.playAlert();
      setBlizzardActive(true);
      setDispatches(prev => prev.map(dp => dp.id === 'DSP-041' || dp.id === 'DSP-044' ? { ...dp, status: 'Weather hold' } : dp));
      setDecisions(prev => [
        { id: 'D-04', num: '04', title: 'Authorize C-130J Aerial Drop to DBO Bypass', desc: 'Sortie #IAF-C130-99 · 12,000L Fuel + 4t Ammo', action: 'Authorize Sortie', cleared: false },
        ...prev.filter(d => d.id !== 'D-04')
      ]);
      addToast('CRITICAL ALERT: Avalanche triggered at Khardung La Km 134! DS-DBO ground highway closed. Air-Bridge Sortie #IAF-C130-99 recommended.');
    } else if (scenario === 'DEFCON1') {
      tacticalAudio.playAlert();
      setOutposts(prev => prev.map(o => o.id === 'op-dbo' ? { ...o, daysOfSupply: 0.8 } : o));
      setDecisions(prev => [
        { id: 'D-04', num: '04', title: 'Authorize Emergency Ammo Sortie (40,000 rds Class V)', desc: 'Direct airlift to DBO Garrison under combat surge protocol', action: 'Dispatch Now', cleared: false },
        ...prev.filter(d => d.id !== 'D-04')
      ]);
      addToast('WAR READINESS ESCALATION: DEFCON-1 combat readiness declared! Class V Ammo burn surged 400%. Reserve down to 0.8 days.');
    } else if (scenario === 'GPS_SPOOF') {
      tacticalAudio.playAlert();
      setIsSpoofed(true);
      addToast('ELECTRONIC WARFARE ALERT: Hostile GPS constellation spoofing detected! Convoys falling back to INS Dead-Reckoning.');
    }
  };

  // Commander Tactical Keybindings (Hotkeys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === '1') {
        setActiveNav('overview');
        tacticalAudio.playBlip();
        addToast('C2 HOTKEY [1]: Command Overview');
      } else if (e.key === '2') {
        setActiveNav('planner');
        tacticalAudio.playBlip();
        addToast('C2 HOTKEY [2]: Logistics Planner');
      } else if (e.key === '3') {
        setActiveNav('demand');
        tacticalAudio.playBlip();
        addToast('C2 HOTKEY [3]: Demand & Explainability');
      } else if (e.key === '4') {
        setActiveNav('copilot');
        tacticalAudio.playBlip();
        addToast('C2 HOTKEY [4]: Doctrine Copilot');
      } else if (e.key === '5') {
        setActiveNav('telemetry');
        tacticalAudio.playBlip();
        addToast('C2 HOTKEY [5]: Telemetry Console');
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        handleAdvanceSimulation();
      } else if (e.key === 'm' || e.key === 'M') {
        setMapMode(prev => (prev === 'schematic' ? 'gis' : 'schematic'));
        tacticalAudio.playBlip();
        addToast('C2 HOTKEY [M]: Toggled Map Mode');
      } else if (e.key === 'e' || e.key === 'E') {
        handleExportBrief();
      } else if (e.key === 'a' || e.key === 'A') {
        handleToggleSound();
      } else if (e.key === 't' || e.key === 'T') {
        window.dispatchEvent(new CustomEvent('rasad-start-tour'));
        tacticalAudio.playSonar();
        addToast('C2 HOTKEY [T]: Launching Guided Operational Tour');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Live convoy progress tick
  useEffect(() => {
    const timer = setInterval(() => {
      setConvoys(prev =>
        prev.map(c => ({
          ...c,
          progress: c.progress >= 98 ? 12 : c.progress + 1
        }))
      );
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const istStr = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      const zuluStr = `${now.toISOString().slice(11, 19)} ZULU`;
      setIstTime(`${istStr} IST`);
      setZuluTime(zuluStr);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentOutpost = outposts.find(o => o.id === selectedOutpostId) || outposts[0];

  const handleSelectOutpost = (outpostId: string) => {
    setSelectedOutpostId(outpostId);
    if (mapRef.current) {
      mapRef.current.flyToOutpost(outpostId);
    }
  };

  const handleAdvanceSimulation = () => {
    tacticalAudio.playBlip();
    const nextDay = simDay + 1;
    setSimDay(nextDay);
    setOutposts(prev =>
      prev.map(op => ({
        ...op,
        daysOfSupply: Number(Math.max(0.5, op.daysOfSupply - 0.8).toFixed(1))
      }))
    );
    addToast(`Simulation Time Advanced: D+${nextDay}. Daily consumption logged across all outposts.`);
  };

  const handleSimulateBlizzard = () => {
    tacticalAudio.playAlert();
    setBlizzardActive(prev => !prev);
    addToast('ALERT: Satellite RISAT-2B detected severe avalanche at Chang La Axis! Reroute initiated.');
  };

  const handleConfirmDispatch = () => {
    tacticalAudio.playSonar();
    setResupplyApproved(true);
    setOutposts(prev =>
      prev.map(op =>
        op.id === 'op-dbo'
          ? { ...op, daysOfSupply: 14.0, status: 'OPTIMAL' }
          : op
      )
    );
    const newConvoy = {
      id: 'convoy-cv105',
      callsign: 'RUDRA-02 (EMERGENCY POL)',
      vehicles: '4x Tatra 8x8 Heavy Utility Trucks',
      routeId: 'route-dsdbo-alternate',
      origin: 'FSB-KHL-02',
      destination: 'OP_DBO',
      lat: 34.6200,
      lng: 77.7500,
      heading: 25,
      speedKmH: 34,
      cargoType: '18,000L Arctic Fuel (POL)',
      cargoWeight: '22,000 kg',
      fuelPayload: '18,000 L',
      ammoPayload: 'N/A',
      tempSensor: '-12.0°C (Stable)',
      vibration: '0.29g (Normal)',
      eta: '4h 15m',
      progress: 10,
      status: 'DISPATCHED_ACTIVE',
      lastCheckpoint: 'Shyok Bailey Bypass (Authorized)'
    };
    setConvoys(prev => [newConvoy, ...prev]);
    addToast('MISSION DISPATCH ORDER ISSUED: Convoy RUDRA-02 carrying 18,000L Arctic Fuel authorized via Shyok Ridge Bypass!');
  };

  const handleOfficerChange = (role: OfficerRole) => {
    setOfficerRole(role);
    tacticalAudio.playBlip();
    const off = MILITARY_OFFICERS[role];
    addToast(`CLEARANCE UPDATED: [${off.rank} ${off.name}] — ${off.roleTitle} (${off.clearanceLevel})`);
  };

  const handleAuthorizeDecision = (id: string) => {
    const currentOfficer = MILITARY_OFFICERS[officerRole];
    if (!currentOfficer.permissions.canAuthorizeConvoys) {
      tacticalAudio.playAlert();
      addToast(`CLEARANCE RESTRICTED: [${currentOfficer.rank} ${currentOfficer.name}] is restricted to Receipt Verification only.`);
      return;
    }
    tacticalAudio.playSonar();
    setDecisions(prev =>
      prev.map(d => (d.id === id ? { ...d, cleared: !d.cleared } : d))
    );
    const target = decisions.find(d => d.id === id);
    if (target && !target.cleared) {
      addToast(`DIRECTIVE CLEARED BY [${currentOfficer.rank} ${currentOfficer.name}]: [${target.num} ${target.title}] authorized.`);
      if (id === 'D-01') {
        setDispatches(prev => prev.map(dp => dp.id === 'DSP-041' ? { ...dp, status: 'Approved' } : dp));
      } else if (id === 'D-03') {
        setDispatches(prev => prev.map(dp => dp.id === 'DSP-043' ? { ...dp, status: 'Approved' } : dp));
      }
    }
  };

  const handleToggleDispatchStatus = (id: string) => {
    const currentOfficer = MILITARY_OFFICERS[officerRole];
    if (!currentOfficer.permissions.canAuthorizeConvoys) {
      tacticalAudio.playAlert();
      addToast(`ACCESS RESTRICTED: Forward JCO [${currentOfficer.rank} ${currentOfficer.name}] cannot change convoy dispatch status.`);
      return;
    }
    tacticalAudio.playBlip();
    setDispatches(prev =>
      prev.map(dp => {
        if (dp.id !== id) return dp;
        const nextStatus = dp.status === 'Pending' ? 'Approved' : dp.status === 'Approved' ? 'Weather hold' : 'Approved';
        addToast(`DISPATCH [${dp.id}] status updated to ${nextStatus}`);
        return { ...dp, status: nextStatus };
      })
    );
  };

  const handleExportBrief = () => {
    tacticalAudio.playSonar();
    setIsOpordOpen(true);
    addToast('OPERATIONAL BRIEFING EXPORT: Generated standard HQ 14 Corps Logistics OPORD document.');
  };

  const handleSectorChange = (sectorId: MilitarySectorId) => {
    setSelectedSectorId(sectorId);
    tacticalAudio.playSonar();
    const sector = MILITARY_SECTORS[sectorId];
    if (sector.outpostIds.length > 0) {
      setSelectedOutpostId(sector.outpostIds[0]);
    }
    addToast(`THEATER SECTOR ENGAGED: [${sector.name}] — ${sector.formation} (${sector.broProject})`);
  };

  const getDosColor = (dos: number) => {
    if (dos < 4) return '#ef4444';
    if (dos < 6) return '#f59e0b';
    return '#10b981';
  };

  if (activeNav === 'iplms') {
    return (
      <div className="iplms-viewport-root">
        <IplmsDashboard
          onNotify={addToast}
          onOpenPlanner={() => setActiveNav('planner')}
          onOpenDemandTab={() => setActiveNav('demand')}
          onOpenTelemetry={() => setActiveNav('telemetry')}
        />
        {/* RASAD Sahayak AI Tactical Military Floating Chatbot */}
        <RasadSahayakBot />
        {/* Toast Notifications Hub */}
        <div className="toast-container" style={{ zIndex: 9999 }}>
          {toasts.map(toast => (
            <div
              key={toast.id}
              className="tactical-toast"
              onClick={() => dismissToast(toast.id)}
              style={{ cursor: 'pointer' }}
              title="Click to dismiss"
            >
              <div className="pulse-dot" style={{ background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }}></div>
              <span style={{ flex: 1 }}>{toast.message}</span>
              <span style={{ opacity: 0.6, fontSize: '1.1rem', marginLeft: '8px', lineHeight: 1 }}>&times;</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="c4isr-layout">
      {/* ========================================================================= */}
      {/* 1. FIXED LEFT ENTERPRISE MILITARY COMMAND SIDEBAR                         */}
      {/* ========================================================================= */}
      <aside className="c4isr-sidebar">
        <div className="sidebar-top">
          {/* Brand Heading */}
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">
              <RasadLogoIcon size={26} color="#73D3E4" />
            </div>
            <div className="sidebar-brand-text">
              <h2>RASAD-AI</h2>
              <span>LOGISTICS INTELLIGENCE</span>
            </div>
          </div>

          {/* Primary Operations Nav Menu */}
          <div className="sidebar-nav-section">
            <div className="nav-section-title">OPERATIONS</div>
            <button
              className="sidebar-nav-item"
              onClick={() => {
                setActiveNav('iplms');
                tacticalAudio.playSonar();
              }}
              style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.35)', marginBottom: '6px' }}
              title="Return to IPLMS Strategic Command Dashboard"
            >
              <span className="sidebar-nav-icon">🛡️</span>
              <span style={{ fontWeight: 700, color: '#38bdf8' }}>IPLMS Dashboard</span>
            </button>
            <button
              className={`sidebar-nav-item ${activeNav === 'overview' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('overview');
                tacticalAudio.playBlip();
              }}
            >
              <span className="sidebar-nav-icon">
                <CommandOverviewIcon size={18} color={activeNav === 'overview' ? '#73D3E4' : '#8098AB'} />
              </span>
              <span>Tactical detail</span>
            </button>
            <button
              className={`sidebar-nav-item ${activeNav === 'planner' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('planner');
                tacticalAudio.playBlip();
              }}
            >
              <span className="sidebar-nav-icon">
                <LogisticsPlannerIcon size={18} color={activeNav === 'planner' ? '#73D3E4' : '#8098AB'} />
              </span>
              <span>Logistics planner</span>
            </button>
            <button
              className={`sidebar-nav-item ${activeNav === 'demand' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('demand');
                tacticalAudio.playBlip();
              }}
            >
              <span className="sidebar-nav-icon">
                <DemandIcon size={18} color={activeNav === 'demand' ? '#73D3E4' : '#8098AB'} />
              </span>
              <span>Demand &amp; explainability</span>
            </button>
            <button
              className={`sidebar-nav-item ${activeNav === 'copilot' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('copilot');
                tacticalAudio.playBlip();
              }}
            >
              <span className="sidebar-nav-icon">
                <CopilotIcon size={18} color={activeNav === 'copilot' ? '#73D3E4' : '#8098AB'} />
              </span>
              <span>Doctrine copilot</span>
            </button>
            <button
              className={`sidebar-nav-item ${activeNav === 'telemetry' ? 'active' : ''}`}
              onClick={() => {
                setActiveNav('telemetry');
                tacticalAudio.playBlip();
              }}
            >
              <span className="sidebar-nav-icon">
                <TelemetryIcon size={18} color={activeNav === 'telemetry' ? '#73D3E4' : '#8098AB'} />
              </span>
              <span>Telemetry &amp; resilience</span>
            </button>
          </div>

          <div className="sidebar-nav-divider"></div>

          {/* Secondary Utilities Nav */}
          <div className="sidebar-nav-section">
            <div className="nav-section-title">SPECIALIST TOOLS</div>
            <button
              className="sidebar-nav-item"
              onClick={() => setIsScannerOpen(true)}
              title="Optical Cargo Scanner (YOLOv8 CV)"
            >
              <span className="sidebar-nav-icon">
                <CargoScanIcon size={18} color="#8098AB" />
              </span>
              <span>Cargo checkpoint</span>
            </button>
            <button
              className="sidebar-nav-item"
              onClick={() => setIsGuardrailsOpen(true)}
              title="Autonomous Dispatch Safety Guardrails"
            >
              <span className="sidebar-nav-icon">
                <GuardrailIcon size={18} color="#8098AB" />
              </span>
              <span>Guardrail dispatch</span>
            </button>
            <button
              className="sidebar-nav-item"
              onClick={() => setIsMultimodalOpen(true)}
              title="Tri-Modal Air Bridge (IAF C-130J + ALH + UAV)"
            >
              <span className="sidebar-nav-icon">
                <AirBridgeIcon size={18} color="#8098AB" />
              </span>
              <span>Tri-Modal air bridge</span>
            </button>
          </div>
        </div>

        {/* Sidebar Footer: Local Workspace & Commander Profile (Figma Exact) */}
        <div className="sidebar-bottom">
          <div className="sidebar-workspace-info">
            <div className="workspace-label-title">Local workspace</div>
            <div className="workspace-label-sub">Network disconnected</div>
            <div className="workspace-label-sub">Last refresh · 20:41 IST</div>
          </div>

          <div className="user-profile-badge">
            <div className="user-avatar">CO</div>
            <div className="user-meta">
              <div className="user-meta-name">Commander</div>
              <div className="user-meta-role">HQ 14 Corps</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN OPERATIONAL WORKSPACE                                             */}
      {/* ========================================================================= */}
      <main className="c4isr-main">
        {/* Top Sticky Bar: Sector Selector, Status, Display & Audio, Bell (Figma Match) */}
        <header className="c4isr-topbar">
          <div className="topbar-left">
            <span className="topbar-hq-label">HQ 14 CORPS</span>
            <div className="topbar-sector-select-wrapper">
              <select
                className="topbar-sector-select"
                value={selectedSectorId}
                onChange={e => handleSectorChange(e.target.value as MilitarySectorId)}
                title="Select Military Operational Sector"
              >
                <option value="SECTOR_DSDBO">DS-DBO Highway (81 Bde)</option>
                <option value="SECTOR_SSN">SSN &amp; Siachen (102 Bde)</option>
                <option value="SECTOR_CHUSHUL">Pangong / Chushul (3 Div)</option>
                <option value="SECTOR_WESTERN">Kargil / Zojila (8 Mtn Div)</option>
              </select>
              <span className="topbar-select-arrow">▾</span>
            </div>
          </div>

          <div className="topbar-right">
            {/* Edge Local Mode Tag */}
            <div className="airgap-pill">
              <span className="pulse-dot" style={{ width: '6px', height: '6px', background: '#73D3E4' }}></span>
              <span>Local mode · network disconnected</span>
            </div>

            {/* Display & Audio Settings Button */}
            <div className="hud-select-wrapper">
              <button
                className="btn-export-brief"
                style={{ padding: '6px 12px', fontSize: '0.80rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={handleToggleSound}
                title="Display & audio controls"
              >
                <span>🎛️</span>
                <span>Display &amp; audio</span>
              </button>
            </div>

            {/* Notification Bell */}
            <button className="bell-btn" title="Pending Directives" onClick={() => addToast('3 operational directives awaiting commander review.')}>
              🔔
              <span className="bell-badge">{awaitingCount}</span>
            </button>
          </div>
        </header>

        {/* ======================================================================= */}
        {/* WORKSPACE 1: COMMAND OVERVIEW                                           */}
        {/* ======================================================================= */}
        {activeNav === 'overview' && (
          <div className="command-overview-container">
            {/* Overview Header (Figma Match) */}
            <div className="overview-header">
              <div className="overview-title-group">
                <div className="subtag-pill-row">
                  <span className="overview-subtag-text">DEPSANG · NORTHERN SECTOR</span>
                  <span className="subtag-pill">Demo / synthetic data</span>
                </div>
                <h1>Command overview</h1>
                <div className="subtitle">A shared operating picture for the next dispatch window.</div>
              </div>

              <div className="overview-header-controls">
                <div className="header-control-group">
                  <label>Scenario</label>
                  <select
                    className="scenario-select"
                    value={crisisScenario}
                    onChange={e => handleTriggerCrisis(e.target.value as any)}
                  >
                    <option value="NORMAL">Baseline operations</option>
                    <option value="AVALANCHE">Khardung La Avalanche Blockade</option>
                    <option value="DEFCON1">DEFCON 1 Combat Surge</option>
                    <option value="GPS_SPOOF">EW GPS Spoofing Attack</option>
                  </select>
                </div>

                <div className="header-control-group">
                  <label>As of {istTime || '20:41:36 IST'}</label>
                  <button className="btn-export-brief" onClick={handleExportBrief} title="Generate Official OPORD Document &amp; Print">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Export brief
                  </button>
                </div>
              </div>
            </div>

            {/* Advanced Winter Stocking (AWS) Macro Dashboard (if toggled) */}
            {showAwsTracker && (
              <div style={{ marginBottom: '14px' }}>
                <AwsStockingTracker onNotify={addToast} />
              </div>
            )}

            {/* Live Drone FLIR Reconnaissance HUD (if toggled) */}
            {showFlir && (
              <div style={{ marginBottom: '4px' }}>
                <FlirThermalHud />
              </div>
            )}

            {/* 4 Executive KPI Ribbon Cards (Figma Match) */}
            <div className="executive-kpi-grid">
              <div className="exec-kpi-card">
                <div className="exec-kpi-header">
                  <span className="exec-kpi-title">Outposts reporting</span>
                  <RadioOutpostsIcon size={16} color="#8098AB" />
                </div>
                <div className="exec-kpi-val">5 / 6</div>
                <div className="exec-kpi-sub">Murgo reading under review</div>
              </div>

              <div className="exec-kpi-card">
                <div className="exec-kpi-header">
                  <span className="exec-kpi-title">Fleet available</span>
                  <LogisticsPlannerIcon size={16} color="#8098AB" />
                </div>
                <div className="exec-kpi-val">18 / 24</div>
                <div className="exec-kpi-sub">12 road · 2 air · 4 UAV</div>
              </div>

              <div className="exec-kpi-card alert-card">
                <div className="exec-kpi-header">
                  <span className="exec-kpi-title">Minimum reserve cover</span>
                  <AlertTriangleIcon size={16} color="#e57a3b" />
                </div>
                <div className="exec-kpi-val alert-val">
                  {crisisScenario === 'DEFCON1' ? '0.8 days' : '2.1 days'}
                </div>
                <div className="exec-kpi-sub">
                  {crisisScenario === 'DEFCON1' ? 'CRITICAL DEFCON-1 AMMO DEFICIT' : 'DBO fuel · below 4-day target'}
                </div>
              </div>

              <div className="exec-kpi-card">
                <div className="exec-kpi-header">
                  <span className="exec-kpi-title">Awaiting authorization</span>
                  <ClipboardListIcon size={16} color="#8098AB" />
                </div>
                <div className="exec-kpi-val">03</div>
                <div className="exec-kpi-sub">Plans requiring commander signoff</div>
              </div>
            </div>

            {/* ROW 1: Northern Sector Operating Picture (Left) & Priority Watch (Right) */}
            <div className={`overview-split-row ${isMapExpanded ? 'theatre-expanded' : ''}`}>
              {/* Operating Picture Panel (Figma Match) */}
              <div className="operating-picture-panel">
                <div className="operating-picture-header">
                  <div className="operating-title-block">
                    <h3>Northern sector operating picture</h3>
                    <p>10 tactical nodes · staging depots &amp; corridors</p>
                  </div>
                  <div className="operating-header-actions">
                    <div className="map-view-toggle">
                      <button
                        className={mapMode === 'schematic' ? 'active' : ''}
                        onClick={() => setMapMode('schematic')}
                        title="Topological schematic view [Hotkey: M]"
                      >
                        Schematic
                      </button>
                      <button
                        className={mapMode === 'gis' ? 'active' : ''}
                        onClick={() => setMapMode('gis')}
                        title="Live interactive GIS Leaflet Map with Convoys [Hotkey: M]"
                      >
                        Cached GIS
                      </button>
                    </div>

                    {/* Full-Width Theatre Mode Toggle */}
                    <button
                      className={`btn-theatre-toggle ${isMapExpanded ? 'active' : ''}`}
                      onClick={() => {
                        tacticalAudio.playBlip();
                        setIsMapExpanded(p => !p);
                        addToast(!isMapExpanded ? 'THEATRE MODE: Map expanded to full-width operational canvas (640px).' : 'THEATRE MODE: Restored split view.');
                      }}
                      title="Expand map to full width [Theatre Mode]"
                    >
                      {isMapExpanded ? (
                        <>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="4 14 10 14 10 20" />
                            <polyline points="20 10 14 10 14 4" />
                            <line x1="14" y1="10" x2="21" y2="3" />
                            <line x1="3" y1="21" x2="10" y2="14" />
                          </svg>
                          <span>Split view</span>
                        </>
                      ) : (
                        <>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 3 21 3 21 9" />
                            <polyline points="9 21 3 21 3 15" />
                            <line x1="21" y1="3" x2="14" y2="10" />
                            <line x1="3" y1="21" x2="10" y2="14" />
                          </svg>
                          <span>⛶ Expand map</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Live Tactical Meteorological Telemetry Strip (Open-Meteo API) */}
                <div className="tactical-live-weather-strip">
                  <div className={`weather-strip-badge ${isLiveWeatherOnline ? 'live' : 'cached'}`}>
                    <span style={{ fontSize: '10px' }}>{isLiveWeatherOnline ? '●' : '○'}</span>
                    <span>{isLiveWeatherOnline ? 'LIVE METEO' : 'CACHED METEO'}</span>
                  </div>

                  <div className="weather-strip-nodes">
                    {TACTICAL_WEATHER_NODES.map(node => {
                      const data = weatherData[node.id];
                      if (!data) return null;
                      const passClass =
                        data.passStatus === 'CLOSED'
                          ? 'pass-closed'
                          : data.passStatus === 'WARNING'
                          ? 'pass-warning'
                          : 'pass-open';
                      return (
                        <div
                          key={node.id}
                          className="weather-node-chip"
                          title={`${data.name} (${data.altitudeM}m) · ${data.conditionText} · Wind: ${data.windSpeedKmh} km/h · Updated: ${data.lastUpdated}`}
                        >
                          <span className="node-name">{node.name.split(' ')[0]}</span>
                          <span className="node-temp subzero">{data.temperatureC > 0 ? `+${data.temperatureC}` : `${data.temperatureC}`}°C</span>
                          <span className="node-wind" style={{ color: '#8098AB', fontSize: '0.70rem' }}>{data.windSpeedKmh}km/h</span>
                          <span className={`node-pass ${passClass}`}>{data.passStatus}</span>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    className={`btn-weather-refresh ${isRefreshingWeather ? 'refreshing' : ''}`}
                    onClick={() => handleFetchWeather(true)}
                    title="Poll real-time Open-Meteo weather API for Ladakh nodes"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                    </svg>
                    <span>Sync</span>
                  </button>
                </div>

                {/* Map Display: Schematic or Full GIS */}
                <div style={{ height: isMapExpanded ? '640px' : '530px', width: '100%', position: 'relative', transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                  {mapMode === 'schematic' ? (
                    <SchematicMap
                      selectedOutpostId={selectedOutpostId}
                      onSelectOutpost={handleSelectOutpost}
                    />
                  ) : (
                    <TacticalMap
                      ref={mapRef}
                      selectedOutpostId={selectedOutpostId}
                      onSelectOutpost={handleSelectOutpost}
                      onToast={addToast}
                      simDay={simDay}
                      outposts={outposts}
                      onAdvanceSimulation={handleAdvanceSimulation}
                      onSimulateBlizzard={handleSimulateBlizzard}
                      blizzardActive={blizzardActive}
                      onToggleElevation={() => setShowElevation(p => !p)}
                      showElevation={showElevation}
                    />
                  )}
                </div>

                {/* High-Altitude Route Elevation Cross-Section Profile (if toggled) */}
                {showElevation && <ElevationProfile sectorId={selectedSectorId} />}

                {/* SASE / DRDO DGRE Avalanche Threat Matrix Panel (if toggled) */}
                {showAvalancheThreat && (
                  <div style={{ marginTop: '12px' }}>
                    <AvalancheThreatPanel
                      onNotify={addToast}
                      showDoppler={showDopplerRadar}
                      onToggleDoppler={() => setShowDopplerRadar(p => !p)}
                    />
                  </div>
                )}

                {/* Operating Picture Footer Legend & Simulations Action Bar (Figma Match) */}
                <div className="operating-picture-footer">
                  <div className="operating-legend-row">
                    <div className="corridor-legend">
                      <div className="corridor-legend-item">
                        <span className="legend-swatch road"></span>
                        <span>Road</span>
                      </div>
                      <div className="corridor-legend-item">
                        <span className="legend-swatch air"></span>
                        <span>Airdrop</span>
                      </div>
                      <div className="corridor-legend-item">
                        <span className="legend-swatch uav"></span>
                        <span>UAV corridor</span>
                      </div>
                    </div>
                    <div className="schematic-disclaimer">
                      Schematic—not for navigation
                    </div>
                  </div>

                  <div className="map-simulations-bar">
                    <span className="map-sim-title">ANALYSIS &amp; SIMULATIONS</span>
                    <div className="map-sim-links">
                      <button
                        className="map-sim-link"
                        onClick={() => {
                          tacticalAudio.playBlip();
                          setShowAwsTracker(p => !p);
                        }}
                        title="180-Day Advanced Winter Stocking Macro Tracking"
                      >
                        AWS Winter Stocking ↗
                      </button>

                      <button
                        className="map-sim-link"
                        onClick={() => setIsUavAirDropOpen(true)}
                        title="Simulate Autonomous Heavy-Lift UAV Air-Drop"
                      >
                        UAV Sortie Sim ↗
                      </button>

                      <div className="map-sim-link-group">
                        <button
                          className="map-sim-link"
                          onClick={() => setShowElevation(p => !p)}
                          title="DS-DBO Highway Altitude Cross-Section"
                        >
                          Elevation profile ↗
                        </button>
                        <span className="map-sim-sub">HIMANK - Pass: Murgo</span>
                      </div>

                      <button
                        className="map-sim-link"
                        onClick={() => {
                          tacticalAudio.playBlip();
                          setShowAvalancheThreat(p => !p);
                        }}
                        title="DRDO DGRE Avalanche Threat Matrix"
                      >
                        Avalanche risk ↗
                      </button>

                      <button
                        className="map-sim-link"
                        onClick={() => setShowFlir(p => !p)}
                        title="Live Drone FLIR Reconnaissance Feed"
                      >
                        Live Drone FLIR ↗
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Priority Watch Panel (Figma Match) */}
              <div className="priority-watch-panel">
                <div className="priority-watch-header">
                  <div>
                    <h3>Priority watch</h3>
                    <p>3 items requiring attention</p>
                  </div>
                  <span className="badge-priority-count">3</span>
                </div>

                <div className="priority-items-list">
                  {/* Item 1: DBO */}
                  <div className="priority-item-card">
                    <div className="priority-item-top">
                      <div className="priority-item-name">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#e57a3b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 22v-14a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v14" />
                          <path d="M15 10h2a2 2 0 0 1 2 2v3a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L20.5 6.5" />
                          <line x1="3" y1="22" x2="15" y2="22" />
                        </svg>
                        DBO
                      </div>
                      <span className="priority-badge p-orange">Priority 01</span>
                    </div>
                    <div className="priority-item-category">FUEL RESERVE</div>
                    <div className="priority-item-desc">
                      {crisisScenario === 'DEFCON1'
                        ? '0.8 days of kerosene cover under combat expenditure. Immediate replenishment needed.'
                        : '2.1 days of kerosene cover. Review the 4,200 L replenishment recommendation.'}
                    </div>
                    <button
                      className="priority-action-link"
                      onClick={() => {
                        setSelectedOutpostId('op-dbo');
                        setActiveNav('demand');
                      }}
                    >
                      Inspect forecast &amp; explanation ↗
                    </button>
                  </div>

                  {/* Item 2: Khardung La */}
                  <div className="priority-item-card">
                    <div className="priority-item-top">
                      <div className="priority-item-name">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        Khardung La
                      </div>
                      <span className="priority-badge p-brown">Time-sensitive</span>
                    </div>
                    <div className="priority-item-category">CROSSING WINDOW</div>
                    <div className="priority-item-desc">
                      {crisisScenario === 'AVALANCHE'
                        ? 'Avalanche at Km 134. Crossing suspended. Diverting to alternate window.'
                        : 'Cross before 14:00. Planned 12:20 crossing retains a weather buffer.'}
                    </div>
                    <button
                      className="priority-action-link"
                      onClick={() => setActiveNav('planner')}
                    >
                      Review route &amp; weather window ↗
                    </button>
                  </div>

                  {/* Item 3: Murgo */}
                  <div className="priority-item-card">
                    <div className="priority-item-top">
                      <div className="priority-item-name">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8098AB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4.9 19.1C2.5 16.7 2.5 12.8 4.9 10.4M19.1 19.1c2.4-2.4 2.4-6.3 0-8.7M7.8 16.2c-1.2-1.2-1.2-3.1 0-4.3M16.2 16.2c1.2-1.2 1.2-3.1 0-4.3M12 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                        </svg>
                        Murgo
                      </div>
                      <span className="priority-badge p-neutral">Under review</span>
                    </div>
                    <div className="priority-item-category">DATA QUALITY</div>
                    <div className="priority-item-desc">
                      Anomalous ammunition reading. Retain the estimate and confirm locally.
                    </div>
                    <button
                      className="priority-action-link"
                      onClick={() => setActiveNav('telemetry')}
                    >
                      Inspect telemetry &amp; confirm reading ↗
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: Upcoming Dispatches Table (Left) & Commander Decisions (Right) */}
            <div className="overview-split-row">
              {/* Upcoming Dispatches Table Panel (Figma Match) */}
              <div className="upcoming-dispatches-panel">
                <div className="dispatches-header">
                  <div>
                    <h3>Upcoming dispatches</h3>
                    <p>Proposed movements · no automatic deployment</p>
                  </div>
                  <button
                    className="link-open-planner"
                    onClick={() => setActiveNav('planner')}
                  >
                    Open planner ↗
                  </button>
                </div>

                <div className="dispatches-table-wrapper">
                  <table className="c4isr-table">
                    <thead>
                      <tr>
                        <th>PLAN / ROUTE</th>
                        <th>PAYLOAD</th>
                        <th>MODE</th>
                        <th>WINDOW</th>
                        <th>AUTHORIZATION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dispatches.map(dp => {
                        const isSigned = dp.status === 'Approved';
                        const isHold = dp.status === 'Weather hold';
                        return (
                          <tr key={dp.id}>
                            <td>
                              <div className="cell-title">{dp.route}</div>
                              <div className="cell-sub">{dp.id}</div>
                            </td>
                            <td>{dp.cargo}</td>
                            <td>{dp.mode}</td>
                            <td>
                              <div className="cell-title">{dp.window}</div>
                              <div className="cell-sub">{dp.subWindow}</div>
                            </td>
                            <td>
                              <button
                                className={`btn-auth-signoff ${isSigned ? 'signed' : ''}`}
                                style={isHold ? { borderColor: '#f59e0b', color: '#fbbf24', background: 'rgba(245, 158, 11, 0.15)' } : undefined}
                                onClick={() => handleToggleDispatchStatus(dp.id)}
                              >
                                {isSigned ? '✓ Authorized' : isHold ? '⚠️ Weather Hold' : 'Pending signoff'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Commander Decisions Queue Panel (Figma Match) */}
              <div className="decision-queue-panel">
                <div className="decision-queue-header">
                  <div>
                    <h3>Commander decisions</h3>
                    <p>3 awaiting authorization</p>
                  </div>
                  <span className="badge-open-decisions">03</span>
                </div>

                <div className="decision-items-list">
                  <div className="decision-card">
                    <div className="decision-card-left">
                      <span className="decision-num">01</span>
                      <div className="decision-text-group">
                        <div className="decision-title">Review DBO replenishment</div>
                        <div className="decision-sub">4,200 L kerosene · proposed road convoy</div>
                      </div>
                    </div>
                    <button
                      className="btn-decision-review"
                      onClick={() => {
                        handleAuthorizeDecision('D-01');
                        addToast('Directive #01 (DBO Replenishment) authorization reviewed.');
                      }}
                    >
                      Review →
                    </button>
                  </div>

                  <div className="decision-card">
                    <div className="decision-card-left">
                      <span className="decision-num">02</span>
                      <div className="decision-text-group">
                        <div className="decision-title">Confirm crossing window</div>
                        <div className="decision-sub">Khardung La · 12:20 with weather buffer</div>
                      </div>
                    </div>
                    <button
                      className="btn-decision-review"
                      onClick={() => {
                        handleAuthorizeDecision('D-02');
                        addToast('Directive #02 (Khardung La Window) confirmed.');
                      }}
                    >
                      Review →
                    </button>
                  </div>

                  <div className="decision-card">
                    <div className="decision-card-left">
                      <span className="decision-num">03</span>
                      <div className="decision-text-group">
                        <div className="decision-title">Request Murgo confirmation</div>
                        <div className="decision-sub">Retain estimate pending local check</div>
                      </div>
                    </div>
                    <button
                      className="btn-decision-review"
                      onClick={() => {
                        handleAuthorizeDecision('D-03');
                        addToast('Directive #03 (Murgo Telemetry) confirmed.');
                      }}
                    >
                      Review →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Disclaimer Bar (Figma Match) */}
            <div className="overview-bottom-disclaimer">
              <div>Decision support only · Recommendations require commander authorization.</div>
              <div>Demo / synthetic data</div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* WORKSPACE 2: LOGISTICS PLANNER (FULL-PAGE CVRPTW SOLVER)               */}
        {/* ======================================================================= */}
        {activeNav === 'planner' && (
          <PlannerWorkspace
            onNotify={addToast}
            onOpenGuardrail={() => setIsGuardrailsOpen(true)}
          />
        )}

        {/* ======================================================================= */}
        {/* WORKSPACE 3: DEMAND & EXPLAINABILITY (CHART.JS PREDICTIVE ENGINE + XAI) */}
        {/* ======================================================================= */}
        {activeNav === 'demand' && (
          <div className="command-overview-container">
            <div className="overview-header">
              <div className="overview-title-group">
                <div className="subtag">RASAD / ANALYTICS / ML DEMAND &amp; EXPLAINABILITY</div>
                <h1>Outpost Predictive Demand Analytics</h1>
                <div className="subtitle">
                  High-altitude Days of Supply (DOS) forecasting, depletion trajectories, and SHAP factor attribution.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="defense-btn winner-btn" onClick={() => setIsXaiOpen(true)}>
                  📊 Deep SHAP Drivers
                </button>
                <button className="defense-btn winner-btn highlight" onClick={() => setIsGuardrailsOpen(true)}>
                  🛡️ Guardrail Dispatch
                </button>
              </div>
            </div>

            {/* Outpost Selector HUD Bar */}
            <div className="outpost-selector-bar">
              <span className="selector-label">SELECT FORWARD POST:</span>
              <select
                className="custom-select"
                value={selectedOutpostId}
                onChange={e => handleSelectOutpost(e.target.value)}
              >
                {outposts.map(o => (
                  <option key={o.id} value={o.id}>
                    {o.code} - {o.name} ({o.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Outpost Quick Health Summary Banner */}
            <div className="outpost-stats-banner">
              <div className="outpost-stat-box">
                <div className="stat-box-title">Days of Supply (DOS)</div>
                <div className="stat-box-value" style={{ color: getDosColor(currentOutpost.daysOfSupply) }}>
                  {currentOutpost.daysOfSupply} DAYS
                </div>
              </div>
              <div className="outpost-stat-box">
                <div className="stat-box-title">Troop Garrison</div>
                <div className="stat-box-value">{currentOutpost.troops} SOLDIERS</div>
              </div>
              <div className="outpost-stat-box">
                <div className="stat-box-title">Altitude / Weather</div>
                <div className="stat-box-value" style={{ fontSize: '1.20rem', color: '#38bdf8' }}>
                  {currentOutpost.altitude.split(' ')[0]} • {currentOutpost.weather.temp}
                </div>
              </div>
            </div>

            {/* Supply Class Switcher Tabs */}
            <div className="supply-tabs">
              <button
                className={`tab-btn ${selectedCategory === 'class3_pol' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('class3_pol')}
              >
                Class III: Fuel/POL (Liters)
              </button>
              <button
                className={`tab-btn ${selectedCategory === 'class1_rations' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('class1_rations')}
              >
                Class I: Rations (Kg)
              </button>
              <button
                className={`tab-btn ${selectedCategory === 'class5_ammo' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('class5_ammo')}
              >
                Class V: Ammo (Rounds)
              </button>
              <button
                className={`tab-btn ${selectedCategory === 'class8_medical' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('class8_medical')}
              >
                Class VIII: Med/HAPE
              </button>
            </div>

            {/* Demand Chart Component */}
            <div className="panel" style={{ padding: '16px', background: 'var(--bg-card)' }}>
              <DemandChart
                outpostId={selectedOutpostId}
                category={selectedCategory}
                showResupplyImpact={resupplyApproved}
                simDay={simDay}
                theme={theme}
              />
            </div>

            {/* Explainable AI (XAI) Feature Importance Summary Card */}
            <div className="xai-summary-card">
              <div className="xai-summary-header">
                <div className="xai-title">
                  <span className="sparkle-icon">✨</span>
                  <span>Explainable AI (XAI) Demand Attribution — Why this outpost needs supplies</span>
                </div>
                <button className="xai-details-btn" onClick={() => setIsXaiOpen(true)}>
                  Detailed SHAP Analysis &rarr;
                </button>
              </div>
              <div className="xai-tags">
                <span className="xai-factor-tag critical">
                  Sub-zero Temperature (-24°C): +48% Kerosene Burn
                </span>
                <span className="xai-factor-tag critical">
                  High Altitude Hypoxia (16,614 ft): +25% Caloric Burn
                </span>
                <span className="xai-factor-tag warning">
                  DEFCON-2 Readiness: +40% Class V Ammo Reserve
                </span>
                <span className="xai-factor-tag optimal">
                  RISAT-2B Telemetry Link: 99.8% Confidence
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================================= */}
        {/* WORKSPACE 4: DOCTRINE COPILOT (FULL-PAGE AI & SOP MANUALS BROWSER)      */}
        {/* ======================================================================= */}
        {activeNav === 'copilot' && <CopilotWorkspace />}

        {/* ======================================================================= */}
        {/* WORKSPACE 5: TELEMETRY & EW RESILIENCE (FULL-PAGE SPECTRUM MONITOR)    */}
        {/* ======================================================================= */}
        {activeNav === 'telemetry' && (
          <TelemetryWorkspace
            isSpoofed={isSpoofed}
            onSpoofToggle={setIsSpoofed}
            onNotify={addToast}
          />
        )}
      </main>

      {/* ========================================================================= */}
      {/* 3. MODAL DIALOGS & DRAWERS                                                */}
      {/* ========================================================================= */}

      {/* Official Indian Army OPORD Operational Order Export Modal */}
      <OpordModal
        isOpen={isOpordOpen}
        onClose={() => setIsOpordOpen(false)}
        dispatches={dispatches.map(d => ({ ...d, departure: d.window }))}
        zuluTime={zuluTime}
      />

      {/* Slide-out Military SOP Copilot Drawer */}
      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />

      {/* Autonomous Dispatch Guardrails Modal */}
      <GuardrailsModal
        isOpen={isGuardrailsOpen}
        onClose={() => setIsGuardrailsOpen(false)}
        onConfirmDispatch={handleConfirmDispatch}
        onNotify={addToast}
      />

      {/* Optical Cargo Scanner Modal */}
      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

      {/* Explainable AI Modal */}
      <XaiModal
        isOpen={isXaiOpen}
        onClose={() => setIsXaiOpen(false)}
        onNotify={addToast}
      />

      {/* CVRPTW Solver Modal */}
      <CvrptwModal
        isOpen={isCvrptwOpen}
        onClose={() => setIsCvrptwOpen(false)}
        onNotify={addToast}
      />

      {/* Tri-Modal Logistics Modal */}
      <MultimodalModal
        isOpen={isMultimodalOpen}
        onClose={() => setIsMultimodalOpen(false)}
        onNotify={addToast}
        onFocusCorridors={() => mapRef.current?.focusAerialCorridors()}
      />

      {/* Electronic Warfare Modal */}
      <EwModal
        isOpen={isEwOpen}
        onClose={() => setIsEwOpen(false)}
        onNotify={addToast}
        onSpoofStatusChange={setIsSpoofed}
      />

      {/* Convoy Vehicle Black-Box Mechanical & Hypoxia Telemetry Modal */}
      <ConvoyTelemetryModal
        isOpen={isConvoyTelemetryOpen}
        onClose={() => setIsConvoyTelemetryOpen(false)}
        convoyId={selectedConvoyId}
        onNotify={addToast}
      />

      {/* Autonomous Heavy-Lift Drone (UAV) Air-Drop Flight Simulator */}
      <UavAirDropModal
        isOpen={isUavAirDropOpen}
        onClose={() => setIsUavAirDropOpen(false)}
        onNotify={addToast}
      />

      {/* Hotkeys Cheat-Sheet Modal */}
      {showHotkeysModal && (
        <div className="modal-backdrop" onClick={() => setShowHotkeysModal(false)} style={{ zIndex: 1200 }}>
          <div className="tactical-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div className="tactical-modal-header">
              <div className="tactical-modal-title">⌨️ COMMANDER TACTICAL HOTKEYS (C2 KEYBINDINGS)</div>
              <button className="modal-close-btn" onClick={() => setShowHotkeysModal(false)}>&times;</button>
            </div>
            <div className="tactical-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#0f172a', borderRadius: '4px' }}>
                <b style={{ color: '#38bdf8' }}>[1]</b> <span>Switch to Command Overview</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#0f172a', borderRadius: '4px' }}>
                <b style={{ color: '#38bdf8' }}>[2]</b> <span>Switch to Logistics Planner Workspace</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#0f172a', borderRadius: '4px' }}>
                <b style={{ color: '#38bdf8' }}>[3]</b> <span>Switch to Demand &amp; Explainability Suite</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#0f172a', borderRadius: '4px' }}>
                <b style={{ color: '#38bdf8' }}>[4]</b> <span>Switch to Doctrine Copilot Workspace</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#0f172a', borderRadius: '4px' }}>
                <b style={{ color: '#38bdf8' }}>[5]</b> <span>Switch to Telemetry &amp; EW Resilience Console</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#0f172a', borderRadius: '4px' }}>
                <b style={{ color: '#f59e0b' }}>[Space]</b> <span>Advance Simulation Time (+1 Day)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#0f172a', borderRadius: '4px' }}>
                <b style={{ color: '#10b981' }}>[M]</b> <span>Toggle Map Mode (Schematic &harr; Live GIS)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#0f172a', borderRadius: '4px' }}>
                <b style={{ color: '#38bdf8' }}>[E]</b> <span>Export Indian Army OPORD Briefing Order</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#0f172a', borderRadius: '4px' }}>
                <b style={{ color: '#cbd5e1' }}>[A]</b> <span>Toggle Procedural Tactical Audio Synthesizer</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 10px', background: '#0f172a', borderRadius: '4px' }}>
                <b style={{ color: '#38bdf8' }}>[T]</b> <span>Launch Guided Operational Quick Tour ✨</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RASAD Sahayak AI Tactical Military Floating Chatbot */}
      <RasadSahayakBot />

      {/* Toast Notifications Hub */}
      <div className="toast-container">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="tactical-toast"
            onClick={() => dismissToast(toast.id)}
            style={{ cursor: 'pointer' }}
            title="Click to dismiss"
          >
            <div className="pulse-dot" style={{ background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }}></div>
            <span style={{ flex: 1 }}>{toast.message}</span>
            <span style={{ opacity: 0.6, fontSize: '1.1rem', marginLeft: '8px', lineHeight: 1 }}>&times;</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
