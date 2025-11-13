// =================== DATOS ===================
// Agregá listPrice si querés mostrar descuento.
const PRODUCTS = [
  { id:"sauvage", name:"Dior Sauvage EDT", brand:"Dior", family:"Aromático Fougère", gender:"Hombre", type:"EDT", notes:["Bergamota","Pimienta","Ambroxan"], price:145000, listPrice:180000, size:"100 ml", img:"assets/sauvage.jpg", description:"Fresco y vibrante, mezcla cítrica especiada con un fondo ambarado limpio." },
  { id:"no5", name:"Chanel N°5 EDP", brand:"Chanel", family:"Floral Aldehídica", gender:"Mujer", type:"EDP", notes:["Ylang-Ylang","Jazmín","Aldehídos","Sándalo"], price:210000, listPrice:210000, size:"100 ml", img:"assets/chanel-no5.jpg", description:"Icono atemporal: bouquet floral sofisticado con fondo cremoso." },
  { id:"lightblue", name:"Dolce & Gabbana Light Blue", brand:"Dolce & Gabbana", family:"Cítrico Frutal", gender:"Mujer", type:"EDT", notes:["Limón","Manzana","Cedro"], price:118000, listPrice:140000, size:"100 ml", img:"assets/lightblue.jpg", description:"Brillante y veraniega, cítrica con toques frutales y madera clara." }
];

// precio máximo del catálogo (para el filtro "Hasta")
const MAX_PRICE = Math.max(...PRODUCTS.map(p => p.price));

// =================== UTILS ===================
const $  = s=>document.querySelector(s);
const $$ = s=>[...document.querySelectorAll(s)];
const ARS = n=> n.toLocaleString('es-AR',{style:'currency', currency:'ARS', maximumFractionDigits:0});
const pct = (oldp, p)=> oldp && oldp>p ? Math.round((1 - p/oldp)*100) : 0;
const cuotasN = 6; // 6 cuotas
const envioGratisMin = 200000;

// Wishlist localStorage
const WL_KEY = 'wishlist_perfumes';
const getWL = ()=> new Set(JSON.parse(localStorage.getItem(WL_KEY)||'[]'));
const setWL = (set)=> localStorage.setItem(WL_KEY, JSON.stringify([...set]));

// Estado filtros / grilla
const state = { 
  q:"", 
  sort:"rel", 
  maxPrice: MAX_PRICE,
  brands:new Set(), 
  families:new Set(), 
  genders:new Set(), 
  types:new Set(), 
  page:1, 
  perPage:12 
};

// =================== CARRITO ===================
let CART = [];

