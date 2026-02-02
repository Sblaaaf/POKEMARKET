
export const fetchPokemonData = async (id: number | string) => {
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

export const fetchEvolutionData = async (pokemonId: number) => {
  try {
    // 1. Get species to find the evolution chain URL
    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
    if (!speciesRes.ok) return null;
    const speciesData = await speciesRes.json();
    
    const chainRes = await fetch(speciesData.evolution_chain.url);
    if (!chainRes.ok) return null;
    const chainData = await chainRes.json();

    // 2. Traverse the chain to find the current pokemon and its next evolution
    let current = chainData.chain;
    let found = false;

    const findNext = (node: any): string | null => {
      if (node.species.name === speciesData.name) {
        if (node.evolves_to && node.evolves_to.length > 0) {
          return node.evolves_to[0].species.name;
        }
        return null;
      }
      for (const edge of node.evolves_to) {
        const result = findNext(edge);
        if (result) return result;
      }
      return null;
    };

    const nextEvolutionName = findNext(current);
    if (!nextEvolutionName) return null;

    // 3. Fetch the data for the evolved form
    return await fetchPokemonData(nextEvolutionName);
  } catch (error) {
    console.error('Error fetching evolution:', error);
    return null;
  }
};

export const getRandomId = () => Math.floor(Math.random() * 1025) + 1;
