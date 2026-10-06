import { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:8083/personas';

export default function App() {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(setPersonas)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="container">
      <h1>Personas</h1>
      <p className="subtitle">Datos consumidos desde {API_URL}</p>

      {loading && <p className="status">Cargando...</p>}
      {error && <p className="status error">No se pudo cargar: {error}</p>}

      <ul className="grid">
        {personas.map((p) => (
          <li key={p.id} className="card">
            <div className="avatar">{p.nombre[0]}{p.apellido[0]}</div>
            <div>
              <h2>{p.nombre} {p.apellido}</h2>
              <span className="badge">{p.edad} anos</span>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
