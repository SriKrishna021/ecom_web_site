import { useState, useEffect, useReducer, createContext, useContext } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink: #0f0e0b;
  --cream: #f7f4ee;
  --gold: #c9a84c;
  --gold-light: #e8d4a0;
  --rust: #c94c2e;
  --sage: #4a6741;
  --mist: #e8e4dc;
  --shadow: rgba(15,14,11,0.12);
  --card-radius: 2px;
  --font-display: 'Playfair Display', serif;
  --font-body: 'DM Sans', sans-serif;
}

body { font-family: var(--font-body); background: var(--cream); color: var(--ink); }

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--mist); }
::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }

/* ── Layout ── */
.app { min-height: 100vh; display: flex; flex-direction: column; }

/* ── Header ── */
.header {
  background: var(--ink);
  color: var(--cream);
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 2px solid var(--gold);
}
.logo {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: -0.5px;
  color: var(--gold);
}
.logo span { color: var(--cream); }
.nav { display: flex; gap: 0.25rem; align-items: center; }
.nav-btn {
  background: none;
  border: none;
  color: var(--cream);
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.5rem 0.85rem;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s;
  opacity: 0.75;
}
.nav-btn:hover, .nav-btn.active { opacity: 1; background: rgba(201,168,76,0.15); color: var(--gold); }
.cart-btn {
  position: relative;
  background: var(--gold);
  color: var(--ink);
  border: none;
  padding: 0.5rem 1.1rem;
  border-radius: 2px;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 0.5rem;
}
.cart-btn:hover { background: var(--gold-light); transform: translateY(-1px); }
.cart-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: var(--rust);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.user-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 0.3rem 0.75rem;
  font-size: 0.8rem;
  margin-left: 0.5rem;
}
.role-badge {
  background: var(--gold);
  color: var(--ink);
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  border-radius: 2px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.role-badge.user { background: var(--sage); color: #fff; }

/* ── Main ── */
.main { flex: 1; }

/* ── Hero ── */
.hero {
  background: linear-gradient(135deg, var(--ink) 0%, #2a2520 50%, #1a180f 100%);
  color: var(--cream);
  padding: 5rem 2rem 4rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 60% 40%, rgba(201,168,76,0.12) 0%, transparent 70%);
}
.hero-tag {
  font-size: 0.72rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
  font-weight: 600;
  margin-bottom: 1rem;
}
.hero h1 {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 900;
  line-height: 1.05;
  margin-bottom: 1.25rem;
  position: relative;
}
.hero h1 em { font-style: italic; color: var(--gold); }
.hero p {
  font-size: 1.05rem;
  opacity: 0.7;
  max-width: 500px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}
.hero-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--gold);
  color: var(--ink);
  border: none;
  padding: 0.85rem 2rem;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.25s;
}
.hero-cta:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(201,168,76,0.3); }

/* ── Section ── */
.section { padding: 3rem 2rem; max-width: 1280px; margin: 0 auto; }
.section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--mist);
  padding-bottom: 1rem;
}
.section-title {
  font-family: var(--font-display);
  font-size: 1.9rem;
  font-weight: 700;
}
.section-sub { font-size: 0.8rem; color: #888; letter-spacing: 0.06em; text-transform: uppercase; }

/* ── Filter bar ── */
.filter-bar { display: flex; gap: 0.5rem; margin-bottom: 2rem; flex-wrap: wrap; align-items: center; }
.filter-btn {
  background: none;
  border: 1.5px solid var(--mist);
  color: var(--ink);
  padding: 0.4rem 1rem;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-btn:hover { border-color: var(--gold); color: var(--gold); }
.filter-btn.active { background: var(--ink); border-color: var(--ink); color: var(--gold); }
.search-input {
  margin-left: auto;
  border: 1.5px solid var(--mist);
  background: #fff;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--ink);
  outline: none;
  width: 200px;
  transition: border-color 0.2s;
}
.search-input:focus { border-color: var(--gold); }

/* ── Product grid ── */
.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem; }
.product-card {
  background: #fff;
  border-radius: var(--card-radius);
  overflow: hidden;
  box-shadow: 0 2px 8px var(--shadow);
  transition: all 0.3s;
  position: relative;
  cursor: default;
}
.product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px var(--shadow); }
.product-img {
  width: 100%;
  aspect-ratio: 4/3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  position: relative;
  overflow: hidden;
}
.product-img::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.06));
}
.stock-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--rust);
  color: #fff;
  font-size: 0.62rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 2px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.stock-badge.in { background: var(--sage); }
