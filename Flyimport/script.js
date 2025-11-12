// ============== DATOS ==============
// Editá este array con tus perfumes.
// img: ruta relativa en /assets
const PRODUCTS = [
  {
    id: "sauvage",
    name: "Dior Sauvage EDT",
    brand: "Dior",
    family: "Aromático Fougère",
    gender: "Hombre",
    type: "EDT",
    notes: ["Bergamota", "Pimienta", "Ambroxan"],
    price: 145000,        // número (sin $ ni puntos)
    size: "100 ml",
    img: "assets/sauvage.jpg",
    description: "Fresco y vibrante, mezcla cítrica especiada con un fondo ambarado limpio."
  },
  {
    id: "no5",
    name: "Chanel N°5 EDP",
    brand: "Chanel",
    family: "Floral Aldehídica",
    gender: "Mujer",
    type: "EDP",
    notes: ["Ylang-Ylang", "Jazmín", "Aldehídos", "Sándalo"],
    price: 210000,
    size: "100 ml",
    img: "assets/chanel-no5.jpg",
    description: "Icono atemporal: bouquet floral sofisticado con fondo cremoso."
  },
  {
    id: "lightblue",
    name: "Dolce & Gabbana Light Blue",
    brand: "Dolce & Gabbana",
    family: "Cítrico Frutal",
    gender: "Mujer",
    type: "EDT",
    notes: ["Limón", "Manzana", "Cedro"],
    price: 118000,
    size: "100 ml",
    img: "assets/lightblue.jpg",
    description: "Brillante y veraniega, cítrica con toques frutales y madera clara."
  }
];

// ============== UTIL ==============
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];
const fmt = (n) => n.toLocaleString('es-AR', { style:'currency', currency:'ARS', maximumFractionDigits:0 });

const state = {
  q: "",
  brand: "",
  family: "",
  sort: "rel"
};

// ============== INICIALIZACIÓN ==============
function initFilters() {
  // Marcas únicas
  const brands = Array.from(new Set(PRODUCTS.map(p => p.brand))).sort();
  const brandSel = $("#brand");
  brands.forEach(b => {
    const o = document.createElement("option");
    o.value = b; o.textContent = b;
    brandSel.appendChild(o);
  });

  // Familias únicas
  const fams = Array.from(new Set(PRODUCTS.map(p => p.family))).sort();
  const famSel = $("#family");
  fams.forEach(f => {
    const o = document.createElement("option");
    o.value = f; o.textContent = f;
    famSel.appendChild(o);
  });

  // Eventos
  $("#q").addEventListener("input", (e)=>{ state.q = e.target.value.trim().toLowerCase(); render(); });
  $("#brand").addEventListener("change", (e)=>{ state.brand = e.target.value; render(); });
  $("#family").addEventListener("change", (e)=>{ state.family = e.target.value; render(); });
  $("#sort").addEventListener("change", (e)=>{ state.sort = e.target.value; render(); });

  // Footer año
  $("#y").textContent = new Date().getFullYear();
}

// ============== RENDER ==============
function matches(p) {
  const q = state.q;
  const inText = (s) => (s||"").toLowerCase().includes(q);
  const notes = (p.notes||[]).join(" ").toLowerCase();

  const qOk = !q || inText(p.name) || inText(p.brand) || inText(p.family) || inText(notes);
  const bOk = !state.brand || p.brand === state.brand;
  const fOk = !state.family || p.family === state.family;
  return qOk && bOk && fOk;
}
function sortFn(a,b){
  switch(state.sort){
    case "price_asc": return a.price - b.price;
    case "price_desc": return b.price - a.price;
    case "name_asc": return a.name.localeCompare(b.name);
    default: return 0; // relevancia básica
  }
}

function render(){
  const container = $("#catalogo");
  container.innerHTML = "";

  const items = PRODUCTS.filter(matches).sort(sortFn);

  if(items.length === 0){
    container.innerHTML = `<p style="opacity:.7">No se encontraron productos.</p>`;
    return;
  }

  for(const p of items){
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <img class="card-img" src="${p.img}" alt="${p.name}" loading="lazy">
      <div class="card-body">
        <h3 class="card-title">${p.name}</h3>
        <p class="card-sub">${p.brand}</p>
        <div class="card-price">
          <span class="price-tag">${fmt(p.price)}</span>
          <span class="size-tag">${p.size}</span>
        </div>
        <div class="tags">
          <span class="tag">${p.family}</span>
          <span class="tag">${p.gender}</span>
          <span class="tag">${p.type}</span>
        </div>
      </div>`;
    card.addEventListener("click", ()=> openDetail(p));
    container.appendChild(card);
  }
}

// ============== MODAL ==============
const modal = $("#detailModal");
$("#closeModal").addEventListener("click", ()=> modal.close());

function openDetail(p){
  $("#mImg").src = p.img;
  $("#mImg").alt = p.name;
  $("#mName").textContent = p.name;
  $("#mBrand").textContent = p.brand;
  $("#mDesc").textContent = p.description || "";
  $("#mNotes").innerHTML = (p.notes||[]).map(n=>`<span class="chip">${n}</span>`).join("");
  $("#mFamily").textContent = p.family;
  $("#mGender").textContent = p.gender;
  $("#mType").textContent = p.type;
  $("#mPrice").textContent = fmt(p.price);
  $("#mSize").textContent = p.size;

  // Link rápido de WhatsApp con mensaje prellenado
  const msg = encodeURIComponent(`Hola! Quiero consultar por "${p.name}" (${p.size}) - ${fmt(p.price)}`);
  const phone = "5491112345678"; // <-- reemplazá con tu número
  $("#mWhatsApp").href = `https://wa.me/${phone}?text=${msg}`;

  modal.showModal();
}

// ============== START ==============
initFilters();
render();
