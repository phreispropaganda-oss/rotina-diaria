import { useState, useRef, useEffect } from "react";

const SCHEDULE = [
  { time: "05:00", seg: "Acordar + preparo", ter: "Acordar + preparo", qua: "Acordar + preparo", qui: "Acordar + preparo", sex: "Acordar + preparo" },
  { time: "05:30", seg: "Saída Jiu-Jitsu", ter: "Saída Jiu-Jitsu", qua: "—", qui: "—", sex: "Saída Jiu-Jitsu" },
  { time: "06:00", seg: "Jiu-Jitsu 🥋", ter: "Jiu-Jitsu 🥋", qua: "—", qui: "—", sex: "Jiu-Jitsu 🥋" },
  { time: "07:00", seg: "Pós-treino + café", ter: "Pós-treino + café", qua: "Café leve", qui: "Café leve", sex: "Pós-treino + café" },
  { time: "08:00–18:00", seg: "Trabalho 💼", ter: "Trabalho 💼", qua: "Trabalho 💼", qui: "Trabalho 💼", sex: "Trabalho 💼" },
  { time: "19:00", seg: "Passeio + treino 🐕", ter: "Passeio + treino 🐕", qua: "Passeio 🐕", qui: "Passeio + treino 🐕", sex: "Passeio 🐕" },
  { time: "20:30", seg: "Jantar 🍽️", ter: "Jantar 🍽️", qua: "Jantar 🍽️", qui: "Jantar 🍽️", sex: "Jantar 🍽️" },
  { time: "21:00", seg: "Leitura 📖", ter: "Leitura 📖", qua: "Leitura 📖", qui: "Leitura 📖", sex: "Leitura 📖" },
  { time: "22:30", seg: "Dormir 🌙", ter: "Dormir 🌙", qua: "Dormir 🌙", qui: "Dormir 🌙", sex: "Dormir 🌙" },
];

const DIET = [
  {
    meal: "Pré Jiu-Jitsu",
    time: "04:50",
    original: "Banana + café preto",
    improved: "1 banana média + café preto sem açúcar + 1 colher de mel (energia rápida). Opcional: 2 tamarás ou 30g aveia fina.",
    icon: "⚡",
    color: "#f59e0b",
    tip: "Consumir 20–30 min antes do treino. Carboidratos de rápida absorção são essenciais para performance no tatame.",
    days: "Seg, Ter, Sex"
  },
  {
    meal: "Café da Manhã",
    time: "07:15",
    original: "Ovos + aveia + fruta",
    improved: "3 ovos mexidos ou cozidos + 50g aveia + 1 fruta (banana, manga ou morango) + 1 colher de pasta de amendoim. Adicione canela na aveia.",
    icon: "🌅",
    color: "#10b981",
    tip: "Priorize proteína pós-treino: alvo de 30–40g de proteína para otimizar síntese muscular após o Jiu-Jitsu.",
    days: "Todos os dias"
  },
  {
    meal: "Almoço",
    time: "12:00",
    original: "Frango ou peixe + arroz integral + legumes",
    improved: "150–200g frango/peixe/carne magra + 100g arroz integral ou batata doce + legumes refogados + salada verde com azeite + limão. Varie a proteína diariamente.",
    icon: "☀️",
    color: "#3b82f6",
    tip: "Maior refeição do dia. Inclua gorduras boas (azeite, abacate) para saciedade e absorção de vitaminas lipossolúveis.",
    days: "Todos os dias"
  },
  {
    meal: "Lanche",
    time: "15:30",
    original: "Iogurte ou whey + castanhas",
    improved: "200g iogurte grego integral (sem açúcar) + 25g mix de castanhas (castanha-do-pará, amêndoas, nozes) + opcional: 1 fruta de baixo índice glicêmico (maçã, pera).",
    icon: "🌿",
    color: "#8b5cf6",
    tip: "Castanha-do-pará: 1–2 unidades já fornecem selênio diário. Iogurte grego tem o dobro de proteína do comum.",
    days: "Todos os dias"
  },
  {
    meal: "Jantar",
    time: "20:30",
    original: "Carne magra + salada + carbo leve",
    improved: "150g proteína magra (frango, peixe, ovo) + salada verde ampla + legumes cozidos ou grelhados + 50–80g arroz/batata doce (nos dias de treino) ou sem carbo (dias de descanso).",
    icon: "🌙",
    color: "#ef4444",
    tip: "Nos dias sem treino, reduza carboidratos no jantar. Priorize vegetais fibrosos para saciedade sem excesso calórico.",
    days: "Todos os dias"
  },
  {
    meal: "Ceia",
    time: "22:00",
    original: "Proteína leve (iogurte ou ovos)",
    improved: "150g queijo cottage ou iogurte grego + 1 colher de semente de linhaça ou chia. Alternativa: 2 ovos cozidos com sal e azeite.",
    icon: "⭐",
    color: "#06b6d4",
    tip: "Caseína (proteína do cottage/iogurte) é absorvida lentamente, ideal para recuperação muscular durante o sono.",
    days: "Todos os dias"
  },
];

