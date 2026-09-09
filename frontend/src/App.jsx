import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // Estados para datos de Binance API
  const [criptos, setCriptos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados para la Calculadora (compra / venta / inversion)
  const [operacion, setOperacion] = useState('compra');
  const [cripto, setCripto] = useState('BTC');
  const [monto, setMonto] = useState(100);
  const [plazoMeses, setPlazoMeses] = useState(12); // Para el modo Inversión

  // Estado para la Selección Fiat (USD / PEN)
  const [fiat, setFiat] = useState('USD');
  const tipoCambioPEN = 3.75; // 1 USD = 3.75 PEN

  // ESTADO DE SALDOS / BILLETERA
  const [saldos, setSaldos] = useState({
    PEN: 1500.00,
    USD: 500.00,
    BTC: 0.025,
    ETH: 0.15,
    BNB: 1.2,
    USDT: 250.00
  });

  // ESTADO PARA VISUALIZAR IMAGEN A PANTALLA COMPLETA
  const [imagenModal, setImagenModal] = useState(null);

  // Configuración de pares de Binance
  const paresBinance = [
    { simbolo: 'BTC', par: 'BTCUSDT', nombre: 'Bitcoin', icono: '🟧', apy: 5.2 },
    { simbolo: 'ETH', par: 'ETHUSDT', nombre: 'Ethereum', icono: '🔷', apy: 4.8 },
    { simbolo: 'BNB', par: 'BNBUSDT', nombre: 'Binance Coin', icono: '🟨', apy: 7.5 },
    { simbolo: 'USDC', par: 'USDCUSDT', nombre: 'USD Coin', icono: '🔵', apy: 8.0 },
    { simbolo: 'USDT', par: 'USDTUSD', nombre: 'Tether', icono: '🟢', apy: 8.5 }
  ];

  // Consulta en tiempo real a Binance API con margen de 3.1% por operación
  useEffect(() => {
    const obtenerPreciosBinance = async () => {
      try {
        const res = await fetch('https://api.binance.com/api/v3/ticker/price');
        const data = await res.json();

        const margenPorOperacion = 0.031; // 3.1% de utilidad por operación

        const listaActualizada = paresBinance.map((item) => {
          let precioBase = 1;

          if (item.simbolo === 'USDT') {
            precioBase = 1.0; 
          } else {
            const coinData = data.find((d) => d.symbol === item.par);
            precioBase = coinData ? parseFloat(coinData.price) : 0;
          }

          return {
            simbolo: item.simbolo,
            nombre: item.nombre,
            icono: item.icono,
            apy: item.apy,
            precioBase: precioBase,
            compra: +(precioBase * (1 + margenPorOperacion)), // +3.1% para compra
            venta: +(precioBase * (1 - margenPorOperacion))   // -3.1% para venta
          };
        });

        setCriptos(listaActualizada);
        setCargando(false);
      } catch (error) {
        console.error("Error consultando la API de Binance:", error);
        setCargando(false);
      }
    };

    obtenerPreciosBinance();
    const intervalo = setInterval(obtenerPreciosBinance, 10000);
    return () => clearInterval(intervalo);
  }, []);

  // Formateador de precios dinámico (USD vs PEN)
  const formatearPrecio = (precioEnUSD) => {
    if (fiat === 'PEN') {
      const enSoles = precioEnUSD * tipoCambioPEN;
      return `S/ ${enSoles.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$ ${precioEnUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Selección activa y equivalencia a USD
  const seleccionada = criptos.find(c => c.simbolo === cripto) || criptos[0];
  const montoEnUSD = fiat === 'PEN' ? (monto / tipoCambioPEN) : monto;

  // Cálculo de resultado con reglas de $100 USD y comisión de S/ 10
  const calcularResultado = () => {
    if (!seleccionada) return '0.0000';
    
    // Modo Inversión (Staking Proyectado)
    if (operacion === 'inversion') {
      const apyDecimal = (seleccionada.apy || 5) / 100;
      const gananciaEstimadaUSD = montoEnUSD * (apyDecimal * (plazoMeses / 12));
      const totalUSD = montoEnUSD + gananciaEstimadaUSD;
      return fiat === 'PEN' 
        ? `S/ ${(totalUSD * tipoCambioPEN).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : `$ ${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    const comisionFijaPEN = 10;
    const comisionFijaUSD = comisionFijaPEN / tipoCambioPEN;

    // Menor a 100 USD: Aplica tarifa fija de S/ 10
    if (montoEnUSD < 100) {
      if (operacion === 'compra') {
        const montoNetoUSD = Math.max(0, montoEnUSD - comisionFijaUSD);
        const criptoCantidad = (montoNetoUSD / seleccionada.precioBase).toFixed(4);
        return `${criptoCantidad} ${seleccionada.simbolo}`;
      } else {
        // Venta
        const criptoCantidad = (montoEnUSD / seleccionada.precioBase);
        const valorEnPEN = (criptoCantidad * seleccionada.precioBase * tipoCambioPEN) - comisionFijaPEN;
        const valorFinalPEN = Math.max(0, valorEnPEN);

        return fiat === 'PEN'
          ? `S/ ${valorFinalPEN.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : `$ ${(valorFinalPEN / tipoCambioPEN).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
    } else {
      // Igual o mayor a 100 USD: Aplica el 3.1% de margen
      const precioTasa = operacion === 'compra' ? seleccionada.compra : seleccionada.venta;
      const criptoCantidad = (montoEnUSD / precioTasa).toFixed(4);
      return `${criptoCantidad} ${seleccionada.simbolo}`;
    }
  };

  // Cálculo del Portafolio Total
  const calcularTotalPortafolio = () => {
    let totalUSD = saldos.USD + (saldos.PEN / tipoCambioPEN);
    
    criptos.forEach(item => {
      const cantidad = saldos[item.simbolo] || 0;
      totalUSD += cantidad * item.compra;
    });

    if (fiat === 'PEN') {
      return `S/ ${(totalUSD * tipoCambioPEN).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `$ ${totalUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (cargando) {
    return (
      <div style={{ backgroundColor: '#0d0f12', color: '#d4af37', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2>Conectando con Binance API...</h2>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0d0f12', color: '#ffffff', minHeight: '100vh', width: '100%', fontFamily: 'Arial, sans-serif', paddingBottom: '40px', boxSizing: 'border-box' }}>
      
      {/* MODAL IMAGEN A PANTALLA COMPLETA */}
      {imagenModal && (
        <div 
          onClick={() => setImagenModal(null)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, cursor: 'pointer', padding: '20px' }}>
          <button 
            onClick={() => setImagenModal(null)}
            style={{ position: 'absolute', top: '20px', right: '25px', backgroundColor: '#d4af37', color: '#000', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}>
            ✕
          </button>
          <img src={imagenModal} alt="Logo" onError={() => setImagenModal(null)} style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: '12px', border: '2px solid #d4af37', objectFit: 'contain' }} />
        </div>
      )}

      {/* CABECERA */}
      <header style={{ backgroundColor: '#14181d', borderBottom: '1px solid #d4af37', padding: '15px 20px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div 
            onClick={() => setImagenModal('/logo.jpeg')}
            style={{ width: '50px', height: '50px', borderRadius: '8px', border: '1px solid #d4af37', backgroundColor: '#0d0f12', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', overflow: 'hidden' }}>
            <img src="/logo.jpeg" alt="Logo" onError={(e) => { e.target.style.display = 'none'; }} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div>
            <h1 style={{ margin: 0, fontSize: '1.3rem', color: '#d4af37', letterSpacing: '1.5px' }}>LÓPEZ CRIPTO</h1>
            
            {/* OPCIONES INTERACTIVAS RESALTADAS */}
            <div style={{ display: 'flex', gap: '6px', marginTop: '6px', alignItems: 'center' }}>
              <button
                onClick={() => setOperacion('compra')}
                style={{
                  backgroundColor: operacion === 'compra' ? '#00e676' : '#1a1f26',
                  color: operacion === 'compra' ? '#000000' : '#888888',
                  border: '1px solid',
                  borderColor: operacion === 'compra' ? '#00e676' : '#333333',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                COMPRA
              </button>

              <span style={{ color: '#444', fontSize: '0.8rem' }}>|</span>

              <button
                onClick={() => setOperacion('venta')}
                style={{
                  backgroundColor: operacion === 'venta' ? '#ff5252' : '#1a1f26',
                  color: operacion === 'venta' ? '#ffffff' : '#888888',
                  border: '1px solid',
                  borderColor: operacion === 'venta' ? '#ff5252' : '#333333',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                VENDE
              </button>

              <span style={{ color: '#444', fontSize: '0.8rem' }}>|</span>

              <button
                onClick={() => setOperacion('inversion')}
                style={{
                  backgroundColor: operacion === 'inversion' ? '#d4af37' : '#1a1f26',
                  color: operacion === 'inversion' ? '#000000' : '#888888',
                  border: '1px solid',
                  borderColor: operacion === 'inversion' ? '#d4af37' : '#333333',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  fontSize: '0.7rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                INVIERTE
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.85rem', color: '#aaa' }}>Moneda:</label>
            <select 
              value={fiat} 
              onChange={(e) => setFiat(e.target.value)}
              style={{ backgroundColor: '#0d0f12', color: '#d4af37', border: '1px solid #d4af37', padding: '5px 10px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
              <option value="USD">USD ($)</option>
              <option value="PEN">PEN (S/)</option>
            </select>
          </div>

          <div style={{ color: '#f3ba2f', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🔶</span> Binance Live
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ maxWidth: '100%', margin: '20px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '25px', boxSizing: 'border-box' }}>
        
        {/* MIS SALDOS */}
        <section style={{ backgroundColor: '#14181d', padding: '20px', borderRadius: '12px', border: '1px solid #d4af37' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2a2e35', paddingBottom: '12px', marginBottom: '15px', gap: '10px' }}>
            <h2 style={{ color: '#d4af37', fontSize: '1.2rem', margin: 0 }}>💼 Mis Saldos / Billetera</h2>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: '#aaa' }}>Balance Total Estimado:</span>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00e676' }}>{calcularTotalPortafolio()}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
            <div style={{ backgroundColor: '#0d0f12', padding: '12px', borderRadius: '8px', border: '1px solid #2a2e35' }}>
              <span style={{ fontSize: '0.8rem', color: '#aaa' }}>🇵🇪 Soles (PEN)</span>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>S/ {saldos.PEN.toFixed(2)}</div>
            </div>

            <div style={{ backgroundColor: '#0d0f12', padding: '12px', borderRadius: '8px', border: '1px solid #2a2e35' }}>
              <span style={{ fontSize: '0.8rem', color: '#aaa' }}>🇺🇸 Dólares (USD)</span>
              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>$ {saldos.USD.toFixed(2)}</div>
            </div>

            {criptos.map((item) => (
              <div key={item.simbolo} style={{ backgroundColor: '#0d0f12', padding: '12px', borderRadius: '8px', border: '1px solid #2a2e35' }}>
                <span style={{ fontSize: '0.8rem', color: '#aaa' }}>{item.icono} {item.nombre}</span>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', marginTop: '4px' }}>
                  {(saldos[item.simbolo] || 0)} <span style={{ fontSize: '0.75rem', color: '#d4af37' }}>{item.simbolo}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TABLA Y CALCULADORA */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px' }}>
          
          {/* COTIZACIONES */}
          <section style={{ backgroundColor: '#14181d', padding: '20px', borderRadius: '12px', border: '1px solid #2a2e35', overflowX: 'auto' }}>
            <h2 style={{ color: '#d4af37', fontSize: '1.2rem', marginTop: 0, borderBottom: '1px solid #2a2e35', paddingBottom: '10px' }}>
              Cotizaciones Binance ({fiat})
            </h2>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', minWidth: '280px' }}>
              <thead>
                <tr style={{ color: '#888', fontSize: '0.85rem', textAlign: 'left', borderBottom: '1px solid #2a2e35' }}>
                  <th style={{ padding: '10px' }}>Activo</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Compra (+3.1%)</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Venta (-3.1%)</th>
                </tr>
              </thead>
              <tbody>
                {criptos.map((item) => (
                  <tr key={item.simbolo} style={{ borderBottom: '1px solid #1f242d' }}>
                    <td style={{ padding: '12px 10px', fontWeight: 'bold' }}>
                      <span style={{ marginRight: '6px' }}>{item.icono}</span> {item.nombre} <span style={{ color: '#666', fontSize: '0.75rem' }}>({item.simbolo})</span>
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'right', color: '#00e676', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      {formatearPrecio(item.compra)}
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'right', color: '#ff5252', fontWeight: 'bold', fontSize: '0.9rem' }}>
                      {formatearPrecio(item.venta)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* CALCULADORA */}
          <section style={{ backgroundColor: '#14181d', padding: '20px', borderRadius: '12px', border: '1px solid #d4af37' }}>
            <h2 style={{ color: '#ffffff', fontSize: '1.2rem', marginTop: 0, textAlign: 'center' }}>
              {operacion === 'compra' && 'Comprar Cripto'}
              {operacion === 'venta' && 'Vender Cripto'}
              {operacion === 'inversion' && 'Proyección de Inversión (Staking)'}
            </h2>

            <div style={{ display: 'flex', gap: '8px', margin: '20px 0' }}>
              <button 
                onClick={() => setOperacion('compra')}
                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: operacion === 'compra' ? '#00e676' : '#2a2e35', color: operacion === 'compra' ? '#000' : '#fff' }}>
                Comprar
              </button>
              <button 
                onClick={() => setOperacion('venta')}
                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: operacion === 'venta' ? '#ff5252' : '#2a2e35', color: operacion === 'venta' ? '#fff' : '#fff' }}>
                Vender
              </button>
              <button 
                onClick={() => setOperacion('inversion')}
                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold', backgroundColor: operacion === 'inversion' ? '#d4af37' : '#2a2e35', color: operacion === 'inversion' ? '#000' : '#fff' }}>
                Invertir
              </button>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px' }}>Monto ({fiat}):</label>
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

            {operacion === 'inversion' && (
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '5px' }}>Plazo de Inversión:</label>
                <select 
                  value={plazoMeses} 
                  onChange={(e) => setPlazoMeses(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #2a2e35', backgroundColor: '#0d0f12', color: '#fff' }}>
                  <option value={3}>3 Meses</option>
                  <option value={6}>6 Meses</option>
                  <option value={12}>12 Meses (1 Año)</option>
                  <option value={24}>24 Meses (2 Años)</option>
                </select>
              </div>
            )}

            {/* AVISO DE TARIFA APLICADA */}
            {operacion !== 'inversion' && (
              <div style={{ fontSize: '0.75rem', color: '#d4af37', marginBottom: '15px', textAlign: 'center' }}>
                {montoEnUSD < 100 
                  ? '⚠️ Monto < $100 USD: Aplica tarifa fija de S/ 10.00 por pedido.' 
                  : '✅ Monto ≥ $100 USD: Aplica margen preferencial de 3.1%.'}
              </div>
            )}

            {/* RESULTADO */}
            <div style={{ backgroundColor: '#0d0f12', padding: '15px', borderRadius: '8px', textAlign: 'center', margin: '15px 0', border: '1px solid #2a2e35' }}>
              <span style={{ fontSize: '0.8rem', color: '#aaa' }}>
                {operacion === 'inversion' ? `Retorno Total Est. (${seleccionada?.apy || 5}% APY):` : 'Recibes estimadamente:'}
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color: operacion === 'compra' ? '#00e676' : operacion === 'venta' ? '#ff5252' : '#d4af37', marginTop: '5px' }}>
                {calcularResultado()}
              </div>
            </div>

            <button style={{ 
              width: '100%', 
              padding: '12px', 
              backgroundColor: operacion === 'compra' ? '#00e676' : operacion === 'venta' ? '#ff5252' : '#d4af37', 
              color: operacion === 'venta' ? '#fff' : '#000', 
              border: 'none', 
              borderRadius: '6px', 
              fontWeight: 'bold', 
              cursor: 'pointer', 
              fontSize: '1rem' 
            }}>
              {operacion === 'compra' && 'Solicitar Compra'}
              {operacion === 'venta' && 'Solicitar Venta'}
              {operacion === 'inversion' && 'Iniciar Inversión'}
            </button>
          </section>

        </div>
      </main>
    </div>
  );
}

export default App;