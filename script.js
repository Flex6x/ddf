import { S_URL, S_KEY } from './config.js';

const EP_DATA=[[1,"und der Super-Papagei","http://a1.mzstatic.com/us/r30/Music41/v4/c9/3f/e4/c93fe4aa-c385-ed18-2cb3-e4eeff284f5a/source"],[2,"und der Phantomsee","http://a1.mzstatic.com/us/r30/Music62/v4/87/1c/7f/871c7f1c-fdf1-bed9-bf1b-eb7ab73ec448/source"],[3,"und der Karpatenhund","http://a1.mzstatic.com/us/r30/Music71/v4/a7/d8/54/a7d85469-a416-93a3-93ba-d8e82be2f8ae/source"],[4,"und die schwarze Katze","http://a1.mzstatic.com/us/r30/Music71/v4/21/ee/57/21ee57b0-0949-8674-8b3d-c2c512c5fbc8/source"],[5,"und der Fluch des Rubins","http://a1.mzstatic.com/us/r30/Music62/v4/f5/4e/46/f54e4607-2ea1-d765-632e-8a1723d4ba61/source"],[6,"und der sprechende Totenkopf","http://a1.mzstatic.com/us/r30/Music71/v4/a7/e7/cb/a7e7cbc3-0ce0-34db-a310-d7b82546f2b0/source"],[7,"und der unheimliche Drache","http://a1.mzstatic.com/us/r30/Music62/v4/c0/7a/ba/c07aba56-7363-71d6-72ba-38d2a968e379/source"],[8,"und der grüne Geist","http://a1.mzstatic.com/us/r30/Music22/v4/63/98/91/639891fc-8d20-3c32-78a9-5f12e7919932/source"],[9,"und die rätselhaften Bilder","http://a1.mzstatic.com/us/r30/Music41/v4/63/ed/85/63ed8571-c32d-cc88-3bf2-6b1921c9023b/source"],[10,"und die flüsternde Mumie","http://a1.mzstatic.com/us/r30/Music62/v4/db/b7/97/dbb79799-f83a-4f0d-551f-5be2854150d9/source"],[11,"und das Gespensterschloss","http://a1.mzstatic.com/us/r30/Music71/v4/cd/c3/65/cdc36537-ec11-9175-81ba-869e45908266/source"],[12,"und der seltsame Wecker","http://a1.mzstatic.com/us/r30/Music41/v4/79/3c/bb/793cbb57-e901-d11c-6d90-671e09e02f3b/source"],[13,"und der lachende Schatten","http://a1.mzstatic.com/us/r30/Music71/v4/35/d3/83/35d383d4-7cf8-4fc9-4a06-2197ae82f46b/source"],[14,"und das Bergmonster","http://a1.mzstatic.com/us/r30/Music41/v4/05/0b/e1/050be1b1-f45d-df0a-eadd-3209014ed635/source"],[15,"und der rasende Löwe","http://a1.mzstatic.com/us/r30/Music62/v4/9f/c3/e3/9fc3e3cc-6b71-2f31-ccda-8d0563427859/source"],[16,"und der Zauberspiegel","http://a1.mzstatic.com/us/r30/Music22/v4/1d/6e/77/1d6e77a2-74de-4933-9f89-9e843c081822/source"]];

// ── BUILD EPISODE OBJECTS ───────────────────────────────────────────────
function formatDate(d) {
  if(!d) return "";
  const parts = d.split("-");
  return parts.reverse().join(".");
}

