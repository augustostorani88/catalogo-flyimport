<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Catálogo de Perfumes</title>
  <meta name="description" content="Catálogo de perfumes: marcas, familias olfativas, notas y precios." />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="styles.css">
</head>

<body>
  <!-- Promo strip -->
  <div class="promo">
    <div class="promo-inner">
      <span>💥 <b>HOT SALE</b>: 10% OFF extra con código <b>JOTAfumaFINO</b></span>
      <span>·</span>
      <span>🚚 Envío gratis desde $200.000</span>
      <span>·</span>
      <span>💳 Hasta 6 cuotas sin interés</span>
    </div>
  </div>

  <!-- Header -->
  <header class="nav">
    <div class="nav-inner">
        <div class="brand">
        <img src="assets/logo.svg" alt="" onerror="this.style.display='none'">
        <span>Catálogo de Perfumes</span>
        </div>

        <label class="search">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M21 21l-4.35-4.35" stroke="#9ca3af" stroke-width="2" stroke-linecap="round"/>
            <circle cx="11" cy="11" r="7" stroke="#9ca3af" stroke-width="2"/>
        </svg>
        <input id="q" type="search" placeholder="Buscar perfumes..." autocomplete="off"/>
        </label>

        <!-- 🔥 REEMPLAZO FAVORITOS + FILTROS POR ESTO -->
        <button id="openCart" class="icon-btn">
        🛒 Carrito <span id="cartCount" class="icon-badge" style="display:none">0</span>
        </button>
    </div>
  </header>

  <!-- Breadcrumb -->
  <div class="bread">Inicio / Fragancias</div>

  <!-- Main layout -->
  <section class="layout">
    <!-- Sidebar filters -->
    <aside>
      <div class="filters-card" id="filters">
        <div class="f-head">
          <div class="f-title">Filtrar</div>
          <button class="f-clear" id="clearAll" title="Limpiar filtros">Limpiar</button>
        </div>
        <div class="chips" id="activeChips"></div>

        <div class="f-sec">
          <h4>Precio</h4>
          <div class="range">
            <input id="priceRange" type="range" min="0" max="" step="1000" value="">
            <div class="minmax">Hasta <span id="maxPrice">$400.000</span></div>
          </div>
        </div>

        <div class="f-sec" id="fBrands"><h4>Marca</h4><div id="brandList"></div></div>
        <div class="f-sec" id="fFamilies"><h4>Familia</h4><div id="familyList"></div></div>
        <div class="f-sec" id="fGender"><h4>Género</h4><div id="genderList"></div></div>
        <div class="f-sec" id="fType"><h4>Tipo</h4><div id="typeList"></div></div>
      </div>
    </aside>

    <!-- Content -->
    <div>
      <div class="bar">
        <div id="resultCount">0 resultados</div>
        <select id="sort" class="sort">
          <option value="rel">Orden: Relevancia</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="price_desc">Precio: mayor a menor</option>
          <option value="name_asc">Nombre A→Z</option>
          <option value="discount_desc">Descuento</option>
        </select>
      </div>

      <div class="grid" id="grid"></div>
      <div class="pager" id="pager"></div>
    </div>
  </section>

  <!-- Modal Detalle -->
  <dialog id="detailModal">
    <div class="modal-card">
      <button id="closeModal" class="close">×</button>
      <div class="modal-body">
        <img id="mImg" alt="">
        <div>
          <h2 id="mName"></h2>
          <p id="mBrand" class="muted"></p>
          <div class="price" style="margin:10px 0">
            <span id="mPrice" class="price-now"></span>
            <span id="mOld" class="price-old"></span>
          </div>
          <div id="mInstall" class="install"></div>
          <p id="mDesc" style="margin-top:8px"></p>
          <div class="chips" id="mNotes"></div>
          <div class="chips">
            <span id="mFamily" class="chip"></span>
            <span id="mGender" class="chip"></span>
            <span id="mType" class="chip"></span>
          </div>
          <div class="cta-row">
            <button id="mAddFav" class="btn secondary">❤️ Favorito</button>
            <a id="mWhatsApp" class="btn" target="_blank" rel="noopener">Consultar por WhatsApp</a>
          </div>
        </div>
      </div>
    </div>
  </dialog>

  <!-- Footer -->
  <footer class="footer">
    <div class="footer-inner">
      <div>
        <h4>Suscribite al newsletter</h4>
        <p class="muted">Descuentos y lanzamientos exclusivos.</p>
        <div class="newsletter">
          <input id="email" type="email" placeholder="tu@email.com"/>
          <button id="subscribe">Suscribirme</button>
        </div>
      </div>
      <div>
        <h4>Ayuda</h4>
        <div class="trust">
          <span>📦 Cambios y devoluciones</span>
          <span>🔒 Compras seguras</span>
          <span>📞 Contacto</span>
        </div>
      </div>
      <div>
        <h4>Medios</h4>
        <div class="trust">
          <span>💳 Tarjetas</span>
          <span>💵 Transferencia</span>
          <span>🏦 Billeteras</span>
        </div>
      </div>
    </div>
  </footer>


<!-- 🛒 SIDEBAR CARRITO -->
<aside id="cartSidebar" class="cart-sidebar">
  <div class="cart-header">
    <h2>Mi carrito de compra</h2>
    <button id="closeCart">×</button>
  </div>

  <div id="cartItems" class="cart-items"></div>

  <div class="cart-footer">
  <div class="cart-summary">
    <div class="cart-line">
      <span>Subtotal</span>
      <span id="cartSubtotal">$0</span>
    </div>
    <div class="cart-line" id="cartDiscountRow" style="display:none">
      <span>Descuento 20% (5+ fragancias)</span>
      <span id="cartDiscount">-$0</span>
    </div>
    <div class="cart-line cart-total">
      <span>Total</span>
      <span id="cartTotal">$0</span>
    </div>
  </div>
  <button id="buyNow" class="btn">Comprar ahora</button>
  <button id="keepShopping" class="btn secondary">Seguir comprando</button>
</div>

</aside>

<div id="cartBackdrop" class="cart-backdrop"></div>

  <script src="script.js"></script>

</body>
</html>
