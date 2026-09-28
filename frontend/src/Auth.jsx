import { useState } from 'react';

export const Auth = ({ onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [data, setData] = useState({ username: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/api/auth/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, action: isRegister ? 'register' : 'login' })
      });

      const responseData = await res.json();

      if (res.ok) {
        onSuccess();
      } else {
        alert(responseData.error || 'Error en la autenticación');
      }
    } catch (error) {
      alert('Error al conectar con el servidor backend');
    }
  };

  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#121212', 
      color: '#fff'
    }}>
      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#1e1e1e', 
        padding: '30px', 
        borderRadius: '8px', 
        width: '300px', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '15px'
      }}>
        <h2 style={{ textAlign: 'center', margin: 0, color: '#f0b90b' }}>
          {isRegister ? 'Registro' : 'Login'} - López Cripto
        </h2>
        
        <input 
          type="text" 
          placeholder="Usuario" 
          required
          onChange={e => setData({ ...data, username: e.target.value })} 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#2b2b2b', color: '#fff' }}
        />
        
        <input 
          type="password" 
          placeholder="Contraseña" 
          required
          onChange={e => setData({ ...data, password: e.target.value })} 
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#2b2b2b', color: '#fff' }}
        />
        
        <button type="submit" style={{
          padding: '10px', 
          backgroundColor: '#f0b90b', 
          border: 'none', 
          borderRadius: '4px', 
          fontWeight: 'bold', 
          cursor: 'pointer'
        }}>
          {isRegister ? 'Registrarse' : 'Entrar'}
        </button>

        <p 
          onClick={() => setIsRegister(!isRegister)} 
          style={{ cursor: 'pointer', fontSize: '12px', textAlign: 'center', color: '#aaa' }}
        >
          {isRegister ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
        </p>
      </form>
    </div>
  );
};