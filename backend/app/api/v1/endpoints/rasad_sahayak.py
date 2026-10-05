"""
RASAD Sahayak AI - Military Tactical Logistics Copilot
Air-Gapped & Cloud-Augmented C4ISR Decision Support for Northern Command 14 Corps.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
import re
import os
import json
import logging
from app.core.rag_engine import sop_copilot

logger = logging.getLogger("rasad_sahayak")

router = APIRouter(prefix="/rasad-sahayak", tags=["RASAD Sahayak AI Tactical Copilot"])

class RasadChatRequest(BaseModel):
    message: str = Field(..., description="Tactical logistics query or operational command")
    dashboard_context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Active outpost telemetry & C4ISR state")
    history: Optional[List[Dict[str, str]]] = Field(default_factory=list, description="Recent conversation history")
    language: Optional[str] = Field(default="en", description="Target language: 'en', 'hi', or 'bilingual'")

class RasadChatResponse(BaseModel):
    status: str
    reply: str
    engine_used: str
    model_name: Optional[str] = None
    is_critical: bool = False
    language_used: Optional[str] = "en"

OFF_TOPIC_KEYWORDS = [
    "recipe", "cook", "pasta", "cake", "movie", "film", "actor", "song",
    "cricket", "football", "code", "python", "javascript", "hack", "bitcoin",
    "crypto", "politics", "president", "joke", "poem", "essay"
]

def is_military_off_topic(query: str) -> bool:
    q_lower = query.lower()
    for kw in OFF_TOPIC_KEYWORDS:
        if re.search(r'\b' + re.escape(kw) + r'\b', q_lower):
            if not any(mil in q_lower for mil in ["supply", "convoy", "ammo", "fuel", "ration", "route", "post", "corps", "radar"]):
                return True
    return False

@router.get("/status")
def get_rasad_sahayak_status():
    return {
        "status": "ONLINE",
        "system": "RASAD Sahayak AI (रसद सहायक)",
        "command": "HQ 14 Corps (Fire & Fury, Ladakh)",
        "security_classification": "TOP SECRET // AIR-GAPPED C4ISR",
        "primary_model": "Indian Army 14 Corps Logistics Doctrine Engine (v2.4)",
        "quick_chips": [
            {"label": "🚨 SITREP for Post Charlie", "query": "Generate an immediate tactical SITREP for Post Charlie."},
            {"label": "🚚 Resupply Route & Convoy ETA", "query": "What is the recommended resupply route and convoy ETA for the active post?"},
            {"label": "📦 Class I-V Stock & Depletion", "query": "What is the current stock breakdown and depletion velocity?"},
            {"label": "⚡ Simulate Zoji La Avalanche Drill", "query": "Simulate emergency avalanche pass blockage at Zoji La."}
        ]
    }

@router.post("/chat", response_model=RasadChatResponse)
def chat_with_rasad_sahayak(req: RasadChatRequest):
    msg = req.message.strip()
    if not msg:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    ctx = req.dashboard_context or {}
    lang = req.language or "en"
    q_lower = msg.lower()

    # 1. Guardrail Refusal
    if is_military_off_topic(msg):
        if lang == "hi":
            refusal = (
                "🛡️ **रसद सहायक AI (14 कोर सामरिक रसद सहायक)**\n\n"
                "मैं भारतीय सेना 14 कोर के लिए एक विशेष सैन्य रसद निर्णय सहायक हूँ। "
                "मैं **केवल** अग्रिम चौकियों के रसद भंडार, गोला-बारूद/ईंधन आपूर्ति, पर्वतीय कॉन्वॉय मार्गों, "
                "हिमस्खलन बाईपास और सेना SOP में सहायता कर सकता हूँ।\n\n"
                "*कृपया सैन्य आपूर्ति से संबंधित प्रश्न पूछें, जैसे:* \n"
                "• *'पोस्ट चार्ली की वर्तमान रसद स्थिति (SITREP) क्या है?'*\n"
                "• *'मनाली से आपूर्ति कॉन्वॉय का सुरक्षित मार्ग और ETA क्या है?'*\n"
                "• *'जोजी ला दर्रा बंद होने पर वैकल्पिक मार्ग क्या है?'*"
            )
        elif lang == "bilingual":
            refusal = (
                "🛡️ **RASAD Sahayak AI (रसद सहायक AI)**\n\n"
                "I am a specialized military logistics tactical assistant for HQ 14 Corps. "
                "I strictly operate within military supply chain, convoy routing, ammunition/fuel buffers, and C4ISR doctrines.\n\n"
                "*Please ask an operational logistics question / सामरिक रसद प्रश्न पूछें:* \n"
                "• *'Generate SITREP for Post Charlie / स्थिति रिपोर्ट'* \n"
                "• *'Recommended resupply route from Manali & convoy ETA'* \n"
                "• *'What is alternative bypass if Zoji La pass is blocked?'*"
            )
        else:
            refusal = (
                "🛡️ **RASAD Sahayak AI (Tactical Logistics Assistant)**\n\n"
                "I am a specialized military logistics decision assistant for HQ 14 Corps (Fire & Fury). "
                "I can **only assist** with forward post supply reserves, convoy routing, "
                "mountain pass hazards, Arctic fuel/ammunition buffering, and C4ISR operations.\n\n"
                "*Please ask a tactical logistics question, such as:* \n"
                "• *'Generate SITREP for Post Charlie'* \n"
                "• *'What is the recommended resupply route and convoy ETA?'* \n"
                "• *'What is the contingency plan if Zoji La is blocked?'*"
            )
        return RasadChatResponse(
            status="success",
            reply=refusal,
            engine_used="military_guardrail",
            model_name="c4isr_guardrail",
            is_critical=False,
            language_used=lang
        )

    # 2. Extract context variables
    node_name = ctx.get("node_name") or ctx.get("locationName") or "Post Charlie"
    supply_class = ctx.get("supply_class") or ctx.get("supplyClass") or "Class V - Ammunition"
    stock_pct = ctx.get("stock_percent") or ctx.get("stockPercent") or 30
    depletion_time = ctx.get("predicted_depletion") or ctx.get("predictedDepletion") or "18 hours"
    current_units = ctx.get("current_units") or ctx.get("currentUnits") or 450
    priority = ctx.get("priority") or "CRITICAL"
    personnel = ctx.get("personnel_strength") or ctx.get("personnelStrength") or 600
    temp = ctx.get("ambient_temp") or "-18°C"

    plan = ctx.get("recommended_plan") or {}
    source_base = plan.get("source") or "Base Manali (Nearest with stock)"
    primary_route = plan.get("route") or "Manali → Zoji → Dras → Charlie"
    convoy_transport = plan.get("transport") or "6x6 Trucks (x4)"
    convoy_eta = plan.get("eta") or "14 hours"
    convoy_confidence = plan.get("confidence") or 92

    is_critical = stock_pct <= 40 or "critical" in priority.lower()

    # 3. Deterministic Grounded Military Logistics Engine
    # SCENARIO A: SITREP / Status Query
    if any(k in q_lower for k in ["sitrep", "status", "situation", "स्थिति", "रिपोर्ट"]):
        if lang == "hi":
            reply = (
                f"🛡️ **[सामरिक स्थिति रिपोर्ट (SITREP) — {node_name}]**\n\n"
                f"• **प्राथमिकता स्तर**: 🔴 **{priority}** (आपातकालीन आपूर्ति अनिवार्य)\n"
                f"• **सप्लाई श्रेणी**: **{supply_class}**\n"
                f"• **वर्तमान भंडार**: **{stock_pct}% ({current_units} यूनिट्स)**\n"
                f"• **अनुमानित रिक्तीकरण समय**: **{depletion_time}**\n"
                f"• **तैनात सैन्य बल**: **{personnel} जवान** (खपत में +25% वृद्धि)\n"
                f"• **मौसम दशा**: **{temp}**, भारी बर्फबारी, दृश्यता < 500 मी.\n\n"
                f"**अनुशंसित त्वरित कार्रवाई**:\n"
                f"1. **{source_base}** से कॉन्वॉय रवानगी को तुरंत अधिकृत करें।\n"
                f"2. कॉन्वॉय: **{convoy_transport}**, मार्ग: **{primary_route}** (ETA: {convoy_eta})।\n"
                f"3. यदि जोजी ला अवरुद्ध हो, तो वैकल्पिक प्लान C (श्रीनगर-द्रास) सक्रिय करें।"
            )
        elif lang == "bilingual":
            reply = (
                f"🛡️ **[TACTICAL SITREP — {node_name} | स्थिति रिपोर्ट]**\n\n"
                f"• **Priority / स्थिति**: 🔴 **{priority}** (Immediate resupply mandated)\n"
                f"• **Supply Class**: **{supply_class}**\n"
                f"• **Current Holding**: **{stock_pct}% ({current_units} units)**\n"
                f"• **Stockout Velocity / रिक्तीकरण समय**: **{depletion_time}**\n"
                f"• **Personnel Strength**: **{personnel} personnel** (+25% surge due to alert)\n"
                f"• **Weather**: **{temp}**, heavy snow slush, road traction critical.\n\n"
                f"**Tactical Recommendation / सामरिक सिफारिश**:\n"
                f"• Authorize resupply convoy from **{source_base}**.\n"
                f"• Corridor: **{primary_route}** via **{convoy_transport}** (ETA: **{convoy_eta}**, Confidence: **{convoy_confidence}%**)."
            )
        else:
            reply = (
                f"🛡️ **[TACTICAL SITREP — {node_name}]**\n\n"
                f"• **Threat Priority**: 🔴 **{priority}** (Immediate Command Attention)\n"
                f"• **Supply Classification**: **{supply_class}**\n"
                f"• **Current Inventory Holding**: **{stock_pct}% ({current_units} rounds/belts)**\n"
                f"• **Stockout Horizon**: **{depletion_time}**\n"
                f"• **Garrison Strength**: **{personnel} personnel** (+25% operational readiness)\n"
                f"• **Environmental Stress**: **{temp}**, extreme sub-zero, visibility < 500m.\n\n"
                f"**Mandated Command Action**:\n"
                f"1. Authorize immediate sortie of **{convoy_transport}** from **{source_base}**.\n"
                f"2. Primary Corridor: **{primary_route}** (Estimated Transit: **{convoy_eta}** at **{convoy_confidence}%** confidence).\n"
                f"3. Pre-position snowplow clearance teams at Zoji Pass."
            )

    # SCENARIO B: Route / Convoy Planning Query
    elif any(k in q_lower for k in ["route", "convoy", "eta", "transport", "रास्ता", "मार्ग", "ट्रक"]):
        if lang == "hi":
            reply = (
                f"🚚 **[कॉन्वॉय रूटिंग व डिस्पैच निर्देश — {node_name}]**\n\n"
                f"• **प्राथमिक आपूर्ति स्रोत**: **{source_base}**\n"
                f"• **अनुशंसित कॉन्वॉय**: **{convoy_transport}**\n"
                f"• **प्राथमिक मार्ग**: **{primary_route}**\n"
                f"• **अनुमानित समय (ETA)**: **{convoy_eta}** (विश्वास स्तर: **{convoy_confidence}%**)\n\n"
                f"**वैकल्पिक आकस्मिक मार्ग (Plan C)**:\n"
                f"• **रूट**: बेस श्रीनगर ➔ कारगिल ➔ चार्ली\n"
                f"• **ETA**: 16 घंटे | जोखिम: **LOW** | वाहन: 6x6 ALS ट्रक\n"
                f"• *सलाह*: जोजी ला में बर्फबारी के दौरान सभी ट्रकों में स्नो-चेन और आर्कटिक डीजल अनिवार्य है।"
            )
        elif lang == "bilingual":
            reply = (
                f"🚚 **[CONVOY ROUTING & DISPATCH BRIEFING — {node_name}]**\n\n"
                f"• **Primary Source Hub**: **{source_base}**\n"
                f"• **Vehicle Allocation**: **{convoy_transport}**\n"
                f"• **Designated Corridor**: **{primary_route}**\n"
                f"• **Convoy ETA**: **{convoy_eta}** (Model Confidence: **{convoy_confidence}%**)\n\n"
                f"**Contingency Corridor (Plan C / वैकल्पिक मार्ग)**:\n"
                f"• Route: Base Srinagar ➔ Kargil ➔ Charlie (ETA: 16 hrs, Low Avalanche Hazard).\n"
                f"• Mandatory: Fit anti-skid tire chains and Arctic fuel additive (MIL-DTL-85470)."
            )
        else:
            reply = (
                f"🚚 **[TACTICAL CONVOY MOVEMENT ORDER — {node_name}]**\n\n"
                f"• **Source Depot**: **{source_base}**\n"
                f"• **Convoy Composition**: **{convoy_transport}** (All Tatra 6x6 Arctic-fitted)\n"
                f"• **Primary Supply Line**: **{primary_route}**\n"
                f"• **Convoy ETA**: **{convoy_eta}** with **{convoy_confidence}%** route clearance confidence.\n\n"
                f"**Secondary Corridor (Plan C)**:\n"
                f"• **Bypass**: Base Srinagar ➔ Kargil Depot ➔ Post Charlie\n"
                f"• **Transit Time**: 16 hours (Avalanche Risk: LOW)\n"
                f"• **Tactical Directive**: Speed restricted to 30 km/h across alpine passes."
            )

    # SCENARIO C: Avalanche / Pass Closure / What-If Drill Query
    elif any(k in q_lower for k in ["avalanche", "block", "what-if", "simulator", "drill", "zoji", "बंद", "हिमस्खलन"]):
        if lang == "hi":
            reply = (
                f"⚡ **[व्हाट-इफ सिमुलेशन परिणाम — जोजी ला दर्रा हिमस्खलन अवरोध]**\n\n"
                f"• **प्रभावित चौकियां**: 3 चौकियां (पोस्ट चार्ली, पोस्ट डेल्टा, द्रास डिपो)\n"
                f"• **अतिरिक्त आपूर्ति विलंब**: **4 से 12 घंटे**\n"
                f"• **आवश्यक अतिरिक्त वाहन**: **6x अतिरिक्त 6x6 सामरिक ट्रक**\n\n"
                f"**त्वरित सामरिक प्रतिक्रिया**:\n"
                f"1. प्राथमिक मार्ग तुरंत बंद करें। यातायात को मनाली-सरचू दक्षिणी गलियारे पर मोड़ें।\n"
                f"2. गंभीर चिकित्सा/गोला-बारूद आपात स्थिति के लिए यूएवी ड्रोन और Mi-17V5 एयरलिफ्ट तैयार रखें।\n"
                f"3. बीआरओ (Border Roads Organisation) को स्नो कटर तुरंत तैनात करने का निर्देश जारी किया गया है।"
            )
        elif lang == "bilingual":
            reply = (
                f"⚡ **[WHAT-IF DRILL REPORT: Mountain Corridor Severance]**\n\n"
                f"• **Affected Outposts**: 3 locations affected (Post Charlie, Post Delta, Dras Depot)\n"
                f"• **ETA Impact**: ETA increase of **4-12 hours** through bypass routes\n"
                f"• **Fleet Mobilization**: Additional **6 tactical vehicles** required\n\n"
                f"**Command Action / सामरिक कार्रवाई**:\n"
                f"• Divert heavy supply convoys to Southern Axis (Manali - Sarchu - Leh).\n"
                f"• Deploy logistics UAV drones (15 available) for rapid cold-weather medical drops."
            )
        else:
            reply = (
                f"⚡ **[WARGAME SIMULATION: Pass Closure & Route Severance]**\n\n"
                f"• **Assessed Impact**: 3 forward locations affected (Post Charlie, Post Delta, Dras Depot)\n"
                f"• **Transit Delay**: **+4 to +12 hours** transit time increase\n"
                f"• **Alternative Routes**: Northern Shyok Bypass & Southern Manali Axis operational\n"
                f"• **Asset Requirement**: **+6 heavy 6x6 tactical vehicles** mobilized from Jammu reserve.\n\n"
                f"**Emergency Protocol D-DBO-09 Triggered**: Heavy transit suspended on primary ridge; drone airlift standing by."
            )

    # SCENARIO D: General Doctrine / Military SOP Query (Fallback to RAG SOP Engine)
    else:
        rag_res = sop_copilot.query(msg)
        cit = rag_res.get("citation", "Army Logistics Doctrine - Glacial Sector Ops")
        content = rag_res.get("response", "")

        if lang == "hi":
            reply = (
                f"📜 **[14 कोर रसद नियमावली एवं SOP निर्देश]**\n\n"
                f"{content}\n\n"
                f"• **आधिकारिक संदर्भ**: *{cit}*\n"
                f"• **वर्तमान स्थिति**: 14 कोर लेह कमांड द्वारा सत्यापित।"
            )
        elif lang == "bilingual":
            reply = (
                f"📜 **[MILITARY SOP DOCTRINE DIRECTIVE — HQ 14 CORPS]**\n\n"
                f"{content}\n\n"
                f"• **Official Manual Citation / संदर्भ**: *{cit}*\n"
                f"• **Security Clearance**: RESTRICTED // NORTHERN COMMAND LOGISTICS."
            )
        else:
            reply = (
                f"📜 **[ARMY LOGISTICS DOCTRINE & SOP CITATION]**\n\n"
                f"{content}\n\n"
                f"• **Directive Citation**: *{cit}*\n"
                f"• **Operational Theater**: Northern Command (Ladakh Sector)."
            )

    return RasadChatResponse(
        status="success",
        reply=reply,
        engine_used="14_corps_airgap_engine",
        model_name="deterministic_c4isr_rag",
        is_critical=is_critical,
        language_used=lang
    )