function renderCart(){
  const box = $('#cartItems');
  const totalEl = $('#cartTotal');
  const subtotalEl = $('#cartSubtotal');
  const discountRow = $('#cartDiscountRow');
  const discountEl = $('#cartDiscount');
  box.innerHTML = '';

  let subtotal = 0;
  let totalQty = 0;

  CART.forEach(item=>{
    subtotal += item.price * item.qty;
    totalQty += item.qty;

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

  // 🧮 Descuento 20% si hay 5 o más fragancias
  let discount = 0;
  if (totalQty >= 5){
    discount = Math.round(subtotal * 0.20);
  }
  const total = subtotal - discount;

  // Mostrar subtotal / descuento / total
  if(subtotalEl) subtotalEl.textContent = ARS(subtotal);
  if(discountRow && discountEl){
    if(discount > 0){
      discountRow.style.display = 'flex';
      discountEl.textContent = '-' + ARS(discount);
    }else{
      discountRow.style.display = 'none';
    }
  }
  totalEl.textContent = ARS(total);

  // Badge del carrito
  const badge = $('#cartCount');
  if(badge){
    if(totalQty>0){
      badge.style.display = 'inline-block';
      badge.textContent = totalQty;
    }else{
      badge.style.display = 'none';
    }
  }
}


function updateQty(id, delta){
  const item = CART.find(p=>p.id===id);
  if(!item) return;

  item.qty += delta;
  if(item.qty <= 0){
    CART = CART.filter(p=>p.id!==id);
  }

  renderCart();
  updateAddBox(id);
}

function addToCart(product){
  const found = CART.find(p=>p.id===product.id);
  if(found){
    found.qty++;
  }else{
    CART.push({...product, qty:1});
  }
  renderCart();
}

function activateAdd(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;

  addToCart(p);
  updateAddBox(id);
}

// sincronzar [- 1 +] en la card con el carrito
function updateAddBox(id){
  const wrapper = document.getElementById("cta-" + id);
  if(!wrapper) return;

  const item = CART.find(i => i.id === id);

  if(!item){
    // volver a mostrar botón Agregar
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

// Abrir / cerrar carrito
const cartSidebar = $('#cartSidebar');
const cartBackdrop = $('#cartBackdrop');

$('#openCart').addEventListener('click', ()=>{
  cartSidebar.classList.add('open');
  cartBackdrop.classList.add('show');
});

$('#closeCart').addEventListener('click', ()=>{
  cartSidebar.classList.remove('open');
  cartBackdrop.classList.remove('show');
});

$('#keepShopping').addEventListener('click', ()=>{
  cartSidebar.classList.remove('open');
  cartBackdrop.classList.remove('show');
});

cartBackdrop.addEventListener('click', ()=>{
  cartSidebar.classList.remove('open');
  cartBackdrop.classList.remove('show');
});

// =================== INIT FILTER LISTS ===================
function optionsFrom(field){
  return [...new Set(PRODUCTS.map(p=>p[field]).filter(Boolean))].sort();
}

function checks(list, target, group){
  target.innerHTML = '';
  list.forEach(name=>{
    const id = `${group}-${name}`.replace(/\s+/g,'-');
    const div = document.createElement('label');
    div.className = 'check';
    div.innerHTML = `<input type="checkbox" id="${id}"><span>${name}</span> <span class="count" data-count="${group.slice(0,-1)}:${name}"></span>`;
    target.appendChild(div);
    div.querySelector('input').addEventListener('change', (e)=>{
      const set = state[group];
      e.target.checked ? set.add(name) : set.delete(name);
      state.page = 1; 
      render();
    });
  });
}

function initFilters(){
  // 🔹 Configuro el slider con el valor máximo real
  const slider = $('#priceRange');
  slider.max = MAX_PRICE;
  slider.value = MAX_PRICE;
  $('#maxPrice').textContent = ARS(MAX_PRICE);
  state.maxPrice = MAX_PRICE;

  // checkboxes
  checks(optionsFrom('brand'),  $('#brandList'),  'brands');
  checks(optionsFrom('family'), $('#familyList'), 'families');
  checks(optionsFrom('gender'), $('#genderList'), 'genders');
  checks(optionsFrom('type'),   $('#typeList'),   'types');

  // búsqueda
  $('#q').addEventListener('input', e=>{
    state.q = e.target.value.trim().toLowerCase();
    state.page = 1;
    render();
  });

  // orden
  $('#sort').addEventListener('change', e=>{
    state.sort = e.target.value;
    state.page = 1;
    render();
  });

  // slider de precio "Hasta"
  slider.addEventListener('input', e=>{
    state.maxPrice = +e.target.value;
    $('#maxPrice').textContent = ARS(state.maxPrice);
    state.page = 1;
    render();
  });

  // limpiar filtros
  $('#clearAll').addEventListener('click', ()=>{
    state.q = '';
    state.sort = 'rel';
    state.maxPrice = MAX_PRICE;
    state.brands.clear();
    state.families.clear();
    state.genders.clear();
    state.types.clear();
    state.page = 1;

    $('input[type="search"]').value = '';
    slider.value = MAX_PRICE;
    $('#maxPrice').textContent = ARS(MAX_PRICE);

    render();
  });

  $('#subscribe').addEventListener('click', ()=>{ 
    alert('¡Gracias por suscribirte!'); 
  });
}

// =================== MATCH + SORT + PAGINATE ===================
function match(p){
  const q = state.q;
  const inTxt = s => (s||'').toLowerCase().includes(q);
  const notes = (p.notes||[]).join(' ').toLowerCase();
  const qOk = !q || inTxt(p.name) || inTxt(p.brand) || inTxt(p.family) || inTxt(notes);
  const priceOk = p.price <= state.maxPrice;
  const bOk = state.brands.size===0   || state.brands.has(p.brand);
  const fOk = state.families.size===0 || state.families.has(p.family);
  const gOk = state.genders.size===0  || state.genders.has(p.gender);
  const tOk = state.types.size===0    || state.types.has(p.type);
  return qOk && priceOk && bOk && fOk && gOk && tOk;
}

function sortFn(a,b){
  switch(state.sort){
    case 'price_asc':     return a.price - b.price;
    case 'price_desc':    return b.price - a.price;
    case 'name_asc':      return a.name.localeCompare(b.name);
    case 'discount_desc': return pct(a.listPrice,a.price) < pct(b.listPrice,b.price) ? 1 : -1;
    default:              return 0;
  }
}

// =================== RENDER ===================
const grid  = $('#grid');
const pager = $('#pager');

function render(){
  const filtered = PRODUCTS.filter(match).sort(sortFn);

  // counts por facet
  ['brand','family','gender','type'].forEach(field=>{
    const counts = Object.fromEntries(filtered.reduce((m,p)=>{
      m.set(p[field], (m.get(p[field])||0)+1 ); 
      return m; 
    }, new Map()));
    $$(`[data-count^="${field}:"]`).forEach(el=>{
      const name = el.getAttribute('data-count').split(':')[1];
      el.textContent = counts[name] ? `(${counts[name]})` : '(0)';
    });
  });

  // chips activos
  const chips = [];
  if(state.q) chips.push({k:'q', v:`Buscar: ${state.q}`});
  if(state.maxPrice < MAX_PRICE){
    chips.push({k:'maxPrice', v:`Hasta ${ARS(state.maxPrice)}`});
  }
  state.brands.forEach(v=>chips.push({k:'brands',v}));
  state.families.forEach(v=>chips.push({k:'families',v}));
  state.genders.forEach(v=>chips.push({k:'genders',v}));
  state.types.forEach(v=>chips.push({k:'types',v}));

  const chipsDiv = $('#activeChips'); 
  chipsDiv.innerHTML='';
  chips.forEach(ch=>{
    const span = document.createElement('span');
    span.className = 'chip';
    span.innerHTML = `${ch.v} <button aria-label="Quitar">×</button>`;
    span.querySelector('button').onclick = ()=>{
      if(ch.k === 'q') {
        state.q = '';
      } else if (ch.k === 'maxPrice') {
        state.maxPrice = MAX_PRICE;
        const slider = $('#priceRange');
        slider.value = MAX_PRICE;
        $('#maxPrice').textContent = ARS(MAX_PRICE);
      } else {
        state[ch.k].delete(ch.v);
      }
      render();
    };
    chipsDiv.appendChild(span);
  });

  // paginación
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total/state.perPage));
  if(state.page>pages) state.page = pages;
  const start = (state.page-1)*state.perPage;
  const items = filtered.slice(start, start+state.perPage);

  $('#resultCount').textContent = `${total} resultado${total!==1?'s':''}`;

  grid.innerHTML = '';
  if(items.length===0){ 
    grid.innerHTML = '<p class="muted">No se encontraron productos.</p>'; 
  }
  items.forEach(p=> grid.appendChild(cardEl(p)) );

  // pager
  pager.innerHTML = '';
  for(let i=1;i<=pages;i++){
    const b = document.createElement('button');
    b.className='page'+(i===state.page?' active':'');
    b.textContent=i;
    b.onclick=()=>{state.page=i; window.scrollTo({top:0, behavior:'smooth'}); render();};
    pager.appendChild(b);
  }

  // wishlist badge (si existe)
  const wl = getWL();
  const c = wl.size; 
  const wb = $('#wishCount');
  if(wb){
    wb.style.display = c? 'inline-block':'none';
    wb.textContent = c;
  }
}

// =================== CARD ===================
function cardEl(p){
  const el = document.createElement('article');
  el.className = 'card';
  const d = pct(p.listPrice, p.price);
  const free = p.price >= envioGratisMin;

  el.innerHTML = `
    <img class="card-img" src="${p.img}" alt="${p.name}" loading="lazy">
    <div class="card-body">
      <h3 class="card-title">${p.name}</h3>
      <p class="card-sub">${p.brand} · ${p.size}</p>
      <div class="price">
        <span class="price-now">${ARS(p.price)}</span>
        ${d?`<span class="price-old">${ARS(p.listPrice)}</span>`:''}
      </div>
      <div class="install">
      ${ARS(Math.round(p.price * 0.8))} llevando 5+ combinable (20%off)
      </div>
      <div class="cta-row">
        <button class="btn secondary" data-quick>Vista rápida</button>
        <div class="add-wrapper" id="cta-${p.id}">
          <button class="btn" onclick="activateAdd('${p.id}')">Agregar</button>
        </div>
      </div>
    </div>
  `;

  // wishlist state
  const wl = getWL();
  const wbtn = el.querySelector('.wish');
  if(wl.has(p.id)) wbtn.classList.add('active');
  wbtn.onclick = ()=>{ 
    const set = getWL(); 
    set.has(p.id)? set.delete(p.id): set.add(p.id); 
    setWL(set); 
    render(); 
  };

  // quick view
  el.querySelector('[data-quick]').onclick = ()=> openDetail(p);

  // click en imagen/título abre modal
  el.querySelector('.card-img').onclick = ()=> openDetail(p);
  el.querySelector('.card-title').onclick = ()=> openDetail(p);

  return el;
}

// =================== MODAL ===================
const modal = document.getElementById('detailModal');
const closeModal = document.getElementById('closeModal');
closeModal.addEventListener('click', ()=> modal.close());

function openDetail(p){
  $('#mImg').src = p.img;
  $('#mImg').alt = p.name;
  $('#mName').textContent = p.name;
  $('#mBrand').textContent = `${p.brand} · ${p.size}`;
  $('#mPrice').textContent = ARS(p.price);
  $('#mOld').textContent = p.listPrice && p.listPrice>p.price ? ARS(p.listPrice) : '';
  $('#mInstall').textContent = `${ARS(Math.round(p.price * 0.8))} llevando 5+ combinable (20%off)`;
  $('#mDesc').textContent = p.description || '';
  $('#mNotes').innerHTML = (p.notes||[]).map(n=>`<span class='chip'>${n}</span>`).join('');
  $('#mFamily').textContent = p.family;
  $('#mGender').textContent = p.gender;
  $('#mType').textContent = p.type;

  const mFav = $('#mAddFav');
  mFav.onclick = ()=>{ 
    const set = getWL(); 
    set.has(p.id)? set.delete(p.id): set.add(p.id); 
    setWL(set); 
    render(); 
  };

  const msg = encodeURIComponent(`Hola! Quiero consultar por "${p.name}" (${p.size}) - ${ARS(p.price)}`);
  const phone = '5491112345678'; // <-- TU NÚMERO
  $('#mWhatsApp').href = `https://wa.me/${phone}?text=${msg}`;

  modal.showModal();
}

// =================== START ===================
initFilters();
render();
renderCart(); // para inicializar badge en 0

