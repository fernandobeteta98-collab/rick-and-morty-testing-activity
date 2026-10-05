import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

import CharacterCard from '../components/CharacterCard';
import Pagination from '../components/Pagination';
import * as api from '../lib/api';
import Home from '../app/page';

// Mock de Next.js Image
vi.mock('next/image', () => ({
  default: ({ src, alt }: any) => <img src={src} alt={alt || 'mocked-image'} />,
}));

// Mock de Next.js Link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock de Next.js Navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams('page=1'),
}));

const mockCharacter = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: { name: 'Earth (C-137)', url: '' },
  location: { name: 'Citadel of Ricks', url: '' },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: ['https://rickandmortyapi.com/api/episode/1'],
  url: '',
  created: '',
};

describe('Suite de Pruebas Unificadas y Cobertura Completa', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('obtiene personajes exitosamente con getCharacters', async () => {
    const mockResponse = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [mockCharacter],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const data = await api.getCharacters(1, 'Rick', 'Alive');
    expect(data.results).toHaveLength(1);
    expect(data.results[0].name).toBe('Rick Sanchez');
  });

  it('maneja errores en getCharacters cuando la respuesta falla', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    await expect(api.getCharacters(1)).rejects.toThrow('Failed to fetch characters');
  });

  it('renderiza la tarjeta CharacterCard con su información', () => {
    render(<CharacterCard character={mockCharacter as any} />);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText(/Alive/i)).toBeInTheDocument();
    expect(screen.getByText(/Human/i)).toBeInTheDocument();
  });

  it('renderiza el componente de Pagination y sus enlaces', () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={vi.fn()}
      />
    );

    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    expect(screen.getByText(/Previous|Anterior|←/i)).toBeInTheDocument();
    expect(screen.getByText(/Next|Siguiente|→/i)).toBeInTheDocument();
  });

  it('renderiza la vista principal de la aplicación', async () => {
    const mockResponse = {
      info: { count: 1, pages: 1, next: null, prev: null },
      results: [mockCharacter],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const searchParamsPromise = Promise.resolve({ page: '1' });
    const ResolvedHome = await Home({ searchParams: searchParamsPromise });

    render(ResolvedHome);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
  });

  it('obtiene un personaje por ID con getCharacterById', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockCharacter,
    });

    const result = await api.getCharacterById('1');
    expect(result.name).toBe('Rick Sanchez');
  });

  it('maneja el fallo de API en getCharacterById', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    await expect(api.getCharacterById('999')).rejects.toThrow('Failed to fetch character details');
  });
});