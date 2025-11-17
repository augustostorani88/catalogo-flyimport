// =================== DATOS ===================
// Agregá listPrice si querés mostrar precio tachado.
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
  }
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
const pct = (oldp, p) =>
  oldp && oldp > p ? Math.round((1 - p / oldp) * 100) : 0;

// descuento combo 5+
const COMBO_DISCOUNT = 0.20; // 20%

// wishlist (solo se usa en el modal, el corazón ya no existe en las cards)
const WL_KEY = 'wishlist_perfumes';
const getWL = () => new Set(JSON.parse(localStorage.getItem(WL_KEY) || '[]'));
const setWL = (set) => localStorage.setItem(WL_KEY, JSON.stringify([...set]));

// =================== ESTADO LISTA ===================
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
        <span>${ARS(item.price)}</span>
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

  // texto total
  let totalText = ARS(total);
  if (discount > 0) {
    totalText += ` (Subtotal ${ARS(subtotal)} – Descuento 20% por ${totalQty} perfumes: -${ARS(discount)})`;
  }
  totalEl.textContent = totalText;

  // badge carrito
  const count = totalQty;
  const badge = $('#cartCount');
  if (badge) {
    if (count > 0) {
      badge.style.display = 'inline-block';
      badge.textContent = count;
    } else {
      badge.style.display = 'none';
    }
  }

  // actualizar cajas [- 1 +] en cards
  CART.forEach(item => updateAddBox(item.id));
}

function updateQty(id, delta) {
  const item = CART.find(p => p.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    CART = CART.filter(p => p.id !== id);
  }

  // si se eliminó del carrito, volver botón "Agregar" en card
  const wrapper = document.getElementById('cta-' + id);
  if (wrapper && !CART.find(p => p.id === id)) {
    wrapper.innerHTML = `<button class="btn" onclick="activateAdd('${id}')">Agregar</button>`;
  }

  renderCart();
  updateAddBox(id);
}

function addToCart(product, qty = 1) {
  const found = CART.find(p => p.id === product.id);
  if (found) {
    found.qty += qty;
  } else {
    CART.push({ ...product, qty });
  }
  renderCart();
}

function activateAdd(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  addToCart(p, 1);

  const wrapper = document.getElementById('cta-' + id);
  const item = CART.find(i => i.id === id);
  const qty = item ? item.qty : 1;

  if (wrapper) {
    wrapper.innerHTML = `
      <div class="add-box">
        <button onclick="updateQty('${id}', -1)">−</button>
        <span>${qty}</span>
        <button onclick="updateQty('${id}', 1)">+</button>
      </div>
    `;
  }
}

function updateAddBox(id) {
  const wrapper = document.getElementById("cta-" + id);
  if (!wrapper) return;

  const item = CART.find(i => i.id === id);
  if (!item) {
    wrapper.innerHTML = `<button class="btn" onclick="activateAdd('${id}')">Agregar</button>`;
    return;
  }

  wrapper.innerHTML = `
    <div class="add-box">
      <button onclick="updateQty('${id}', -1)">−</button>
      <span>${item.qty}</span>
      <button onclick="updateQty('${id}', 1)">+</button>
    </div>
  `;
}

// Carrito lateral
const cartSidebar  = $('#cartSidebar');
const cartBackdrop = $('#cartBackdrop');

