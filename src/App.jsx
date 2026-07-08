import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Heart, MessageCircleHeart, LogIn, Plus, Edit3, Check, X, Filter,
  Moon, HomeIcon, ActivitySquare, Baby, Weight, Calendar, ShieldCheck,
  ChevronDown, ChevronUp, Sparkles, LogOut, Send, Loader2, BookHeart,
  BookOpen, Quote, ChevronLeft, ChevronRight
} from "lucide-react";

/* ---------------------------------------------------------
   PAIS DE PREMATUROS — v2
   Abas: Depoimentos | Momento de Fé | Palavras de Incentivo
--------------------------------------------------------- */

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

const ADMIN_PASSWORD = "admin123";
const STORIES_PER_PAGE = 5;

const STATUS_META = {
  uti: { label: "UTI Neonatal", color: "#A1C4FD", dark: "#4A6FA5", icon: Moon, bg: "#EEF4FF" },
  semi: { label: "Semi-intensiva", color: "#88D49E", dark: "#3E8B5C", icon: ActivitySquare, bg: "#F0FBF4" },
  alta: { label: "Alta! Em casa", color: "#F2C879", dark: "#A9791E", icon: HomeIcon, bg: "#FEF8EC" },
};

const FOUNDER_STORY = {
  id: "founder-0",
  babyName: "Olívia",
  weeks: 29,
  weight: "880g",
  status: "Semi-intensiva",
  authorName: "Pai da Olívia",
  text: Por um pai de UTI "Nossa história começou de forma avassaladora. Minha filha nasceu com apenas 29 semanas e pesando 880 gramas — muito prematura. O parto foi decorrência de uma pré-eclampsia severa da mãe que, como uma verdadeira guerreira, aguentou até o último limite para que a nossa pequena pudesse vir ao mundo de forma segura por meio de uma cesárea. Antes do nascimento, vivemos dias pesados, cheios de apreensão. Para a mãe, eram dias inteiros de exames e cuidados intensivos; para mim, o pai, dias de correria insana e pensamentos a mil. Mas o desânimo nunca teve espaço. Minha fé me dizia que daria certo. Eu não podia desmontar ou demonstrar fraqueza; precisava ser a rocha da minha esposa para que ela se mantivesse forte. Por dentro, o emocional estava abalado, mas eu sabia que Aquele que cuida de nós estava no controle. Durante duas semanas, minha rotina foi trabalhar, correr para o hospital para passar a noite com minha esposa, voltar em casa, buscar minha outra filha e levá-la para a escola. Até que o dia chegou. Nossa pequena nasceu: minúscula, mas cheia de vida. Ali começava a nossa rotina com o coração na boca. O medo do desconhecido se misturava com a esperança. Foram dias tentando 'decifrar' os números dos aparelhos da UTI. Cada barulho, cada apito, cada apneia da minha filha nos gelava a alma. Paralelamente, havia a preocupação com a recuperação da minha esposa, que graças a Deus se restabeleceu rápido, nos permitindo focar 100% na nossa guerreira. E como ela lutou! Nossa pequena foi vencendo etapas: saiu da UTI e foi para a semi-intensiva com poucos dias de vida. Começamos a rotina de alimentação com apenas 1 ml de leite. Ver aquele corpinho cheio de fios e aparelhos era doloroso, mas aos poucos ela foi vencendo os exames e se despedindo dos fios. Viver a UTI é exatamente como uma montanha-russa. Um dia você sai radiante porque ela evoluiu e aumentou o leite; no dia seguinte, sai desanimado porque ela não processou bem a dieta e perdeu peso. É um dia de cada vez. Mas seguimos aqui, com a certeza e a fé em Deus de que tudo já deu certo.",
  updates: [
    { date: "22/05/2026", text: "1 dia na UTi." },
    { date: "07/07/2026", text: "1.800kg, na ultima etapa antes da alta." }
  ],
  isFounder: true,
  postStatus: "aprovado"
};
const SEED_STORIES = [
  {
    id: "seed-1", babyName: "Théo", weeks: 32, weight: "1.640kg", status: "uti",
    authorName: "Marina, mãe do Théo",
    text: "Ainda estamos na UTI, no dia 12. Hoje ele abriu os olhinhos pra mim pela primeira vez e meu peito se encheu de uma coisa que não sei nem nomear. Tenho medo de me apegar demais aos números da balança, mas tento respirar e confiar na equipe.",
    updates: [{ date: "05/07/2026", text: "Passou para o CPAP! Menos um tubo, mais uma vitória." }],
    postStatus: "aprovado",
  },
  {
    id: "seed-2", babyName: "Noah", weeks: 34, weight: "2.100kg", status: "semi",
    authorName: "Rafael, pai do Noah",
    text: "Saímos da UTI essa semana pra semi-intensiva. Parece pequeno pra quem não viveu, mas pra nós foi tirar um peso do mundo. Ele já suga a chuquinha sozinho às vezes.",
    updates: [], postStatus: "aprovado",
  },
  {
    id: "seed-3", babyName: "Alice", weeks: 30, weight: "1.310kg", status: "alta",
    authorName: "Juliana, mãe da Alice",
    text: "Depois de 68 dias internada, minha filha dorme no berço do quarto dela hoje. Guardo esse dia com um carinho enorme por todo mundo que rezou com a gente.",
    updates: [{ date: "01/06/2026", text: "Primeira consulta com o pediatra de fora. Ganhou 300g!" }],
    postStatus: "aprovado",
  },
  {
    id: "seed-4", babyName: "Miguel", weeks: 28, weight: "1.050kg", status: "uti",
    authorName: "Patrícia, mãe do Miguel",
    text: "Hoje fez uma semana. Ainda é difícil ver ele tão pequenininho cheio de fios, mas a equipe é maravilhosa e isso me dá um pouco de paz.",
    updates: [], postStatus: "aprovado",
  },
  {
    id: "seed-5", babyName: "Sofia", weeks: 33, weight: "1.890kg", status: "semi",
    authorName: "Bruno, pai da Sofia",
    text: "De pai de UTI a pai de semi-intensiva em três semanas. Cada grama que ela ganha é uma festa aqui em casa.",
    updates: [], postStatus: "aprovado",
  },
  {
    id: "seed-6", babyName: "Davi", weeks: 31, weight: "1.470kg", status: "alta",
    authorName: "Larissa, mãe do Davi",
    text: "Hoje é o primeiro dia dele dormindo em casa. 54 dias de UTI e semi-intensiva. Obrigada a todos que oraram com a gente.",
    updates: [], postStatus: "aprovado",
  },
];

