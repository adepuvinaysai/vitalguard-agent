import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Brain, Heart, MessageSquare, Send, ShieldCheck, 
  Zap, Calendar, AlertCircle, Droplets, Wind, Battery, 
  HeartPulse, Smile, Moon, Sun, Coffee, Thermometer,
  TrendingUp, ShieldAlert, ZapOff, CloudRain, Waves, 
  Target, Info
} from 'lucide-react';

// --- AGENT CONFIGURATION ---
const apiKey = ""; 

const App = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'agent', 
      content: "VitalGuard Ultra Online. Deep Neural Biometric Link established. Monitoring 100+ biomarkers including metabolic, neuro-chemical, and environmental factors. How can I assist your longevity today?", 
      type: 'response' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activeTab, setActiveTab] = useState('vitals'); // vitals | neuro | trends
  
  // Comprehensive Global State
  const [vitals, setVitals] = useState({ 
    physical: { 
      hr: 72, bp: '120/80', spo2: 98, hydration: 65, temp: 98.6, glucose: 95, respiration: 14
    },
    mental: { 
      stress: 'Low', emotion: 'Stable', energy: 85, focus: 90, 
      cortisol: 'Optimal', serotonin: 'High', dopamine: 'Balanced', oxytocin: 'Baseline'
    },
    environment: {
      aqi: 42, uv: 2, noise: '30dB', weather: 'Clear'
    },
    meta: {
      condition: "System Optimal",
      riskLevel: "Low",
      trend: "Improving",
      recommendation: "Maintain current activity levels."
    }
  });
  
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const processAgenticLogic = async (userText) => {
    if (!apiKey) {
      setMessages(prev => [...prev, { 
        role: 'agent', 
        content: "System Alert: API Key missing. Please insert your Gemini API Key to enable the VitalGuard Ultra Reasoning Engine.", 
        type: 'response' 
      }]);
      return;
    }
    
    setIsThinking(true);
    
    try {
      const prompt = `You are VitalGuard Ultra, a world-class AI Physician and Neuro-Psychologist.
      
      User Context: "${userText}"
      Current Biological State: ${JSON.stringify(vitals)}
      
      Your Goal: Perform a 360-degree assessment of the user's health. 
      - Calculate physical biometrics (HR, BP, SpO2, Glucose, Temp).
      - Deduce Neuro-chemical state (Cortisol, Serotonin, Dopamine, Oxytocin).
      - Infer environmental impact (Weather, AQI).
      - Predict a 24-hour health trend.
      
      Condition Mapping Examples:
      - Burnout: High Cortisol, Low Dopamine, Low Energy, High BP.
      - Flu/Infection: High Temp, High HR, Low SpO2, Low Glucose.
      - Social Anxiety: High HR, Low Oxytocin, High Stress.
      - Peak Performance: High Dopamine, High Focus, Optimal BP.
      
      Respond ONLY in strict JSON:
      {
        "reasoning": "Clinical synthesis of physical symptoms and psychological state (3 sentences).",
        "actionText": "Description of the deep-tissue or neuro-scan performed.",
        "vitalsUpdate": {
          "physical": {"hr": number, "bp": "string", "spo2": number, "hydration": number, "temp": number, "glucose": number, "respiration": number},
          "mental": {"stress": "Low"|"Medium"|"High"|"Critical", "emotion": "string", "energy": number, "focus": number, "cortisol": "string", "serotonin": "string", "dopamine": "string", "oxytocin": "string"},
          "environment": {"aqi": number, "uv": number, "noise": "string", "weather": "string"},
          "meta": {"condition": "string", "riskLevel": "Low"|"Moderate"|"High"|"Critical", "trend": "Improving"|"Stable"|"Declining", "recommendation": "string"}
        },
        "response": "Detailed, professional medical/wellness advice."
      }`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsed = JSON.parse(rawText);

      // Agentic Execution Chain
      setMessages(prev => [...prev, { role: 'agent', content: `[Neuro-Reasoning]: ${parsed.reasoning}`, type: 'reasoning' }]);
      await new Promise(r => setTimeout(r, 800));

      setMessages(prev => [...prev, { role: 'agent', content: parsed.actionText, type: 'action' }]);
      if (parsed.vitalsUpdate) setVitals(parsed.vitalsUpdate);
      await new Promise(r => setTimeout(r, 800));

      setMessages(prev => [...prev, { role: 'agent', content: parsed.response, type: 'response' }]);

    } catch (error) {
      setMessages(prev => [...prev, { role: 'agent', content: "VitalGuard Core encountered a sync error. Re-calibrating sensors...", type: 'response' }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isThinking) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    const currentInput = input;
    setInput('');
    processAgenticLogic(currentInput);
  };

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 overflow-hidden font-sans select-none">
      
      {/* LEFT SIDEBAR: DASHBOARD */}
      <div className="w-[380px] bg-slate-900/40 border-r border-slate-800/60 p-6 flex flex-col gap-6 overflow-y-auto backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">VitalGuard</h1>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Ultra v5.0</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className={`h-2.5 w-2.5 rounded-full ${vitals.meta.riskLevel === 'Low' ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]`}></div>
            <span className="text-[9px] text-slate-500 mt-1 uppercase font-bold">Encrypted</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-950/50 p-1 rounded-lg border border-slate-800">
          {['vitals', 'neuro', 'trends'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-tighter rounded-md transition-all ${
                activeTab === tab ? 'bg-slate-800 text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {activeTab === 'vitals' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Activity size={12} className="text-indigo-500" /> Bio-Physical Metrics
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'HR', val: vitals.physical.hr, icon: <Heart size={14} className="text-rose-500" />, sub: 'bpm' },
                  { label: 'BP', val: vitals.physical.bp, icon: <HeartPulse size={14} className="text-red-400" />, sub: 'systolic' },
                  { label: 'SpO2', val: `${vitals.physical.spo2}%`, icon: <Wind size={14} className="text-sky-400" />, sub: 'blood ox' },
                  { label: 'Glucose', val: vitals.physical.glucose, icon: <Zap size={14} className="text-yellow-500" />, sub: 'mg/dL' },
                  { label: 'Temp', val: `${vitals.physical.temp}°`, icon: <Thermometer size={14} className="text-orange-400" />, sub: 'farenheit' },
                  { label: 'H2O', val: `${vitals.physical.hydration}%`, icon: <Droplets size={14} className="text-blue-400" />, sub: 'hydration' }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-800/40 p-3 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors group">
                    <div className="flex justify-between items-center mb-1">
                      {item.icon}
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">{item.label}</span>
                    </div>
                    <p className="text-xl font-mono font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">{item.val}</p>
                    <p className="text-[8px] text-slate-600 font-bold uppercase mt-1">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'neuro' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300 space-y-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                <Brain size={12} className="text-purple-500" /> Neuro-Chemistry
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Dopamine', val: vitals.mental.dopamine, color: 'bg-yellow-500' },
                  { label: 'Serotonin', val: vitals.mental.serotonin, color: 'bg-emerald-500' },
                  { label: 'Oxytocin', val: vitals.mental.oxytocin, color: 'bg-rose-400' },
                  { label: 'Cortisol', val: vitals.mental.cortisol, color: 'bg-orange-500' }
                ].map((chem, i) => (
                  <div key={i} className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-300 font-bold uppercase tracking-tighter">{chem.label}</span>
                      <span className="text-[10px] font-bold text-slate-100">{chem.val}</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1">
                       <div className={`${chem.color} h-1 rounded-full transition-all duration-1000`} style={{ width: chem.val === 'Optimal' || chem.val === 'High' ? '85%' : chem.val === 'Low' ? '20%' : '50%' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'trends' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300 space-y-4">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                <TrendingUp size={12} className="text-emerald-500" /> Predictive Trends
              </p>
              <div className="bg-indigo-950/20 border border-indigo-500/30 p-4 rounded-2xl space-y-3">
                 <div className="flex justify-between items-center">
                    <span className="text-xs text-indigo-300 font-bold">Predicted Trend</span>
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-black rounded uppercase border border-indigo-500/40">{vitals.meta.trend}</span>
                 </div>
                 <p className="text-xs text-slate-400 leading-relaxed italic">
                   "Based on current biometric volatility, system equilibrium is {vitals.meta.trend.toLowerCase()} over the next 18 hours."
                 </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                 <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                    <span className="text-[9px] text-slate-500 block mb-1 uppercase">Air Quality</span>
                    <p className="text-sm font-bold text-emerald-400">{vitals.environment.aqi} AQI</p>
                 </div>
                 <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                    <span className="text-[9px] text-slate-500 block mb-1 uppercase">Noise</span>
                    <p className="text-sm font-bold text-sky-400">{vitals.environment.noise}</p>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: CHAT & INTERVENTION */}
      <div className="flex-1 flex flex-col bg-[#020617] relative">
        {/* Holographic Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[140px] animate-pulse delay-700"></div>
          <div className="absolute top-[30%] left-[20%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]"></div>
        </div>

        {/* Top Indicator Bar */}
        <div className="h-14 border-b border-slate-800/60 px-8 flex items-center justify-between z-10 backdrop-blur-md bg-slate-900/10">
           <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <ShieldAlert size={14} className="text-indigo-400" />
                <span className="text-xs font-bold text-slate-300">Condition: <span className="text-indigo-400">{vitals.meta.condition}</span></span>
             </div>
             <div className="w-[1px] h-4 bg-slate-800"></div>
             <div className="flex items-center gap-2">
                <Target size={14} className="text-emerald-400" />
                <span className="text-xs font-bold text-slate-300">Focus: <span className="text-emerald-400">{vitals.mental.focus}%</span></span>
             </div>
           </div>
           <div className="flex gap-2">
              <div className="h-2 w-8 bg-slate-800 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[80%]"></div>
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase">Signal: High</span>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-8 z-10 scrollbar-thin scrollbar-thumb-slate-800">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] group ${m.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                <div className={`px-6 py-4 rounded-3xl shadow-2xl transition-all duration-300 ${
                  m.role === 'user' 
                  ? 'bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white rounded-tr-none border border-indigo-400/20' 
                  : m.type === 'reasoning' 
                  ? 'bg-slate-900/60 border border-slate-800 text-slate-400 text-xs italic font-medium mb-2'
                  : m.type === 'action'
                  ? 'bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono tracking-tighter mb-2'
                  : 'bg-slate-900/80 text-slate-100 rounded-tl-none border border-slate-800 backdrop-blur-md'
                }`}>
                  {m.type === 'reasoning' && <div className="flex items-center gap-2 mb-1.5 text-[8px] font-black uppercase tracking-[0.2em] text-slate-500"><Brain size={12}/> Bio-Neural Reasoning</div>}
                  {m.type === 'action' && <div className="flex items-center gap-2 mb-1.5 text-[8px] font-black uppercase tracking-[0.2em] text-emerald-500"><Zap size={12}/> Diagnostic Sequence</div>}
                  <p className="leading-relaxed text-[15px]">{m.content}</p>
                </div>
                {m.role === 'agent' && m.type === 'response' && (
                  <div className="mt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-[9px] uppercase font-bold text-slate-500 hover:text-indigo-400">Log to HealthKit</button>
                    <button className="text-[9px] uppercase font-bold text-slate-500 hover:text-indigo-400">Share with Doctor</button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-slate-900/60 backdrop-blur-md px-6 py-4 rounded-3xl rounded-tl-none animate-pulse text-slate-500 text-sm border border-slate-800 flex items-center gap-4">
                <div className="relative w-4 h-4">
                  <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <span>Executing multi-modal biological scan...</span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>

        {/* Recommendation Overlay */}
        <div className="px-10 pb-2 z-10">
           <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-3 flex items-center gap-4">
              <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                <Info size={18} />
              </div>
              <p className="text-xs text-indigo-300 font-medium tracking-tight">
                <span className="font-bold uppercase mr-2 text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded">Advice</span>
                {vitals.meta.recommendation}
              </p>
           </div>
        </div>

        <div className="p-8 z-10">
          <div className="max-w-4xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-600/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
              <div className="relative flex gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-2 backdrop-blur-xl">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Analyze physical symptoms, mental fatigue, or emotional shifts..."
                  className="flex-1 bg-transparent py-4 px-6 focus:outline-none text-slate-200 placeholder:text-slate-600 font-medium"
                />
                <button 
                  onClick={handleSend}
                  disabled={isThinking}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-8 rounded-xl transition-all flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/30"
                >
                  {isThinking ? <ZapOff size={20} className="animate-pulse" /> : <Send size={20} />}
                </button>
              </div>
            </div>
            
            <div className="flex justify-center gap-8 mt-6 overflow-x-auto no-scrollbar pb-2">
               {[
                 { icon: <Zap size={14}/>, label: 'Dopamine' },
                 { icon: <CloudRain size={14}/>, label: 'AQI Sense' },
                 { icon: <Waves size={14}/>, label: 'Hydration' },
                 { icon: <Battery size={14}/>, label: 'Energy' },
                 { icon: <AlertCircle size={14}/>, label: 'Risk AI' }
               ].map((tag, i) => (
                 <button 
                  key={i}
                  onClick={() => setInput(`Perform a deep scan on my ${tag.label.toLowerCase()} levels.`)}
                  className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-slate-600 hover:text-indigo-400 transition-colors whitespace-nowrap"
                 >
                   {tag.icon} {tag.label}
                 </button>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;