if ($('#openCart')) {
  $('#openCart').addEventListener('click', () => {
    if (!cartSidebar || !cartBackdrop) return;
    cartSidebar.classList.add('open');
    cartBackdrop.classList.add('show');
  });
}
if ($('#closeCart')) {
  $('#closeCart').addEventListener('click', () => {
    if (!cartSidebar || !cartBackdrop) return;
    cartSidebar.classList.remove('open');
    cartBackdrop.classList.remove('show');
  });
}
if ($('#keepShopping')) {
  $('#keepShopping').addEventListener('click', () => {
    if (!cartSidebar || !cartBackdrop) return;
    cartSidebar.classList.remove('open');
    cartBackdrop.classList.remove('show');
  });
}
if (cartBackdrop) {
  cartBackdrop.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
    cartBackdrop.classList.remove('show');
  });
}
if ($('#buyNow')) {
  $('#buyNow').addEventListener('click', () => {
    alert('Esta es una demo de catálogo 🙂');
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

  const qInput = $('#q');
  if (qInput) {
    qInput.addEventListener('input', e => {
      state.q = e.target.value.trim().toLowerCase();
      state.page = 1;
      render();
    });
  }

  const sortSel = $('#sort');
  if (sortSel) {
    sortSel.addEventListener('change', e => {
      state.sort = e.target.value;
      state.page = 1;
      render();
    });
  }

  const range = $('#priceRange');
  if (range) {
    range.addEventListener('input', e => {
      state.maxPrice = +e.target.value;
      const label = $('#maxPrice');
      if (label) label.textContent = ARS(state.maxPrice);
      state.page = 1;
      render();
    });
  }

  const clearAll = $('#clearAll');
  if (clearAll) {
    clearAll.addEventListener('click', () => {
      state.q = '';
      state.sort = 'rel';
      state.maxPrice = MAX_PRODUCT_PRICE;
      state.brands.clear();
      state.families.clear();
      state.genders.clear();
      state.types.clear();
      state.page = 1;

      const searchInput = $('#q');
      if (searchInput) searchInput.value = '';

      const slider = $('#priceRange');
      if (slider) slider.value = MAX_PRODUCT_PRICE;
      const label = $('#maxPrice');
      if (label) label.textContent = ARS(MAX_PRODUCT_PRICE);

      $$('input[type="checkbox"]').forEach(ch => ch.checked = false);

      render();
    });
  }

  const subBtn = $('#subscribe');
  if (subBtn) {
    subBtn.addEventListener('click', () => {
      alert('¡Gracias por suscribirte!');
    });
  }
}

// =================== MATCH + SORT + PAGINAR ===================
function match(p) {
  const q = state.q;
  const inTxt = s => (s || '').toLowerCase().includes(q);
  const notes = (p.notes || []).join(' ').toLowerCase();
  const qOk = !q || inTxt(p.name) || inTxt(p.brand) || inTxt(p.family) || inTxt(notes);
  const priceOk = p.price <= state.maxPrice;
  const bOk = state.brands.size === 0   || state.brands.has(p.brand);
  const fOk = state.families.size === 0 || state.families.has(p.family);
  const gOk = state.genders.size === 0  || state.genders.has(p.gender);
  const tOk = state.types.size === 0    || state.types.has(p.type);
  return qOk && priceOk && bOk && fOk && gOk && tOk;
}

function sortFn(a, b) {
  switch (state.sort) {
    case 'price_asc':  return a.price - b.price;
    case 'price_desc': return b.price - a.price;
    case 'name_asc':   return a.name.localeCompare(b.name);
    default:           return 0;
  }
}

// =================== RENDER GRID ===================
const grid  = $('#grid');
const pager = $('#pager');

function render() {
  if (!grid || !pager) return;

  const filtered = PRODUCTS.filter(match).sort(sortFn);

  // counts por facet
  ['brand', 'family', 'gender', 'type'].forEach(field => {
    const counts = Object.fromEntries(filtered.reduce((m, p) => {
      m.set(p[field], (m.get(p[field]) || 0) + 1);
      return m;
    }, new Map()));
    $$(`[data-count^="${field}:"]`).forEach(el => {
      const name = el.getAttribute('data-count').split(':')[1];
      el.textContent = counts[name] ? `(${counts[name]})` : '(0)';
    });
  });

  // chips
  const chips = [];
  if (state.q) chips.push({ k: 'q', v: `Buscar: ${state.q}` });
  chips.push({ k: 'maxPrice', v: `Hasta ${ARS(state.maxPrice)}` });
  state.brands.forEach(v => chips.push({ k: 'brands', v }));
  state.families.forEach(v => chips.push({ k: 'families', v }));
  state.genders.forEach(v => chips.push({ k: 'genders', v }));
  state.types.forEach(v => chips.push({ k: 'types', v }));

  const chipsDiv = $('#activeChips');
  if (chipsDiv) {
    chipsDiv.innerHTML = '';
    chips.forEach(ch => {
      const span = document.createElement('span');
      span.className = 'chip';
      span.innerHTML = `${ch.v} <button aria-label="Quitar">×</button>`;
      span.querySelector('button').onclick = () => {
        if (ch.k === 'q') {
          state.q = '';
          const qInput = $('#q');
          if (qInput) qInput.value = '';
        } else if (ch.k === 'maxPrice') {
          state.maxPrice = MAX_PRODUCT_PRICE;
          const slider = $('#priceRange');
          if (slider) slider.value = MAX_PRODUCT_PRICE;
          const label = $('#maxPrice');
          if (label) label.textContent = ARS(MAX_PRODUCT_PRICE);
        } else {
          state[ch.k].delete(ch.v);
          // desmarcar checkbox
          $$(`input[type="checkbox"]`).forEach(inp => {
            if (inp.parentElement && inp.parentElement.textContent.trim().startsWith(ch.v)) {
              inp.checked = false;
            }
          });
        }
        render();
      };
      chipsDiv.appendChild(span);
    });
  }

  // paginación
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / state.perPage));
  if (state.page > pages) state.page = pages;
  const start = (state.page - 1) * state.perPage;
  const items = filtered.slice(start, start + state.perPage);

  const resultCount = $('#resultCount');
  if (resultCount) {
    resultCount.textContent = `${total} resultado${total !== 1 ? 's' : ''}`;
  }

  grid.innerHTML = '';
  if (items.length === 0) {
    grid.innerHTML = '<p class="muted">No se encontraron productos.</p>';
  }
  items.forEach(p => grid.appendChild(cardEl(p)));

  pager.innerHTML = '';
  for (let i = 1; i <= pages; i++) {
    const b = document.createElement('button');
    b.className = 'page' + (i === state.page ? ' active' : '');
    b.textContent = i;
    b.onclick = () => {
      state.page = i;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      render();
    };
    pager.appendChild(b);
  }
}