const SEED_FAITH = [
  {
    id: "faith-1",
    authorName: "Camila, mãe da Valentina",
    reference: "Isaías 41:10",
    verseText: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.",
    message: "Repeti esse versículo em todas as visitas à UTI. Ele me lembrava que eu não estava carregando aquilo sozinha.",
    postStatus: "aprovado",
  },
  {
    id: "faith-2",
    authorName: "Marina, mãe do Théo",
    reference: "Salmos 34:18",
    verseText: "Perto está o Senhor dos que têm o coração quebrantado.",
    message: "Nos dias mais difíceis, esse versículo me lembrava que eu não estava sendo esquecida.",
    postStatus: "aprovado",
  },
];

const SEED_ENCOURAGEMENT = [
  { id: "enc-1", authorName: "Equipe Pais de Prematuros", phrase: "Seu amor já está curando, mesmo que você ainda não veja.", postStatus: "aprovado" },
  { id: "enc-2", authorName: "Equipe Pais de Prematuros", phrase: "Cada dia que passa é uma vitória, não importa o tamanho.", postStatus: "aprovado" },
  { id: "enc-3", authorName: "Equipe Pais de Prematuros", phrase: "Você não precisa ser forte o tempo todo. Só precisa continuar aqui.", postStatus: "aprovado" },
  { id: "enc-4", authorName: "Juliana, mãe da Alice", phrase: "Gramas se ganham. Fé se constrói. Você está fazendo as duas coisas.", postStatus: "aprovado" },
];

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