async function initEpisodes() {
  try {
    const r=await fetch("https://dreimetadaten.de/data/Serie.json");
    if(r.ok) {
      const raw=await r.json();
      const arr=raw.serie||[];
      const today = new Date().toISOString().split('T')[0];
      
      const released = arr.filter(ep => ep.veröffentlichungsdatum && ep.veröffentlichungsdatum <= today);
      const upcoming = arr.filter(ep => ep.veröffentlichungsdatum && ep.veröffentlichungsdatum > today);
      
      const filtered = [...released];
      if (upcoming.length > 0) {
        filtered.push(upcoming[0]);
      }

      return filtered.map(ep=>({
        num: ep.nummer,
        title: ep.titel,
        cover: `https://dreimetadaten.de/data/Serie/${String(ep.nummer).padStart(3, '0')}/cover.png`,
        desc: ep.beschreibung || ep.gesamtbeschreibung || "",
        author: ep.autor || "Unbekannt",
        date: ep.veröffentlichungsdatum,
        links: {
          spotify: ep.links ? (ep.links.spotify || ep.links['spotify']) : "",
          appleMusic: ep.links ? (ep.links.appleMusic || ep.links['apple-music'] || ep.links['apple_music'] || ep.links['itunes']) : "",
          amazonMusic: ep.links ? (ep.links.amazonMusic || ep.links['amazon-music'] || ep.links['amazon_music'] || ep.links['prime-music'] || ep.links['amazon']) : "",
          youtubeMusic: ep.links ? (ep.links.youTubeMusic || ep.links.youtubeMusic || ep.links['youtube-music'] || ep.links['youtube_music'] || ep.links['youtube'] || ep.links['yt']) : "",
          deezer: ep.links ? (ep.links.deezer || ep.links['deezer']) : "",
          bookbeat: ep.links ? (ep.links.bookbeat || ep.links['bookbeat']) : ""
        },
        spotifyId: ep.ids ? ep.ids.spotify : "",
        duration: ep.gesamtdauer || 0,
        isFuture: ep.veröffentlichungsdatum > today
      }));
    }
  } catch(e){}
  return EP_DATA.map(([num, sub, cover]) => ({
    num,
    title: sub,
    cover: `https://dreimetadaten.de/data/Serie/${String(num).padStart(3, '0')}/cover.png`,
    desc: "",
    author: "",
    date: "",
    links: { spotify: "", appleMusic: "", amazonMusic: "", youtubeMusic: "", deezer: "", bookbeat: "" },
    spotifyId: "",
    duration: 0,
    isFuture: false
  }));
}

let episodes = [];

// ── SUPABASE ────────────────────────────────────────────────────────────
let sb = null;
if (S_URL && S_URL.includes("supabase.co")) {
  sb = supabase.createClient(S_URL, S_KEY);
}

// ── STATE ───────────────────────────────────────────────────────────────
let checked = new Set();
let bookmarks = new Set();
let ratings = {};
let musicService = "spotify";
let cur = 1;
let filt = "all";
let obs = null;
let user = null;

async function loadState() {
  try {
    const c = localStorage.getItem("ddf4_c");
    if (c) checked = new Set(JSON.parse(c));
    const b = localStorage.getItem("ddf4_b");
    if (b) bookmarks = new Set(JSON.parse(b));
    const r = localStorage.getItem("ddf4_r");
    if (r) ratings = JSON.parse(r);
    const m = localStorage.getItem("ddf4_m");
    if (m) musicService = m;
    const e = localStorage.getItem("ddf4_ep");
    if (e) cur = Math.max(1, Math.min(parseInt(e), episodes.length||999));
    
    if (sb) {
        const { data: { session } } = await sb.auth.getSession();
        if (session) {
            user = session.user;
            await syncFromCloud();
            updateAuthUI();
        }
    }
  } catch(e) {}
}

async function save() {
  localStorage.setItem("ddf4_c", JSON.stringify([...checked]));
  localStorage.setItem("ddf4_b", JSON.stringify([...bookmarks]));
  localStorage.setItem("ddf4_r", JSON.stringify(ratings));
  localStorage.setItem("ddf4_m", musicService);
  localStorage.setItem("ddf4_ep", cur);
  if (user && sb) await syncToCloud();
}

// ── CLOUD SYNC ──────────────────────────────────────────────────────────
async function syncToCloud() {
    if (!user || !sb) return;
    try {
        await sb.from("user_data").upsert({
            id: user.id,
            checked: [...checked],
            bookmarks: [...bookmarks],
            ratings: ratings,
            music_service: musicService,
            updated_at: new Date()
        });
    } catch(e) { console.error("Sync Error", e); }
}

