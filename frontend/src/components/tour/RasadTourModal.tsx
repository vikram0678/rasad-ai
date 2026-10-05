import React, { useEffect, useState, useRef, useCallback } from 'react';
import { tacticalAudio } from '../../utils/audio';
import './RasadTourModal.css';

export interface LocalizedStepContent {
  title: string;
  subtitle: string;
  content: string;
  tip: string;
  actionLabel?: string;
  actionQuery?: string;
}

export interface TourStep {
  id: string;
  targetSelector: string;
  preferredPosition?: 'top' | 'bottom' | 'left' | 'right';
  isCircle?: boolean;
  en: LocalizedStepContent;
  hi: LocalizedStepContent;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 'step-welcome',
    targetSelector: '',
    preferredPosition: 'top',
    en: {
      title: '🛡️ Welcome to RASAD-AI (IPLMS)',
      subtitle: 'Integrated Predictive Logistics Management System // HQ 14 Corps',
      content: 'RASAD-AI is an operational C4ISR military logistics decision support platform engineered for high-altitude theatres (Ladakh, Siachen Glacier, and the DS-DBO axis). It unifies real-time Class I-V inventory tracking, multi-modal air-land dispatch planning, 7-day predictive consumption forecasting, and 24/7 doctrine-aligned AI assistance.',
      tip: '💡 Operational Workflow: 1️⃣ Readiness KPIs ➔ 2️⃣ Tactical GIS Map ➔ 3️⃣ Incident Triaging ➔ 4️⃣ Inventory Ledger ➔ 5️⃣ Demand Forecast ➔ 6️⃣ Fleet War-Gaming ➔ 7️⃣ RASAD Sahayak AI.',
      actionLabel: 'Start Operational Tour 🚀 ✨'
    },
    hi: {
      title: '🛡️ रसद-एआई (RASAD-AI) में आपका स्वागत है',
      subtitle: 'एकीकृत पूर्वानुमानात्मक रसद प्रबंधन प्रणाली // 14 कोर मुख्यालय',
      content: 'रसद-एआई (IPLMS) लद्दाख, सियाचिन ग्लेशियर और डीबीओ सेक्टर जैसे उच्च-ऊंचाई वाले सामरिक क्षेत्रों के लिए विकसित एक उन्नत सैन्य आपूर्ति प्रबंधन प्रणाली है। यह वास्तविक समय में क्लास I-V सैन्य इन्वेंट्री, त्रि-आयामी परिवहन, 7-दिवसीय खपत पूर्वानुमान और 24/7 सैन्य सिद्धांतों पर आधारित AI सहायता प्रदान करता है।',
      tip: '💡 सामरिक कार्यप्रणाली: 1️⃣ तत्परता मैट्रिक्स ➔ 2️⃣ सामरिक जीआईएस मानचित्र ➔ 3️⃣ आपूर्ति आपात-समीक्षा ➔ 4️⃣ डिपो भंडार ➔ 5️⃣ मांग पूर्वानुमान ➔ 6️⃣ वाहन सिमुलेशन ➔ 7️⃣ रसद सहायक AI।',
      actionLabel: 'सामरिक टूर शुरू करें 🚀 ✨'
    }
  },
  {
    id: 'step-kpi',
    targetSelector: '#tour-kpi-ribbon, .iplms-kpi-grid',
    preferredPosition: 'bottom',
    en: {
      title: '📊 Theatre Readiness & Stocking KPIs',
      subtitle: 'High-Altitude Network Operational Snapshot',
      content: 'Monitor theatre-wide logistics health across 28 strategic nodes (5 Base Hubs, 8 Depots, 15 Forward Posts). Track active supply shortages, average days of supply (DOS), fleet availability, and pending dispatch authorizations at a glance.',
      tip: '💡 Tip: Clicking on any KPI card instantly highlights the corresponding critical outposts on the map and filters the incident table.'
    },
    hi: {
      title: '📊 थियेटर तत्परता व रसद केपीआई (KPIs)',
      subtitle: 'उच्च-पर्वतीय सैन्य आपूर्ति नेटवर्क की स्थिति',
      content: '28 सामरिक स्थानों (5 बेस, 8 डिपो, 15 अग्रिम चौकियां) पर रसद स्वास्थ्य की त्वरित समीक्षा करें। सक्रिय आपूर्ति संकट, स्टॉक के शेष दिन (DOS), वाहन उपलब्धता और प्रतीक्षारत कॉन्वॉय की रीयल-टाइम स्थिति देखें।',
      tip: '💡 सुझाव: किसी भी कार्ड पर क्लिक करके आप सीधे संबंधित अग्रिम चौकियों को मैप पर देख सकते हैं।'
    }
  },
  {
    id: 'step-map',
    targetSelector: '#tour-tactical-map, .iplms-map-card',
    preferredPosition: 'right',
    en: {
      title: '🗺️ Tactical Operational Map (Ladakh Theatre)',
      subtitle: 'Live GIS Nodes, Passes & Avalanche Corridors',
      content: 'Inspect forward military outposts (Post Charlie, Post Delta, DBO ALG, Siachen Base) and mountain passes (Khardung La, Zoji La, Chang La). Switch between Satellite, High-Altitude Terrain, and Night NVG basemaps, and toggle live weather hazard overlays.',
      tip: '💡 Tip: Click any outpost marker to view local garrison strength, sub-zero ambient temperature, and days-of-supply telemetry.'
    },
    hi: {
      title: '🗺️ सामरिक परिचालन मानचित्र (लद्दाख थियेटर)',
      subtitle: 'लाइव जीआईएस नोड्स, दर्रे और हिमस्खलन गलियारे',
      content: 'अग्रिम चौकियों (पोस्ट चार्ली, डीबीओ, सियाचिन) और उच्च पर्वतीय दर्रों (खारदुंग ला, जोजी ला) का लाइव निरीक्षण करें। सैटेलाइट, स्थलाकृतिक मेश या नाइट-विजन मानचित्र चुनें और मौसम चेतावनी ओवरले देखें।',
      tip: '💡 सुझाव: किसी भी चौकी पर क्लिक करके वहां की सैन्य क्षमता, तापमान और मौजूदा भंडार की जांच करें।'
    }
  },
  {
    id: 'step-incidents',
    targetSelector: '#tour-incidents-panel, .iplms-incidents-panel-wrap',
    preferredPosition: 'left',
    en: {
      title: '⚠️ Predictive Incidents & Dispatch Authorization',
      subtitle: 'Automated Shortage Detection with Commander Approval',
      content: 'Real-time AI alerts detect imminent stockouts across Class I (Rations), Class III (POL/Fuel), and Class V (Ammunition). Commanders maintain full command-and-control with one-click "Approve Dispatch" authorization to release military convoys and heavy-lift UAVs.',
      tip: '💡 Tip: Filter by "CRITICAL" to triage outposts with less than 24 hours of supply remaining.'
    },
    hi: {
      title: '⚠️ सक्रिय रसद आपातकाल व कॉन्वॉय अनुमोदन',
      subtitle: 'स्वचालित कमी चेतावनी एवं कमांडर-इन-द-लूप अनुमति',
      content: 'क्लास I (राशन), क्लास III (ईंधन) और क्लास V (गोला-बारूद) की आसन्न कमी का त्वरित पता लगाएं। कमांडर "Approve Dispatch" बटन दबाकर तुरंत राहत कॉन्वॉय और ड्रोन एयर-ड्रॉप को आधिकारिक मंजूरी दे सकते हैं।',
      tip: '💡 सुझाव: 24 घंटे से कम राशन वाली चौकियों को प्राथमिकता देने के लिए "CRITICAL" फ़िल्टर का उपयोग करें।'
    }
  },
  {
    id: 'step-inventory',
    targetSelector: '#tour-inventory-chart, .iplms-inventory-widget-exact',
    preferredPosition: 'top',
    en: {
      title: '📦 12-Base Strategic Inventory Ledger',
      subtitle: 'Comparative Stock Levels Across Northern Command',
      content: 'A 12-column visual bar ledger comparing current reserves from Base Jammu and Base Srinagar to forward sectors like Dras Depot and Post Charlie. Color-coded markers instantly distinguish Surplus (>70%), Safe (40-70%), and Critical Deficit (<40%).',
      tip: '💡 Tip: Clicking any base bar filters and updates the demand forecast dual-curve to that specific garrison.'
    },
    hi: {
      title: '📦 12-स्थानों का सामरिक इन्वेंट्री लेजर',
      subtitle: 'उत्तरी कमान के प्रमुख डिपो और चौकियों का भंडार',
      content: 'बेस जम्मू, श्रीनगर और लेह से लेकर द्रास डिपो व पोस्ट चार्ली तक 12 प्रमुख स्थानों के स्टॉक प्रतिशत का तुलनात्मक बार चार्ट। हरा (सुरक्षित), पीला (सावधानी) और लाल (गंभीर कमी) संकेतकों द्वारा तुरंत स्थिति स्पष्ट होती है।',
      tip: '💡 सुझाव: किसी भी बेस बार पर क्लिक करने से दाईं ओर का 7-दिवसीय मांग वक्र उसी स्थान पर रीसेट हो जाता है।'
    }
  },
  {
    id: 'step-forecast',
    targetSelector: '#tour-forecast-chart, .iplms-demand-widget-exact',
    preferredPosition: 'top',
    en: {
      title: '📈 7-Day Demand vs. Stock Crossover Engine',
      subtitle: 'AI Time-Series Forecasting & Danger Zone Analysis',
      content: 'Projects stock depletion curves against multi-factor predictive consumption (sub-zero heating demand, high-altitude caloric intake, and operational readiness). The shaded red danger zone alerts commanders when supplies cross below zero.',
      tip: '💡 Tip: The golden crossover point highlights the exact hour when consumption outpaces reserves without resupply.'
    },
    hi: {
      title: '📈 7-दिवसीय मांग पूर्वानुमान एवं क्रॉसओवर इंजन',
      subtitle: 'AI समय-श्रृंखला विश्लेषण व खतरा क्षेत्र (Danger Zone)',
      content: 'वर्तमान भंडार के क्षरण और अनुमानित खपत (भीषण ठंड में हीटिंग, उच्च पर्वतीय कैलोरी और रक्षा तैयारी) का सटीक वक्र। लाल छायांकित "Danger Zone" इंगित करता है कि बिना नई आपूर्ति के स्टॉक कब शून्य हो जाएगा।',
      tip: '💡 सुझाव: सुनहरा क्रॉसओवर बिंदु वह सटीक समय बताता है जब नई आपूर्ति पहुंचना अनिवार्य है।'
    }
  },
  {
    id: 'step-bottom-panels',
    targetSelector: '#tour-bottom-panels, .iplms-bottom-four-cards',
    preferredPosition: 'top',
    en: {
      title: '🚛 Fleet Allocation & What-If War-Gaming',
      subtitle: 'Tri-Modal Assets, Dispatches & Network Resilience',
      content: 'Manage high-altitude 4x4 ALS, 6x6 Stallion trucks, and heavy-lift logistics UAVs. Use the integrated What-If Simulator to stress-test avalanche road closures (e.g. Zoji La blocked) and calculate alternative bypass routes.',
      tip: '💡 Tip: The Network Resilience index quantifies multi-path operational survivability during electronic warfare and blizzards.'
    },
    hi: {
      title: '🚛 वाहन बेड़ा आवंटन एवं व्हाट-इफ वॉर-गेमिंग',
      subtitle: 'त्रि-आयामी परिवहन, कॉन्वॉय स्थिति व नेटवर्क मजबूती',
      content: '4x4 ALS, 6x6 स्टैलियन ट्रकों और भारी-भरकम लॉजिस्टिक्स ड्रोन का आवंटन देखें। "What-If Simulator" की मदद से दर्रे बंद होने या हिमस्खलन के समय वैकल्पिक मार्गों और अतिरिक्त वाहनों की आवश्यकता का आकलन करें।',
      tip: '💡 सुझाव: "Network Resilience" स्कोर इलेक्ट्रॉनिक युद्ध या बर्फबारी के दौरान आपूर्ति जारी रखने की क्षमता मापता है।'
    }
  },
  {
    id: 'step-sahayak-bot',
    targetSelector: '#rasad-sahayak-launcher, #tour-sahayak-launcher, .rasad-circle-launcher',
    preferredPosition: 'top',
    isCircle: true,
    en: {
      title: '🛡️ RASAD Sahayak AI Tactical Copilot (रसद सहायक)',
      subtitle: '24/7 C4ISR Military Decision Assistant',
      content: 'Your dedicated high-altitude logistics intelligence copilot. Grounded in HQ 14 Corps doctrine and live telemetry, it answers questions on convoy routing, snowbound pass bypasses, and generates standard military SITREP reports in English, हिंदी, or Bilingual mode.',
      tip: '💡 Tip: Click below to launch an instant AI tactical query demo!',
      actionLabel: 'Ask Sample SITREP 💬 🛡️',
      actionQuery: 'Give me current SITREP for Post Charlie ammunition shortage and recommended resupply route.'
    },
    hi: {
      title: '🛡️ रसद सहायक AI सामरिक सैन्य कोपायलट',
      subtitle: '24/7 C4ISR सैन्य रसद निर्णय सहायक',
      content: 'आपका उच्च-पर्वतीय सैन्य रसद सहायक। 14 कोर के सिद्धांतों और लाइव डेटा पर आधारित, यह कॉन्वॉय मार्गों, हिमस्खलन बाईपास और सेना SOP से संबंधित प्रश्नों के उत्तर शुद्ध हिन्दी, English या द्विभाषी मोड में प्रदान करता है।',
      tip: '💡 सुझाव: त्वरित प्रदर्शन देखने के लिए नीचे दिए गए बटन पर क्लिक करें!',
      actionLabel: 'नमूना SITREP पूछें 💬 🛡️',
      actionQuery: 'पोस्ट चार्ली के गोला-बारूद संकट और अनुशंसित आपूर्ति मार्ग की वर्तमान स्थिति (SITREP) बताएं।'
    }
  }
];

