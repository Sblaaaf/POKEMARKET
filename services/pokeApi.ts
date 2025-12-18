
export const fetchPokemonData = async (id: number) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) throw new Error('Pokemon not found');
    const data = await response.json();
    
    return {
      id: data.id,
      name: data.name,
      types: data.types.map((t: any) => t.type.name),
      imageUrl: data.sprites.other['official-artwork'].front_default || data.sprites.front_default
    };
  } catch (error) {
    console.error('Error fetching pokemon:', error);
    return null;
  }
};

export const getRandomId = () => Math.floor(Math.random() * 1025) + 1;
