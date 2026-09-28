import React, { useState } from 'react';

export default function Dashboard({ user, onLogout }) {
  const [currency, setCurrency] = useState('PEN');
  const [activeTab, setActiveTab] = useState('vender');
  const [amount, setAmount] = useState('0340');
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');

  return (
    <div style={styles.container}>
      {/* 1. Navbar Superior */}
      <header style={styles.navbar}>
        <div style={styles.logoSection}>
          <div style={styles.logoBox}>
            <span style={{ fontSize: '18px' }}>💰</span>
          </div>
          <span style={styles.brandTitle}>LÓPEZ CRIPTO</span>
          <div style={styles.navPills}>
            <button 
              style={activeTab === 'comprar' ? styles.pillActiveRed : styles.pillInactive}
              onClick={() => setActiveTab('comprar')}
            >
              COMPRA
            </button>
            <button 
              style={activeTab === 'vender' ? styles.pillActiveRed : styles.pillInactive}
              onClick={() => setActiveTab('vender')}
            >
              VENDE
            </button>
            <button 
              style={activeTab === 'invertir' ? styles.pillActiveRed : styles.pillInactive}
              onClick={() => setActiveTab('invertir')}
            >
              INVIERTE
            </button>
          </div>
        </div>

        <div style={styles.rightHeader}>
          <div style={styles.currencySelector}>
            <label style={{ fontSize: '12px', color: '#aaa', marginRight: '6px' }}>Moneda:</label>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              style={styles.selectInput}
            >
              <option value="PEN">PEN (S/)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
          <div style={styles.binanceTag}>
            <span style={{ color: '#f0b90b', marginRight: '5px' }}>◆</span> Binance Live
          </div>
          {onLogout && (
            <button style={styles.logoutBtn} onClick={onLogout}>
              Salir
            </button>
          )}
        </div>
      </header>

      {/* 2. Sección: Mis Saldos / Billetera */}
      <section style={styles.walletCard}>
        <div style={styles.walletHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '18px' }}>💼</span>
            <h2 style={styles.walletTitle}>Mis Saldos / Billetera</h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '12px', color: '#888' }}>Balance Total Estimado:</span>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#00e676' }}>
              S/ 17,615.66
            </div>
          </div>
        </div>

        {/* Tarjetas de monedas individuales */}
        <div style={styles.balancesGrid}>
          <div style={styles.cryptoBox}>
            <span style={styles.cryptoLabel}>PE Soles (PEN)</span>
            <span style={styles.cryptoValue}>S/ 1500.00</span>
          </div>

          <div style={styles.cryptoBox}>
            <span style={styles.cryptoLabel}>US Dólares (USD)</span>
            <span style={styles.cryptoValue}>$ 500.00</span>
          </div>

          <div style={styles.cryptoBox}>
            <span style={styles.cryptoLabel}>
              <span style={{ color: '#ff9800', marginRight: '4px' }}>■</span> Bitcoin
            </span>
            <span style={styles.cryptoValue}>
              0.025 <small style={{ color: '#ff9800' }}>BTC</small>
            </span>
          </div>

          <div style={styles.cryptoBox}>
            <span style={styles.cryptoLabel}>
              <span style={{ color: '#2196f3', marginRight: '4px' }}>◆</span> Ethereum
            </span>
            <span style={styles.cryptoValue}>
              0.15 <small style={{ color: '#aaa' }}>ETH</small>
            </span>
          </div>

          <div style={styles.cryptoBox}>
            <span style={styles.cryptoLabel}>
              <span style={{ color: '#f0b90b', marginRight: '4px' }}>■</span> Binance Coin
            </span>
            <span style={styles.cryptoValue}>
              1.2 <small style={{ color: '#f0b90b' }}>BNB</small>
            </span>
          </div>

          <div style={styles.cryptoBox}>
            <span style={styles.cryptoLabel}>
              <span style={{ color: '#29b6f6', marginRight: '4px' }}>●</span> USD Coin
            </span>
            <span style={styles.cryptoValue}>
              0 <small style={{ color: '#aaa' }}>USDC</small>
            </span>
          </div>

          <div style={styles.cryptoBox}>
            <span style={styles.cryptoLabel}>
              <span style={{ color: '#00e676', marginRight: '4px' }}>●</span> Tether
            </span>
            <span style={styles.cryptoValue}>
              250 <small style={{ color: '#f0b90b' }}>USDT</small>
            </span>
          </div>
        </div>
      </section>

      {/* 3. Panel Inferior (Cotizaciones y Operación) */}
      <div style={styles.bottomSection}>
        {/* Tabla Cotizaciones Binance */}
        <div style={styles.quotesCard}>
          <h3 style={styles.cardHeaderTitle}>Cotizaciones Binance (PEN)</h3>
          <table style={styles.table}>
            <thead>
              <tr style={{ color: '#777', fontSize: '13px', textAlign: 'left' }}>
                <th style={{ paddingBottom: '12px' }}>Activo</th>
                <th style={{ paddingBottom: '12px', textAlign: 'right' }}>Compra (+3.1%)</th>
                <th style={{ paddingBottom: '12px', textAlign: 'right' }}>Venta (-3.1%)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={styles.tableRow}>
                <td>
                  <span style={{ color: '#ff9800', marginRight: '6px' }}>■</span>
                  <strong>Bitcoin</strong> <small style={{ color: '#777' }}>(BTC)</small>
                </td>
                <td style={{ textAlign: 'right', color: '#00e676', fontWeight: 'bold' }}>S/ 324,888.72</td>
                <td style={{ textAlign: 'right', color: '#ff5252', fontWeight: 'bold' }}>S/ 305,351.28</td>
              </tr>
              <tr style={styles.tableRow}>
                <td>
                  <span style={{ color: '#2196f3', marginRight: '6px' }}>◆</span>
                  <strong>Ethereum</strong> <small style={{ color: '#777' }}>(ETH)</small>
                </td>
                <td style={{ textAlign: 'right', color: '#00e676', fontWeight: 'bold' }}>S/ 10,399.83</td>
                <td style={{ textAlign: 'right', color: '#ff5252', fontWeight: 'bold' }}>S/ 9,774.42</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Formulario Operativo (Vender Cripto) */}
        <div style={styles.actionCard}>
          <h3 style={{ textAlign: 'center', margin: '0 0 15px 0', fontSize: '20px' }}>Vender Cripto</h3>
          
          <div style={styles.tabSwitchGroup}>
            <button 
              style={activeTab === 'comprar' ? styles.tabBtnActive : styles.tabBtnInactive}
              onClick={() => setActiveTab('comprar')}
            >
              Comprar
            </button>
            <button 
              style={activeTab === 'vender' ? styles.tabBtnActiveRed : styles.tabBtnInactive}
              onClick={() => setActiveTab('vender')}
            >
              Vender
            </button>
            <button 
              style={activeTab === 'invertir' ? styles.tabBtnActive : styles.tabBtnInactive}
              onClick={() => setActiveTab('invertir')}
            >
              Invertir
            </button>
          </div>

          <div style={{ marginTop: '15px' }}>
            <label style={styles.fieldLabel}>Monto (PEN):</label>
            <input 
              type="text" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              style={styles.inputField} 
            />
          </div>

          <div style={{ marginTop: '15px' }}>
            <label style={styles.fieldLabel}>Selecciona Cripto:</label>
            <select 
              value={selectedCrypto} 
              onChange={(e) => setSelectedCrypto(e.target.value)}
              style={styles.inputField}
            >
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="BNB">Binance Coin (BNB)</option>
              <option value="USDT">Tether (USDT)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// Estilos oscuros dorados idénticos a la interfaz
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0d14',
    color: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    padding: '15px 25px',
    boxSizing: 'border-box',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #1e232d',
    paddingBottom: '10px',
  },
  logoSection: { display: 'flex', alignItems: 'center', gap: '12px' },
  logoBox: {
    width: '35px',
    height: '35px',
    border: '1px solid #f0b90b',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#141824',
  },
  brandTitle: { fontSize: '20px', fontWeight: 'bold', color: '#f0b90b', letterSpacing: '1px' },
  navPills: { display: 'flex', gap: '6px', marginLeft: '15px' },
  pillInactive: {
    background: '#141824',
    border: '1px solid #2a2e3d',
    color: '#aaa',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  pillActiveRed: {
    background: '#ff5252',
    border: 'none',
    color: '#fff',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  rightHeader: { display: 'flex', alignItems: 'center', gap: '15px' },
  currencySelector: {
    display: 'flex',
    alignItems: 'center',
  },
  selectInput: {
    background: '#141824',
    border: '1px solid #f0b90b',
    color: '#f0b90b',
    padding: '4px 8px',
    borderRadius: '6px',
    fontWeight: 'bold',
  },
  binanceTag: {
    border: '1px solid #333',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#f0b90b',
    background: '#111520',
  },
  logoutBtn: {
    background: '#333',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  walletCard: {
    background: '#111520',
    border: '1px solid #f0b90b',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
  },
  walletHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  walletTitle: { margin: 0, color: '#f0b90b', fontSize: '18px' },
  balancesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '10px',
  },
  cryptoBox: {
    background: '#090b10',
    border: '1px solid #222736',
    borderRadius: '6px',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cryptoLabel: { fontSize: '11px', color: '#aaa', marginBottom: '6px' },
  cryptoValue: { fontSize: '15px', fontWeight: 'bold' },
  bottomSection: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '20px',
  },
  quotesCard: {
    background: '#111520',
    border: '1px solid #222736',
    borderRadius: '10px',
    padding: '20px',
  },
  cardHeaderTitle: { color: '#f0b90b', margin: '0 0 20px 0', fontSize: '16px', textAlign: 'center' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableRow: { borderTop: '1px solid #1a1e2b', height: '40px' },
  actionCard: {
    background: '#111520',
    border: '1px solid #f0b90b',
    borderRadius: '10px',
    padding: '20px',
  },
  tabSwitchGroup: { display: 'flex', gap: '8px', background: '#090b10', padding: '4px', borderRadius: '8px' },
  tabBtnInactive: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    color: '#aaa',
    padding: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  tabBtnActive: {
    flex: 1,
    background: '#1e2433',
    border: 'none',
    color: '#fff',
    padding: '8px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  tabBtnActiveRed: {
    flex: 1,
    background: '#ff5252',
    border: 'none',
    color: '#fff',
    padding: '8px',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  fieldLabel: { display: 'block', fontSize: '12px', color: '#aaa', marginBottom: '6px' },
  inputField: {
    width: '100%',
    background: '#090b10',
    border: '1px solid #222736',
    color: '#fff',
    padding: '10px',
    borderRadius: '6px',
    boxSizing: 'border-box',
  },
};