export interface RasadTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  tourStep: number;
  setTourStep: (step: number) => void;
}

export const RasadTourModal: React.FC<RasadTourModalProps> = ({
  isOpen,
  onClose,
  tourStep,
  setTourStep
}) => {
  const [tourLang, setTourLang] = useState<'en' | 'hi'>('en');
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [windowSize, setWindowSize] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const currentStepData = TOUR_STEPS[tourStep] || TOUR_STEPS[0];
  const activeContent = currentStepData[tourLang] || currentStepData.en;
  const isFirstStep = tourStep === 0;
  const isLastStep = tourStep === TOUR_STEPS.length - 1;

  const nextStep = useCallback(() => {
    if (tourStep < TOUR_STEPS.length - 1) {
      tacticalAudio.playBlip();
      setTourStep(tourStep + 1);
    } else {
      tacticalAudio.playSonar();
      onClose();
    }
  }, [tourStep, setTourStep, onClose]);

  const prevStep = useCallback(() => {
    if (tourStep > 0) {
      tacticalAudio.playBlip();
      setTourStep(tourStep - 1);
    }
  }, [tourStep, setTourStep]);

  // Measure and auto-scroll target element
  const updateTargetRect = useCallback(() => {
    if (!isOpen) return;
    const current = TOUR_STEPS[tourStep];
    if (!current) return;
    if (!current.targetSelector || !current.targetSelector.trim()) {
      setTargetRect(null);
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      return;
    }

    let el: Element | null = null;
    const selectors = current.targetSelector.split(',').map(s => s.trim()).filter(Boolean);
    for (const sel of selectors) {
      try {
        el = document.querySelector(sel);
        if (el) break;
      } catch (e) {
        // Safe guard
      }
    }

    if (el) {
      // Smooth auto-scroll into view if needed
      try {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      } catch (e) {
        // Safe fallback
      }

      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
    } else {
      setTargetRect(null);
    }

    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, [isOpen, tourStep]);

  useEffect(() => {
    updateTargetRect();
    const timer = setTimeout(() => {
      updateTargetRect();
    }, 80);

    const handleResize = () => updateTargetRect();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [updateTargetRect]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        tacticalAudio.playBlip();
        onClose();
      } else if (e.key === 'ArrowRight') {
        if (!isLastStep) nextStep();
      } else if (e.key === 'ArrowLeft') {
        if (!isFirstStep) prevStep();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFirstStep, isLastStep, nextStep, prevStep, onClose]);

  if (!isOpen) return null;

  // Calculate card position, dynamic arrow direction and offset
  const calculatePositionAndArrow = () => {
    const { width: winW, height: winH } = windowSize;
    const measuredCardH = modalRef.current?.offsetHeight || 360;
    const cardW = tourStep === 0 ? Math.min(480, winW - 32) : Math.min(430, winW - 32);
    const cardH = measuredCardH;
    const margin = 20;

    if (!targetRect || targetRect.width === 0 || targetRect.height === 0 || tourStep === 0) {
      const centerX = Math.max(16, (winW - cardW) / 2);
      const centerY = Math.max(16, (winH - cardH) / 2);
      return {
        cardStyle: {
          top: `${centerY}px`,
          left: `${centerX}px`,
          transform: 'none'
        },
        arrowDirection: 'none' as const,
        arrowCustomStyle: {}
      };
    }

    let top = targetRect.top;
    let left = targetRect.left;
    let arrowDir: 'left' | 'right' | 'top' | 'bottom' | 'none' = 'left';

    const pref = currentStepData.preferredPosition;
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    if (currentStepData.isCircle) {
      // Circle target (RASAD Sahayak AI floating button)
      arrowDir = 'bottom';
      const circleGap = 36;
      top = Math.max(20, targetRect.top - cardH - circleGap);
      left = Math.max(20, Math.min(winW - cardW - 20, targetRect.right - cardW + 10));
    } else if (pref === 'right' && targetRect.right + cardW + margin <= winW) {
      arrowDir = 'left';
      left = targetRect.right + margin;
      top = Math.max(20, Math.min(winH - cardH - 20, targetRect.top + Math.min(60, (targetRect.height - cardH) / 2)));
    } else if (pref === 'left' && targetRect.left - cardW - margin >= 0) {
      arrowDir = 'right';
      left = targetRect.left - cardW - margin;
      top = Math.max(20, Math.min(winH - cardH - 20, targetRect.top + 30));
    } else if (pref === 'top' && targetRect.top - cardH - margin >= 0) {
      arrowDir = 'bottom';
      top = targetRect.top - cardH - margin;
      left = Math.max(20, Math.min(winW - cardW - 20, targetRect.left + (targetRect.width - cardW) / 2));
    } else if (pref === 'bottom' && targetRect.bottom + cardH + margin <= winH) {
      arrowDir = 'top';
      top = targetRect.bottom + margin;
      left = Math.max(20, Math.min(winW - cardW - 20, targetRect.left + (targetRect.width - cardW) / 2));
    } else {
      // Fallback
      if (targetRect.top - cardH - margin >= 0) {
        arrowDir = 'bottom';
        top = targetRect.top - cardH - margin;
        left = Math.max(20, Math.min(winW - cardW - 20, targetRect.left + (targetRect.width - cardW) / 2));
      } else if (targetRect.bottom + cardH + margin <= winH) {
        arrowDir = 'top';
        top = targetRect.bottom + margin;
        left = Math.max(20, Math.min(winW - cardW - 20, targetRect.left + (targetRect.width - cardW) / 2));
      } else {
        arrowDir = 'none';
        top = Math.max(20, (winH - cardH) / 2);
        left = Math.max(20, (winW - cardW) / 2);
      }
    }

    // Precise Arrow Positioning Offset targeting the center of the component
    const arrowCustomStyle: React.CSSProperties = {};
    if (arrowDir === 'bottom' || arrowDir === 'top') {
      const offsetX = Math.max(32, Math.min(cardW - 32, targetCenterX - left));
      arrowCustomStyle.left = `${offsetX}px`;
      arrowCustomStyle.transform = 'translateX(-50%)';
    } else if (arrowDir === 'left' || arrowDir === 'right') {
      const offsetY = Math.max(32, Math.min(cardH - 32, targetCenterY - top));
      arrowCustomStyle.top = `${offsetY}px`;
      arrowCustomStyle.transform = 'translateY(-50%)';
    }

    return {
      cardStyle: {
        top: `${top}px`,
        left: `${left}px`,
        transform: 'none'
      },
      arrowDirection: arrowDir,
      arrowCustomStyle
    };
  };

  const { cardStyle, arrowDirection, arrowCustomStyle } = calculatePositionAndArrow();

  // Handle interactive action
  const handleInteractiveAction = () => {
    if (tourStep === 0) {
      nextStep();
    } else {
      onClose();
      if (activeContent.actionQuery) {
        window.dispatchEvent(
          new CustomEvent('rasad-open-query', {
            detail: { query: activeContent.actionQuery }
          })
        );
      }
    }
  };

  // Spotlight Cutout Geometry
  const isCircle = Boolean(currentStepData.isCircle);
  const cutoutPadding = isCircle ? 8 : 10;
  const cutoutX = targetRect ? Math.max(0, targetRect.left - cutoutPadding) : 0;
  const cutoutY = targetRect ? Math.max(0, targetRect.top - cutoutPadding) : 0;
  const cutoutW = targetRect ? targetRect.width + cutoutPadding * 2 : 0;
  const cutoutH = targetRect ? targetRect.height + cutoutPadding * 2 : 0;
  const rx = isCircle ? cutoutW / 2 : 14;
  const ry = isCircle ? cutoutH / 2 : 14;

  return (
    <div className="rasad-tour-overlay" aria-label="Interactive Guided Operational Tour" role="dialog">
      {/* 🌟 1. True Illuminated SVG Mask (Hole-Punching Cutout Layer) */}
      <svg className="tour-svg-mask-layer" width="100%" height="100%">
        <defs>
          <mask id="rasad-tour-spotlight-mask">
            {/* White covers entire screen (becomes dimmed backdrop) */}
            <rect width="100%" height="100%" fill="white" />
            {/* Black punches 100% transparent hole over the target (100% bright & clear) */}
            {targetRect && (
              <rect
                x={cutoutX}
                y={cutoutY}
                width={cutoutW}
                height={cutoutH}
                rx={rx}
                ry={ry}
                fill="black"
              />
            )}
          </mask>
        </defs>
        {/* Darkened backdrop rendered with the cutout mask */}
        <rect
          width="100%"
          height="100%"
          fill="rgba(5, 10, 20, 0.80)"
          mask="url(#rasad-tour-spotlight-mask)"
        />
      </svg>

      {/* 🌟 2. Glowing Animated Tactical Frame around Active Component */}
      {targetRect && (
        <div
          className={`tour-illuminated-frame ${isCircle ? 'circle-frame' : ''}`}
          style={{
            top: cutoutY,
            left: cutoutX,
            width: cutoutW,
            height: cutoutH,
            borderRadius: isCircle ? '50%' : '14px'
          }}
        >
          {!isCircle && (
            <>
              <div className="frame-corner top-left" />
              <div className="frame-corner top-right" />
              <div className="frame-corner bottom-left" />
              <div className="frame-corner bottom-right" />
            </>
          )}
          <div className={`frame-pulse-halo ${isCircle ? 'circle-halo' : ''}`} />
        </div>
      )}

      {/* 🌟 3. Floating Guided Tour Explanation Card with Directional Arrow Beak */}
      <div
        ref={modalRef}
        className={`tour-card arrow-${arrowDirection} ${tourStep === 0 ? 'welcome-card' : ''}`}
        style={cardStyle}
      >
        {/* Directional Arrow Pointer with Exact Component Alignment */}
        {arrowDirection !== 'none' && (
          <div className={`tour-arrow-beak ${arrowDirection}`} style={arrowCustomStyle} />
        )}

        {/* Card Header with Step Badge & Language Toggle */}
        <div className="tour-card-header">
          <div className="tour-step-badge">
            <span className="step-glow-dot" />
            <span>
              {tourLang === 'hi'
                ? `चरण ${tourStep + 1} / ${TOUR_STEPS.length}`
                : `Step ${tourStep + 1} of ${TOUR_STEPS.length}`}
            </span>
          </div>

          <div className="tour-header-right">
            {/* Multi-Language Toggle (EN / हिंदी) */}
            <div className="tour-lang-toggle" role="group" aria-label="Tour Language">
              <button
                type="button"
                className={`tour-lang-btn ${tourLang === 'en' ? 'active' : ''}`}
                onClick={() => {
                  setTourLang('en');
                  tacticalAudio.playBlip();
                }}
                title="Switch to English"
              >
                🇬🇧 EN
              </button>
              <button
                type="button"
                className={`tour-lang-btn ${tourLang === 'hi' ? 'active' : ''}`}
                onClick={() => {
                  setTourLang('hi');
                  tacticalAudio.playBlip();
                }}
                title="हिंदी में देखें"
              >
                🇮🇳 हिंदी
              </button>
            </div>

            <button
              className="tour-close-btn"
              onClick={() => {
                tacticalAudio.playBlip();
                onClose();
              }}
              title={tourLang === 'hi' ? 'टूर बंद करें (Esc)' : 'Close Tour (Esc)'}
              aria-label="Close Tour"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="tour-card-body">
          <h3 className="tour-card-title">{activeContent.title}</h3>
          <div className="tour-card-subtitle">{activeContent.subtitle}</div>

          {/* Welcome Step Tactical Badges */}
          {tourStep === 0 && (
            <div className="tour-welcome-pillars">
              <span className="welcome-pillar-tag">🗺️ Tactical GIS</span>
              <span className="welcome-pillar-tag">📦 Class I-V Inventory</span>
              <span className="welcome-pillar-tag">📈 7-Day Demand ML</span>
              <span className="welcome-pillar-tag">🚛 Tri-Modal Fleet</span>
              <span className="welcome-pillar-tag">🛡️ RASAD Sahayak AI</span>
            </div>
          )}

          <p className="tour-card-content">{activeContent.content}</p>
          <div className="tour-card-tip">{activeContent.tip}</div>

          {/* Interactive Action Button */}
          {activeContent.actionLabel && (
            <button
              className="tour-interactive-demo-btn"
              onClick={handleInteractiveAction}
              title={tourStep === 0 ? 'Start the step-by-step dashboard tour' : 'Launch instant demonstration query in RASAD Sahayak AI'}
            >
              <span>{activeContent.actionLabel}</span>
            </button>
          )}
        </div>

        {/* Card Footer: Step Dots & Navigation Buttons */}
        <div className="tour-card-footer">
          <div className="tour-dots-indicator">
            {TOUR_STEPS.map((step, idx) => (
              <button
                key={step.id}
                className={`tour-dot ${idx === tourStep ? 'active' : ''} ${idx < tourStep ? 'completed' : ''}`}
                onClick={() => {
                  tacticalAudio.playBlip();
                  setTourStep(idx);
                }}
                title={`Jump to step ${idx + 1}`}
                aria-label={`Step ${idx + 1}`}
              />
            ))}
          </div>

          <div className="tour-actions-group">
            <button
              className="tour-btn tour-skip-btn"
              onClick={() => {
                tacticalAudio.playBlip();
                onClose();
              }}
            >
              {tourLang === 'hi' ? 'छोड़ें' : 'Skip'}
            </button>

            {!isFirstStep && (
              <button
                className="tour-btn tour-back-btn"
                onClick={prevStep}
              >
                {tourLang === 'hi' ? '← पीछे' : '← Back'}
              </button>
            )}

            <button
              className="tour-btn tour-next-btn"
              onClick={nextStep}
            >
              {isLastStep
                ? tourLang === 'hi'
                  ? 'समाप्त करें 🚀'
                  : 'Finish Tour 🚀'
                : tourLang === 'hi'
                ? 'आगे →'
                : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RasadTourModal;
