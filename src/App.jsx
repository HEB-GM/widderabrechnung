import { useState, useEffect } from "react";

const DEFAULT_ITEMS = [
  { id: 1, name: "Bier", price: 4.50 },
  { id: 2, name: "Wein", price: 7.00 },
  { id: 3, name: "Cola", price: 3.50 },
  { id: 4, name: "Wasser", price: 2.50 },
  { id: 5, name: "Burger", price: 18.00 },
  { id: 6, name: "Pizza", price: 19.50 },
];

const STORAGE_KEY = "restaurant-items";
const QTY_KEY = "restaurant-quantities";
const TIP_KEY = "restaurant-tip-extra";

function loadItems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_ITEMS;
}

function saveItems(items) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
}

function loadQuantities() {
  try {
    const raw = localStorage.getItem(QTY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

function loadTipExtra() {
  try {
    const raw = localStorage.getItem(TIP_KEY);
    if (raw !== null) return Number(raw);
  } catch {}
  return 0;
}

// Styles
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;1,9..144,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: #0f0e0c;
    color: #f0ead8;
    font-family: 'DM Mono', monospace;
    min-height: 100vh;
  }

  .app {
    max-width: 480px;
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #141210;
  }

  .header {
    padding: 20px 24px 16px;
    border-bottom: 1px solid #2a2520;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background: #141210;
    z-index: 10;
  }

  .header-logo {
    height: 44px;
    width: auto;
    object-fit: contain;
    filter: brightness(0) invert(1) sepia(1) saturate(2) hue-rotate(5deg) brightness(0.9);
  }

  .header-title {
    font-family: 'Fraunces', serif;
    font-size: 22px;
    font-weight: 700;
    color: #e8c87a;
    letter-spacing: -0.5px;
  }

  .header-subtitle {
    font-size: 10px;
    color: #6b6050;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .nav-btn {
    background: #1e1c18;
    border: 1px solid #2a2520;
    color: #c4b896;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: all 0.15s;
  }

  .nav-btn:hover { background: #2a2520; color: #e8c87a; border-color: #e8c87a44; }

  .content { flex: 1; padding: 0 0 40px; }

  /* BILL PAGE */
  .items-table { width: 100%; }

  .table-head {
    display: grid;
    grid-template-columns: 1fr 70px 80px 110px;
    padding: 10px 24px;
    border-bottom: 1px solid #2a2520;
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #5a5040;
  }

  .table-row {
    display: grid;
    grid-template-columns: 1fr 70px 80px 110px;
    padding: 10px 24px;
    align-items: center;
    border-bottom: 1px solid #1e1c18;
    transition: background 0.1s;
  }

  .table-row:hover { background: #1a1814; }

  .item-name {
    font-size: 14px;
    font-family: 'Fraunces', serif;
    font-weight: 300;
    font-style: italic;
    color: #f0ead8;
  }

  .item-price {
    font-size: 12px;
    color: #7a6e5a;
  }

  .item-total {
    font-size: 14px;
    color: #c4b896;
    font-weight: 500;
  }

  .qty-ctrl {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .qty-btn {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: 1px solid #2a2520;
    background: #1e1c18;
    color: #e8c87a;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.1s;
    flex-shrink: 0;
    line-height: 1;
    padding-bottom: 1px;
  }

  .qty-btn:hover { background: #2a2520; border-color: #e8c87a55; }
  .qty-btn:active { transform: scale(0.93); }

  .qty-val {
    width: 26px;
    text-align: center;
    font-size: 15px;
    font-weight: 500;
    color: #f0ead8;
  }

  /* TOTALS SECTION */
  .totals {
    margin-top: 8px;
    border-top: 1px solid #2a2520;
    padding: 16px 24px 0;
  }

  .total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
  }

  .total-label {
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #6b6050;
  }

  .total-val {
    font-size: 16px;
    font-family: 'Fraunces', serif;
    font-weight: 700;
    color: #c4b896;
  }

  .total-val.accent { color: #e8c87a; }

  .divider {
    height: 1px;
    background: #2a2520;
    margin: 6px 0;
  }

  .tip-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0;
    gap: 8px;
  }

  .tip-btns {
    display: flex;
    gap: 6px;
  }

  .tip-add-btn {
    background: #1e1c18;
    border: 1px solid #2a2520;
    color: #e8c87a;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    transition: all 0.12s;
  }

  .tip-add-btn:hover { background: #2a2520; border-color: #e8c87a55; }
  .tip-add-btn:active { transform: scale(0.95); }

  .final-box {
    background: #1a1814;
    border: 1px solid #2a2520;
    border-radius: 12px;
    padding: 16px 20px;
    margin-top: 16px;
  }

  .final-total {
    font-family: 'Fraunces', serif;
    font-size: 36px;
    font-weight: 700;
    color: #e8c87a;
    text-align: center;
    letter-spacing: -1px;
  }

  .final-label {
    font-size: 9px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #5a5040;
    text-align: center;
    margin-bottom: 8px;
  }

  .split-box {
    margin-top: 12px;
    border-top: 1px solid #2a2520;
    padding-top: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .split-label {
    font-size: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: #5a5040;
  }

  .split-val {
    font-family: 'Fraunces', serif;
    font-size: 22px;
    font-weight: 700;
    color: #c4b896;
  }

  .split-per { font-size: 11px; color: #5a5040; }

  .reset-btn {
    width: 100%;
    margin-top: 16px;
    background: transparent;
    border: 1px solid #2a2520;
    color: #5a5040;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: all 0.15s;
  }

  .reset-btn:hover { color: #c47a7a; border-color: #c47a7a55; }

  /* SETTINGS PAGE */
  .settings-item {
    display: grid;
    grid-template-columns: 1fr 80px 40px;
    align-items: center;
    padding: 12px 24px;
    border-bottom: 1px solid #1e1c18;
    gap: 8px;
  }

  .settings-item input {
    background: #1e1c18;
    border: 1px solid #2a2520;
    color: #f0ead8;
    padding: 6px 10px;
    border-radius: 6px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    width: 100%;
    outline: none;
  }

  .settings-item input:focus { border-color: #e8c87a55; }

  .del-btn {
    background: transparent;
    border: none;
    color: #4a3a3a;
    font-size: 18px;
    cursor: pointer;
    padding: 4px;
    transition: color 0.15s;
  }

  .del-btn:hover { color: #c47a7a; }

  .add-form {
    display: grid;
    grid-template-columns: 1fr 80px auto;
    gap: 8px;
    padding: 16px 24px;
    border-top: 1px solid #2a2520;
    margin-top: 8px;
  }

  .add-form input {
    background: #1e1c18;
    border: 1px solid #2a2520;
    color: #f0ead8;
    padding: 8px 12px;
    border-radius: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    outline: none;
  }

  .add-form input:focus { border-color: #e8c87a55; }

  .add-btn {
    background: #e8c87a;
    border: none;
    color: #0f0e0c;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.12s;
    white-space: nowrap;
  }

  .add-btn:hover { background: #f0d890; }

  .empty-hint {
    text-align: center;
    padding: 40px 24px;
    color: #5a5040;
    font-size: 12px;
    letter-spacing: 1px;
  }

  .chf-sym { font-size: 10px; color: #5a5040; margin-right: 2px; }
`;

function fmt(val) {
  return val.toFixed(2);
}

export default function App() {
  const [page, setPage] = useState("bill");
  const [items, setItems] = useState(loadItems);
  const [quantities, setQuantities] = useState(loadQuantities);
  const [tipExtra, setTipExtra] = useState(loadTipExtra);

  // New item form
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => { saveItems(items); }, [items]);
  useEffect(() => { try { localStorage.setItem(QTY_KEY, JSON.stringify(quantities)); } catch {} }, [quantities]);
  useEffect(() => { try { localStorage.setItem(TIP_KEY, String(tipExtra)); } catch {} }, [tipExtra]);

  // Bill calculations
  const subtotal = items.reduce((sum, it) => sum + (quantities[it.id] || 0) * it.price, 0);
  const tip10 = Math.round(subtotal * 1.1); // rounded to whole franc
  const tipTotal = tip10 + tipExtra;
  const perPerson = tipTotal / 3;

  function setQty(id, delta) {
    setQuantities(q => {
      const cur = q[id] || 0;
      const next = Math.max(0, cur + delta);
      return { ...q, [id]: next };
    });
  }

  function addItem() {
    const name = newName.trim();
    const price = parseFloat(newPrice.replace(",", "."));
    if (!name || isNaN(price) || price <= 0) return;
    const newId = Date.now();
    setItems(prev => [...prev, { id: newId, name, price }]);
    setNewName("");
    setNewPrice("");
  }

  function deleteItem(id) {
    setItems(prev => prev.filter(i => i.id !== id));
    setQuantities(q => { const next = { ...q }; delete next[id]; return next; });
  }

  function updateItem(id, field, val) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: val } : i));
  }

  function resetBill() {
    setQuantities({});
    setTipExtra(0);
  }

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <div>
            <div className="header-title">Widderabrechnung</div>
            <div className="header-subtitle">Restaurant Split</div>
          </div>
          <button className="nav-btn" onClick={() => setPage(p => p === "bill" ? "settings" : "bill")}>
            {page === "bill" ? "Artikel" : "← Abrechnung"}
          </button>
        </div>

        <div className="content">
          {page === "bill" ? (
            <>
              <div className="items-table">
                <div className="table-head">
                  <span>Artikel</span>
                  <span>Preis</span>
                  <span>Total</span>
                  <span style={{textAlign:"center"}}>Menge</span>
                </div>
                {items.map(it => {
                  const qty = quantities[it.id] || 0;
                  const total = qty * it.price;
                  return (
                    <div className="table-row" key={it.id}>
                      <span className="item-name">{it.name}</span>
                      <span className="item-price">
                        <span className="chf-sym">CHF</span>{fmt(it.price)}
                      </span>
                      <span className="item-total" style={{opacity: qty === 0 ? 0.3 : 1}}>
                        {qty > 0 ? fmt(total) : "-"}
                      </span>
                      <div className="qty-ctrl">
                        <button className="qty-btn" onClick={() => setQty(it.id, -1)}>−</button>
                        <span className="qty-val">{qty}</span>
                        <button className="qty-btn" onClick={() => setQty(it.id, +1)}>+</button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="totals" style={{paddingBottom: 24}}>
                <div className="total-row">
                  <span className="total-label">Subtotal</span>
                  <span className="total-val">CHF {fmt(subtotal)}</span>
                </div>

                <div className="divider" />

                <div className="total-row">
                  <span className="total-label">+ 10% Trinkgeld<br/><span style={{fontSize:9,color:"#3a3028"}}>auf CHF gerundet</span></span>
                  <span className="total-val">CHF {tip10}.00</span>
                </div>

                <div className="tip-row">
                  <span className="total-label" style={{flexShrink:0}}>Aufrunden</span>
                  <div className="tip-btns">
                    {[1,2,3,4].map(n => (
                      <button key={n} className="tip-add-btn" onClick={() => setTipExtra(e => e + n)}>
                        +{n}
                      </button>
                    ))}
                    {tipExtra > 0 && (
                      <button className="tip-add-btn" style={{color:"#c47a7a"}} onClick={() => setTipExtra(0)}>
                        ×
                      </button>
                    )}
                  </div>
                  {tipExtra > 0 && <span style={{fontSize:12, color:"#c4b896"}}>+{tipExtra}</span>}
                </div>

                <div className="divider" />

                <div className="final-box">
                  <div className="final-label">Total</div>
                  <div className="final-total">CHF {tipTotal}.00</div>

                  <div className="split-box">
                    <div>
                      <div className="split-label">Pro Person</div>
                      <div className="split-per">geteilt durch 3</div>
                    </div>
                    <div className="split-val">CHF {fmt(perPerson)}</div>
                  </div>
                </div>

                <button className="reset-btn" onClick={resetBill}>
                  Abrechnung zurücksetzen
                </button>
              </div>
            </>
          ) : (
            <>
              {items.length === 0 && (
                <div className="empty-hint">Noch keine Artikel. Füge einen unten hinzu.</div>
              )}
              {items.map(it => (
                <div className="settings-item" key={it.id}>
                  <input
                    value={it.name}
                    onChange={e => updateItem(it.id, "name", e.target.value)}
                    placeholder="Bezeichnung"
                  />
                  <input
                    type="number"
                    value={it.price}
                    onChange={e => updateItem(it.id, "price", parseFloat(e.target.value) || 0)}
                    placeholder="Preis"
                    step="0.5"
                    min="0"
                  />
                  <button className="del-btn" onClick={() => deleteItem(it.id)}>✕</button>
                </div>
              ))}
              <div className="add-form">
                <input
                  placeholder="Bezeichnung"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && addItem()}
                />
                <input
                  placeholder="CHF"
                  type="number"
                  value={newPrice}
                  onChange={e => setNewPrice(e.target.value)}
                  step="0.5"
                  min="0"
                  onKeyDown={e => e.key === "Enter" && addItem()}
                />
                <button className="add-btn" onClick={addItem}>+ Hinzufügen</button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