.product-body { padding: 1rem 1.1rem; }
.product-cat {
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #999;
  font-weight: 600;
  margin-bottom: 0.3rem;
}
.product-name {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0.35rem;
}
.product-desc { font-size: 0.78rem; color: #777; line-height: 1.4; margin-bottom: 0.75rem; }
.product-footer { display: flex; align-items: center; justify-content: space-between; }
.price {
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--ink);
}
.price span { font-size: 0.75rem; color: #aaa; font-family: var(--font-body); font-weight: 400; }
.add-btn {
  background: var(--ink);
  color: var(--gold);
  border: none;
  padding: 0.45rem 0.85rem;
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
}
.add-btn:hover { background: var(--gold); color: var(--ink); }
.add-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Cart Sidebar ── */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 200;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s;
}
.sidebar {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: min(420px, 100vw);
  background: var(--cream);
  z-index: 201;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s cubic-bezier(0.25,0.46,0.45,0.94);
  box-shadow: -8px 0 48px rgba(0,0,0,0.2);
}
.sidebar-header {
  background: var(--ink);
  color: var(--cream);
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid var(--gold);
}
.sidebar-title { font-family: var(--font-display); font-size: 1.3rem; font-weight: 700; }
.close-btn {
  background: none;
  border: none;
  color: var(--cream);
  font-size: 1.4rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  line-height: 1;
}
.close-btn:hover { opacity: 1; }
.cart-items { flex: 1; overflow-y: auto; padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
.cart-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; opacity: 0.5; }
.cart-empty-icon { font-size: 3rem; }
.cart-item {
  background: #fff;
  border-radius: 2px;
  padding: 0.85rem 1rem;
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  box-shadow: 0 1px 4px var(--shadow);
}
.cart-item-img {
  width: 52px;
  height: 52px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  flex-shrink: 0;
}
.cart-item-info { flex: 1; }
.cart-item-name { font-family: var(--font-display); font-size: 0.9rem; font-weight: 700; margin-bottom: 0.2rem; }
.cart-item-price { font-size: 0.8rem; color: var(--gold); font-weight: 600; }
.cart-item-qty { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.4rem; }
.qty-btn {
  background: var(--mist);
  border: none;
  width: 22px;
  height: 22px;
  border-radius: 2px;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
.qty-btn:hover { background: var(--gold-light); }
.qty-val { font-size: 0.85rem; font-weight: 600; min-width: 18px; text-align: center; }
.remove-btn { background: none; border: none; color: #ccc; cursor: pointer; font-size: 0.9rem; transition: color 0.2s; }
.remove-btn:hover { color: var(--rust); }
.cart-footer {
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--mist);
  background: #fff;
}
.cart-summary { margin-bottom: 1rem; }
.summary-row { display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.25rem 0; color: #666; }
.summary-row.total { font-size: 1.05rem; font-weight: 700; color: var(--ink); border-top: 1px solid var(--mist); margin-top: 0.5rem; padding-top: 0.5rem; }
.checkout-btn {
  width: 100%;
  background: var(--gold);
  color: var(--ink);
  border: none;
  padding: 0.9rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
}
.checkout-btn:hover { background: var(--gold-light); }

/* ── Auth Modal ── */
.modal-bg {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s;
  padding: 1rem;
}
.modal {
  background: var(--cream);
  border-radius: 4px;
  width: min(420px, 100%);
  overflow: hidden;
  animation: popIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 24px 64px rgba(0,0,0,0.3);
}
.modal-head {
  background: var(--ink);
  padding: 1.5rem 2rem;
  border-bottom: 2px solid var(--gold);
}
.modal-head h2 { font-family: var(--font-display); color: var(--cream); font-size: 1.4rem; }
.modal-head p { color: rgba(255,255,255,0.5); font-size: 0.8rem; margin-top: 0.25rem; }
.modal-body { padding: 1.75rem 2rem; }
.field { margin-bottom: 1.1rem; }
.field label { display: block; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #666; margin-bottom: 0.4rem; }
.field input, .field select {
  width: 100%;
  border: 1.5px solid var(--mist);
  background: #fff;
  padding: 0.6rem 0.85rem;
  border-radius: 2px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--ink);
  outline: none;
  transition: border-color 0.2s;
}
.field input:focus, .field select:focus { border-color: var(--gold); }
.form-error { background: #fff0ed; border: 1px solid var(--rust); color: var(--rust); padding: 0.6rem 0.85rem; border-radius: 2px; font-size: 0.82rem; margin-bottom: 1rem; }
.submit-btn {
  width: 100%;
  background: var(--ink);
  color: var(--gold);
  border: none;
  padding: 0.8rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}
.submit-btn:hover { background: var(--gold); color: var(--ink); }
.modal-switch { text-align: center; font-size: 0.82rem; color: #888; margin-top: 1rem; }
.modal-switch button { background: none; border: none; color: var(--gold); font-weight: 600; cursor: pointer; text-decoration: underline; }

/* ── Admin Panel ── */
.admin-layout { display: grid; grid-template-columns: 220px 1fr; min-height: calc(100vh - 64px); }
.admin-sidebar {
  background: var(--ink);
  color: var(--cream);
  padding: 1.5rem 1rem;
}
.admin-menu-title { font-size: 0.62rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.35); font-weight: 600; padding: 0 0.5rem; margin-bottom: 0.5rem; margin-top: 1.25rem; }
.admin-menu-title:first-child { margin-top: 0; }
.admin-menu-btn {
  width: 100%;
  background: none;
  border: none;
  color: rgba(255,255,255,0.65);
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.55rem 0.75rem;
  border-radius: 2px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.admin-menu-btn:hover { background: rgba(255,255,255,0.08); color: var(--cream); }
.admin-menu-btn.active { background: rgba(201,168,76,0.2); color: var(--gold); }
.admin-content { padding: 2rem; background: #f0ece4; }
.admin-content-title { font-family: var(--font-display); font-size: 1.5rem; font-weight: 700; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
.stat-card {
  background: #fff;
  border-radius: 2px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px var(--shadow);
  border-left: 3px solid var(--gold);
}
.stat-val { font-family: var(--font-display); font-size: 2rem; font-weight: 900; color: var(--ink); }
.stat-label { font-size: 0.72rem; letter-spacing: 0.08em; text-transform: uppercase; color: #888; margin-top: 0.25rem; }
.data-table { background: #fff; border-radius: 2px; box-shadow: 0 2px 8px var(--shadow); overflow: hidden; }
.table-toolbar { padding: 1rem 1.25rem; border-bottom: 1px solid var(--mist); display: flex; align-items: center; justify-content: space-between; }
table { width: 100%; border-collapse: collapse; }
th {
  background: var(--ink);
  color: var(--gold);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.75rem 1rem;
  text-align: left;
}
td { padding: 0.75rem 1rem; font-size: 0.85rem; border-bottom: 1px solid var(--mist); }
tr:last-child td { border-bottom: none; }
tr:hover td { background: #faf8f3; }
.status-pill {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.status-pending { background: #fff3cd; color: #856404; }
.status-processing { background: #cfe2ff; color: #084298; }
.status-shipped { background: #d1ecf1; color: #0c5460; }
.status-delivered { background: #d4edda; color: #155724; }
.status-cancelled { background: #f8d7da; color: #721c24; }
.action-btn {
  background: none;
  border: 1px solid var(--mist);
  color: var(--ink);
  padding: 0.25rem 0.65rem;
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: 500;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
  margin-right: 0.3rem;
}
.action-btn:hover { background: var(--ink); color: var(--gold); border-color: var(--ink); }
.action-btn.danger:hover { background: var(--rust); color: #fff; border-color: var(--rust); }
.primary-btn {
  background: var(--gold);
  color: var(--ink);
  border: none;
  padding: 0.5rem 1.1rem;
  font-family: var(--font-body);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.2s;
}
.primary-btn:hover { background: var(--gold-light); }

/* ── Orders page ── */
.orders-grid { display: flex; flex-direction: column; gap: 1rem; }
.order-card {
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px var(--shadow);
  overflow: hidden;
}
.order-card-header {
  background: var(--ink);
  color: var(--cream);
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
}
.order-id { font-weight: 700; color: var(--gold); letter-spacing: 0.06em; }
.order-card-body { padding: 1rem 1.25rem; }
.order-items-list { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 0.75rem; }
.order-item-row { display: flex; justify-content: space-between; font-size: 0.82rem; color: #555; }
.order-total { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; border-top: 1px solid var(--mist); padding-top: 0.6rem; margin-top: 0.25rem; }

/* ── Checkout ── */
.checkout-layout { display: grid; grid-template-columns: 1fr 360px; gap: 2rem; max-width: 960px; margin: 0 auto; }
.checkout-form-section { background: #fff; border-radius: 2px; box-shadow: 0 2px 8px var(--shadow); padding: 2rem; }
.checkout-form-section h3 { font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--mist); }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.order-summary-card { background: var(--ink); color: var(--cream); border-radius: 2px; padding: 1.75rem; height: fit-content; }
.order-summary-card h3 { font-family: var(--font-display); font-size: 1.1rem; margin-bottom: 1.25rem; color: var(--gold); }
.summary-item { display: flex; justify-content: space-between; font-size: 0.82rem; padding: 0.4rem 0; border-bottom: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.75); }
.summary-total { display: flex; justify-content: space-between; font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid var(--gold); color: var(--gold); }
.success-screen { text-align: center; padding: 4rem 2rem; }
.success-icon { font-size: 4rem; margin-bottom: 1rem; }
.success-screen h2 { font-family: var(--font-display); font-size: 2rem; font-weight: 900; margin-bottom: 0.75rem; }
.success-screen p { color: #666; margin-bottom: 2rem; }

/* ── Toasts ── */
.toast-container { position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 500; display: flex; flex-direction: column; gap: 0.5rem; }
.toast {
  background: var(--ink);
  color: var(--cream);
  padding: 0.75rem 1.25rem;
  border-radius: 2px;
  font-size: 0.85rem;
  font-weight: 500;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
  border-left: 3px solid var(--gold);
  animation: toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.toast.success { border-color: var(--sage); }
.toast.error { border-color: var(--rust); }

/* ── Animations ── */
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes popIn { from { opacity: 0; transform: scale(0.9) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
@keyframes toastIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }

/* ── Responsive ── */
@media (max-width: 768px) {
  .admin-layout { grid-template-columns: 1fr; }
  .admin-sidebar { display: flex; overflow-x: auto; padding: 0.75rem; }
  .checkout-layout { grid-template-columns: 1fr; }
  .form-row { grid-template-columns: 1fr; }
  .filter-bar { gap: 0.35rem; }
  .search-input { width: 140px; }
}
`;

// ─── Data ────────────────────────────────────────────────────────────────────
const PRODUCTS_INITIAL = [
  { id: 1, name: "Artisan Leather Journal", category: "Stationery", price: 42.99, stock: 18, emoji: "📔", bg: "#f5e9d0", desc: "Handcrafted full-grain leather, 192 pages." },
  { id: 2, name: "Ceramic Pour-Over Set", category: "Kitchen", price: 68.00, stock: 7, emoji: "☕", bg: "#e8ded0", desc: "Matte stoneware with bamboo stand." },
  { id: 3, name: "Linen Tote Bag", category: "Accessories", price: 29.50, stock: 24, emoji: "👜", bg: "#e8e4d8", desc: "Pre-washed Belgian linen, natural dye." },
  { id: 4, name: "Beeswax Candle Bundle", category: "Home", price: 36.00, stock: 15, emoji: "🕯️", bg: "#f5f0e0", desc: "100% pure beeswax, 40hr burn time." },
  { id: 5, name: "Brass Compass", category: "Accessories", price: 54.00, stock: 5, emoji: "🧭", bg: "#e0ddd0", desc: "Vintage-style solid brass, hand-engraved." },
  { id: 6, name: "Herbal Tea Collection", category: "Kitchen", price: 22.99, stock: 30, emoji: "🍵", bg: "#e0ecd8", desc: "12 artisan blends, hand-selected leaves." },
  { id: 7, name: "Wooden Desk Organizer", category: "Stationery", price: 48.00, stock: 10, emoji: "🪵", bg: "#ece4d4", desc: "Solid walnut with brass accents." },
  { id: 8, name: "Handmade Soap Set", category: "Home", price: 18.50, stock: 40, emoji: "🧼", bg: "#e8f0ec", desc: "Cold-process, essential oil scented." },
];

const USERS_INITIAL = [
  { id: 1, name: "Admin User", email: "admin@store.com", password: "admin123", role: "admin" },
  { id: 2, name: "Jane Smith", email: "jane@mail.com", password: "user123", role: "user" },
  { id: 3, name: "Alex Chen",  email: "alex@mail.com", password: "user123", role: "user" },
];

const ORDERS_INITIAL = [
  { id: "ORD-001", userId: 2, date: "2025-05-15", status: "delivered", items: [{id:1,name:"Artisan Leather Journal",qty:1,price:42.99},{id:3,name:"Linen Tote Bag",qty:2,price:29.50}], total: 101.99, shipping: "Jane Smith, 42 Oak Street, Portland OR 97201" },
  { id: "ORD-002", userId: 3, date: "2025-05-22", status: "shipped",   items: [{id:2,name:"Ceramic Pour-Over Set",qty:1,price:68.00}], total: 68.00, shipping: "Alex Chen, 88 Pine Ave, Seattle WA 98101" },
  { id: "ORD-003", userId: 2, date: "2025-05-28", status: "processing", items: [{id:5,name:"Brass Compass",qty:1,price:54.00},{id:4,name:"Beeswax Candle Bundle",qty:1,price:36.00}], total: 90.00, shipping: "Jane Smith, 42 Oak Street, Portland OR 97201" },
];

// ─── Context ─────────────────────────────────────────────────────────────────
const AppCtx = createContext(null);
function useApp() { return useContext(AppCtx); }

// ─── Reducers ─────────────────────────────────────────────────────────────────
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const existing = state.find(i => i.id === action.product.id);
      if (existing) return state.map(i => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...state, { ...action.product, qty: 1 }];
    }
    case "INC": return state.map(i => i.id === action.id ? { ...i, qty: i.qty + 1 } : i);
    case "DEC": return state.map(i => i.id === action.id ? { ...i, qty: Math.max(0, i.qty - 1) } : i).filter(i => i.qty > 0);
    case "REMOVE": return state.filter(i => i.id !== action.id);
    case "CLEAR": return [];
    default: return state;
  }
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage]           = useState("shop");
  const [cart, dispatch]          = useReducer(cartReducer, []);
  const [cartOpen, setCartOpen]   = useState(false);
  const [authOpen, setAuthOpen]   = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts]   = useState(PRODUCTS_INITIAL);
  const [users, setUsers]         = useState(USERS_INITIAL);
  const [orders, setOrders]       = useState(ORDERS_INITIAL);
  const [toasts, setToasts]       = useState([]);

  const addToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const ctx = { page, setPage, cart, dispatch, cartOpen, setCartOpen, authOpen, setAuthOpen, currentUser, setCurrentUser, products, setProducts, users, setUsers, orders, setOrders, cartCount, cartTotal, addToast };

  return (
    <AppCtx.Provider value={ctx}>
      <style>{CSS}</style>
      <div className="app">
        <Header />
        <main className="main">
          {page === "shop"     && <ShopPage />}
          {page === "orders"   && <OrdersPage />}
          {page === "checkout" && <CheckoutPage />}
          {page === "admin"    && currentUser?.role === "admin" && <AdminPanel />}
          {page === "admin"    && currentUser?.role !== "admin" && <UnauthorizedPage />}
        </main>
        {cartOpen   && <CartSidebar />}
        {authOpen   && <AuthModal />}
        <ToastContainer toasts={toasts} />
      </div>
    </AppCtx.Provider>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────
function Header() {
  const { page, setPage, cartCount, setCartOpen, setAuthOpen, currentUser, setCurrentUser } = useApp();
  const logout = () => { setCurrentUser(null); setPage("shop"); };
  return (
    <header className="header">
      <div className="logo" onClick={() => setPage("shop")} style={{cursor:"pointer"}}>Maison<span>Store</span></div>
      <nav className="nav">
        <button className={`nav-btn ${page==="shop"?"active":""}`} onClick={() => setPage("shop")}>Shop</button>
        {currentUser && <button className={`nav-btn ${page==="orders"?"active":""}`} onClick={() => setPage("orders")}>My Orders</button>}
        {currentUser?.role === "admin" && <button className={`nav-btn ${page==="admin"?"active":""}`} onClick={() => setPage("admin")}>Admin</button>}
        {currentUser
          ? <>
              <div className="user-pill">
                <span>👤 {currentUser.name.split(" ")[0]}</span>
                <span className={`role-badge ${currentUser.role}`}>{currentUser.role}</span>
              </div>
              <button className="nav-btn" onClick={logout}>Logout</button>
            </>
          : <button className="nav-btn" onClick={() => setAuthOpen(true)}>Sign In</button>}
        <button className="cart-btn" onClick={() => setCartOpen(true)}>
          🛒 Cart
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </nav>
    </header>
  );
}

// ─── Shop Page ───────────────────────────────────────────────────────────────
function ShopPage() {
  const { products, dispatch, addToast, setPage, cart, currentUser } = useApp();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const cats = ["All", ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = products.filter(p =>
    (filter === "All" || p.category === filter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()))
  );
  const addToCart = (p) => {
    dispatch({ type: "ADD", product: p });
    addToast(`${p.emoji} ${p.name} added to cart`);
  };
  return (
    <>
      <section className="hero">
        <p className="hero-tag">✦ New Arrivals — Spring 2025</p>
        <h1>Curated <em>Objects</em><br/>for Everyday Life</h1>
        <p>Handpicked artisan goods. Ethically sourced, beautifully crafted, delivered with care.</p>
        <button className="hero-cta" onClick={() => document.querySelector('.section')?.scrollIntoView({behavior:'smooth'})}>
          Browse Collection ↓
        </button>
      </section>
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Our Collection</h2>
          <span className="section-sub">{filtered.length} products</span>
        </div>
        <div className="filter-bar">
          {cats.map(c => <button key={c} className={`filter-btn ${filter===c?"active":""}`} onClick={() => setFilter(c)}>{c}</button>)}
          <input className="search-input" placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="product-grid">
          {filtered.map(p => {
            const inCart = cart.find(i => i.id === p.id);
            return (
              <div key={p.id} className="product-card">
                <div className="product-img" style={{background: p.bg}}>
                  <span style={{fontSize:"3.5rem",filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.15))"}}>
                    {p.emoji}
                  </span>
                  <span className={`stock-badge ${p.stock>8?"in":""}`}>{p.stock>8?"In Stock":p.stock>0?`Only ${p.stock}`:"Sold Out"}</span>
                </div>
                <div className="product-body">
                  <div className="product-cat">{p.category}</div>
                  <div className="product-name">{p.name}</div>
                  <div className="product-desc">{p.desc}</div>
                  <div className="product-footer">
                    <div className="price">${p.price.toFixed(2)} <span>USD</span></div>
                    <button className="add-btn" onClick={() => addToCart(p)} disabled={p.stock===0}>
                      {p.stock===0 ? "Sold Out" : inCart ? "Add More" : "+ Cart"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── Cart Sidebar ─────────────────────────────────────────────────────────────
function CartSidebar() {
  const { cart, dispatch, cartTotal, setCartOpen, setPage, currentUser, setAuthOpen } = useApp();
  const shipping = cartTotal >= 60 ? 0 : 8.99;
  const tax = cartTotal * 0.08;
  const handleCheckout = () => {
    if (!currentUser) { setAuthOpen(true); return; }
    setCartOpen(false);
    setPage("checkout");
  };
  return (
    <>
      <div className="overlay" onClick={() => setCartOpen(false)} />
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title">Your Cart ({cart.reduce((s,i)=>s+i.qty,0)})</div>
          <button className="close-btn" onClick={() => setCartOpen(false)}>✕</button>
        </div>
        <div className="cart-items">
          {cart.length === 0
            ? <div className="cart-empty"><div className="cart-empty-icon">🛒</div><div>Your cart is empty</div></div>
            : cart.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-img" style={{background: item.bg}}>{item.emoji}</div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">${(item.price * item.qty).toFixed(2)}</div>
                    <div className="cart-item-qty">
                      <button className="qty-btn" onClick={() => dispatch({type:"DEC",id:item.id})}>−</button>
                      <span className="qty-val">{item.qty}</span>
                      <button className="qty-btn" onClick={() => dispatch({type:"INC",id:item.id})}>+</button>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => dispatch({type:"REMOVE",id:item.id})}>✕</button>
                </div>
              ))
          }
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="summary-row"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
              <div className="summary-row"><span>Shipping</span><span>{shipping===0?"FREE":"$"+shipping.toFixed(2)}</span></div>
              <div className="summary-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="summary-row total"><span>Total</span><span>${(cartTotal+shipping+tax).toFixed(2)}</span></div>
            </div>
            {cartTotal < 60 && <div style={{fontSize:"0.75rem",color:"#888",marginBottom:"0.75rem"}}>Add ${(60-cartTotal).toFixed(2)} more for free shipping</div>}
            <button className="checkout-btn" onClick={handleCheckout}>
              {currentUser ? "Proceed to Checkout →" : "Sign In to Checkout →"}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

// ─── Auth Modal ───────────────────────────────────────────────────────────────
function AuthModal() {
  const { setAuthOpen, users, setUsers, setCurrentUser, addToast } = useApp();
  const [mode, setMode]     = useState("login");
  const [email, setEmail]   = useState("");
  const [password, setPassword] = useState("");
  const [name, setName]     = useState("");
  const [role, setRole]     = useState("user");
  const [error, setError]   = useState("");

  const handleSubmit = () => {
    setError("");
    if (mode === "login") {
      const u = users.find(u => u.email === email && u.password === password);
      if (!u) { setError("Invalid email or password."); return; }
      setCurrentUser(u);
      setAuthOpen(false);
      addToast(`Welcome back, ${u.name.split(" ")[0]}! 👋`);
    } else {
      if (!name || !email || !password) { setError("All fields are required."); return; }
      if (users.find(u => u.email === email)) { setError("Email already registered."); return; }
      const newUser = { id: users.length + 1, name, email, password, role };
      setUsers(u => [...u, newUser]);
      setCurrentUser(newUser);
      setAuthOpen(false);
      addToast(`Account created! Welcome, ${name.split(" ")[0]} 🎉`);
    }
  };

  return (
    <div className="modal-bg" onClick={e => e.target===e.currentTarget && setAuthOpen(false)}>
      <div className="modal">
        <div className="modal-head">
          <h2>{mode === "login" ? "Sign In" : "Create Account"}</h2>
          <p>{mode === "login" ? "Welcome back to MaisonStore" : "Join to start shopping"}</p>
        </div>
        <div className="modal-body">
          {error && <div className="form-error">⚠ {error}</div>}
          {mode === "register" && (
            <div className="field">
              <label>Full Name</label>
              <input value={name} onChange={e=>setName(e.target.value)} placeholder="Jane Smith" />
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {mode === "register" && (
            <div className="field">
              <label>Account Type</label>
              <select value={role} onChange={e=>setRole(e.target.value)}>
                <option value="user">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}
          {mode === "login" && (
            <div style={{fontSize:"0.75rem",color:"#888",marginBottom:"0.75rem"}}>
              Demo: <strong>admin@store.com / admin123</strong> or <strong>jane@mail.com / user123</strong>
            </div>
          )}
          <button className="submit-btn" onClick={handleSubmit}>
            {mode === "login" ? "Sign In →" : "Create Account →"}
          </button>
          <div className="modal-switch">
            {mode === "login"
              ? <>No account? <button onClick={() => { setMode("register"); setError(""); }}>Register here</button></>
              : <>Have an account? <button onClick={() => { setMode("login"); setError(""); }}>Sign in</button></>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Checkout Page ────────────────────────────────────────────────────────────
function CheckoutPage() {
  const { cart, dispatch, cartTotal, setPage, orders, setOrders, currentUser, addToast } = useApp();
  const [form, setForm]       = useState({ first:"", last:"", email: currentUser?.email||"", address:"", city:"", state:"", zip:"", card:"", expiry:"", cvv:"" });
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const shipping = cartTotal >= 60 ? 0 : 8.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + shipping + tax;

  const f = (k) => (e) => setForm(prev => ({...prev, [k]: e.target.value}));

  const placeOrder = () => {
    if (!form.first || !form.address || !form.card) { addToast("Please fill in all required fields", "error"); return; }
    const id = "ORD-" + String(orders.length + 1).padStart(3, "0");
    const newOrder = {
      id, userId: currentUser.id,
      date: new Date().toISOString().split("T")[0],
      status: "processing",
      items: cart.map(i => ({id:i.id,name:i.name,qty:i.qty,price:i.price})),
      total: total,
      shipping: `${form.first} ${form.last}, ${form.address}, ${form.city} ${form.state} ${form.zip}`
    };
    setOrders(o => [...o, newOrder]);
    dispatch({ type: "CLEAR" });
    setOrderId(id);
    setSuccess(true);
  };

  if (success) return (
    <div className="section">
      <div className="success-screen">
        <div className="success-icon">🎉</div>
        <h2>Order Placed!</h2>
        <p>Thank you for your purchase. Order <strong>{orderId}</strong> is being processed.</p>
        <button className="hero-cta" onClick={() => setPage("orders")}>View My Orders</button>
      </div>
    </div>
  );

  if (cart.length === 0) return (
    <div className="section">
      <div className="success-screen">
        <div className="success-icon">🛒</div>
        <h2>Cart is Empty</h2>
        <p>Add some products before checking out.</p>
        <button className="hero-cta" onClick={() => setPage("shop")}>Browse Shop</button>
      </div>
    </div>
  );

  return (
    <div className="section">
      <div className="section-header"><h2 className="section-title">Checkout</h2></div>
      <div className="checkout-layout">
        <div>
          <div className="checkout-form-section" style={{marginBottom:"1.5rem"}}>
            <h3>📦 Shipping Information</h3>
            <div className="form-row">
              <div className="field"><label>First Name *</label><input value={form.first} onChange={f("first")} placeholder="Jane" /></div>
              <div className="field"><label>Last Name</label><input value={form.last} onChange={f("last")} placeholder="Smith" /></div>
            </div>
            <div className="field"><label>Email *</label><input value={form.email} onChange={f("email")} placeholder="jane@mail.com" /></div>
            <div className="field"><label>Address *</label><input value={form.address} onChange={f("address")} placeholder="42 Oak Street" /></div>
            <div className="form-row">
              <div className="field"><label>City</label><input value={form.city} onChange={f("city")} placeholder="Portland" /></div>
              <div className="field"><label>State</label><input value={form.state} onChange={f("state")} placeholder="OR" /></div>
            </div>
            <div className="field"><label>ZIP Code</label><input value={form.zip} onChange={f("zip")} placeholder="97201" /></div>
          </div>
          <div className="checkout-form-section">
            <h3>💳 Payment Details</h3>
            <div className="field"><label>Card Number *</label><input value={form.card} onChange={f("card")} placeholder="4242 4242 4242 4242" /></div>
            <div className="form-row">
              <div className="field"><label>Expiry</label><input value={form.expiry} onChange={f("expiry")} placeholder="MM/YY" /></div>
              <div className="field"><label>CVV</label><input value={form.cvv} onChange={f("cvv")} placeholder="123" /></div>
            </div>
            <button className="submit-btn" style={{marginTop:"0.75rem"}} onClick={placeOrder}>Place Order — ${total.toFixed(2)}</button>
          </div>
        </div>
        <div className="order-summary-card">
          <h3>Order Summary</h3>
          {cart.map(i => (
            <div key={i.id} className="summary-item">
              <span>{i.emoji} {i.name} ×{i.qty}</span>
              <span>${(i.price*i.qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-item"><span>Shipping</span><span>{shipping===0?"FREE":"$"+shipping.toFixed(2)}</span></div>
          <div className="summary-item"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
          <div className="summary-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}

// ─── Orders Page ──────────────────────────────────────────────────────────────
function OrdersPage() {
  const { orders, currentUser, setPage } = useApp();
  const myOrders = orders.filter(o => o.userId === currentUser?.id);
  const STATUS_LABEL = { pending:"🟡 Pending", processing:"🔵 Processing", shipped:"🚚 Shipped", delivered:"✅ Delivered", cancelled:"❌ Cancelled" };
  if (!currentUser) return <div className="section"><div className="success-screen"><div className="success-icon">🔒</div><h2>Sign in to view orders</h2></div></div>;
  return (
    <div className="section">
      <div className="section-header">
        <h2 className="section-title">My Orders</h2>
        <span className="section-sub">{myOrders.length} orders</span>
      </div>
      {myOrders.length === 0
        ? <div className="success-screen"><div className="success-icon">📦</div><h2>No orders yet</h2><p>Start shopping to place your first order.</p><button className="hero-cta" onClick={() => setPage("shop")}>Browse Shop</button></div>
        : <div className="orders-grid">
            {[...myOrders].reverse().map(o => (
              <div key={o.id} className="order-card">
                <div className="order-card-header">
                  <span className="order-id">{o.id}</span>
                  <span>{o.date}</span>
                  <span className={`status-pill status-${o.status}`}>{STATUS_LABEL[o.status]||o.status}</span>
                </div>
                <div className="order-card-body">
                  <div className="order-items-list">
                    {o.items.map((i,idx) => <div key={idx} className="order-item-row"><span>{i.name} ×{i.qty}</span><span>${(i.price*i.qty).toFixed(2)}</span></div>)}
                  </div>
                  <div style={{fontSize:"0.75rem",color:"#888",marginBottom:"0.5rem"}}>📍 {o.shipping}</div>
                  <div className="order-total">Total: ${o.total.toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>}
    </div>
  );
}

// ─── Admin Panel ──────────────────────────────────────────────────────────────
function AdminPanel() {
  const [tab, setTab] = useState("dashboard");
  const MENU = [
    { id:"dashboard", icon:"📊", label:"Dashboard" },
    { id:"products",  icon:"📦", label:"Products" },
    { id:"orders",    icon:"🧾", label:"Orders" },
    { id:"users",     icon:"👥", label:"Users" },
  ];
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-menu-title">Management</div>
        {MENU.map(m => (
          <button key={m.id} className={`admin-menu-btn ${tab===m.id?"active":""}`} onClick={() => setTab(m.id)}>
            <span>{m.icon}</span> {m.label}
          </button>
        ))}
      </aside>
      <div className="admin-content">
        {tab === "dashboard" && <AdminDashboard />}
        {tab === "products"  && <AdminProducts />}
        {tab === "orders"    && <AdminOrders />}
        {tab === "users"     && <AdminUsers />}
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { products, orders, users } = useApp();
  const revenue = orders.filter(o=>o.status!=="cancelled").reduce((s,o)=>s+o.total,0);
  return (
    <>
      <div className="admin-content-title">Dashboard Overview</div>
      <div className="stats-grid">
        <div className="stat-card"><div className="stat-val">{products.length}</div><div className="stat-label">Products</div></div>
        <div className="stat-card" style={{borderColor:"#4a6741"}}><div className="stat-val">{orders.length}</div><div className="stat-label">Total Orders</div></div>
        <div className="stat-card" style={{borderColor:"#c94c2e"}}><div className="stat-val">${revenue.toFixed(0)}</div><div className="stat-label">Revenue</div></div>
        <div className="stat-card" style={{borderColor:"#5a8aaf"}}><div className="stat-val">{users.length}</div><div className="stat-label">Users</div></div>
        <div className="stat-card" style={{borderColor:"#8a6aaf"}}><div className="stat-val">{orders.filter(o=>o.status==="processing").length}</div><div className="stat-label">Processing</div></div>
        <div className="stat-card" style={{borderColor:"#af8a2a"}}><div className="stat-val">{products.filter(p=>p.stock<=5).length}</div><div className="stat-label">Low Stock</div></div>
      </div>
      <div className="data-table">
        <div className="table-toolbar" style={{fontFamily:"var(--font-display)",fontWeight:700}}>Recent Orders</div>
        <table>
          <thead><tr><th>Order ID</th><th>Date</th><th>Status</th><th>Total</th></tr></thead>
          <tbody>{[...orders].slice(-5).reverse().map(o => (
            <tr key={o.id}><td style={{fontWeight:700,color:"var(--gold)"}}>{o.id}</td><td>{o.date}</td>
              <td><span className={`status-pill status-${o.status}`}>{o.status}</span></td>
              <td>${o.total.toFixed(2)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}

function AdminProducts() {
  const { products, setProducts, addToast } = useApp();
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:"", category:"", price:"", stock:"", desc:"", emoji:"📦", bg:"#f0ede4" });
  const [showForm, setShowForm] = useState(false);
  const f = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const openNew = () => { setEditing(null); setForm({name:"",category:"",price:"",stock:"",desc:"",emoji:"📦",bg:"#f0ede4"}); setShowForm(true); };
  const openEdit = (p) => { setEditing(p.id); setForm({name:p.name,category:p.category,price:p.price,stock:p.stock,desc:p.desc,emoji:p.emoji,bg:p.bg}); setShowForm(true); };
  const save = () => {
    if (!form.name || !form.price) { addToast("Name and price are required", "error"); return; }
    if (editing) {
      setProducts(ps => ps.map(p => p.id === editing ? {...p,...form,price:parseFloat(form.price),stock:parseInt(form.stock)} : p));
      addToast("Product updated ✓", "success");
    } else {
      setProducts(ps => [...ps, {...form, id: Date.now(), price:parseFloat(form.price), stock:parseInt(form.stock)}]);
      addToast("Product added ✓", "success");
    }
    setShowForm(false);
  };
  const del = (id) => { setProducts(ps => ps.filter(p => p.id !== id)); addToast("Product deleted"); };

  return (
    <>
      <div className="admin-content-title">
        Products
        <button className="primary-btn" onClick={openNew}>+ Add Product</button>
      </div>
      {showForm && (
        <div className="data-table" style={{marginBottom:"1.5rem",padding:"1.5rem"}}>
          <h3 style={{fontFamily:"var(--font-display)",marginBottom:"1rem"}}>{editing?"Edit Product":"New Product"}</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1rem"}}>
            <div className="field"><label>Name *</label><input value={form.name} onChange={f("name")} /></div>
            <div className="field"><label>Category</label><input value={form.category} onChange={f("category")} /></div>
            <div className="field"><label>Price ($) *</label><input type="number" value={form.price} onChange={f("price")} /></div>
            <div className="field"><label>Stock</label><input type="number" value={form.stock} onChange={f("stock")} /></div>
            <div className="field"><label>Emoji</label><input value={form.emoji} onChange={f("emoji")} /></div>
            <div className="field"><label>Background Color</label><input type="color" value={form.bg} onChange={f("bg")} style={{height:"40px"}} /></div>
          </div>
          <div className="field"><label>Description</label><input value={form.desc} onChange={f("desc")} /></div>
          <div style={{display:"flex",gap:"0.5rem",marginTop:"0.5rem"}}>
            <button className="primary-btn" onClick={save}>Save</button>
            <button className="action-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      <div className="data-table">
        <table>
          <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
          <tbody>{products.map(p => (
            <tr key={p.id}>
              <td style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                <span style={{fontSize:"1.4rem"}}>{p.emoji}</span>
                <span style={{fontWeight:600}}>{p.name}</span>
              </td>
              <td>{p.category}</td>
              <td>${p.price.toFixed(2)}</td>
              <td><span style={{fontWeight:600,color:p.stock<=5?"var(--rust)":"var(--sage)"}}>{p.stock}</span></td>
              <td>
                <button className="action-btn" onClick={() => openEdit(p)}>Edit</button>
                <button className="action-btn danger" onClick={() => del(p.id)}>Delete</button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}

function AdminOrders() {
  const { orders, setOrders, users } = useApp();
  const STATUSES = ["pending","processing","shipped","delivered","cancelled"];
  const getUserName = id => users.find(u=>u.id===id)?.name || "Unknown";
  const updateStatus = (id, status) => setOrders(os => os.map(o => o.id===id ? {...o,status} : o));
  return (
    <>
      <div className="admin-content-title">Order Management</div>
      <div className="data-table">
        <table>
          <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>{[...orders].reverse().map(o => (
            <tr key={o.id}>
              <td style={{fontWeight:700,color:"var(--gold)"}}>{o.id}</td>
              <td>{getUserName(o.userId)}</td>
              <td>{o.date}</td>
              <td style={{fontSize:"0.78rem"}}>{o.items.length} item{o.items.length!==1?"s":""}</td>
              <td>${o.total.toFixed(2)}</td>
              <td><span className={`status-pill status-${o.status}`}>{o.status}</span></td>
              <td>
                <select style={{border:"1px solid var(--mist)",borderRadius:"2px",padding:"0.2rem",fontSize:"0.75rem",fontFamily:"var(--font-body)"}}
                  value={o.status} onChange={e => updateStatus(o.id, e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}

function AdminUsers() {
  const { users } = useApp();
  return (
    <>
      <div className="admin-content-title">User Management</div>
      <div className="data-table">
        <table>
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th></tr></thead>
          <tbody>{users.map(u => (
            <tr key={u.id}>
              <td style={{color:"#999"}}>#{u.id}</td>
              <td style={{fontWeight:600}}>{u.name}</td>
              <td>{u.email}</td>
              <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}

function UnauthorizedPage() {
  return (
    <div className="section">
      <div className="success-screen">
        <div className="success-icon">🚫</div>
        <h2>Access Denied</h2>
        <p>You need admin privileges to view this page.</p>
      </div>
    </div>
  );
}

// ─── Toasts ───────────────────────────────────────────────────────────────────
function ToastContainer({ toasts }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>
      ))}
    </div>
  );
}