async function syncFromCloud() {
    if (!user || !sb) return;
    try {
        const { data, error } = await sb.from("user_data").select("*").eq("id", user.id).single();
        if (data) {
            checked = new Set(data.checked || []);
            bookmarks = new Set(data.bookmarks || []);
            ratings = data.ratings || {};
            if (data.music_service) musicService = data.music_service;

            localStorage.setItem("ddf4_c", JSON.stringify([...checked]));
            localStorage.setItem("ddf4_b", JSON.stringify([...bookmarks]));
            localStorage.setItem("ddf4_r", JSON.stringify(ratings));
            localStorage.setItem("ddf4_m", musicService);
        }
    } catch(e) { console.error("Pull Error", e); }
}
// ── AUTH ────────────────────────────────────────────────────────────────
function openAuth() { document.getElementById("ovAuth").classList.add("open"); }
function closeAuth() { document.getElementById("ovAuth").classList.remove("open"); }

function openDesc() {
    const ep = episodes.find(e => e.num === cur);
    if (!ep) return;
    document.getElementById("descTitle").textContent = ep.title;
    
    let info = "";
    if (ep.isFuture) {
      info += `<div style="background:var(--ac);color:#000;padding:12px;border-radius:12px;font-weight:900;margin-bottom:20px;text-align:center;font-size:14px;letter-spacing:0.02em;box-shadow:0 4px 12px rgba(232,196,74,0.2)">ERSCHEINT AM ${formatDate(ep.date)}</div>`;
    }
    
    info += `<div style="display:grid;grid-template-columns:auto 1fr;gap:4px 12px;margin-bottom:16px;background:var(--sf2);padding:12px;border-radius:12px;border:1px solid var(--bd)">`;
    if (ep.author) {
      info += `<div style="font-size:11px;color:var(--mu2);text-transform:uppercase;letter-spacing:0.05em">Autor</div><div style="font-size:13px;color:var(--tx);font-weight:500">${ep.author}</div>`;
    }
    if (ep.date) {
      info += `<div style="font-size:11px;color:var(--mu2);text-transform:uppercase;letter-spacing:0.05em">${ep.isFuture?"Datum":"Erschienen"}</div><div style="font-size:13px;color:var(--tx);font-weight:500">${formatDate(ep.date)}</div>`;
    }
    if (ep.duration) {
      const mins = Math.floor(ep.duration / 60000);
      info += `<div style="font-size:11px;color:var(--mu2);text-transform:uppercase;letter-spacing:0.05em">Dauer</div><div style="font-size:13px;color:var(--tx);font-weight:500">ca. ${mins} Minuten</div>`;
    }
    info += `</div>`;
    
    document.getElementById("descContent").innerHTML = info + (ep.desc || "Keine Beschreibung verfügbar.");
    document.getElementById("ovDesc").classList.add("open");
}
function closeDesc() { document.getElementById("ovDesc").classList.remove("open"); }

async function doAuth(type) {
    if (!sb) { toast("Supabase nicht konfiguriert."); return; }
    const email = document.getElementById("authEmail").value;
    const pass = document.getElementById("authPass").value;
    if (!email || !pass) { toast("Bitte Daten eingeben."); return; }

    try {
        if (type === "reg") {
            const res = await sb.auth.signUp({ email, password: pass });
            if (res.error) throw res.error;
            
            if (res.data.user) {
              await sb.from("user_data").upsert({
                  id: res.data.user.id,
                  checked: [...checked],
                  bookmarks: [...bookmarks],
                  ratings: ratings,
                  updated_at: new Date()
              });
              localStorage.removeItem("ddf4_c");
              localStorage.removeItem("ddf4_b");
              localStorage.removeItem("ddf4_r");
            }
            toast("Registrierung erfolgreich!");
        } else {
            const res = await sb.auth.signInWithPassword({ email, password: pass });
            if (res.error) throw res.error;
            user = res.data.user;

            const { data } = await sb.from("user_data").select("*").eq("id", user.id).single();
            if (data) {
                checked = new Set(data.checked || []);
                bookmarks = new Set(data.bookmarks || []);
                ratings = data.ratings || {};
            } else {
                checked = new Set();
                bookmarks = new Set();
                ratings = {};
            }
            
            localStorage.setItem("ddf4_c", JSON.stringify([...checked]));
            localStorage.setItem("ddf4_b", JSON.stringify([...bookmarks]));
            localStorage.setItem("ddf4_r", JSON.stringify(ratings));

            toast("Willkommen zurück!");
            updateAuthUI();
            closeAuth();
            updateStats(); renderList(); updatePlayer();
        }
    } catch(e) {
        toast("Fehler: " + e.message);
    }
}

