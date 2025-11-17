// =================== DATOS ===================
const PRODUCTS = [
  {
    id: "sauvage",
    name: "Dior Sauvage EDT",
    brand: "Dior",
    family: "Aromático Fougère",
    gender: "Hombre",
    type: "EDT",
    notes: ["Bergamota", "Pimienta", "Ambroxan"],
    price: 145000,
    listPrice: 180000,
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
    listPrice: 210000,
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
    listPrice: 140000,
    size: "100 ml",
    img: "assets/lightblue.jpg",
    description: "Brillante y veraniega, cítrica con toques frutales y madera clara."
  },
  {
    id: "sauvage",
    name: "Dior Sauvage EDT",
    brand: "Dior",
    family: "Aromático Fougère",
    gender: "Hombre",
    type: "EDT",
    notes: ["Bergamota", "Pimienta", "Ambroxan"],
    price: 145000,
    listPrice: 180000,
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
    listPrice: 210000,
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
    listPrice: 140000,
    size: "100 ml",
    img: "assets/lightblue.jpg",
    description: "Brillante y veraniega, cítrica con toques frutales y madera clara."
  },
  // Agrega más productos aquí si lo deseas...
];

const MAX_PRODUCT_PRICE = Math.max(...PRODUCTS.map(p => p.price));

// =================== UTILS ===================
const $  = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const ARS = n => n.toLocaleString('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0
});

const COMBO_DISCOUNT = 0.20; // 20%
const WL_KEY = 'wishlist_perfumes';
const getWL = () => new Set(JSON.parse(localStorage.getItem(WL_KEY) || '[]'));
const setWL = (set) => localStorage.setItem(WL_KEY, JSON.stringify([...set]));

// =================== ESTADO GLOBAL ===================
const state = {
  q: "",
  sort: "rel",
  maxPrice: MAX_PRODUCT_PRICE,
  brands: new Set(),
  families: new Set(),
  genders: new Set(),
  types: new Set(),
  page: 1,
  perPage: 12
};

// =================== CARRITO ===================
let CART = [];

function getCartTotals() {
  let subtotal = 0;
  let totalQty = 0;
  CART.forEach(item => {
    subtotal += item.price * item.qty;
    totalQty += item.qty;
  });
  const discount = totalQty >= 5 ? subtotal * COMBO_DISCOUNT : 0;
  const total = subtotal - discount;
  return { subtotal, discount, total, totalQty };
}