// =================== CARD ===================
function cardEl(p) {
  const el = document.createElement('article');
  el.className = 'card';

  const discountPrice = Math.round(p.price * (1 - COMBO_DISCOUNT));

  el.innerHTML = `
    <img class="card-img" src="${p.img}" alt="${p.name}" loading="lazy">
    <div class="card-body">
      <h3 class="card-title">${p.name}</h3>
      <p class="card-sub">${p.brand} · ${p.size}</p>
      <div class="price">
        <span class="price-now">${ARS(p.price)}</span>
        ${p.listPrice && p.listPrice > p.price ? `<span class="price-old">${ARS(p.listPrice)}</span>` : ''}
      </div>
      <div class="install">
        ${ARS(discountPrice)} llevando 5+ combinable (20%off)
      </div>
      <div class="cta-row">
        <button class="btn secondary" data-quick>Vista rápida</button>
        <div class="add-wrapper" id="cta-${p.id}">
          <button class="btn" onclick="activateAdd('${p.id}')">Agregar</button>
        </div>
      </div>
    </div>
  `;

  // quick view
  el.querySelector('[data-quick]').onclick = () => openDetail(p);

  // click en imagen/título abre modal
  el.querySelector('.card-img').onclick   = () => openDetail(p);
  el.querySelector('.card-title').onclick = () => openDetail(p);

  return el;
}

// =================== MODAL ===================
const modal      = $('#detailModal');
const closeModal = $('#closeModal');

if (closeModal && modal) {
  closeModal.addEventListener('click', () => modal.close());
}