async function doLogout() {
    if (sb) await sb.auth.signOut();
    user = null;
    
    checked = new Set();
    bookmarks = new Set();
    ratings = {};
    localStorage.removeItem("ddf4_c");
    localStorage.removeItem("ddf4_b");
    localStorage.removeItem("ddf4_r");
    
    updateAuthUI();
    closeAuth();
    toast("Abgemeldet. Lokaler Stand zurückgesetzt.");
    updateStats(); renderList(); updatePlayer();
}

function updateAuthUI() {
    const btn = document.getElementById("authBtn");
    const text = document.getElementById("authText");
    const forms = document.getElementById("authForms");
    const profile = document.getElementById("userProfile");
    const pEmail = document.getElementById("profileEmail");
    const title = document.getElementById("authTitle");

    if (user) {
        text.textContent = "Profil";
        forms.style.display = "none";
        profile.style.display = "block";
        pEmail.textContent = user.email;
        title.textContent = "Dein Profil";
    } else {
        text.textContent = "Login";
        forms.style.display = "block";
        profile.style.display = "none";
        title.textContent = "Konto";
    }
}

// ── CANVAS ──────────────────────────────────────────────────────────────
function draw(c, num, sz) {
  c.width = sz; c.height = sz;
  const x = c.getContext("2d");
  x.clearRect(0,0,sz,sz);
}

// ── STATS ───────────────────────────────────────────────────────────────
function updateStats() {
  const tot=episodes.length, done=checked.size;
  document.getElementById("sT").textContent=tot;
  document.getElementById("sW").textContent=done;
  document.getElementById("sL").textContent=tot-done;
  const pct=tot?Math.round(done/tot*100):0;
  document.getElementById("progFill").style.width=pct+"%";
  document.getElementById("progPct").textContent=pct+"%";
}

// ── PLAYER ──────────────────────────────────────────────────────────────
function updatePlayer() {
  const ep = episodes.find(e=>e.num===cur);
  if(!ep) return;
  const done = checked.has(cur);
  document.getElementById("pBadge").textContent="Folge "+String(ep.num).padStart(3,"0");
  document.getElementById("pNum").textContent="Folge "+String(ep.num).padStart(3,"0");
  document.getElementById("pTitle").textContent=ep.title;
  
  const link = ep.links ? ep.links[musicService] : "";
  const btn = document.getElementById("pSpotify");
  btn.style.display = link ? "flex" : "none";
  
  // Update Class for Hover Color
  btn.className = "ctrl-s svc-" + musicService;
  
  // Update Icon
  const icons = {
    spotify: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.31c-.218.358-.684.47-1.042.252-2.822-1.723-6.375-2.113-10.558-1.157-.409.093-.82-.163-.914-.572-.093-.41.163-.82.572-.914 4.58-1.047 8.52-.596 11.69 1.341.358.218.47.684.252 1.052zm1.47-3.255c-.276.448-.86.59-1.308.314-3.23-1.986-8.153-2.56-11.97-1.403-.504.153-1.04-.128-1.194-.632-.154-.504.128-1.04.632-1.194 4.363-1.324 9.78-.67 13.518 1.628.448.276.59.86.322 1.287zm.127-3.41c-3.873-2.3-10.274-2.512-13.996-1.383-.593.18-1.23-.153-1.41-.746-.18-.593.153-1.23.746-1.41 4.282-1.298 11.353-1.042 15.82 1.61.533.317.708 1.004.392 1.536-.317.532-1.004.708-1.552.393z"/></svg>',
    appleMusic: '<img src="icons/apple_music.svg" width="18" height="18" alt="">',
    amazonMusic: '<img src="icons/Amazon_Music.png" width="18" height="18" alt="">',
    youtubeMusic: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18c-3.313 0-6-2.687-6-6s2.687-6 6-6 6 2.687 6 6-2.687 6-6 6zm0-10c-2.209 0-4 1.791-4 4s1.791 4 4 4 4-1.791 4-4-1.791-4-4-4zm-1.5 6.5v-5l4 2.5-4 2.5z"/></svg>',
    deezer: '<img src="icons/deezer.png" width="18" height="18" alt="">',
    bookbeat: '<img src="icons/bookbeat.png" width="18" height="18" alt="">'
  };
  btn.innerHTML = icons[musicService] || icons.spotify;



  document.getElementById("mCheck").classList.toggle("on",done);
  document.getElementById("pOk").classList.toggle("on",done);
  
  document.getElementById("mBook").classList.toggle("on", bookmarks.has(cur));
  document.getElementById("mRate").classList.toggle("on", !!ratings[cur]);
  updateRateStars();

  const idx=episodes.findIndex(e=>e.num===cur);
  document.getElementById("bPrev").disabled=idx<=0;
  document.getElementById("bNext").disabled=idx>=episodes.length-1;
  loadCover(ep);
}