function renderCart() {
  const box = $('#cartItems');
  const totalEl = $('#cartTotal');
  if (!box || !totalEl) return;

  box.innerHTML = '';
  CART.forEach(item => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div style="flex:1">
        <b>${item.name}</b><br>
        <span class="muted" style="font-size:12px;">${ARS(item.price)} x ${item.qty}</span>
      </div>
      <div class="qty-box">
        <button onclick="updateQty('${item.id}', -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="updateQty('${item.id}', 1)">+</button>
      </div>
    `;
    box.appendChild(div);
  });

  const { subtotal, discount, total, totalQty } = getCartTotals();
  let totalText = ARS(total);
  if (discount > 0) totalText += ` (Desc: -${ARS(discount)})`;
  totalEl.textContent = totalText;

  const count = totalQty;
  const badge = $('#cartCount');
  if (badge) {
    badge.style.display = count > 0 ? 'inline-block' : 'none';
    badge.textContent = count;
  }

  PRODUCTS.forEach(p => updateAddBox(p.id));
}

function updateQty(id, delta) {
  const item = CART.find(p => p.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) CART = CART.filter(p => p.id !== id);
  if (!CART.find(p => p.id === id)) updateAddBox(id); 
  renderCart();
}

function addToCart(product, qty = 1) {
  const found = CART.find(p => p.id === product.id);
  if (found) found.qty += qty;
  else CART.push({ ...product, qty });
  renderCart();
  
  const cartSidebar = $('#cartSidebar');
  const cartBackdrop = $('#cartBackdrop');
  if(cartSidebar && cartBackdrop) {
      cartSidebar.classList.add('open');
      cartBackdrop.classList.add('show');
  }
}

function activateAdd(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  addToCart(p, 1);
}

function updateAddBox(id) {
  const wrappers = document.querySelectorAll(`#cta-${id}`);
  const item = CART.find(i => i.id === id);
  wrappers.forEach(wrapper => {
    if (!item) {
      wrapper.innerHTML = `<button class="btn" onclick="activateAdd('${id}')">Agregar</button>`;
    } else {
      wrapper.innerHTML = `
        <div class="add-box">
          <button onclick="updateQty('${id}', -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="updateQty('${id}', 1)">+</button>
        </div>
      `;
    }
  });
}

const cartSidebar  = $('#cartSidebar');
const cartBackdrop = $('#cartBackdrop');
function toggleCart(show) {
  if (!cartSidebar || !cartBackdrop) return;
  if (show) {
    cartSidebar.classList.add('open');
    cartBackdrop.classList.add('show');
  } else {
    cartSidebar.classList.remove('open');
    cartBackdrop.classList.remove('show');
  }
}
if ($('#openCart')) $('#openCart').onclick = () => toggleCart(true);
if ($('#closeCart')) $('#closeCart').onclick = () => toggleCart(false);
if ($('#keepShopping')) $('#keepShopping').onclick = () => toggleCart(false);
if (cartBackdrop) cartBackdrop.onclick = () => toggleCart(false);

if ($('#buyNow')) {
  $('#buyNow').addEventListener('click', () => {
    const { total } = getCartTotals();
    if(total === 0) return alert("El carrito está vacío");
    const msg = encodeURIComponent(`Hola! Quiero comprar mis perfumes. Total: ${ARS(total)}`);
    window.open(`https://wa.me/5491112345678?text=${msg}`, '_blank');
  });
}


// =================== FILTROS ===================
function optionsFrom(field) {
  return [...new Set(PRODUCTS.map(p => p[field]).filter(Boolean))].sort();
}

function checks(list, target, group) {
  if (!target) return;
  target.innerHTML = '';
  list.forEach(name => {
    const id = `${group}-${name}`.replace(/\s+/g, '-');
    const div = document.createElement('label');
    div.className = 'check';
    div.innerHTML = `
      <input type="checkbox" id="${id}">
      <span>${name}</span>
      <span class="count" data-count="${group.slice(0, -1)}:${name}"></span>
    `;
    target.appendChild(div);

    div.querySelector('input').addEventListener('change', (e) => {
      const set = state[group];
      if (e.target.checked) set.add(name);
      else set.delete(name);
      state.page = 1;
      render();
    });
  });
}

function initFilters() {
  checks(optionsFrom('brand'),  $('#brandList'),  'brands');
  checks(optionsFrom('family'), $('#familyList'), 'families');
  checks(optionsFrom('gender'), $('#genderList'), 'genders');
  checks(optionsFrom('type'),   $('#typeList'),   'types');

  const q = $('#q');
  if(q) q.addEventListener('input', e => { state.q = e.target.value.trim().toLowerCase(); state.page=1; render(); });
  
  const sort = $('#sort');
  if(sort) sort.addEventListener('change', e => { state.sort = e.target.value; state.page=1; render(); });

  const range = $('#priceRange');
  if(range) range.addEventListener('input', e => {
      state.maxPrice = +e.target.value;
      if($('#maxPrice')) $('#maxPrice').textContent = ARS(state.maxPrice);
      state.page=1; render();
  });

  const clear = $('#clearAll');
  if(clear) clear.addEventListener('click', () => {
      state.q = ''; state.sort='rel'; state.maxPrice=MAX_PRODUCT_PRICE;
      state.brands.clear(); state.families.clear(); state.genders.clear(); state.types.clear();
      if($('#q')) $('#q').value='';
      if($('#priceRange')) $('#priceRange').value=MAX_PRODUCT_PRICE;
      if($('#maxPrice')) $('#maxPrice').textContent=ARS(MAX_PRODUCT_PRICE);
      $$('input[type="checkbox"]').forEach(ch => ch.checked=false);
      render();
  });
}

// =================== RENDER & LOGICA ===================
function match(p) {
  const q = state.q;
  const inTxt = s => (s || '').toLowerCase().includes(q);
  const notes = (p.notes || []).join(' ').toLowerCase();
  return (!q || inTxt(p.name) || inTxt(p.brand) || inTxt(p.family) || inTxt(notes)) &&
         (p.price <= state.maxPrice) &&
         (state.brands.size === 0 || state.brands.has(p.brand)) &&
         (state.families.size === 0 || state.families.has(p.family)) &&
         (state.genders.size === 0 || state.genders.has(p.gender)) &&
         (state.types.size === 0 || state.types.has(p.type));
}

function sortFn(a, b) {
  switch (state.sort) {
    case 'price_asc':  return a.price - b.price;
    case 'price_desc': return b.price - a.price;
    case 'name_asc':   return a.name.localeCompare(b.name);
    default:           return 0;
  }
}

function render() {
  const grid = $('#grid');
  const pager = $('#pager');
  if (!grid || !pager) return;
  
  const filtered = PRODUCTS.filter(match).sort(sortFn);
  
  // Contadores
  ['brand','family','gender','type'].forEach(field => {
      const counts = filtered.reduce((acc,p)=>{ acc[p[field]]=(acc[p[field]]||0)+1; return acc;}, {});
      $$(`[data-count^="${field}:"]`).forEach(el => {
          const name=el.getAttribute('data-count').split(':')[1];
          el.textContent = counts[name] ? `(${counts[name]})` : '(0)';
      });
  });

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / state.perPage));
  if (state.page > pages) state.page = pages;
  const start = (state.page - 1) * state.perPage;
  const items = filtered.slice(start, start + state.perPage);
  
  if($('#resultCount')) $('#resultCount').textContent = `${total} resultado${total !== 1 ? 's' : ''}`;
  grid.innerHTML = items.length === 0 ? '<p class="muted">No se encontraron productos.</p>' : '';
  items.forEach(p => grid.appendChild(cardEl(p)));
  
  pager.innerHTML = '';
  if(pages > 1){
      for (let i = 1; i <= pages; i++) {
        const b = document.createElement('button');
        b.className = 'page' + (i === state.page ? ' active' : '');
        b.textContent = i;
        b.onclick = () => { state.page = i; window.scrollTo({ top: 0, behavior: 'smooth' }); render(); };
        pager.appendChild(b);
      }
  }
}

