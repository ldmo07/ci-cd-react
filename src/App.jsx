import { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:8083/personas';

export default function App() {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState({ nombre: '', apellido: '', edad: '' });

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

  const startEdit = (p) => {
    setActionError(null);
    setEditingId(p.id);
    setDraft({ nombre: p.nombre, apellido: p.apellido, edad: String(p.edad) });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (e) => {
    e.preventDefault();
    const body = { id: editingId, nombre: draft.nombre.trim(), apellido: draft.apellido.trim(), edad: Number(draft.edad) };
    try {
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setPersonas((list) => list.map((p) => (p.id === editingId ? body : p)));
      setEditingId(null);
      setActionError(null);
    } catch (err) {
      setActionError(`No se pudo guardar: ${err.message}`);
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Eliminar a ${p.nombre} ${p.apellido}?`)) return;
    try {
      const res = await fetch(`${API_URL}/${p.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setPersonas((list) => list.filter((x) => x.id !== p.id));
      setActionError(null);
    } catch (err) {
      setActionError(`No se pudo eliminar: ${err.message}`);
    }
  };

  const setField = (field) => (e) => setDraft((d) => ({ ...d, [field]: e.target.value }));

  return (
    <main className="container">
      <h1>Personas</h1>
      <p className="subtitle">Datos consumidos desde {API_URL}</p>

      {loading && <p className="status">Cargando...</p>}
      {error && <p className="status error">No se pudo cargar: {error}</p>}
      {actionError && <p className="status error">{actionError}</p>}

      <ul className="grid">
        {personas.map((p) =>
          editingId === p.id ? (
            <li key={p.id} className="card">
              <form className="edit-form" onSubmit={saveEdit}>
                <input value={draft.nombre} onChange={setField('nombre')} placeholder="Nombre" aria-label="Nombre" required />
                <input value={draft.apellido} onChange={setField('apellido')} placeholder="Apellido" aria-label="Apellido" required />
                <input type="number" min="0" value={draft.edad} onChange={setField('edad')} placeholder="Edad" aria-label="Edad" required />
                <div className="actions">
                  <button type="submit" className="btn primary">Guardar</button>
                  <button type="button" className="btn" onClick={cancelEdit}>Cancelar</button>
                </div>
              </form>
            </li>
          ) : (
            <li key={p.id} className="card">
              <div className="avatar">{p.nombre[0]}{p.apellido[0]}</div>
              <div className="info">
                <h2>{p.nombre} {p.apellido}</h2>
                <span className="badge">{p.edad} anos</span>
              </div>
              <div className="actions">
                <button type="button" className="btn" onClick={() => startEdit(p)}>Editar</button>
                <button type="button" className="btn danger" onClick={() => remove(p)}>Eliminar</button>
              </div>
            </li>
          )
        )}
      </ul>
    </main>
  );
}