function openSpotify() {
  const ep = episodes.find(e => e.num === cur);
  if (!ep) return;
  const link = ep.links ? ep.links[musicService] : "";
  if (!link) return;

  if (musicService === "spotify" && ep.spotifyId) {
    window.location.href = `spotify:album:${ep.spotifyId}`;
    setTimeout(() => { window.open(link, "_blank"); }, 600);
  } else {
    window.open(link, "_blank");
  }
}

function openSvc() {
  document.querySelectorAll(".svc-item").forEach(i => i.classList.toggle("on", i.id === `svc-${musicService}`));
  document.getElementById("ovSvc").classList.add("open");
}
function closeSvc() { document.getElementById("ovSvc").classList.remove("open"); }
function setSvc(s) {
  musicService = s;
  save();
  document.getElementById("svcBtnIcon").innerHTML = document.querySelector(`#svc-${s} .svc-icon`).innerHTML;
  updatePlayer();
  closeSvc();
}

function toTop() { window.scrollTo({ top: 0, behavior: "smooth" }); }
window.onscroll = () => {
  document.getElementById("upBtn").classList.toggle("on", window.scrollY > 300);
};

function toggleBook() {
  if(bookmarks.has(cur)) bookmarks.delete(cur); else bookmarks.add(cur);
  save(); updatePlayer(); renderList();
}

function toggleRatePop(e) {
  if(e) e.stopPropagation();
  document.getElementById("ratePop").classList.toggle("on");
}

function setRate(v) {
  if(ratings[cur] === v) delete ratings[cur]; else ratings[cur] = v;
  save(); updatePlayer(); renderList();
  document.getElementById("ratePop").classList.remove("on");
}

function updateRateStars() {
  const v = ratings[cur] || 0;
  document.querySelectorAll("#ratePop .rate-star").forEach((s, i) => {
    s.classList.toggle("on", i < v);
  });
}

let cvId = 0;
function loadCover(ep) {
  const cvs=document.getElementById("pCvs"),img=document.getElementById("pImg");
  const sz=Math.min((cvs.offsetWidth||460)*(window.devicePixelRatio||1),900);
  const myId = ++cvId;

  const local = `cover/cover_${String(ep.num).padStart(3, '0')}.png`;
  const p = new Image();
  
  const showResult = (src, success) => {
    if(cvId !== myId) return;
    img.classList.remove("on");
    
    setTimeout(() => {
      if(cvId !== myId) return;
      draw(cvs, ep.num, sz);
      if(success) {
        img.src = src;
        img.classList.add("on");
      } else {
        img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
      }
    }, 20);
  };

  p.onload = () => {
    if(p.naturalWidth > 5) showResult(p.src, true);
    else p.onerror();
  };
  p.onerror = () => {
    if(p.src.includes('cover/cover_')) {
      p.crossOrigin = "anonymous";
      p.src = ep.cover;
    } else {
      showResult("", false);
    }
  };
  p.src = local;
}

function nav(d) {
  const idx=episodes.findIndex(e=>e.num===cur);
  const nxt=episodes[idx+d]; if(!nxt) return;
  cur=nxt.num; save(); updatePlayer();
  document.querySelectorAll(".epr").forEach(r=>r.classList.toggle("act",+r.dataset.n===cur));
  document.getElementById("ratePop").classList.remove("on");
}

function toggleCur() {
  if(checked.has(cur)) checked.delete(cur); else checked.add(cur);
  save(); updateStats();
  const done=checked.has(cur);
  document.getElementById("mCheck").classList.toggle("on",done);
  document.getElementById("pOk").classList.toggle("on",done);
  const row=document.querySelector(`.epr[data-n="${cur}"]`);
  if(row){if(filt!=="all") row.remove(); else syncRow(row,cur);}
}