export default function App() {
  const [stories, setStories] = useState([]);
  const [faithMoments, setFaithMoments] = useState([]);
  const [encouragements, setEncouragements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [view, setView] = useState("home");
  const [activeTab, setActiveTab] = useState("depoimentos");
  const [filter, setFilter] = useState("todos");
  const [page, setPage] = useState(1);

  const [showLogin, setShowLogin] = useState(false);
  const [showNewStory, setShowNewStory] = useState(false);
  const [showNewFaith, setShowNewFaith] = useState(false);
  const [showNewEncouragement, setShowNewEncouragement] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [editingStory, setEditingStory] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [s, f, e] = await Promise.all([
          storage.get("stories-list"),
          storage.get("faith-list"),
          storage.get("encouragement-list"),
        ]);
        setStories(s?.value ? JSON.parse(s.value) : SEED_STORIES);
        setFaithMoments(f?.value ? JSON.parse(f.value) : SEED_FAITH);
        setEncouragements(e?.value ? JSON.parse(e.value) : SEED_ENCOURAGEMENT);
        if (!s?.value) await storage.set("stories-list", JSON.stringify(SEED_STORIES));
        if (!f?.value) await storage.set("faith-list", JSON.stringify(SEED_FAITH));
        if (!e?.value) await storage.set("encouragement-list", JSON.stringify(SEED_ENCOURAGEMENT));
      } catch (err) {
        setStories(SEED_STORIES);
        setFaithMoments(SEED_FAITH);
        setEncouragements(SEED_ENCOURAGEMENT);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persistStories = useCallback(async (next) => {
    setStories(next);
    try { await storage.set("stories-list", JSON.stringify(next)); } catch (e) { console.error(e); }
  }, []);
  const persistFaith = useCallback(async (next) => {
    setFaithMoments(next);
    try { await storage.set("faith-list", JSON.stringify(next)); } catch (e) { console.error(e); }
  }, []);
  const persistEncouragement = useCallback(async (next) => {
    setEncouragements(next);
    try { await storage.set("encouragement-list", JSON.stringify(next)); } catch (e) { console.error(e); }
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
    if (password === ADMIN_PASSWORD) {
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
      id: "story-" + Date.now(), ...data, authorName: user.name,
      updates: [], postStatus: "pendente", createdAt: Date.now(),
    };
    await persistStories([newStory, ...stories]);
    setShowNewStory(false);
    showToast("Sua história foi enviada e está aguardando aprovação. 🌱");
  };
  const handleAddUpdate = async (storyId, updateText, dateStr) => {
    const next = stories.map((s) =>
      s.id === storyId ? { ...s, updates: [{ date: dateStr, text: updateText }, ...(s.updates || [])] } : s
    );
    await persistStories(next);
    showToast("Jornada atualizada!");
  };
  const handleEditText = async (storyId, newText, newStatus) => {
    const next = stories.map((s) => (s.id === storyId ? { ...s, text: newText, status: newStatus } : s));
    await persistStories(next);
    setEditingStory(null);
    showToast("História atualizada com carinho.");
  };
  const handleModerateStory = async (id, decision) => {
    const next = decision === "aprovar"
      ? stories.map((s) => (s.id === id ? { ...s, postStatus: "aprovado" } : s))
      : stories.filter((s) => s.id !== id);
    await persistStories(next);
    showToast(decision === "aprovar" ? "Depoimento aprovado." : "Depoimento removido.");
  };

  const handleNewFaith = async (data) => {
    const newFaith = { id: "faith-" + Date.now(), ...data, authorName: user.name, postStatus: "pendente", createdAt: Date.now() };
    await persistFaith([newFaith, ...faithMoments]);
    setShowNewFaith(false);
    showToast("Seu momento de fé foi enviado para aprovação. 🙏");
  };
  const handleModerateFaith = async (id, decision) => {
    const next = decision === "aprovar"
      ? faithMoments.map((f) => (f.id === id ? { ...f, postStatus: "aprovado" } : f))
      : faithMoments.filter((f) => f.id !== id);
    await persistFaith(next);
    showToast(decision === "aprovar" ? "Momento de fé aprovado." : "Momento de fé removido.");
  };

  const handleNewEncouragement = async (data) => {
    const newEnc = { id: "enc-" + Date.now(), ...data, authorName: user.name, postStatus: "pendente", createdAt: Date.now() };
    await persistEncouragement([newEnc, ...encouragements]);
    setShowNewEncouragement(false);
    showToast("Sua frase foi enviada para aprovação. 💛");
  };
  const handleModerateEncouragement = async (id, decision) => {
    const next = decision === "aprovar"
      ? encouragements.map((e) => (e.id === id ? { ...e, postStatus: "aprovado" } : e))
      : encouragements.filter((e) => e.id !== id);
    await persistEncouragement(next);
    showToast(decision === "aprovar" ? "Frase aprovada." : "Frase removida.");
  };

  const toggleExpand = (id) => setExpanded((e) => ({ ...e, [id]: !e[id] }));

  const approvedStories = useMemo(() => stories.filter((s) => s.postStatus === "aprovado"), [stories]);
  const visibleStories = useMemo(
    () => (filter === "todos" ? approvedStories : approvedStories.filter((s) => s.status === filter)),
    [approvedStories, filter]
  );
  const totalPages = Math.max(1, Math.ceil(visibleStories.length / STORIES_PER_PAGE));
  const pagedStories = visibleStories.slice((page - 1) * STORIES_PER_PAGE, page * STORIES_PER_PAGE);

  const approvedFaith = useMemo(() => faithMoments.filter((f) => f.postStatus === "aprovado"), [faithMoments]);
  const approvedEncouragements = useMemo(() => encouragements.filter((e) => e.postStatus === "aprovado"), [encouragements]);

  const myStories = user ? stories.filter((s) => s.authorName === user.name) : [];
  const myFaith = user ? faithMoments.filter((f) => f.authorName === user.name) : [];
  const myEncouragements = user ? encouragements.filter((e) => e.authorName === user.name) : [];

  const pendingCount = stories.filter((s) => s.postStatus === "pendente").length
    + faithMoments.filter((f) => f.postStatus === "pendente").length
    + encouragements.filter((e) => e.postStatus === "pendente").length;

  const scrollToTabs = (tab) => {
    setActiveTab(tab);
    document.getElementById("tabs-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const openDesabafar = () => {
    if (!user) { setShowLogin(true); return; }
    setActiveTab("depoimentos");
    setShowNewStory(true);
  };

  useEffect(() => { setPage(1); }, [filter]);

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#FDFBF7", minHeight: "100vh", color: "#4A4438" }}>
      <style>{FONT_IMPORT}</style>
      <style>{`
        .font-display { font-family: 'Poppins', sans-serif; }
        * { box-sizing: border-box; }
        ::selection { background: ${PASTEL.mint}; }
        @keyframes floatIn { from { opacity:0; transform: translateY(10px);} to {opacity:1; transform:translateY(0);} }
        .floatIn { animation: floatIn .45s ease both; }
        button:focus-visible, a:focus-visible, textarea:focus-visible, input:focus-visible, select:focus-visible {
          outline: 3px solid ${PASTEL.blue}; outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) { .floatIn { animation: none; } }
      `}</style>

      <TopBar user={user} onLogin={() => setShowLogin(true)} onLogout={handleLogout} view={view} setView={setView} pendingCount={pendingCount} />

      {view === "home" && (
        <>
          <HeroTitle onForca={() => scrollToTabs("incentivo")} onDesabafar={openDesabafar} />
          <FounderCard story={FOUNDER_STORY} expanded={!!expanded[FOUNDER_STORY.id]} onToggle={() => toggleExpand(FOUNDER_STORY.id)} />

          <div id="tabs-section" />
          <TabsNav activeTab={activeTab} setActiveTab={setActiveTab} />

          {activeTab === "depoimentos" && (
            <DepoimentosTab
              loading={loading}
              filter={filter} setFilter={setFilter}
              stories={pagedStories}
              expanded={expanded} toggleExpand={toggleExpand}
              onNew={openDesabafar}
              page={page} setPage={setPage} totalPages={totalPages}
            />
          )}
          {activeTab === "fe" && (
            <FaithTab
              items={approvedFaith}
              onNew={() => (user ? setShowNewFaith(true) : setShowLogin(true))}
            />
          )}
          {activeTab === "incentivo" && (
            <EncouragementTab
              items={approvedEncouragements}
              onNew={() => (user ? setShowNewEncouragement(true) : setShowLogin(true))}
            />
          )}
        </>
      )}

      {view === "myStories" && user && (
        <MyStuff
          stories={myStories} faith={myFaith} encouragements={myEncouragements}
          onEditStory={(s) => setEditingStory(s)}
        />
      )}

      {view === "admin" && user?.isAdmin && (
        <AdminPanel
          stories={stories.filter((s) => s.postStatus === "pendente")}
          faith={faithMoments.filter((f) => f.postStatus === "pendente")}
          encouragements={encouragements.filter((e) => e.postStatus === "pendente")}
          onModerateStory={handleModerateStory}
          onModerateFaith={handleModerateFaith}
          onModerateEncouragement={handleModerateEncouragement}
        />
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
      {showNewStory && <NewStoryModal onClose={() => setShowNewStory(false)} onSubmit={handleNewStory} />}
      {showNewFaith && <NewFaithModal onClose={() => setShowNewFaith(false)} onSubmit={handleNewFaith} />}
      {showNewEncouragement && <NewEncouragementModal onClose={() => setShowNewEncouragement(false)} onSubmit={handleNewEncouragement} />}
      {editingStory && (
        <EditStoryModal story={editingStory} onClose={() => setEditingStory(null)} onSaveText={handleEditText} onAddUpdate={handleAddUpdate} />
      )}
      {toast && <Toast message={toast} />}
    </div>
  );
}
/* ---------------- TopBar (navegação, fixa e discreta) ---------------- */
function TopBar({ user, onLogin, onLogout, view, setView, pendingCount }) {
  return (
    <header style={{ background: "rgba(253,251,247,0.92)", backdropFilter: "blur(6px)", borderBottom: "1px solid #EFE9DD", position: "sticky", top: 0, zIndex: 40 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <button onClick={() => setView("home")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
          <div style={{ width: 28, height: 28, borderRadius: "9px", background: `linear-gradient(135deg, ${PASTEL.mint}, ${PASTEL.blue})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Heart size={15} color="#4A4438" fill="#4A4438" />
          </div>
          <span className="font-display" style={{ fontWeight: 700, fontSize: 14, color: "#3E7C57" }}>Pais de Prematuros</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {user && !user.isAdmin && (
            <button onClick={() => setView("myStories")} style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, padding: "8px 13px", borderRadius: 999, cursor: "pointer", border: view === "myStories" ? `1.5px solid ${PASTEL.mintDark}` : "1.5px solid transparent", background: view === "myStories" ? PASTEL.mint : "transparent", color: PASTEL.mintDark, display: "flex", alignItems: "center", gap: 6 }}>
              <BookHeart size={15} /> Minhas Publicações
            </button>
          )}
          {user?.isAdmin && (
            <button onClick={() => setView("admin")} style={{ fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, padding: "8px 13px", borderRadius: 999, cursor: "pointer", border: view === "admin" ? `1.5px solid ${PASTEL.lilacDark}` : "1.5px solid transparent", background: view === "admin" ? PASTEL.lilac : "transparent", color: PASTEL.lilacDark, display: "flex", alignItems: "center", gap: 6, position: "relative" }}>
              <ShieldCheck size={15} /> Painel
              {pendingCount > 0 && (
                <span style={{ position: "absolute", top: -4, right: -4, background: "#E8896F", color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 999, minWidth: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>
                  {pendingCount}
                </span>
              )}
            </button>
          )}
          {user ? (
            <button onClick={onLogout} title="Sair" style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 600, padding: "8px 13px", borderRadius: 999, border: "1.5px solid #EFE9DD", background: "#fff", color: "#9C9384", cursor: "pointer" }}>
              <LogOut size={14} /> Sair
            </button>
          ) : (
            <button onClick={onLogin} style={{ display: "flex", alignItems: "center", gap: 5, fontFamily: "'Poppins', sans-serif", fontSize: 13, fontWeight: 700, padding: "9px 15px", borderRadius: 999, border: "none", background: PASTEL.blue, color: PASTEL.blueDark, cursor: "pointer" }}>
              <LogIn size={14} /> Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

/* ---------------- Hero / Título em destaque ---------------- */
function HeroTitle({ onForca, onDesabafar }) {
  return (
    <section style={{ maxWidth: 780, margin: "0 auto", padding: "48px 24px 30px", textAlign: "center" }} className="floatIn">
      <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 18 }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: `linear-gradient(135deg, ${PASTEL.mint}, ${PASTEL.blue})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Heart size={26} color="#4A4438" fill="#4A4438" />
        </div>
      </div>

      <h1 className="font-display" style={{ fontSize: "clamp(34px, 6vw, 54px)", fontWeight: 800, color: "#3A362E", lineHeight: 1.15, margin: "0 0 12px" }}>
        Pais de Prematuros
      </h1>

      <p
        style={{
          display: "inline-block", fontSize: "clamp(15px, 2.2vw, 19px)", fontStyle: "italic", fontWeight: 700,
          color: PASTEL.mintDark, background: `linear-gradient(120deg, ${PASTEL.mint} 0%, ${PASTEL.blue} 100%)`,
          padding: "6px 20px", borderRadius: 999, margin: "0 0 22px",
        }}
      >
        "Histórias reais que acalmam o coração"
      </p>

      <p style={{ fontSize: 15.5, color: "#7A7263", lineHeight: 1.6, maxWidth: 540, margin: "0 auto 30px" }}>
        Um espaço acolhedor para famílias que vivem a rotina da UTI Neonatal. Aqui você pode ler
        histórias reais, buscar um momento de fé, receber palavras de incentivo e, quando quiser,
        contar a sua própria jornada.
      </p>

      <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={onForca} style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 15, color: PASTEL.blueDark, background: PASTEL.blue, border: "none", padding: "14px 24px", borderRadius: 999, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 6px 18px rgba(211,230,254,0.7)" }}>
          <Heart size={17} /> Preciso de Força
        </button>
        <button onClick={onDesabafar} style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 15, color: PASTEL.mintDark, background: PASTEL.mint, border: "none", padding: "14px 24px", borderRadius: 999, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 6px 18px rgba(198,239,217,0.7)" }}>
          <MessageCircleHeart size={17} /> Quero Desabafar
        </button>
      </div>
    </section>
  );
}

/* ---------------- Founder Card (destaque fixo) ---------------- */
function FounderCard({ story, expanded, onToggle }) {
  return (
    <section style={{ maxWidth: 780, margin: "0 auto", padding: "0 24px 8px" }}>
      <div style={{ position: "relative", borderRadius: 22, padding: 2, background: `linear-gradient(135deg, ${PASTEL.mint}, ${PASTEL.blue}, ${PASTEL.peach})` }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "26px 26px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
            <span className="font-display" style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.4, color: PASTEL.peachDark, background: "#FEF8EC", border: "1px solid #F5E3B8", padding: "5px 12px", borderRadius: 999, display: "flex", alignItems: "center", gap: 6 }}>
              <Sparkles size={12} /> A HISTÓRIA QUE DEU ORIGEM A ESSA REDE
            </span>
            <StatusBadge status={story.status} />
          </div>
          <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: "#3A362E", margin: "0 0 6px" }}>29 Semanas de Amor, Fé e Superação</h2>
          <div style={{ fontSize: 13.5, color: "#9C9384", marginBottom: 14, display: "flex", gap: 14, flexWrap: "wrap" }}>
            <span><Baby size={13} style={{ verticalAlign: -2, marginRight: 4 }} />{story.babyName} · {story.weeks} semanas</span>
            <span><Weight size={13} style={{ verticalAlign: -2, marginRight: 4 }} />{story.weight}</span>
            <span>— por {story.authorName}</span>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: "#5C5648", margin: 0 }}>{expanded ? story.text : story.text.slice(0, 165) + "…"}</p>
          <button onClick={onToggle} style={linkBtnStyle(PASTEL.mintDark)}>
            {expanded ? <>Ler menos <ChevronUp size={14} /></> : <>A jornada dos 880g <ChevronDown size={14} /></>}
          </button>
          {expanded && story.updates?.length > 0 && <UpdatesTimeline updates={story.updates} />}
        </div>
      </div>
    </section>
  );
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status];
  const Icon = meta.icon;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: meta.dark, background: meta.bg, border: `1px solid ${meta.color}`, padding: "5px 11px", borderRadius: 999, fontFamily: "'Poppins', sans-serif" }}>
      <Icon size={12} /> {meta.label}
    </span>
  );
}

