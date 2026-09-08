import { useState } from 'react'
import './App.css'

function App() {
  const [monto, setMonto] = useState(1000);
  const [cripto, setCripto] = useState('USDT');
  const [operacion, setOperacion] = useState('compra');

  const criptos = [
    { simbolo: 'BTC', nombre: 'Bitcoin', icono: '🟧', compra: 64200.00, venta: 65100.00 },
    { simbolo: 'ETH', nombre: 'Ethereum', icono: '🔷', compra: 3450.00, venta: 3520.00 },
    { simbolo: 'USDT', nombre: 'Tether', icono: '🟢', compra: 3.72, venta: 3.76 },
    { simbolo: 'BNB', nombre: 'Binance Coin', icono: '🟨', compra: 580.00, venta: 595.00 },
    { simbolo: 'USDC', nombre: 'USD Coin', icono: '🔵', compra: 3.71, venta: 3.75 },
  ];

  const seleccionada = criptos.find(c => c.simbolo === cripto) || criptos[2];
  const precioTasa = operacion === 'compra' ? seleccionada.venta : seleccionada.compra;
  const resultado = (monto / precioTasa).toFixed(4);

  return (
    <div style={{ backgroundColor: '#0d0f12', color: '#ffffff', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      
      {/* CABECERA */}
      <header style={{ backgroundColor: '#14181d', borderBottom: '1px solid #d4af37', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img 
            src="/logo.jpg" 
            alt="López Cripto Logo" 
            onError={(e) => { e.target.src = '/logo.png'; }} // Intenta PNG si la extensión no es JPG
            style={{ height: '50px', borderRadius: '8px', border: '1px solid #d4af37' }} 
          />
          <div>
            <h1 style={{ margin: 0, fontSize: '1.4rem', color: '#d4af37', letterSpacing: '2px' }}>LÓPEZ CRIPTO</h1>
            <span style={{ fontSize: '0.75rem', color: '#aaa', letterSpacing: '1px' }}>COMPRA | VENDE | INVIERTE</span>
          </div>
        </div>

        <div style={{ color: '#28a745', fontWeight: 'bold', fontSize: '0.9rem' }}>
          🔒 Tu confianza, nuestra prioridad
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ maxWidth: '1100px', margin: '30px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px' }}>
        
        {/* COTIZACIONES */}
        <section style={{ backgroundColor: '#14181d', padding: '20px', borderRadius: '12px', border: '1px solid #2a2e35' }}>
          <h2 style={{ color: '#d4af37', fontSize: '1.2rem', marginTop: 0, borderBottom: '1px solid #2a2e35', paddingBottom: '10px' }}>
            Cotizaciones en Tiempo Real
          </h2>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ color: '#888', fontSize: '0.85rem', textAlign: 'left', borderBottom: '1px solid #2a2e35' }}>
                <th style={{ padding: '10px' }}>Activo</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Compra</th>
                <th style={{ padding: '10px', textAlign: 'right' }}>Venta</th>
              </tr>
            </thead>
            <tbody>
              {criptos.map((item) => (
                <tr key={item.simbolo} style={{ borderBottom: '1px solid #1f242d' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>
                    <span style={{ marginRight: '8px' }}>{item.icono}</span> {item.nombre} <span style={{ color: '#666', fontSize: '0.8rem' }}>({item.simbolo})</span>
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'right', color: '#00e676', fontWeight: 'bold' }}>
                    ${item.compra.toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 10px', textAlign: 'right', color: '#ff5252', fontWeight: 'bold' }}>
                    ${item.venta.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* CALCULADORA */}
        <section style={{ backgroundColor: '#14181d', padding: '20px', borderRadius: '12px', border: '1px solid #d4af37' }}>
          <h2 style={{ color: '#ffffff', fontSize: '1.2rem', marginTop: 0, textAlign: 'center' }}>
            Operar Cripto
          </h2>

          <div style={{ display: 'flex', gap: '10px', margin: '20px 0' }}>
            <button 
              onClick={() => setOperacion('compra')}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: operacion === 'compra' ? '#d4af37' : '#2a2e35', color: operacion === 'compra' ? '#000' : '#fff' }}>
              Comprar
            </button>
            <button 
              onClick={() => setOperacion('venta')}
              style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: operacion === 'venta' ? '#d4af37' : '#2a2e35', color: operacion === 'venta' ? '#000' : '#fff' }}>
              Vender
            </button>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px' }}>Monto a enviar:</label>
            <input 
              type="number" 
              value={monto} 
              onChange={(e) => setMonto(Number(e.target.value))} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #2a2e35', backgroundColor: '#0d0f12', color: '#fff', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px' }}>Selecciona Cripto:</label>
            <select 
              value={cripto} 
              onChange={(e) => setCripto(e.target.value)} 
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #2a2e35', backgroundColor: '#0d0f12', color: '#fff' }}>
              {criptos.map(c => <option key={c.simbolo} value={c.simbolo}>{c.nombre} ({c.simbolo})</option>)}
            </select>
          </div>

          <div style={{ backgroundColor: '#0d0f12', padding: '15px', borderRadius: '8px', textAlign: 'center', margin: '20px 0', border: '1px solid #2a2e35' }}>
            <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Recibes estimadamente:</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#d4af37', marginTop: '5px' }}>
              {resultado} {seleccionada.simbolo}
            </div>
          </div>

          <button style={{ width: '100%', padding: '12px', backgroundColor: '#d4af37', color: '#000', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }}>
            Solicitar Operación
          </button>
        </section>

      </main>
    </div>
  );
}

export default App