function cardEl(p) {
  const el = document.createElement('article');
  el.className = 'card';
  const discountPrice = Math.round(p.price * (1 - COMBO_DISCOUNT));
  const hasDiscount = p.listPrice && p.listPrice > p.price;

  el.innerHTML = `
    <img class="card-img" src="${p.img}" alt="${p.name}" loading="lazy">
    <div class="card-body">
      <h3 class="card-title">${p.name}</h3>
      <p class="card-sub">${p.brand} · ${p.size}</p>
      <div class="price">
        <span class="price-now">${ARS(p.price)}</span>
        ${hasDiscount ? `<span class="price-old">${ARS(p.listPrice)}</span>` : ''}
      </div>
      <div class="install">${ARS(discountPrice)} llevando 5+ (20% OFF)</div>
      <div class="cta-row">
        <button class="btn secondary" data-quick>Vista rápida</button>
        <div class="add-wrapper" id="cta-${p.id}"></div>
      </div>
    </div>
  `;
  el.querySelector('[data-quick]').onclick = () => openDetail(p);
  el.querySelector('.card-img').onclick    = () => openDetail(p);
  setTimeout(() => updateAddBox(p.id), 0);
  return el;
}

const modal = $('#detailModal');
const closeModal = $('#closeModal');
if (closeModal && modal) {
  closeModal.onclick = () => modal.close();
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.close(); });
}
function openDetail(p) {
  if (!modal) return;
  $('#mImg').src = p.img;
  $('#mName').textContent = p.name;
  $('#mBrand').textContent = `${p.brand} · ${p.size}`;
  $('#mPrice').textContent = ARS(p.price);
  if($('#mOld')) $('#mOld').textContent = p.listPrice && p.listPrice > p.price ? ARS(p.listPrice) : '';
  $('#mDesc').textContent = p.description || '';
  $('#mNotes').innerHTML = (p.notes || []).map(n => `<span class='chip'>${n}</span>`).join('');
  $('#mFamily').textContent = p.family;
  $('#mGender').textContent = p.gender;
  $('#mType').textContent   = p.type;
  const mFav = $('#mAddFav');
  if (mFav) mFav.onclick = () => alert('❤️ Agregado a favoritos');
  const msg = encodeURIComponent(`Hola! Quiero consultar por "${p.name}"`);
  $('#mWhatsApp').href = `https://wa.me/5491112345678?text=${msg}`;
  modal.showModal();
}