const linkBtnStyle = (color = "#3E7C57") => ({
  marginTop: 12, background: "none", border: "none", cursor: "pointer",
  color, fontWeight: 700, fontFamily: "'Poppins', sans-serif", fontSize: 13.5,
  display: "flex", alignItems: "center", gap: 5, padding: 0,
});

function UpdatesTimeline({ updates }) {
  return (
    <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px dashed #E3DCCB" }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#9C9384", marginBottom: 10, fontFamily: "'Poppins', sans-serif", letterSpacing: 0.3 }}>DIÁRIO DE BORDO</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {updates.map((u, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#FBFAF6", border: "1px dashed #E3DCCB", borderRadius: 12, padding: "10px 12px" }}>
            <div style={{ width: 26, height: 26, borderRadius: 8, background: PASTEL.mint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Calendar size={13} color={PASTEL.mintDark} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: PASTEL.mintDark }}>{u.date}</div>
              <div style={{ fontSize: 14, color: "#5C5648", lineHeight: 1.5 }}>{u.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Abas (Tabs) ---------------- */
function TabsNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "depoimentos", label: "Depoimentos", icon: BookHeart, color: PASTEL.blue, dark: PASTEL.blueDark },
    { id: "fe", label: "Momento de Fé", icon: BookOpen, color: PASTEL.lilac, dark: PASTEL.lilacDark },
    { id: "incentivo", label: "Palavras de Incentivo", icon: Heart, color: PASTEL.peach, dark: PASTEL.peachDark },
  ];
  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "18px 24px 0" }}>
      <div style={{ display: "flex", gap: 8, borderBottom: "1.5px solid #F0EBE0", flexWrap: "wrap" }}>
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 13.5,
                padding: "11px 16px", borderRadius: "12px 12px 0 0", cursor: "pointer",
                border: "none", borderBottom: active ? `3px solid ${t.dark}` : "3px solid transparent",
                background: active ? t.color : "transparent", color: active ? t.dark : "#9C9384",
                display: "flex", alignItems: "center", gap: 7, marginBottom: -2,
              }}
            >
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Aba: Depoimentos ---------------- */
function DepoimentosTab({ loading, filter, setFilter, stories, expanded, toggleExpand, onNew, page, setPage, totalPages }) {
  const filters = [
    { id: "todos", label: "Todos" },
    { id: "uti", label: "UTI" },
    { id: "semi", label: "Semi-intensiva" },
    { id: "alta", label: "Alta" },
  ];
  return (
    <section style={{ maxWidth: 780, margin: "0 auto", padding: "24px 24px 70px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "#9C9384", fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>
            <Filter size={14} /> Filtrar:
          </span>
          {filters.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ fontFamily: "'Poppins', sans-serif", fontSize: 12.5, fontWeight: 700, padding: "6px 13px", borderRadius: 999, cursor: "pointer", border: filter === f.id ? `1.5px solid ${PASTEL.blueDark}` : "1.5px solid #EFE9DD", background: filter === f.id ? PASTEL.blue : "#fff", color: filter === f.id ? PASTEL.blueDark : "#9C9384" }}>
              {f.label}
            </button>
          ))}
        </div>
        <button onClick={onNew} style={{ ...primaryBtnStyle, padding: "9px 16px", fontSize: 13, display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <Plus size={14} /> Novo depoimento
        </button>
      </div>

      {loading ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#9C9384", padding: "40px 0", justifyContent: "center" }}>
          <Loader2 size={18} /> Carregando histórias…
        </div>
      ) : stories.length === 0 ? (
        <div style={{ textAlign: "center", color: "#9C9384", padding: "40px 20px", fontSize: 14.5 }}>
          Ainda não há depoimentos aprovados com esse filtro. Que tal ser a primeira pessoa a contar a sua? 🌿
        </div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {stories.map((s) => (
              <StoryCard key={s.id} story={s} expanded={!!expanded[s.id]} onToggle={() => toggleExpand(s.id)} />
            ))}
          </div>
          {totalPages > 1 && <Pagination page={page} setPage={setPage} totalPages={totalPages} />}
        </>
      )}
    </section>
  );
}