function toggleEp(n) {
  if(checked.has(n)) checked.delete(n); else checked.add(n);
  save(); updateStats();
  if(n===cur){
    const done=checked.has(n);
    document.getElementById("mCheck").classList.toggle("on",done);
    document.getElementById("pOk").classList.toggle("on",done);
  }
  const row=document.querySelector(`.epr[data-n="${n}"]`);
  if(row){if(filt!=="all") row.remove(); else syncRow(row,n);}
}

function syncRow(row,n){
  const done=checked.has(n);
  row.classList.toggle("done",done);
}

// ── LIST ────────────────────────────────────────────────────────────────
function setupObs() {
  if(!("IntersectionObserver" in window)) return;
  obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const row=e.target, n=+row.dataset.n;
      const ep=episodes.find(x=>x.num===n);
      if(!ep) return;
      const img=row.querySelector(".epth-i");
      if(img.dataset.l) return;
      img.dataset.l="1";
      const local = `cover/cover_${String(ep.num).padStart(3, '0')}.png`;
      const p=new Image();
      p.onload=()=>{
        if(p.naturalWidth>5){
          img.src=p.src;
          requestAnimationFrame(()=>img.classList.add("on"));
        }
      };
      p.onerror=()=>{
        if(p.src.includes('cover/cover_')){
          p.crossOrigin="anonymous";
          p.src=ep.cover;
          img.crossOrigin="anonymous";
        }
      };
      p.src=local;
      obs.unobserve(row);
    });
  },{rootMargin:"150px"});
}

function renderList() {
  const list=document.getElementById("epList");
  const q=(document.getElementById("srch")?.value||"").toLowerCase().trim();
  const filtered=episodes.filter(ep=>{
    if(filt==="open"&&checked.has(ep.num)) return false;
    if(filt==="done"&&!checked.has(ep.num)) return false;
    if(filt==="book"&&!bookmarks.has(ep.num)) return false;
    if(filt.startsWith("r") && filt.length === 2) {
      const r = parseInt(filt[1]);
      if(ratings[ep.num] !== r) return false;
    }
    if(q) return ep.title.toLowerCase().includes(q)||String(ep.num).includes(q);
    return true;
  });
  if(!filtered.length){list.innerHTML='<div class="ep-empty">Keine Folgen gefunden.</div>';return;}
  list.innerHTML="";
  filtered.forEach(ep=>{
    const done=checked.has(ep.num), act=ep.num===cur, booked=bookmarks.has(ep.num), rate=ratings[ep.num];
    const row=document.createElement("div");
    row.className=`epr${done?" done":""}${act?" act":""}`;
    row.dataset.n=ep.num;
    row.innerHTML=`<div class="epth"><canvas class="epth-c"></canvas><img class="epth-i" alt=""></div><div class="epi"><div class="epn">FOLGE ${String(ep.num).padStart(3,"0")}</div><div class="ept">${esc(ep.title)}</div></div><div class="ep-meta"><div class="ep-bmark${booked?" on":""}"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg></div><div class="ep-rate${rate?" on":""}"><svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg><span>${rate||""}</span></div></div><div class="epck"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>`;
    draw(row.querySelector(".epth-c"),ep.num,84);
    row.addEventListener("click",e=>{
      if(e.target.closest(".epck")) toggleEp(ep.num);
      else selEp(ep.num);
    });
    list.appendChild(row);
    if(obs) obs.observe(row);
  });
}

function selEp(n) {
  cur=n; save(); updatePlayer();
  document.querySelectorAll(".epr").forEach(r=>r.classList.toggle("act",+r.dataset.n===n));
  document.querySelector(".epr.act")?.scrollIntoView({block:"nearest",behavior:"smooth"});
}

function setF(f,btn){
  filt=f;
  document.querySelectorAll(".fb").forEach(b=>b.classList.remove("on"));
  btn.classList.add("on");

  const sBtn = document.getElementById("fStarBtn");
  if(!f.startsWith("r")) sBtn.textContent = "★";
  else sBtn.textContent = f[1] + " ★";

  document.getElementById("fRatePop").classList.remove("on");

  const titles = {
    all: "Alle Folgen",
    open: "Offene Folgen",
    done: "Gehörte Folgen",
    book: "Lesezeichen",
    r1: "1 Stern",
    r2: "2 Sterne",
    r3: "3 Sterne",
    r4: "4 Sterne",
    r5: "5 Sterne"
  };
  document.querySelector(".ltitle").textContent = titles[f] || "Gefiltert";

  renderList();
}

