import React, { useState, useEffect, useCallback } from "react";
import {
  Heart, MessageCircleHeart, LogIn, Plus, Edit3, Check, X, Filter,
  Moon, HomeIcon, ActivitySquare, Baby, Weight, Calendar, ShieldCheck,
  ChevronDown, ChevronUp, Sparkles, LogOut, Send, Loader2, BookHeart
} from "lucide-react";

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Nunito:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');
`;

const PASTEL = {
  mint: "#C6EFD9",
  mintDark: "#2F6B47",
  blue: "#D3E6FE",
  blueDark: "#3B5998",
  lilac: "#E7DAF7",
  lilacDark: "#6B4E96",
  peach: "#FFE6D6",
  peachDark: "#B5703F",
};

const STATUS_META = {
  uti: { label: "UTI Neonatal", color: PASTEL.blue, dark: PASTEL.blueDark, icon: Moon, bg: "#EEF4FF" },
  semi: { label: "Semi-intensiva", color: PASTEL.mint, dark: PASTEL.mintDark, icon: ActivitySquare, bg: "#F0FBF4" },
  alta: { label: "Alta! Em casa", color: PASTEL.peach, dark: PASTEL.peachDark, icon: HomeIcon, bg: "#FEF8EC" },
};

const FOUNDER_STORY = {
  id: "founder-0",
  babyName: "Valentina",
  weeks: 29,
  weight: "880g",
  status: "alta",
  authorName: "Camila, mãe da Valentina",
  text:
    "Valentina nasceu de 29 semanas, pesando 880 gramas. Cabia na palma da minha mão e eu não podia nem segurá-la. Foram 97 dias de UTI, alarmes que me tiravam o sono e uma fé que eu não sabia que tinha até precisar dela inteira. Hoje ela corre pela sala, gorda e brava quando não quer comer verdura. Se você está no começo dessa jornada: seu bebê é mais forte do que parece, e você também.",
  updates: [
    { date: "07/07/2026", text: "3 aninhos hoje! Trouxe um bolinho pra UTI que a salvou, de agradecimento." },
    { date: "12/03/2024", text: "Alta definitiva. 4kg200 e mamando no peito. Chorei no carro." },
  ],
  isFounder: true,
  postStatus: "aprovado",
};

const SEED_STORIES = [
  {
    id: "seed-1",
    babyName: "Théo",
    weeks: 32,
    weight: "1.640kg",
    status: "uti",
    authorName: "Marina, mãe do Théo",
    text:
      "Ainda estamos na UTI, no dia 12. Hoje ele abriu os olhinhos pra mim pela primeira vez e meu peito se encheu de uma coisa que não sei nem nomear. Tenho medo de me apegar demais aos números da balança, mas tento respirar e confiar na equipe.",
    updates: [{ date: "05/07/2026", text: "Passou para o CPAP! Menos um tubo, mais uma vitória." }],
    postStatus: "aprovado",
  },
  {
    id: "seed-2",
    babyName: "Noah",
    weeks: 34,
    weight: "2.100kg",
    status: "semi",
    authorName: "Rafael, pai do Noah",
    text:
      "Saímos da UTI essa semana pra semi-intensiva. Parece pequeno pra quem não viveu, mas pra nós foi like tirar um peso do mundo. Ele já suga a chuquinha sozinho às vezes.",
    updates: [],
    postStatus: "aprovado",
  },
  {
    id: "seed-3",
    babyName: "Alice",
    weeks: 30,
    weight: "1.310kg",
    status: "alta",
    authorName: "Juliana, mãe da Alice",
    text:
      "Depois de 68 dias internada, minha filha dorme no berço do quarto dela hoje. Guardo esse dia com um carinho enorme por todo mundo que rezou com a gente.",
    updates: [{ date: "01/06/2026", text: "Primeira consulta com o pediatra de fora. Ganhou 300g!" }],
    postStatus: "aprovado",
  },
];

function resizeImage(file, maxWidth = 480) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const storage = {
  async get(key) {
    const value = localStorage.getItem(key);
    if (value === null) return null;
    return { key, value };
  },
  async set(key, value) {
    localStorage.setItem(key, value);
    return { key, value };
  },
};

export default function App() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [view, setView] = useState("home");
  const [filter, setFilter] = useState("todos");
  const [showLogin, setShowLogin] = useState(false);
  const [showNewStory, setShowNewStory] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [editingStory, setEditingStory] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await storage.get("stories-list");
        if (res && res.value) {
          setStories(JSON.parse(res.value));
        } else {
          setStories(SEED_STORIES);
          await storage.set("stories-list", JSON.stringify(SEED_STORIES));
        }
      } catch (e) {
        setStories(SEED_STORIES);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (next) => {
    setStories(next);
    try {
      await storage.set("stories-list", JSON.stringify(next));
    } catch (e) {
      console.error("Erro ao salvar", e);
    }
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const handleLogin = (name) => {
    setUser({ name, isAdmin: false });
    setShowLogin(false);
    showToast(`Bem-vindo(a), ${name}! ✨`);
  };

  const handleAdminLogin = (password) => {
    if (password === "Tina1904") {
      setUser({ name: "Administrador", isAdmin: true });
      setShowLogin(false);
      showToast("Você entrou como admin! 🔑");
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setUser(null);
    setView("home");
    showToast("Você saiu. Volte sempre que precisar. 💛");
  };

  const handleNewStory = async (data) => {
    const newStory = {
      id: "story-" + Date.now(),
      ...data,
      authorName: user.name,
      updates: [],
      postStatus: "pendente",
      createdAt: Date.now(),
    };
    await persist([newStory, ...stories]);
    setShowNewStory(false);
    showToast("Sua história foi enviada e está aguardando aprovação. 🌱");
  };

  const handleAddUpdate = async (storyId, updateText, dateStr) => {
    const next = stories.map((s) =>
      s.id === storyId
        ? { ...s, updates: [{ date: dateStr, text: updateText }, ...(s.updates || [])] }
        : s
    );
    await persist(next);
    showToast("Jornada atualizada!");
  };

  const handleEditText = async (storyId, newText, newStatus) => {
    const next = stories.map((s) =>
      s.id === storyId ? { ...s, text: newText, status: newStatus } : s
    );
    await persist(next);
    setEditingStory(null);
    showToast("História atualizada com carinho.");
  };

  const handleModerate = async (storyId, decision) => {
    const next =
      decision === "aprovar"
        ? stories.map((s) => (s.id === storyId ? { ...s, postStatus: "aprovado" } : s))
        : stories.filter((s) => s.id !== storyId);
    await persist(next);
    showToast(decision === "aprovar" ? "História aprovada e publicada." : "História removida.");
  };

  const toggleExpand = (id) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  const approvedStories = stories.filter((s) => s.postStatus === "aprovado");
  const visibleStories =
    filter === "todos" ? approvedStories : approvedStories.filter((s) => s.status === filter);
  const myStories = user ? stories.filter((s) => s.authorName === user.name) : [];
  const pendingStories = stories.filter((s) => s.postStatus === "pendente");

  const scrollToForca = () => {
    document.getElementById("forca-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const openDesabafar = () => {
    if (!user) setShowLogin(true);
    else setShowNewStory(true);
  };

  return (
    <div
      style={{
        fontFamily: "'Nunito', sans-serif",
        background: "#FDFBF7",
        minHeight: "100vh",
        color: "#4A4438",
      }}
    >
      <style>{FONT_IMPORT}</style>
      <style>{`
        .font-display { font-family: 'Poppins', sans-serif; }
        * { box-sizing: border-box; }
        ::selection { background: #A8E6CF; }
        @keyframes floatIn { from { opacity:0; transform: translateY(10px);} to {opacity:1; transform:translateY(0);} }
        .floatIn { animation: floatIn .5s ease both; }
        button:focus-visible, a:focus-visible, textarea:focus-visible, input:focus-visible, select:focus-visible {
          outline: 3px solid ${PASTEL.blue}; outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          .floatIn { animation: none; }
        }
      `}</style>

      <Header user={user} onLogin={() => setShowLogin(true)} onLogout={handleLogout} view={view} setView={setView} />

      {view === "home" && (
        <>
          <Hero onForca={scrollToForca} onDesabafar={openDesabafar} />
          <FounderCard story={FOUNDER_STORY} expanded={!!expanded[FOUNDER_STORY.id]} onToggle={() => toggleExpand(FOUNDER_STORY.id)} />
          <div id="forca-section" />
          <EncouragementSection />
          <Feed
            loading={loading}
            filter={filter}
            setFilter={setFilter}
            stories={visibleStories}
            expanded={expanded}
            toggleExpand={toggleExpand}
          />
        </>
      )}

      {view === "myStories" && user && (
        <MyStories
          stories={myStories}
          onEdit={(s) => setEditingStory(s)}
        />
      )}

      {view === "admin" && user?.isAdmin && (
        <AdminPanel pending={pendingStories} onModerate={handleModerate} />
      )}

      {view === "admin" && !user?.isAdmin && (
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px" }}>
          <div style={{ background: "#FDF4F2", border: "1px solid #F3D9D2", borderRadius: 16, padding: "32px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 16, color: "#B5543F", fontWeight: 600 }}>Acesso restrito a administradores.</p>
          </div>
        </div>
      )}

      <Footer setView={setView} user={user} />

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} onAdminLogin={handleAdminLogin} />}
      {showNewStory && (
        <NewStoryModal onClose={() => setShowNewStory(false)} onSubmit={handleNewStory} />
      )}
      {editingStory && (
        <EditStoryModal
          story={editingStory}
          onClose={() => setEditingStory(null)}
          onSaveText={handleEditText}
          onAddUpdate={handleAddUpdate}
        />
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}
/* ---------------- Header ---------------- */
function Header({ user, onLogin, onLogout, view, setView }) {
  return (
    <header
      style={{
        background: "rgba(253,251,247,0.9)",
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid #EFE9DD",
        position: "sticky",
        top: 0,
        zIndex: 40,
      }}
    >
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <button
          onClick={() => setView("home")}
          style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <div
            style={{
              width: 38, height: 38, borderRadius: "12px",
              background: "linear-gradient(135deg, #A8E6CF, #A1C4FD)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            <Heart size={20} color="#fff" fill="#fff" />
          </div>
          <div style={{ textAlign: "left" }}>
            <div className="font-display" style={{ fontWeight: 700, fontSize: 17, lineHeight: 1.1, color: "#3E7C57" }}>
              Pais de Prematuros
            </div>
            <div style={{ fontSize: 11.5, color: "#9C9384", fontStyle: "italic" }}>
              Histórias reais que acalmam o coração
            </div>
          </div>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {user && !user.isAdmin && (
            <button
              onClick={() => setView("myStories")}
              style={{
                fontFamily: "'Poppins', sans-serif", fontSize: 13.5, fontWeight: 600,
                padding: "9px 14px", borderRadius: 999, cursor: "pointer",
                border: view === "myStories" ? "1.5px solid #88D49E" : "1.5px solid transparent",
                background: view === "myStories" ? "#F0FBF4" : "transparent", color: "#3E7C57",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <BookHeart size={16} /> Minhas Histórias
            </button>
          )}
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {!user.isAdmin && (
                <span style={{ fontSize: 13.5, color: "#7A7263", fontWeight: 600, display: "none" }} className="hide-sm">
                  {user.name}
                </span>
              )}
              <button
                onClick={onLogout}
                title="Sair"
                style={{
                  display: "flex", alignItems: "center", gap: 6, fontFamily: "'Poppins', sans-serif",
                  fontSize: 13.5, fontWeight: 600, padding: "9px 14px", borderRadius: 999,
                  border: "1.5px solid #EFE9DD", background: "#fff", color: "#9C9384", cursor: "pointer",
                }}
              >
                <LogOut size={15} /> Sair
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              style={{
                display: "flex", alignItems: "center", gap: 6, fontFamily: "'Poppins', sans-serif",
                fontSize: 13.5, fontWeight: 700, padding: "10px 16px", borderRadius: 999,
                border: "none", background: PASTEL.blue, color: PASTEL.blueDark, cursor: "pointer",
                boxShadow: `0 2px 10px rgba(211,230,254,0.6)`,
              }}
            >
              <LogIn size={15} /> Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero({ onForca, onDesabafar }) {
  return (
    <section style={{ maxWidth: 780, margin: "0 auto", padding: "56px 24px 32px", textAlign: "center" }} className="floatIn">
      <div
        style={{
          display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700,
          color: "#3E7C57", background: "#F0FBF4", border: "1px solid #D3F0DF",
          padding: "6px 14px", borderRadius: 999, marginBottom: 20, fontFamily: "'Poppins', sans-serif",
        }}
      >
        <Sparkles size={14} /> Você não está sozinho(a) nessa jornada
      </div>
      <h1 className="font-display" style={{ fontSize: "clamp(32px, 6vw, 52px)", fontWeight: 800, color: "#3A362E", lineHeight: 1.3, margin: "0 auto 18px", maxWidth: 640, textAlign: "center" }}>
        Cada grama, cada dia,<br />
        <span
          style={{
            background: `linear-gradient(120deg, ${PASTEL.blue} 0%, ${PASTEL.mint} 100%)`,
            padding: "3px 16px",
            borderRadius: 14,
            display: "inline-block",
            marginTop: 8,
          }}
        >
          cada vitória importa.
        </span>
      </h1>
      <p style={{ fontSize: 16.5, color: "#7A7263", lineHeight: 1.6, maxWidth: 560, margin: "0 auto 30px" }}>
        Um espaço acolhedor para famílias que vivem a rotina da UTI Neonatal. Aqui você pode ler
        histórias reais, se inspirar e, quando quiser, contar a sua.
      </p>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
        <button
          onClick={onForca}
          style={{
            fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 15, color: PASTEL.blueDark,
            background: PASTEL.blue, border: "none", padding: "14px 24px", borderRadius: 999,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 6px 18px rgba(211,230,254,0.7)",
          }}
        >
          <Heart size={17} /> Preciso de Força
        </button>
        <button
          onClick={onDesabafar}
          style={{
            fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 15, color: PASTEL.mintDark,
            background: PASTEL.mint, border: "none", padding: "14px 24px", borderRadius: 999,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 6px 18px rgba(198,239,217,0.7)",
          }}
        >
          <MessageCircleHeart size={17} /> Quero Desabafar
        </button>
      </div>
    </section>
  );
}

/* ---------------- Founder Card ---------------- */
function FounderCard({ story, expanded, onToggle }) {
  const meta = STATUS_META[story.status];
  return (
    <section style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 8px" }}>
      <div
        style={{
          position: "relative", borderRadius: 22, padding: 2,
          background: "linear-gradient(135deg, #A8E6CF, #A1C4FD, #F2C879)",
        }}
      >
        <div style={{ background: "#fff", borderRadius: 20, padding: "26px 26px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
            <span
              className="font-display"
              style={{
                fontSize: 11.5, fontWeight: 700, letterSpacing: 0.4, color: "#A9791E",
                background: "#FEF8EC", border: "1px solid #F5E3B8", padding: "5px 12px", borderRadius: 999,
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <Sparkles size={12} /> A HISTÓRIA QUE DEU ORIGEM A ESSA REDE
            </span>
            <StatusBadge status={story.status} />
          </div>
          <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: "#3A362E", margin: "0 0 6px" }}>
            29 Semanas de Amor, Fé e Superação
          </h2>
          <div style={{ fontSize: 13.5, color: "#9C9384", marginBottom: 14, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <span><Baby size={13} style={{ verticalAlign: -2, marginRight: 4 }} />{story.babyName} · {story.weeks} semanas</span>
            <span><Weight size={13} style={{ verticalAlign: -2, marginRight: 4 }} />{story.weight}</span>
            <span>— por {story.authorName}</span>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#5C5648", margin: 0 }}>
            {expanded ? story.text : story.text.slice(0, 165) + "…"}
          </p>
          <button onClick={onToggle} style={linkBtnStyle}>
            {expanded ? <>Ler menos <ChevronUp size={14} /></> : <>A jornada dos 880g <ChevronDown size={14} /></>}
          </button>

          {expanded && story.updates?.length > 0 && <UpdatesTimeline updates={story.updates} />}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Status Badge ---------------- */
function StatusBadge({ status }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700,
        color: meta.dark, background: meta.bg, border: `1px solid ${meta.color}`,
        padding: "5px 11px", borderRadius: 999, fontFamily: "'Poppins', sans-serif",
      }}
    >
      <Icon size={12} /> {meta.label}
    </span>
  );
}

const linkBtnStyle = {
  marginTop: 12, background: "none", border: "none", cursor: "pointer",
  color: "#3E7C57", fontWeight: 700, fontFamily: "'Poppins', sans-serif", fontSize: 13.5,
  display: "flex", alignItems: "center", gap: 5, padding: 0,
};

/* ---------------- Updates Timeline ("Diário de Bordo" ticket style) ---------------- */
function UpdatesTimeline({ updates }) {
  return (
    <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px dashed #E3DCCB" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#9C9384", marginBottom: 10, fontFamily: "'Poppins', sans-serif", letterSpacing: 0.3 }}>
        DIÁRIO DE BORDO
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {updates.map((u, i) => (
          <div
            key={i}
            style={{
              display: "flex", gap: 10, alignItems: "flex-start", background: "#FBFAF6",
              border: "1px dashed #E3DCCB", borderRadius: 12, padding: "10px 12px",
            }}
          >
            <div style={{ width: 26, height: 26, borderRadius: 8, background: "#F0FBF4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Calendar size={13} color="#3E7C57" />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#3E7C57" }}>{u.date}</div>
              <div style={{ fontSize: 14, color: "#5C5648", lineHeight: 1.5 }}>{u.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Palavras de Incentivo ---------------- */
const ENCOURAGEMENT_PHRASES = [
  { text: "Seu amor já está curando, mesmo que você ainda não veja.", color: PASTEL.mint, dark: PASTEL.mintDark },
  { text: "Cada dia que passa é uma vitória, não importa o tamanho.", color: PASTEL.blue, dark: PASTEL.blueDark },
  { text: "Você não precisa ser forte o tempo todo. Só precisa continuar aqui.", color: PASTEL.lilac, dark: PASTEL.lilacDark },
  { text: "Gramas se ganham. Fé se constrói. Você está fazendo as duas coisas.", color: PASTEL.peach, dark: PASTEL.peachDark },
  { text: "Está tudo bem chorar no corredor e sorrir na hora da visita.", color: PASTEL.blue, dark: PASTEL.blueDark },
  { text: "Seu bebê sente sua voz, seu cheiro, seu toque. Isso já é cuidado.", color: PASTEL.mint, dark: PASTEL.mintDark },
  { text: "Essa fase é uma página difícil, não o livro inteiro.", color: PASTEL.peach, dark: PASTEL.peachDark },
  { text: "Respire. Um dia vocês vão contar essa história pelo final feliz.", color: PASTEL.lilac, dark: PASTEL.lilacDark },
];

function EncouragementSection() {
  return (
    <section style={{ maxWidth: 900, margin: "0 auto", padding: "10px 24px 10px" }}>
      <h2 className="font-display" style={{ textAlign: "center", fontSize: 22, fontWeight: 800, color: "#3A362E", marginBottom: 6 }}>
        Palavras para o seu coração hoje
      </h2>
      <p style={{ textAlign: "center", fontSize: 13.5, color: "#9C9384", marginBottom: 22 }}>
        Escolhemos algumas frases para os dias mais difíceis. Você não está sozinho(a).
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
        {ENCOURAGEMENT_PHRASES.map((p, i) => (
          <div
            key={i}
            className="floatIn"
            style={{
              background: p.color, borderRadius: 16, padding: "18px 18px",
              display: "flex", flexDirection: "column", gap: 10,
            }}
          >
            <Heart size={16} color={p.dark} fill={p.dark} />
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: p.dark, fontWeight: 600 }}>
              {p.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Feed ---------------- */
function Feed({ loading, filter, setFilter, stories, expanded, toggleExpand }) {
  const filters = [
    { id: "todos", label: "Todos" },
    { id: "uti", label: "UTI" },
    { id: "semi", label: "Semi-intensiva" },
    { id: "alta", label: "Alta" },
  ];
  return (
    <section style={{ maxWidth: 780, margin: "0 auto", padding: "36px 24px 70px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#9C9384", fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
          <Filter size={14} /> Filtrar por:
        </span>
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            style={{
              fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700,
              padding: "7px 14px", borderRadius: 999, cursor: "pointer",
              border: filter === f.id ? `1.5px solid ${PASTEL.mint}` : "1.5px solid #EFE9DD",
              background: filter === f.id ? "#F0FBF4" : "#fff",
              color: filter === f.id ? PASTEL.mintDark : "#9C9384",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#9C9384", padding: "40px 0", justifyContent: "center" }}>
          <Loader2 className="spin" size={18} /> Carregando histórias…
        </div>
      ) : stories.length === 0 ? (
        <div style={{ textAlign: "center", color: "#9C9384", padding: "40px 20px", fontSize: 14.5 }}>
          Ainda não há histórias aprovadas com esse filtro. Que tal ser a primeira pessoa a contar a sua? 🌿
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {stories.map((s) => (
            <StoryCard key={s.id} story={s} expanded={!!expanded[s.id]} onToggle={() => toggleExpand(s.id)} />
          ))}
        </div>
      )}
    </section>
  );
}

function StoryCard({ story, expanded, onToggle }) {
  const long = story.text.length > 220;
  return (
    <article className="floatIn" style={{ background: "#fff", border: "1px solid #F0EBE0", borderRadius: 18, padding: "20px 22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {story.photo && (
            <img src={story.photo} alt={story.babyName} style={{ width: 52, height: 52, borderRadius: 14, objectFit: "cover", border: "2px solid #F0EBE0", flexShrink: 0 }} />
          )}
          <div>
            <h3 className="font-display" style={{ margin: 0, fontSize: 16.5, fontWeight: 700, color: "#3A362E" }}>{story.babyName}</h3>
            <div style={{ fontSize: 12.5, color: "#9C9384", marginTop: 2 }}>
              {story.weeks} semanas · {story.weight} — por {story.authorName}
            </div>
          </div>
        </div>
        <StatusBadge status={story.status} />
      </div>
      <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "#5C5648", margin: "0 0 4px" }}>
        {expanded || !long ? story.text : story.text.slice(0, 220) + "…"}
      </p>
      {long && (
        <button onClick={onToggle} style={linkBtnStyle}>
          {expanded ? <>Ler menos <ChevronUp size={14} /></> : <>Ler mais <ChevronDown size={14} /></>}
        </button>
      )}
      {expanded && story.updates?.length > 0 && <UpdatesTimeline updates={story.updates} />}
    </article>
  );
}

/* ---------------- Login Modal (simulado) ---------------- */
function LoginModal({ onClose, onLogin, onAdminLogin }) {
  const [name, setName] = useState("");
  const [tab, setTab] = useState("user"); // user | admin
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  const handleAdminSubmit = () => {
    if (onAdminLogin(adminPassword)) {
      onClose();
    } else {
      setAdminError("Senha incorreta");
      setAdminPassword("");
      setTimeout(() => setAdminError(""), 3000);
    }
  };

  return (
    <Modal onClose={onClose} title="Entrar" icon={<LogIn size={18} />}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <TabBtn active={tab === "user"} onClick={() => { setTab("user"); setAdminError(""); }}>Participante</TabBtn>
        <TabBtn active={tab === "admin"} onClick={() => { setTab("admin"); setAdminError(""); }}>Administrador</TabBtn>
      </div>

      {tab === "user" ? (
        <>
          <p style={{ fontSize: 13.5, color: "#9C9384", margin: "0 0 18px" }}>
            Para comentar ou compartilhar sua história, faça login. Nesta demonstração, escolha uma
            opção e diga como quer ser chamado(a).
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            <SocialLoginButton label="Continuar com Google" color="#EA4335" name={name} setName={setName} onLogin={onLogin} />
            <SocialLoginButton label="Continuar com Facebook" color="#1877F2" name={name} setName={setName} onLogin={onLogin} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "6px 0 14px" }}>
            <div style={{ flex: 1, height: 1, background: "#F0EBE0" }} />
            <span style={{ fontSize: 11.5, color: "#B4AC9C" }}>ou informe seu nome</span>
            <div style={{ flex: 1, height: 1, background: "#F0EBE0" }} />
          </div>
          <input
            placeholder="Como podemos te chamar?"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
          <button
            disabled={!name.trim()}
            onClick={() => onLogin(name.trim())}
            style={{ ...primaryBtnStyle, width: "100%", marginTop: 14, opacity: name.trim() ? 1 : 0.5 }}
          >
            Entrar
          </button>
        </>
      ) : (
        <>
          <p style={{ fontSize: 13.5, color: "#9C9384", margin: "0 0 18px" }}>
            Informe a senha de administrador para acessar o painel de moderação.
          </p>
          <input
            type="password"
            placeholder="Senha de administrador"
            value={adminPassword}
            onChange={(e) => { setAdminPassword(e.target.value); setAdminError(""); }}
            style={inputStyle}
          />
          {adminError && (
            <div style={{ color: "#B5543F", fontSize: 13, marginBottom: 12, fontWeight: 600 }}>
              {adminError}
            </div>
          )}
          <button
            disabled={!adminPassword.trim()}
            onClick={handleAdminSubmit}
            style={{ ...primaryBtnStyle, width: "100%", marginTop: 14, opacity: adminPassword.trim() ? 1 : 0.5 }}
          >
            Acessar Painel
          </button>
          <p style={{ fontSize: 12, color: "#B4AC9C", marginTop: 14, textAlign: "center" }}>
            💡 Senha padrão: <code style={{ background: "#F5F1E8", padding: "2px 6px", borderRadius: 4 }}>admin123</code>
          </p>
        </>
      )}
    </Modal>
  );

  function SocialLoginButton({ label, color, name, setName, onLogin }) {
    return (
      <button
        onClick={() => { if (!name.trim()) setName("Visitante"); onLogin(name.trim() || "Visitante"); }}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          padding: "11px 14px", borderRadius: 12, border: "1.5px solid #F0EBE0",
          background: "#fff", cursor: "pointer", fontFamily: "'Poppins', sans-serif",
          fontWeight: 600, fontSize: 14, color: "#5C5648",
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: color }} />
        {label}
      </button>
    );
  }
}

/* ---------------- New Story Modal ---------------- */
function NewStoryModal({ onClose, onSubmit }) {
  const [babyName, setBabyName] = useState("");
  const [weeks, setWeeks] = useState("");
  const [weight, setWeight] = useState("");
  const [status, setStatus] = useState("uti");
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoLoading, setPhotoLoading] = useState(false);

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoLoading(true);
    try {
      const dataUrl = await resizeImage(file);
      setPhoto(dataUrl);
    } catch {
      // silencioso: se falhar, apenas não anexa foto
    } finally {
      setPhotoLoading(false);
    }
  };

  const valid = babyName.trim() && weeks && weight.trim() && text.trim().length > 10;

  return (
    <Modal onClose={onClose} title="Contar minha história" icon={<MessageCircleHeart size={18} />} wide>
      <p style={{ fontSize: 13.5, color: "#9C9384", margin: "0 0 16px" }}>
        Seu relato passará por uma breve moderação antes de aparecer no feed público. 💛
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <Field label="Nome/apelido do bebê">
          <input value={babyName} onChange={(e) => setBabyName(e.target.value)} placeholder="Ex: Théo" style={inputStyle} />
        </Field>
        <Field label="Semanas de nascimento">
          <input type="number" value={weeks} onChange={(e) => setWeeks(e.target.value)} placeholder="Ex: 32" style={inputStyle} />
        </Field>
        <Field label="Peso de nascimento">
          <input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Ex: 1.640kg" style={inputStyle} />
        </Field>
        <Field label="Status atual">
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
            <option value="uti">UTI Neonatal</option>
            <option value="semi">Semi-intensiva</option>
            <option value="alta">Alta! Em casa</option>
          </select>
        </Field>
      </div>
      <Field label="Seu relato">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Conte com suas palavras como está essa jornada…"
          rows={6}
          style={{ ...inputStyle, resize: "vertical", fontFamily: "'Nunito', sans-serif" }}
        />
      </Field>
      <Field label="Foto do bebê (opcional)">
        <input type="file" accept="image/*" onChange={handlePhotoChange} style={inputStyle} />
        {photoLoading && <div style={{ fontSize: 12.5, color: "#9C9384", marginBottom: 10 }}>Carregando foto…</div>}
        {photo && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <img src={photo} alt="Prévia" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 14, border: "1.5px solid #F0EBE0" }} />
            <button
              type="button"
              onClick={() => setPhoto(null)}
              style={{ background: "none", border: "none", color: "#B5543F", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}
            >
              Remover foto
            </button>
          </div>
        )}
      </Field>
      <button
        disabled={!valid}
        onClick={() => onSubmit({ babyName: babyName.trim(), weeks: Number(weeks), weight: weight.trim(), status, text: text.trim(), photo })}
        style={{ ...primaryBtnStyle, width: "100%", marginTop: 16, opacity: valid ? 1 : 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
      >
        <Send size={15} /> Enviar para aprovação
      </button>
    </Modal>
  );
}

/* ---------------- Edit Story Modal ---------------- */
function EditStoryModal({ story, onClose, onSaveText, onAddUpdate }) {
  const [tab, setTab] = useState("update"); // update | edit
  const [text, setText] = useState(story.text);
  const [status, setStatus] = useState(story.status);
  const [updateText, setUpdateText] = useState("");

  const todayStr = new Date().toLocaleDateString("pt-BR");

  return (
    <Modal onClose={onClose} title={`Atualizar Jornada — ${story.babyName}`} icon={<Edit3 size={18} />} wide>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <TabBtn active={tab === "update"} onClick={() => setTab("update")}>Adicionar atualização</TabBtn>
        <TabBtn active={tab === "edit"} onClick={() => setTab("edit")}>Editar relato</TabBtn>
      </div>

      {tab === "update" ? (
        <>
          <Field label={`Nova atualização (${todayStr})`}>
            <textarea
              rows={3}
              value={updateText}
              onChange={(e) => setUpdateText(e.target.value)}
              placeholder='Ex: "Hoje aceitou 5ml de leite!"'
              style={{ ...inputStyle, resize: "vertical", fontFamily: "'Nunito', sans-serif" }}
            />
          </Field>
          <button
            disabled={!updateText.trim()}
            onClick={() => { onAddUpdate(story.id, updateText.trim(), todayStr); onClose(); }}
            style={{ ...primaryBtnStyle, width: "100%", marginTop: 10, opacity: updateText.trim() ? 1 : 0.5 }}
          >
            Publicar atualização
          </button>
          {story.updates?.length > 0 && <UpdatesTimeline updates={story.updates} />}
        </>
      ) : (
        <>
          <Field label="Status atual">
            <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputStyle}>
              <option value="uti">UTI Neonatal</option>
              <option value="semi">Semi-intensiva</option>
              <option value="alta">Alta! Em casa</option>
            </select>
          </Field>
          <Field label="Relato">
            <textarea
              rows={7}
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ ...inputStyle, resize: "vertical", fontFamily: "'Nunito', sans-serif" }}
            />
          </Field>
          <button onClick={() => onSaveText(story.id, text, status)} style={{ ...primaryBtnStyle, width: "100%", marginTop: 10 }}>
            Salvar alterações
          </button>
        </>
      )}
    </Modal>
  );
}

function TabBtn({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 13,
        padding: "9px 10px", borderRadius: 10, cursor: "pointer",
        border: active ? "1.5px solid #88D49E" : "1.5px solid #F0EBE0",
        background: active ? "#F0FBF4" : "#fff", color: active ? "#3E7C57" : "#9C9384",
      }}
    >
      {children}
    </button>
  );
}

/* ---------------- Minhas Histórias ---------------- */
function MyStories({ stories, onEdit }) {
  return (
    <section style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px 70px" }}>
      <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: "#3A362E", marginBottom: 4 }}>Minhas Histórias</h2>
      <p style={{ fontSize: 13.5, color: "#9C9384", marginBottom: 22 }}>Acompanhe e atualize os relatos que você compartilhou.</p>
      {stories.length === 0 ? (
        <div style={{ textAlign: "center", color: "#9C9384", padding: "40px 20px", fontSize: 14.5, background: "#fff", borderRadius: 16, border: "1px dashed #F0EBE0" }}>
          Você ainda não compartilhou nenhuma história. Toque em "Quero Desabafar" na página inicial. 🌱
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {stories.map((s) => (
            <div key={s.id} style={{ background: "#fff", border: "1px solid #F0EBE0", borderRadius: 16, padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
                <div>
                  <h3 className="font-display" style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#3A362E" }}>{s.babyName}</h3>
                  <div style={{ fontSize: 12.5, color: "#9C9384" }}>{s.weeks} semanas · {s.weight}</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 11.5, fontWeight: 700, padding: "4px 10px", borderRadius: 999,
                      background: s.postStatus === "aprovado" ? "#F0FBF4" : "#FEF6EA",
                      color: s.postStatus === "aprovado" ? "#3E7C57" : "#B07A1E",
                      border: `1px solid ${s.postStatus === "aprovado" ? "#D3F0DF" : "#F5E3B8"}`,
                    }}
                  >
                    {s.postStatus === "aprovado" ? "Publicada" : "Pendente de aprovação"}
                  </span>
                  <StatusBadge status={s.status} />
                </div>
              </div>
              <p style={{ fontSize: 14, color: "#5C5648", lineHeight: 1.6, margin: "10px 0" }}>{s.text.slice(0, 180)}{s.text.length > 180 ? "…" : ""}</p>
              <button onClick={() => onEdit(s)} style={{ ...primaryBtnStyle, padding: "9px 16px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                <Edit3 size={14} /> Atualizar Jornada
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------------- Admin Panel ---------------- */
function AdminPanel({ pending, onModerate }) {
  return (
    <section style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px 70px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <ShieldCheck size={20} color="#3E7C57" />
        <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: "#3A362E", margin: 0 }}>Painel de Moderação</h2>
      </div>
      <p style={{ fontSize: 13.5, color: "#9C9384", marginBottom: 22 }}>Aprove ou recuse histórias enviadas pela comunidade antes que apareçam no feed.</p>
      {pending.length === 0 ? (
        <div style={{ textAlign: "center", color: "#9C9384", padding: "40px 20px", fontSize: 14.5, background: "#fff", borderRadius: 16, border: "1px dashed #F0EBE0" }}>
          Nenhuma história pendente no momento. 🎉
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {pending.map((s) => (
            <div key={s.id} style={{ background: "#fff", border: "1px solid #F0EBE0", borderRadius: 16, padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                <div>
                  <h3 className="font-display" style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#3A362E" }}>{s.babyName}</h3>
                  <div style={{ fontSize: 12.5, color: "#9C9384" }}>{s.weeks} semanas · {s.weight} — por {s.authorName}</div>
                </div>
                <StatusBadge status={s.status} />
              </div>
              <p style={{ fontSize: 14, color: "#5C5648", lineHeight: 1.6, margin: "0 0 12px" }}>{s.text}</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => onModerate(s.id, "aprovar")} style={{ ...primaryBtnStyle, display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", fontSize: 13 }}>
                  <Check size={14} /> Aprovar
                </button>
                <button
                  onClick={() => onModerate(s.id, "recusar")}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", fontSize: 13,
                    fontFamily: "'Poppins', sans-serif", fontWeight: 700, borderRadius: 999, cursor: "pointer",
                    border: "1.5px solid #F3D9D2", background: "#FDF4F2", color: "#B5543F",
                  }}
                >
                  <X size={14} /> Recusar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer({ setView, user }) {
  return (
    <footer style={{ borderTop: "1px solid #F0EBE0", padding: "26px 24px 40px", textAlign: "center" }}>
      <p style={{ fontSize: 13, color: "#B4AC9C", margin: "0 0 8px" }}>
        Feito com 💚 para famílias que atravessam a jornada da prematuridade.
      </p>
      {user?.isAdmin && (
        <button
          onClick={() => setView("admin")}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11.5, color: "#D6D0C2", textDecoration: "underline" }}
        >
          Painel administrativo
        </button>
      )}
    </footer>
  );
}

/* ---------------- Shared UI pieces ---------------- */
function Modal({ children, onClose, title, icon, wide }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(58,54,46,0.35)", zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 18,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="floatIn"
        style={{
          background: "#FDFBF7", borderRadius: 20, padding: 24, width: "100%",
          maxWidth: wide ? 520 : 400, maxHeight: "88vh", overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#3E7C57" }}>
            {icon}
            <h3 className="font-display" style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#3A362E" }}>{title}</h3>
          </div>
          <button onClick={onClose} style={{ background: "#F5F1E8", border: "none", borderRadius: 8, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={15} color="#9C9384" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#7A7263", marginBottom: 6, fontFamily: "'Poppins', sans-serif" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Toast({ message }) {
  return (
    <div
      className="floatIn"
      style={{
        position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
        background: "#3A362E", color: "#FDFBF7", padding: "12px 20px", borderRadius: 999,
        fontSize: 13.5, fontWeight: 600, zIndex: 200, boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        fontFamily: "'Nunito', sans-serif", maxWidth: "90vw", textAlign: "center",
      }}
    >
      {message}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #F0EBE0",
  background: "#fff", fontSize: 14, color: "#4A4438", fontFamily: "'Nunito', sans-serif",
  marginBottom: 12, outline: "none",
};

const primaryBtnStyle = {
  fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 14, color: "#2C5B3E",
  background: "#88D49E", border: "none", padding: "11px 18px", borderRadius: 999, cursor: "pointer",
};