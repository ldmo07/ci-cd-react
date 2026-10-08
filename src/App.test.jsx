import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import App from './App.jsx';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

test('muestra las personas devueltas por la API', async () => {
  const personas = [{ id: '1', nombre: 'Ana', apellido: 'Gomez', edad: 30 }];
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => personas }));

  render(<App />);

  expect(await screen.findByText('Ana Gomez')).toBeTruthy();
  expect(screen.getByText('30 anos')).toBeTruthy();
});

test('muestra un error si la API falla', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));

  render(<App />);

  expect(await screen.findByText(/No se pudo cargar: HTTP 500/)).toBeTruthy();
});