function Pagination({ page, setPage, totalPages }) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 26 }}>
      <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} style={pageBtnStyle(false, page === 1)}>
        <ChevronLeft size={15} />
      </button>
      {pages.map((p) => (
        <button key={p} onClick={() => setPage(p)} style={pageBtnStyle(p === page)}>
          {p}
        </button>
      ))}
      <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} style={pageBtnStyle(false, page === totalPages)}>
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

const pageBtnStyle = (active, disabled) => ({
  width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
  fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 13, cursor: disabled ? "default" : "pointer",
  border: active ? `1.5px solid ${PASTEL.blueDark}` : "1.5px solid #EFE9DD",
  background: active ? PASTEL.blue : "#fff", color: active ? PASTEL.blueDark : disabled ? "#D6D0C2" : "#9C9384",
  opacity: disabled ? 0.5 : 1,
});

function StoryCard({ story, expanded, onToggle }) {
  const long = story.text.length > 220;
  return (
    <article className="floatIn" style={{ background: "#fff", border: "1px solid #F0EBE0", borderRadius: 18, padding: "20px 22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {story.photo && <img src={story.photo} alt={story.babyName} style={{ width: 52, height: 52, borderRadius: 14, objectFit: "cover", border: "2px solid #F0EBE0", flexShrink: 0 }} />}
          <div>
            <h3 className="font-display" style={{ margin: 0, fontSize: 16.5, fontWeight: 700, color: "#3A362E" }}>{story.babyName}</h3>
            <div style={{ fontSize: 12.5, color: "#9C9384", marginTop: 2 }}>{story.weeks} semanas · {story.weight} — por {story.authorName}</div>
          </div>
        </div>
        <StatusBadge status={story.status} />
      </div>
      <p style={{ fontSize: 14.5, lineHeight: 1.65, color: "#5C5648", margin: "0 0 4px" }}>{expanded || !long ? story.text : story.text.slice(0, 220) + "…"}</p>
      {long && (
        <button onClick={onToggle} style={linkBtnStyle()}>
          {expanded ? <>Ler menos <ChevronUp size={14} /></> : <>Ler mais <ChevronDown size={14} /></>}
        </button>
      )}
      {expanded && story.updates?.length > 0 && <UpdatesTimeline updates={story.updates} />}
    </article>
  );
}
/* ---------------- Aba: Momento de Fé ---------------- */
function FaithTab({ items, onNew }) {
  return (
    <section style={{ maxWidth: 780, margin: "0 auto", padding: "24px 24px 70px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
        <div>
          <h2 className="font-display" style={{ fontSize: 19, fontWeight: 800, color: "#3A362E", margin: "0 0 4px" }}>Momento de Fé</h2>
          <p style={{ fontSize: 13, color: "#9C9384", margin: 0 }}>Versículos e reflexões que ajudaram outras famílias a atravessar esse momento.</p>
        </div>
        <button
          onClick={onNew}
          style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 13, color: PASTEL.lilacDark, background: PASTEL.lilac, border: "none", padding: "10px 16px", borderRadius: 999, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
        >
          <Plus size={14} /> Deixar meu versículo
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", color: "#9C9384", padding: "40px 20px", fontSize: 14.5, background: "#fff", borderRadius: 16, border: "1px dashed #F0EBE0" }}>
          Ainda não há versículos aprovados. Seja o primeiro a compartilhar um momento de fé. 🙏
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((f) => (
            <article key={f.id} className="floatIn" style={{ background: PASTEL.lilac + "55", border: `1px solid ${PASTEL.lilac}`, borderRadius: 18, padding: "20px 22px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: PASTEL.lilac, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <BookOpen size={16} color={PASTEL.lilacDark} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: "0 0 6px", fontSize: 15.5, fontStyle: "italic", color: "#3A362E", lineHeight: 1.6, fontWeight: 600 }}>
                    "{f.verseText}"
                  </p>
                  {f.reference && (
                    <div className="font-display" style={{ fontSize: 12.5, fontWeight: 700, color: PASTEL.lilacDark, marginBottom: 10 }}>
                      — {f.reference}
                    </div>
                  )}
                  {f.message && (
                    <p style={{ margin: "8px 0 0", fontSize: 13.5, color: "#5C5648", lineHeight: 1.6, borderTop: `1px dashed ${PASTEL.lilac}`, paddingTop: 10 }}>
                      {f.message}
                    </p>
                  )}
                  <div style={{ fontSize: 12, color: "#9C9384", marginTop: 10 }}>— {f.authorName}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------------- Aba: Palavras de Incentivo ---------------- */
function EncouragementTab({ items, onNew }) {
  return (
    <section style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px 70px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: 18 }}>
        <div>
          <h2 className="font-display" style={{ fontSize: 19, fontWeight: 800, color: "#3A362E", margin: "0 0 4px" }}>Palavras de Incentivo</h2>
          <p style={{ fontSize: 13, color: "#9C9384", margin: 0 }}>Frases curtas deixadas por outros pais e mães para os dias mais difíceis.</p>
        </div>
        <button
          onClick={onNew}
          style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 13, color: PASTEL.peachDark, background: PASTEL.peach, border: "none", padding: "10px 16px", borderRadius: 999, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}
        >
          <Plus size={14} /> Deixar uma frase
        </button>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", color: "#9C9384", padding: "40px 20px", fontSize: 14.5, background: "#fff", borderRadius: 16, border: "1px dashed #F0EBE0" }}>
          Ainda não há frases aprovadas. Deixe a primeira palavra de incentivo para outros pais. 💛
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
          {items.map((e) => (
            <div key={e.id} className="floatIn" style={{ background: PASTEL.peach, borderRadius: 16, padding: "18px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
              <Quote size={16} color={PASTEL.peachDark} />
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: PASTEL.peachDark, fontWeight: 600, flex: 1 }}>{e.phrase}</p>
              <div style={{ fontSize: 11.5, color: PASTEL.peachDark, opacity: 0.75 }}>— {e.authorName}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------------- Login Modal (simulado) ---------------- */
function LoginModal({ onClose, onLogin, onAdminLogin }) {
  const [name, setName] = useState("");
  const [tab, setTab] = useState("user");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  const handleAdminSubmit = () => {
    if (onAdminLogin(adminPassword)) { onClose(); }
    else { setAdminError("Senha incorreta"); setAdminPassword(""); setTimeout(() => setAdminError(""), 3000); }
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
            Para comentar ou compartilhar sua história, faça login. Nesta demonstração, escolha uma opção e diga como quer ser chamado(a).
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
          <input placeholder="Como podemos te chamar?" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
          <button disabled={!name.trim()} onClick={() => onLogin(name.trim())} style={{ ...primaryBtnStyle, width: "100%", marginTop: 14, opacity: name.trim() ? 1 : 0.5 }}>
            Entrar
          </button>
        </>
      ) : (
        <>
          <p style={{ fontSize: 13.5, color: "#9C9384", margin: "0 0 18px" }}>Informe a senha de administrador para acessar o painel de moderação.</p>
          <input type="password" placeholder="Senha de administrador" value={adminPassword} onChange={(e) => { setAdminPassword(e.target.value); setAdminError(""); }} style={inputStyle} />
          {adminError && <div style={{ color: "#B5543F", fontSize: 13, marginBottom: 12, fontWeight: 600 }}>{adminError}</div>}
          <button disabled={!adminPassword.trim()} onClick={handleAdminSubmit} style={{ ...primaryBtnStyle, width: "100%", marginTop: 14, opacity: adminPassword.trim() ? 1 : 0.5 }}>
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
        onClick={() => { const finalName = name.trim() || "Visitante"; if (!name.trim()) setName(finalName); onLogin(finalName); }}
        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "11px 14px", borderRadius: 12, border: "1.5px solid #F0EBE0", background: "#fff", cursor: "pointer", fontFamily: "'Poppins', sans-serif", fontWeight: 600, fontSize: 14, color: "#5C5648" }}
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
      // se falhar, apenas não anexa foto
    } finally {
      setPhotoLoading(false);
    }
  };

  const valid = babyName.trim() && weeks && weight.trim() && text.trim().length > 10;

  return (
    <Modal onClose={onClose} title="Contar minha história" icon={<MessageCircleHeart size={18} />} wide>
      <p style={{ fontSize: 13.5, color: "#9C9384", margin: "0 0 16px" }}>Seu relato passará por uma breve moderação antes de aparecer no feed público. 💛</p>
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
      <Field label="Foto do bebê (opcional)">
        <input type="file" accept="image/*" onChange={handlePhotoChange} style={inputStyle} />
        {photoLoading && <div style={{ fontSize: 12.5, color: "#9C9384", marginBottom: 10 }}>Carregando foto…</div>}
        {photo && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <img src={photo} alt="Prévia" style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 14, border: "1.5px solid #F0EBE0" }} />
            <button type="button" onClick={() => setPhoto(null)} style={{ background: "none", border: "none", color: "#B5543F", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Poppins', sans-serif" }}>
              Remover foto
            </button>
          </div>
        )}
      </Field>
      <Field label="Seu relato">
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Conte com suas palavras como está essa jornada…" rows={6} style={{ ...inputStyle, resize: "vertical", fontFamily: "'Nunito', sans-serif" }} />
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

/* ---------------- New Faith Modal ---------------- */
function NewFaithModal({ onClose, onSubmit }) {
  const [verseText, setVerseText] = useState("");
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState("");

  const valid = verseText.trim().length > 5;

  return (
    <Modal onClose={onClose} title="Deixar meu Momento de Fé" icon={<BookOpen size={18} />} wide>
      <p style={{ fontSize: 13.5, color: "#9C9384", margin: "0 0 16px" }}>
        Compartilhe um versículo ou reflexão que te trouxe força nessa jornada. Passa por aprovação antes de aparecer para outras famílias. 🙏
      </p>
      <Field label="Versículo ou trecho">
        <textarea value={verseText} onChange={(e) => setVerseText(e.target.value)} placeholder='Ex: "Não temas, porque eu sou contigo..."' rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "'Nunito', sans-serif" }} />
      </Field>
      <Field label="Referência (opcional)">
        <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Ex: Isaías 41:10" style={inputStyle} />
      </Field>
      <Field label="Por que esse versículo é especial pra você? (opcional)">
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Conte um pouco sobre esse momento de fé…" rows={3} style={{ ...inputStyle, resize: "vertical", fontFamily: "'Nunito', sans-serif" }} />
      </Field>
      <button
        disabled={!valid}
        onClick={() => onSubmit({ verseText: verseText.trim(), reference: reference.trim(), message: message.trim() })}
        style={{ ...primaryBtnStyle, width: "100%", marginTop: 8, opacity: valid ? 1 : 0.5, background: PASTEL.lilac, color: PASTEL.lilacDark, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
      >
        <Send size={15} /> Enviar para aprovação
      </button>
    </Modal>
  );
}

/* ---------------- New Encouragement Modal ---------------- */
function NewEncouragementModal({ onClose, onSubmit }) {
  const [phrase, setPhrase] = useState("");
  const valid = phrase.trim().length > 5;

  return (
    <Modal onClose={onClose} title="Deixar uma Palavra de Incentivo" icon={<Heart size={18} />}>
      <p style={{ fontSize: 13.5, color: "#9C9384", margin: "0 0 16px" }}>
        Escreva uma frase curta para animar outros pais e mães que estão passando por essa fase. Passa por aprovação antes de aparecer. 💛
      </p>
      <Field label="Sua frase de incentivo">
        <textarea value={phrase} onChange={(e) => setPhrase(e.target.value)} placeholder="Ex: Cada grama é uma vitória..." rows={4} maxLength={180} style={{ ...inputStyle, resize: "vertical", fontFamily: "'Nunito', sans-serif" }} />
      </Field>
      <div style={{ fontSize: 11.5, color: "#B4AC9C", textAlign: "right", marginTop: -8, marginBottom: 12 }}>{phrase.length}/180</div>
      <button
        disabled={!valid}
        onClick={() => onSubmit({ phrase: phrase.trim() })}
        style={{ ...primaryBtnStyle, width: "100%", marginTop: 4, opacity: valid ? 1 : 0.5, background: PASTEL.peach, color: PASTEL.peachDark, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
      >
        <Send size={15} /> Enviar para aprovação
      </button>
    </Modal>
  );
}

/* ---------------- Edit Story Modal ---------------- */
function EditStoryModal({ story, onClose, onSaveText, onAddUpdate }) {
  const [tab, setTab] = useState("update");
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
            <textarea rows={3} value={updateText} onChange={(e) => setUpdateText(e.target.value)} placeholder='Ex: "Hoje aceitou 5ml de leite!"' style={{ ...inputStyle, resize: "vertical", fontFamily: "'Nunito', sans-serif" }} />
          </Field>
          <button disabled={!updateText.trim()} onClick={() => { onAddUpdate(story.id, updateText.trim(), todayStr); onClose(); }} style={{ ...primaryBtnStyle, width: "100%", marginTop: 10, opacity: updateText.trim() ? 1 : 0.5 }}>
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
            <textarea rows={7} value={text} onChange={(e) => setText(e.target.value)} style={{ ...inputStyle, resize: "vertical", fontFamily: "'Nunito', sans-serif" }} />
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
    <button onClick={onClick} style={{ flex: 1, fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 13, padding: "9px 10px", borderRadius: 10, cursor: "pointer", border: active ? `1.5px solid ${PASTEL.mintDark}` : "1.5px solid #F0EBE0", background: active ? PASTEL.mint : "#fff", color: active ? PASTEL.mintDark : "#9C9384" }}>
      {children}
    </button>
  );
}
/* ---------------- Minhas Publicações ---------------- */
function MyStuff({ stories, faith, encouragements, onEditStory }) {
  return (
    <section style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px 70px" }}>
      <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: "#3A362E", marginBottom: 4 }}>Minhas Publicações</h2>
      <p style={{ fontSize: 13.5, color: "#9C9384", marginBottom: 24 }}>Acompanhe tudo o que você compartilhou nas três áreas do site.</p>

      <SubSectionTitle>Depoimentos</SubSectionTitle>
      {stories.length === 0 ? (
        <EmptyBox>Você ainda não compartilhou nenhum depoimento. 🌱</EmptyBox>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 30 }}>
          {stories.map((s) => (
            <div key={s.id} style={{ background: "#fff", border: "1px solid #F0EBE0", borderRadius: 16, padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
                <div>
                  <h3 className="font-display" style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#3A362E" }}>{s.babyName}</h3>
                  <div style={{ fontSize: 12.5, color: "#9C9384" }}>{s.weeks} semanas · {s.weight}</div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <StatusPill status={s.postStatus} />
                  <StatusBadge status={s.status} />
                </div>
              </div>
              <p style={{ fontSize: 14, color: "#5C5648", lineHeight: 1.6, margin: "10px 0" }}>{s.text.slice(0, 180)}{s.text.length > 180 ? "…" : ""}</p>
              <button onClick={() => onEditStory(s)} style={{ ...primaryBtnStyle, padding: "9px 16px", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
                <Edit3 size={14} /> Atualizar Jornada
              </button>
            </div>
          ))}
        </div>
      )}

      <SubSectionTitle>Momentos de Fé</SubSectionTitle>
      {faith.length === 0 ? (
        <EmptyBox>Você ainda não compartilhou nenhum versículo. 🙏</EmptyBox>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 30 }}>
          {faith.map((f) => (
            <div key={f.id} style={{ background: PASTEL.lilac + "55", border: `1px solid ${PASTEL.lilac}`, borderRadius: 16, padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <p style={{ margin: 0, fontSize: 14.5, fontStyle: "italic", color: "#3A362E", fontWeight: 600 }}>"{f.verseText}"</p>
                <StatusPill status={f.postStatus} />
              </div>
              {f.reference && <div style={{ fontSize: 12, color: PASTEL.lilacDark, fontWeight: 700, marginTop: 6 }}>— {f.reference}</div>}
            </div>
          ))}
        </div>
      )}

      <SubSectionTitle>Palavras de Incentivo</SubSectionTitle>
      {encouragements.length === 0 ? (
        <EmptyBox>Você ainda não deixou nenhuma frase. 💛</EmptyBox>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {encouragements.map((e) => (
            <div key={e.id} style={{ background: PASTEL.peach, border: `1px solid ${PASTEL.peach}`, borderRadius: 14, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <p style={{ margin: 0, fontSize: 13.5, color: PASTEL.peachDark, fontWeight: 600 }}>{e.phrase}</p>
              <StatusPill status={e.postStatus} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function SubSectionTitle({ children }) {
  return <h3 className="font-display" style={{ fontSize: 14.5, fontWeight: 700, color: "#7A7263", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: 0.4 }}>{children}</h3>;
}
function EmptyBox({ children }) {
  return <div style={{ textAlign: "center", color: "#9C9384", padding: "24px 20px", fontSize: 13.5, background: "#fff", borderRadius: 14, border: "1px dashed #F0EBE0", marginBottom: 30 }}>{children}</div>;
}
function StatusPill({ status }) {
  const approved = status === "aprovado";
  return (
    <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, whiteSpace: "nowrap", background: approved ? PASTEL.mint : "#FEF6EA", color: approved ? PASTEL.mintDark : "#B07A1E", border: `1px solid ${approved ? PASTEL.mint : "#F5E3B8"}` }}>
      {approved ? "Publicado" : "Pendente"}
    </span>
  );
}

/* ---------------- Painel de Moderação ---------------- */
function AdminPanel({ stories, faith, encouragements, onModerateStory, onModerateFaith, onModerateEncouragement }) {
  const total = stories.length + faith.length + encouragements.length;
  return (
    <section style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px 70px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <ShieldCheck size={20} color={PASTEL.lilacDark} />
        <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, color: "#3A362E", margin: 0 }}>Painel de Moderação</h2>
      </div>
      <p style={{ fontSize: 13.5, color: "#9C9384", marginBottom: 22 }}>{total} publicação(ões) aguardando aprovação.</p>

      <SubSectionTitle>Depoimentos pendentes</SubSectionTitle>
      {stories.length === 0 ? <EmptyBox>Nenhum depoimento pendente. 🎉</EmptyBox> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 30 }}>
          {stories.map((s) => (
            <div key={s.id} style={{ background: "#fff", border: "1px solid #F0EBE0", borderRadius: 16, padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                <div>
                  <h3 className="font-display" style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#3A362E" }}>{s.babyName}</h3>
                  <div style={{ fontSize: 12.5, color: "#9C9384" }}>{s.weeks} semanas · {s.weight} — por {s.authorName}</div>
                </div>
                <StatusBadge status={s.status} />
              </div>
              <p style={{ fontSize: 14, color: "#5C5648", lineHeight: 1.6, margin: "0 0 12px" }}>{s.text}</p>
              <ModerateButtons onApprove={() => onModerateStory(s.id, "aprovar")} onReject={() => onModerateStory(s.id, "recusar")} />
            </div>
          ))}
        </div>
      )}

      <SubSectionTitle>Momentos de fé pendentes</SubSectionTitle>
      {faith.length === 0 ? <EmptyBox>Nenhum momento de fé pendente. 🎉</EmptyBox> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 30 }}>
          {faith.map((f) => (
            <div key={f.id} style={{ background: "#fff", border: "1px solid #F0EBE0", borderRadius: 16, padding: "18px 20px" }}>
              <p style={{ margin: "0 0 4px", fontSize: 15, fontStyle: "italic", color: "#3A362E", fontWeight: 600 }}>"{f.verseText}"</p>
              {f.reference && <div style={{ fontSize: 12.5, color: PASTEL.lilacDark, fontWeight: 700, marginBottom: 6 }}>— {f.reference}</div>}
              {f.message && <p style={{ fontSize: 13.5, color: "#5C5648", margin: "6px 0 10px" }}>{f.message}</p>}
              <div style={{ fontSize: 12, color: "#9C9384", marginBottom: 12 }}>por {f.authorName}</div>
              <ModerateButtons onApprove={() => onModerateFaith(f.id, "aprovar")} onReject={() => onModerateFaith(f.id, "recusar")} />
            </div>
          ))}
        </div>
      )}

      <SubSectionTitle>Frases de incentivo pendentes</SubSectionTitle>
      {encouragements.length === 0 ? <EmptyBox>Nenhuma frase pendente. 🎉</EmptyBox> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {encouragements.map((e) => (
            <div key={e.id} style={{ background: "#fff", border: "1px solid #F0EBE0", borderRadius: 16, padding: "18px 20px" }}>
              <p style={{ margin: "0 0 6px", fontSize: 14.5, color: "#3A362E", fontWeight: 600 }}>{e.phrase}</p>
              <div style={{ fontSize: 12, color: "#9C9384", marginBottom: 12 }}>por {e.authorName}</div>
              <ModerateButtons onApprove={() => onModerateEncouragement(e.id, "aprovar")} onReject={() => onModerateEncouragement(e.id, "recusar")} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function ModerateButtons({ onApprove, onReject }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <button onClick={onApprove} style={{ ...primaryBtnStyle, display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", fontSize: 13 }}>
        <Check size={14} /> Aprovar
      </button>
      <button onClick={onReject} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", fontSize: 13, fontFamily: "'Poppins', sans-serif", fontWeight: 700, borderRadius: 999, cursor: "pointer", border: "1.5px solid #F3D9D2", background: "#FDF4F2", color: "#B5543F" }}>
        <X size={14} /> Recusar
      </button>
    </div>
  );
}

/* ---------------- Footer ---------------- */
function Footer({ setView, user }) {
  return (
    <footer style={{ borderTop: "1px solid #F0EBE0", padding: "26px 24px 40px", textAlign: "center" }}>
      <p style={{ fontSize: 13, color: "#B4AC9C", margin: "0 0 8px" }}>Feito com 💚 para famílias que atravessam a jornada da prematuridade.</p>
      {user?.isAdmin && (
        <button onClick={() => setView("admin")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 11.5, color: "#D6D0C2", textDecoration: "underline" }}>
          Painel administrativo
        </button>
      )}
    </footer>
  );
}

/* ---------------- Shared UI pieces ---------------- */
function Modal({ children, onClose, title, icon, wide }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(58,54,46,0.35)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 18 }}>
      <div onClick={(e) => e.stopPropagation()} className="floatIn" style={{ background: "#FDFBF7", borderRadius: 20, padding: 24, width: "100%", maxWidth: wide ? 520 : 400, maxHeight: "88vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: PASTEL.mintDark }}>
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
      <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#7A7263", marginBottom: 6, fontFamily: "'Poppins', sans-serif" }}>{label}</label>
      {children}
    </div>
  );
}

function Toast({ message }) {
  return (
    <div className="floatIn" style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#3A362E", color: "#FDFBF7", padding: "12px 20px", borderRadius: 999, fontSize: 13.5, fontWeight: 600, zIndex: 200, boxShadow: "0 10px 30px rgba(0,0,0,0.2)", fontFamily: "'Nunito', sans-serif", maxWidth: "90vw", textAlign: "center" }}>
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
  fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: 14, color: PASTEL.mintDark,
  background: PASTEL.mint, border: "none", padding: "11px 18px", borderRadius: 999, cursor: "pointer",
};