function openDetail(p) {
  if (!modal) return;

  $('#mImg').src = p.img;
  $('#mImg').alt = p.name;
  $('#mName').textContent = p.name;
  $('#mBrand').textContent = `${p.brand} · ${p.size}`;
  $('#mPrice').textContent = ARS(p.price);
  const oldEl = $('#mOld');
  if (oldEl) {
    oldEl.textContent = p.listPrice && p.listPrice > p.price ? ARS(p.listPrice) : '';
  }
  $('#mDesc').textContent = p.description || '';
  $('#mNotes').innerHTML = (p.notes || []).map(n => `<span class='chip'>${n}</span>`).join('');
  $('#mFamily').textContent = p.family;
  $('#mGender').textContent = p.gender;
  $('#mType').textContent   = p.type;

  const mFav = $('#mAddFav');
  if (mFav) {
    mFav.onclick = () => {
      const set = getWL();
      if (set.has(p.id)) set.delete(p.id);
      else set.add(p.id);
      setWL(set);
      alert('Favoritos guardados en tu navegador 🙂');
    };
  }

  const msg = encodeURIComponent(`Hola! Quiero consultar por "${p.name}" (${p.size}) - ${ARS(p.price)}`);
  const phone = '5491112345678'; // ← poné tu número real
  $('#mWhatsApp').href = `https://wa.me/${phone}?text=${msg}`;

  modal.showModal();
}

// =================== HOME vs CATÁLOGO ===================
const homePage   = $('#homePage');
const catalogPage = $('#catalogPage');
const bread      = $('.bread');
const navHome    = $('#navHome');
const navCatalog = $('#navCatalog');

function showHome(e) {
  if (e) e.preventDefault();
  if (homePage)   homePage.classList.remove('hidden');
  if (catalogPage) catalogPage.classList.add('hidden');
  if (bread)       bread.style.display = 'none';
  if (navHome)     navHome.classList.add('active');
  if (navCatalog)  navCatalog.classList.remove('active');
  window.scrollTo({ top: 0 });
}

function showCatalog(e) {
  if (e) e.preventDefault();
  if (homePage)   homePage.classList.add('hidden');
  if (catalogPage) catalogPage.classList.remove('hidden');
  if (bread)       bread.style.display = 'block';
  if (navHome)     navHome.classList.remove('active');
  if (navCatalog)  navCatalog.classList.add('active');
  window.scrollTo({ top: 0 });
}

if (navHome)    navHome.addEventListener('click', showHome);
if (navCatalog) navCatalog.addEventListener('click', showCatalog);

// botón "Ver productos" del hero
const goProductsBtn = $('#goProductsBtn');
if (goProductsBtn) {
  goProductsBtn.addEventListener('click', showCatalog);
}

// =================== INTEGRAR DESTACADOS HOME ===================
function initFeaturedCards() {
  const cards = $$('.featured-card');
  cards.forEach(card => {
    const nameEl = card.querySelector('.featured-name');
    const qtyEl  = card.querySelector('.featured-qty-value');
    const minus  = card.querySelectorAll('.featured-qty-btn')[0];
    const plus   = card.querySelectorAll('.featured-qty-btn')[1];
    const addBtn = card.querySelector('.featured-add-btn');

    if (!nameEl || !qtyEl || !minus || !plus || !addBtn) return;

    const prod = PRODUCTS.find(p => p.name === nameEl.textContent.trim());
    if (!prod) return;

    let qty = 1;
    qtyEl.textContent = qty;

    minus.addEventListener('click', () => {
      qty = Math.max(1, qty - 1);
      qtyEl.textContent = qty;
    });

    plus.addEventListener('click', () => {
      qty += 1;
      qtyEl.textContent = qty;
    });

    addBtn.addEventListener('click', () => {
      addToCart(prod, qty);
      showCatalog(); // opcional: te lleva al catálogo
    });
  });
}

// =================== START ===================
initFilters();

// slider de precio
const slider = $('#priceRange');
if (slider) {
  slider.max   = MAX_PRODUCT_PRICE;
  slider.value = MAX_PRODUCT_PRICE;
  const label = $('#maxPrice');
  if (label) label.textContent = ARS(MAX_PRODUCT_PRICE);
  state.maxPrice = MAX_PRODUCT_PRICE;
}

render();
renderCart();
initFeaturedCards();
showHome(); // arrancar en la Home