function toggleFPop(e) {
  e.stopPropagation();
  document.getElementById("fRatePop").classList.toggle("on");
}

window.addEventListener("click", () => {
  document.getElementById("ratePop")?.classList.remove("on");
  document.getElementById("fRatePop")?.classList.remove("on");
});

function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}

function exportCSV() {
  let csv = "\uFEFFNummer;Titel;Status;Bewertung;Lesezeichen\n";
  episodes.forEach(ep => {
    const status = checked.has(ep.num) ? "Gehört" : "Offen";
    const rate = ratings[ep.num] || "-";
    const book = bookmarks.has(ep.num) ? "Ja" : "Nein";
    csv += `${ep.num};"${ep.title.replace(/"/g, '""')}";${status};${rate};${book}\n`;
  });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `DDF_Tracker_Export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ── MODAL ───────────────────────────────────────────────────────────────
function openM(){document.getElementById("ov").classList.add("open")}
function closeM(){document.getElementById("ov").classList.remove("open")}
function handleOv(e){
  if(e.target.id==="ov") closeM();
  if(e.target.id==="ovAuth") closeAuth();
  if(e.target.id==="ovDesc") closeDesc();
  if(e.target.id==="ovSvc") closeSvc();
}
function doImport(){
  const nums=parseNums(document.getElementById("mTa").value);
  if(!nums.length){toast("Keine gültigen Nummern gefunden.");return}
  const max=episodes[episodes.length-1]?.num||9999;
  let added=0;
  nums.forEach(n=>{if(n>=1&&n<=max){checked.add(n);added++}});
  save();updateStats();renderList();updatePlayer();closeM();
  document.getElementById("mTa").value="";
  toast(`✓ ${added} Folge${added!==1?"n":""} als gehört markiert`);
}
function parseNums(raw){
  const s=new Set();
  raw.split(/[,\n;]+/).forEach(p=>{
    p=p.trim();if(!p) return;
    const r=p.match(/^(\d+)\s*[-–]\s*(\d+)$/);
    if(r){const a=+r[1],b=+r[2];for(let i=Math.min(a,b);i<=Math.max(a,b);i++)s.add(i)}
    else{const n=parseInt(p);if(!isNaN(n))s.add(n)}
  });
  return[...s];
}
function resetAll(){
  if(!confirm("Alle Häkchen wirklich entfernen?")) return;
  checked.clear();save();updateStats();renderList();updatePlayer();closeM();toast("Alle Häkchen entfernt.");
}

// ── TOAST ───────────────────────────────────────────────────────────────
let tt;
function toast(msg){
  const el=document.getElementById("toast");
  if(!el) return;
  el.textContent=msg;el.classList.add("show");
  clearTimeout(tt);tt=setTimeout(()=>el.classList.remove("show"),3000);
}

// ── GLOBAL EXPOSE ───────────────────────────────────────────────────────
window.openAuth = openAuth;
window.openDesc = openDesc;
window.closeDesc = closeDesc;
window.doAuth = doAuth;
window.doLogout = doLogout;
window.openSpotify = openSpotify;
window.openSvc = openSvc;
window.closeSvc = closeSvc;
window.setSvc = setSvc;
window.toTop = toTop;
window.nav = nav;
window.toggleCur = toggleCur;
window.toggleEp = toggleEp;
window.toggleBook = toggleBook;
window.toggleRatePop = toggleRatePop;
window.setRate = setRate;
window.setF = setF;
window.toggleFPop = toggleFPop;
window.renderList = renderList;
window.exportCSV = exportCSV;
window.openM = openM;
window.closeM = closeM;
window.handleOv = handleOv;
window.doImport = doImport;
window.resetAll = resetAll;

// ── INIT ────────────────────────────────────────────────────────────────
(async () => {
  episodes = await initEpisodes();
  await loadState();
  
  // Update Service Button Icon
  const sEl = document.querySelector(`#svc-${musicService} .svc-icon`);
  if (sEl) document.getElementById("svcBtnIcon").innerHTML = sEl.innerHTML;

  updateStats();
  updatePlayer();
  setupObs();
  renderList();
})();