// =================== CARRUSEL DESTACADOS (LÓGICA) ===================
function initFeaturedCards() {
  const track = document.getElementById('featuredTrack');
  if (!track) return;

  // 1. Seleccionamos qué productos mostrar (puedes agregar más IDs aquí)
  // Agregué 'sauvage' de nuevo al final para tener al menos 4 y probar el scroll
  const featuredIds = ['sauvage', 'no5', 'lightblue', 'sauvage']; 
  
  const featuredProducts = PRODUCTS.filter(p => featuredIds.includes(p.id));
  // Si quieres mostrar TODOS los productos en el carrusel, usa:
  // const featuredProducts = PRODUCTS; 

  track.innerHTML = '';

  // 2. Crear las tarjetas dentro de wrappers para el layout flex
  featuredProducts.forEach(p => {
    const wrapper = document.createElement('div');
    wrapper.className = 'carousel-item'; // Clase clave para el ancho (25%)
    
    // Usamos la misma función cardEl que ya tienes para crear el diseño
    const card = cardEl(p);
    
    wrapper.appendChild(card);
    track.appendChild(wrapper);
  });

  // 3. Lógica de Movimiento
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  let currentIndex = 0;
  
  // Detectar cuántos items se ven según el ancho de pantalla (Responsive)
  function getItemsPerView() {
    if (window.innerWidth <= 480) return 1;
    if (window.innerWidth <= 768) return 2;
    if (window.innerWidth <= 1024) return 3;
    return 4; // Desktop: 4 items
  }

  function updateCarousel() {
    const itemsPerView = getItemsPerView();
    const totalItems = featuredProducts.length;
    
    // Calcular porcentaje a mover (ej: si hay 4 items, movemos 25% por click)
    // Pero para mover de a 1 bloque: width = 100 / itemsPerView
    const percentage = 100 / itemsPerView;
    
    track.style.transform = `translateX(-${currentIndex * percentage}%)`;
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      const itemsPerView = getItemsPerView();
      const maxIndex = featuredProducts.length - itemsPerView;
      
      if (currentIndex < maxIndex) {
        currentIndex++;
      } else {
        currentIndex = 0; // Volver al inicio (loop)
      }
      updateCarousel();
    };
  }

  if (prevBtn) {
    prevBtn.onclick = () => {
      const itemsPerView = getItemsPerView();
      const maxIndex = featuredProducts.length - itemsPerView;

      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = maxIndex; // Ir al final (loop)
      }
      updateCarousel();
    };
  }
  
  // Actualizar si cambian el tamaño de ventana
  window.addEventListener('resize', () => {
    currentIndex = 0;
    updateCarousel();
  });
}

// =================== NAVEGACIÓN + ANIMACIÓN AVIÓN ===================
const homePage     = $('#homePage');
const catalogPage  = $('#catalogPage');
const bread        = $('.bread');
const navHome      = $('#navHome');
const navCatalog   = $('#navCatalog');
const goProductsBtn = $('#goProductsBtn');
const mainMenu     = $('.main-menu');

// --- BOTÓN VER PRODUCTOS (Con animación) ---
// --- 1. CLICK EN "VER PRODUCTOS" (Solo vuela el avión) ---
if (goProductsBtn) {
  goProductsBtn.onclick = (e) => {
    e.preventDefault(); 
    
    // Buscamos específicamente la capa del avión por su ID
    const plane = document.getElementById('flyingPlane');
    
    if (plane) {
      // Le ponemos la clase que lo mueve en el CSS
      plane.classList.add('fly-away');
      
      // Esperamos a que termine la animación antes de cambiar de sección
      setTimeout(() => {
        showCatalog();
      }, 800);
    } else {
      // Fallback: Si no existe el ID, cambia directo
      showCatalog();
    }
  };
}

// --- 2. FUNCIÓN MOSTRAR INICIO (Restaura el avión) ---
function showHome(e) {
  if (e) e.preventDefault();
  homePage.classList.remove('hidden');
  catalogPage.classList.add('hidden');
  if (bread) bread.style.display = 'none';
  if (navHome) navHome.classList.add('active');
  if (navCatalog) navCatalog.classList.remove('active');
  
  // RESTAURAR EL AVIÓN A SU LUGAR ORIGINAL
  const plane = document.getElementById('flyingPlane');
  if(plane) {
    plane.classList.remove('fly-away');
  }

  window.scrollTo({ top: 0 });
  closeMobileMenu();
}

function showCatalog(e) {
  if (e) e.preventDefault();
  homePage.classList.add('hidden');
  catalogPage.classList.remove('hidden');
  if (bread) bread.style.display = 'block';
  if (navHome) navHome.classList.remove('active');
  if (navCatalog) navCatalog.classList.add('active');
  window.scrollTo({ top: 0 });
  closeMobileMenu();
}

const mobileBtn = $('#mobileMenuBtn');
if (mobileBtn && mainMenu) {
    mobileBtn.onclick = () => {
        mainMenu.classList.toggle('open');
        mobileBtn.textContent = mainMenu.classList.contains('open') ? '✕' : '☰';
    };
}
function closeMobileMenu() {
    if(mainMenu) mainMenu.classList.remove('open');
    if(mobileBtn) mobileBtn.textContent = '☰';
}

// Listeners generales
if (navHome)    navHome.onclick = showHome;
if (navCatalog) navCatalog.onclick = showCatalog;


// =================== INICIALIZACIÓN ===================
function init() {
    initFilters();
    
    const slider = $('#priceRange');
    if (slider) {
        slider.max = MAX_PRODUCT_PRICE;
        slider.value = MAX_PRODUCT_PRICE;
        if($('#maxPrice')) $('#maxPrice').textContent = ARS(MAX_PRODUCT_PRICE);
        state.maxPrice = MAX_PRODUCT_PRICE;
    }

    render();
    renderCart();
    initFeaturedCards();
    showHome();
}

init();