function generateICS() {
  const events = [];
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  
  // Days of week (Mon=1..Fri=5)
  const dayMap = { seg: "MO", ter: "TU", qua: "WE", qui: "TH", sex: "FR" };

  // Jiu-Jitsu
  events.push(`BEGIN:VEVENT
DTSTART;TZID=America/Sao_Paulo:${year}${month}01T060000
DTEND;TZID=America/Sao_Paulo:${year}${month}01T070000
RRULE:FREQ=WEEKLY;BYDAY=MO,TU,FR
SUMMARY:🥋 Jiu-Jitsu
DESCRIPTION:Treino de Jiu-Jitsu
BEGIN:VALARM
TRIGGER:-PT30M
ACTION:DISPLAY
DESCRIPTION:Preparar para sair para o treino!
END:VALARM
END:VEVENT`);

  // Passeio cachorro
  events.push(`BEGIN:VEVENT
DTSTART;TZID=America/Sao_Paulo:${year}${month}01T190000
DTEND;TZID=America/Sao_Paulo:${year}${month}01T193000
RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR
SUMMARY:🐕 Passeio do Cachorro
DESCRIPTION:Passeio com o cachorro
END:VEVENT`);

  // Treino noturno (seg, ter, qui)
  events.push(`BEGIN:VEVENT
DTSTART;TZID=America/Sao_Paulo:${year}${month}01T193000
DTEND;TZID=America/Sao_Paulo:${year}${month}01T203000
RRULE:FREQ=WEEKLY;BYDAY=MO,TU,TH
SUMMARY:💪 Treino Noturno
DESCRIPTION:Treino de força/condicionamento
BEGIN:VALARM
TRIGGER:-PT15M
ACTION:DISPLAY
DESCRIPTION:Hora do treino!
END:VALARM
END:VEVENT`);

  // Leitura
  events.push(`BEGIN:VEVENT
DTSTART;TZID=America/Sao_Paulo:${year}${month}01T210000
DTEND;TZID=America/Sao_Paulo:${year}${month}01T223000
RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR
SUMMARY:📖 Leitura
DESCRIPTION:Tempo de leitura / descanso mental
END:VEVENT`);

  // Diet reminders
  const mealReminders = [
    { time: "045000", name: "⚡ Pré-treino", desc: "Banana + café preto antes do Jiu-Jitsu", days: "MO,TU,FR" },
    { time: "071500", name: "🌅 Café da Manhã", desc: "Ovos + aveia + fruta + pasta amendoim", days: "MO,TU,WE,TH,FR" },
    { time: "120000", name: "☀️ Almoço", desc: "Proteína + arroz integral + legumes + salada", days: "MO,TU,WE,TH,FR" },
    { time: "153000", name: "🌿 Lanche", desc: "Iogurte grego + castanhas", days: "MO,TU,WE,TH,FR" },
    { time: "203000", name: "🌙 Jantar", desc: "Proteína magra + salada + carbo leve", days: "MO,TU,WE,TH,FR" },
    { time: "220000", name: "⭐ Ceia", desc: "Cottage ou iogurte grego + sementes", days: "MO,TU,WE,TH,FR" },
  ];

  mealReminders.forEach(m => {
    events.push(`BEGIN:VEVENT
DTSTART;TZID=America/Sao_Paulo:${year}${month}01T${m.time}
DTEND;TZID=America/Sao_Paulo:${year}${month}01T${m.time}
RRULE:FREQ=WEEKLY;BYDAY=${m.days}
SUMMARY:${m.name}
DESCRIPTION:${m.desc}
BEGIN:VALARM
TRIGGER:PT0M
ACTION:DISPLAY
DESCRIPTION:${m.name} - ${m.desc}
END:VALARM
END:VEVENT`);
  });

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Rotina & Dieta//PT
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Rotina & Dieta Semanal
X-WR-TIMEZONE:America/Sao_Paulo
${events.join("\n")}
END:VCALENDAR`;
}

const DAYS = ["seg", "ter", "qua", "qui", "sex"];
const DAY_LABELS = { seg: "Seg", ter: "Ter", qua: "Qua", qui: "Qui", sex: "Sex" };

function getCellStyle(val) {
  if (val === "—") return { opacity: 0.2 };
  if (val.includes("Jiu-Jitsu") || val.includes("treino") || val.includes("Treino")) return { background: "rgba(16,185,129,0.15)", borderLeft: "2px solid #10b981" };
  if (val.includes("Trabalho")) return { background: "rgba(59,130,246,0.12)", borderLeft: "2px solid #3b82f6" };
  if (val.includes("Dormir") || val.includes("Leitura")) return { background: "rgba(139,92,246,0.12)", borderLeft: "2px solid #8b5cf6" };
  if (val.includes("Jantar") || val.includes("café") || val.includes("Café") || val.includes("Pós")) return { background: "rgba(245,158,11,0.12)", borderLeft: "2px solid #f59e0b" };
  return {};
}

export default function App() {
  const [tab, setTab] = useState("rotina");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Olá! Sou seu coach de rotina e nutrição. Posso analisar sua semana, sugerir ajustes na dieta, calcular macros, criar variações de refeições ou responder qualquer dúvida sobre treino e alimentação. O que deseja?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    const context = `Você é um coach especializado em nutrição esportiva e rotina saudável. O usuário pratica Jiu-Jitsu 3x/semana (Seg, Ter, Sex às 06h), trabalha das 08h às 18h, faz treino noturno alguns dias, passeia com o cachorro às 19h e dorme às 22h30. 

Dieta atual melhorada:
- Pré JJ (04:50): banana + café preto + mel
- Café (07:15): 3 ovos + 50g aveia + fruta + pasta amendoim  
- Almoço (12h): 150-200g proteína + arroz integral + legumes + salada
- Lanche (15:30): iogurte grego + castanhas
- Jantar (20:30): proteína magra + salada (com carbo nos dias de treino)
- Ceia (22h): cottage/iogurte + sementes

Responda em português, de forma direta e prática. Use emojis com moderação. Foque em dicas aplicáveis.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: context,
          messages: [
            ...messages.filter(m => m.role !== "assistant" || messages.indexOf(m) > 0).map(m => ({ role: m.role, content: m.content })),
            { role: "user", content: userMsg }
          ]
        })
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Não consegui processar. Tente novamente.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Erro de conexão. Verifique sua internet." }]);
    }
    setLoading(false);
  }

  function downloadICS() {
    const ics = generateICS();
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rotina_semanal.ics";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", color: "#e8e8f0", fontFamily: "'DM Mono', 'Fira Mono', monospace" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e1e2e", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0d0d14" }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 3, color: "#4ade80", textTransform: "uppercase", marginBottom: 4 }}>Sistema de Rotina</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", letterSpacing: -0.5 }}>Rotina & Dieta Semanal</div>
        </div>
        <button onClick={downloadICS} style={{ background: "linear-gradient(135deg, #10b981, #059669)", border: "none", borderRadius: 8, padding: "10px 16px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5, display: "flex", alignItems: "center", gap: 6 }}>
          📅 Exportar Calendário
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #1e1e2e", background: "#0d0d14" }}>
        {[["rotina", "📋 Rotina Semanal"], ["dieta", "🥗 Dieta Otimizada"], ["coach", "🤖 Coach IA"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ padding: "14px 22px", background: "none", border: "none", color: tab === key ? "#4ade80" : "#555", fontSize: 13, fontWeight: tab === key ? 700 : 400, cursor: "pointer", borderBottom: tab === key ? "2px solid #4ade80" : "2px solid transparent", transition: "all 0.2s" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Rotina Tab */}
      {tab === "rotina" && (
        <div style={{ padding: "24px 16px" }}>
          <div style={{ marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[["🥋 Treino", "#10b981"], ["💼 Trabalho", "#3b82f6"], ["🌙 Descanso", "#8b5cf6"], ["🍽️ Alimentação", "#f59e0b"]].map(([l, c]) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#888" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
                {l}
              </div>
            ))}
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
              <thead>
                <tr>
                  <th style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, color: "#4ade80", letterSpacing: 1, borderBottom: "1px solid #1e1e2e", width: 90 }}>HORÁRIO</th>
                  {DAYS.map(d => (
                    <th key={d} style={{ padding: "10px 12px", textAlign: "center", fontSize: 11, color: "#888", letterSpacing: 1, borderBottom: "1px solid #1e1e2e" }}>{DAY_LABELS[d].toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SCHEDULE.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #12121a" }}>
                    <td style={{ padding: "10px 12px", fontSize: 12, color: "#4ade80", fontWeight: 700, whiteSpace: "nowrap" }}>{row.time}</td>
                    {DAYS.map(d => {
                      const val = row[d];
                      const cs = getCellStyle(val);
                      return (
                        <td key={d} style={{ padding: "8px 10px", fontSize: 12, textAlign: "center", borderRadius: 4, ...cs, color: val === "—" ? "#333" : "#ddd" }}>
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 20, background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: 12, color: "#4ade80", fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>📊 RESUMO SEMANAL</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              {[["🥋 Jiu-Jitsu", "3x / semana", "#10b981"], ["💪 Treinos", "3x à noite", "#3b82f6"], ["😴 Sono", "~7h30/noite", "#8b5cf6"]].map(([l, v, c]) => (
                <div key={l} style={{ textAlign: "center", padding: "12px 8px", background: "#0a0a0f", borderRadius: 8, border: `1px solid ${c}22` }}>
                  <div style={{ fontSize: 18, marginBottom: 4 }}>{l.split(" ")[0]}</div>
                  <div style={{ fontSize: 10, color: "#888", marginBottom: 2 }}>{l.split(" ").slice(1).join(" ")}</div>
                  <div style={{ fontSize: 14, color: c, fontWeight: 700 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Dieta Tab */}
      {tab === "dieta" && (
        <div style={{ padding: "24px 16px" }}>
          <div style={{ marginBottom: 16, fontSize: 12, color: "#555", lineHeight: 1.6 }}>
            Sugestões otimizadas com base em nutrição esportiva para praticantes de Jiu-Jitsu.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {DIET.map((item, i) => (
              <div key={i} style={{ background: "#0d0d14", border: `1px solid ${item.color}22`, borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ fontSize: 26, lineHeight: 1 }}>{item.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{item.meal}</span>
                      <span style={{ fontSize: 11, color: item.color, background: `${item.color}18`, padding: "2px 8px", borderRadius: 20 }}>{item.time}</span>
                      <span style={{ fontSize: 10, color: "#444" }}>{item.days}</span>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <div style={{ fontSize: 10, color: "#444", marginBottom: 2, letterSpacing: 0.5 }}>ORIGINAL</div>
                      <div style={{ fontSize: 12, color: "#555", textDecoration: "line-through" }}>{item.original}</div>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 10, color: item.color, marginBottom: 2, letterSpacing: 0.5 }}>✦ OTIMIZADO</div>
                      <div style={{ fontSize: 13, color: "#ccc", lineHeight: 1.5 }}>{item.improved}</div>
                    </div>
                    <div style={{ background: `${item.color}0d`, border: `1px solid ${item.color}22`, borderRadius: 6, padding: "8px 10px", fontSize: 11, color: "#888", lineHeight: 1.5 }}>
                      💡 {item.tip}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, background: "#0d0d14", border: "1px solid #1e1e2e", borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 11, color: "#4ade80", fontWeight: 700, marginBottom: 10, letterSpacing: 1 }}>🎯 METAS NUTRICIONAIS ESTIMADAS</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
              {[["Proteína", "~160g", "#10b981"], ["Carbo", "~200g", "#f59e0b"], ["Gordura", "~70g", "#8b5cf6"], ["Calorias", "~2200kcal", "#3b82f6"]].map(([l, v, c]) => (
                <div key={l} style={{ textAlign: "center", padding: "10px 4px", background: "#0a0a0f", borderRadius: 6 }}>
                  <div style={{ fontSize: 10, color: "#555", marginBottom: 3 }}>{l}</div>
                  <div style={{ fontSize: 14, color: c, fontWeight: 700 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 10, color: "#333" }}>* Estimativa para dias de treino. Reduza carboidratos em ~50g nos dias de descanso.</div>
          </div>
        </div>
      )}

      {/* Coach Tab */}
      {tab === "coach" && (
        <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 120px)" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 14, display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                {m.role === "assistant" && <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0, marginRight: 10, marginTop: 2 }}>🤖</div>}
                <div style={{ maxWidth: "80%", padding: "11px 14px", borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px", background: m.role === "user" ? "linear-gradient(135deg, #10b981, #059669)" : "#111118", border: m.role === "user" ? "none" : "1px solid #1e1e2e", fontSize: 13, color: m.role === "user" ? "#fff" : "#ddd", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 14 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg, #10b981, #059669)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🤖</div>
                <div style={{ padding: "11px 16px", background: "#111118", border: "1px solid #1e1e2e", borderRadius: "14px 14px 14px 4px", display: "flex", gap: 6, alignItems: "center" }}>
                  {[0, 150, 300].map(d => (
                    <div key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", animation: "pulse 1s infinite", animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>
          <div style={{ padding: "12px 16px", borderTop: "1px solid #1e1e2e", background: "#0d0d14" }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
              {["Calcular meus macros", "Variações de almoço", "Suplementação para JJ", "Ajuste para perder gordura"].map(s => (
                <button key={s} onClick={() => setInput(s)} style={{ fontSize: 11, padding: "4px 10px", background: "#111118", border: "1px solid #1e1e2e", borderRadius: 20, color: "#888", cursor: "pointer" }}>
                  {s}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Pergunte sobre treino, dieta, suplementação..." style={{ flex: 1, background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "11px 14px", color: "#ddd", fontSize: 13, outline: "none" }} />
              <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ background: loading ? "#1a2a20" : "linear-gradient(135deg, #10b981, #059669)", border: "none", borderRadius: 8, padding: "11px 18px", color: "#fff", fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
                ↑
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.3 } 50% { opacity: 1 } }`}</style>
    </div>
  );
}
