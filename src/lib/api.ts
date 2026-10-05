export async function getCharacters(page: number = 1, name: string = '', status: string = '') {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (name) params.append('name', name);
  if (status) params.append('status', status);

  const res = await fetch(`https://rickandmortyapi.com/api/character/?${params.toString()}`);
  if (!res.ok) {
    throw new Error('Failed to fetch characters');
  }
  return res.json();
}

export async function getCharacterById(id: string | number) {
  const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch character details');
  }
  return res.json();
}