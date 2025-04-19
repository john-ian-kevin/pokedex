export interface PokemonResponse {
    count: number;
    pokemonDetails: ReadonlyArray<Pokemon>;
}

export interface PokemonListResponse {
    count: number;
    next: string;
    previous: string;
    results: ReadonlyArray<GenericKeyValue>;
}

export interface GenericKeyValue {
    name: string;
    url: string;
}

export interface Pokemon {
    abilities: ReadonlyArray<Ability>;
    base_experience: number;
    cries: Cry;
    forms: ReadonlyArray<GenericKeyValue>;
    game_indices: ReadonlyArray<GameIndex>;
    height: number;
    held_items: ReadonlyArray<HeldItem>;
    id: number;
    is_default: boolean;
    location_area_encounters: string;
    moves: ReadonlyArray<Move>;
    name: string;
    order: number;
    past_abilities: ReadonlyArray<PastAbility>;
    past_types: ReadonlyArray<PastType>;
    species: GenericKeyValue;
    sprites: Sprites;
    stats: ReadonlyArray<Stat>;
    types: ReadonlyArray<Type>;
    weight: number;
    ui?: {
        img: string;
        bg: string;
        color: string;
        isFlipped: boolean;
    };
}

export interface Ability {
    ability: GenericKeyValue;
    is_hidden: boolean;
    slot: number;
}

export interface Cry {
    latest: string;
    legacy: string;
}

export interface GameIndex {
    game_index: number;
    version: GenericKeyValue;
}

export interface HeldItem {
    item: GenericKeyValue;
    version_details: ReadonlyArray<VersionDetail>;
}

export interface VersionDetail {
    rarity: number;
    version: GenericKeyValue;
}

export interface Move {
    move: GenericKeyValue;
    version_group_details: ReadonlyArray<VersionGroupDetail>;
}

export interface VersionGroupDetail {
    level_learned_at: number;
    move_learn_method: GenericKeyValue;
    version_group: GenericKeyValue;
    order: number;
}

export interface PastAbility {
    ability: GenericKeyValue;
    is_hidden: boolean;
    slot: number;
}

export interface PastType {
    generation: GenericKeyValue;
    types: ReadonlyArray<Type>;
}

export interface Type {
    slot: number;
    type: GenericKeyValue;
}

export interface Sprites {
    back_default: string;
    back_female: string;
    back_shiny: string;
    back_shiny_female: string;
    front_default: string;
    front_female: string;
    front_shiny: string;
    front_shiny_female: string;
    other: Other;
    versions: Versions;
}

export interface Other {
    dream_world: OtherImage;
    home: Home;
    'official-artwork': OfficialArtwork;
    showdown: OtherImage;
}

export interface showdown extends OtherImage {
    back_default: string;
    back_female: string;
    back_shiny: string;
    back_shiny_female: string;
    front_shiny: string;
    front_shiny_female: string;
}

export interface OtherImage {
    front_default: string;
    front_female: string;
}

export interface Home extends OtherImage {
    front_shiny: string;
    front_shiny_female: string;
}

export interface OfficialArtwork extends OtherImage {
    front_shiny: string;
}

export interface Versions {
    'generation-i': GenerationI;
    'generation-ii': GenerationII;
    'generation-iii': GenerationIII;
    'generation-iv': GenerationIV;
    'generation-v': GenerationV;
    'generation-vi': GenerationVI;
    'generation-vii': GenerationVII;
    'generation-viii': GenerationVIII;
}

export interface Generation {
    back_default: string;
    back_gray?: string;
    back_transparent?: string;
    back_shiny?: string;
    back_shiny_transparent?: string;
    back_female?: string;

    front_default: string;
    front_gray?: string;
    front_transparent?: string;
    front_shiny?: string;
    front_shiny_transparent?: string;
    front_female?: string;
    front_shiny_female?: string;
}

export interface GenerationI {
    red_blue: Generation;
    yellow: Generation;
}

export interface GenerationII {
    crystal: Generation;
    gold: Generation;
    silver: Generation;
}

export interface GenerationIII {
    emerald: Generation;
    firered_leafgreen: Generation;
    ruby_sapphire: Generation;
}

export interface GenerationIV {
    diamond_pearl: Generation;
    heartgold_soulsilver: Generation;
    platinum: Generation;
}

export interface GenerationV {
    black_white: Generation;
}

export interface GenerationVI {
    omegaruby_alphasapphire: Generation;
    x_y: Generation;
}

export interface GenerationVII {
    icons: Generation;
    ultra_sun_ultra_moon: Generation;
}

export interface GenerationVIII {
    icons: Generation;
}

export interface Stat {
    base_stat: number;
    effort: number;
    stat: GenericKeyValue;
}

export interface TypeEffectiveness {
    double_damage_from: string[];
    double_damage_to: string[];
    half_damage_from: string[];
    half_damage_to: string[];
    no_damage_from: string[];
    no_damage_to: string[];
}

export interface PokemonWithDetails extends Pokemon {
    effectiveness?: TypeEffectiveness;
    evolution_chain?: {
        species: string;
        evolves_to: EvolutionChain[];
    };
}

export interface EvolutionChain {
    species: string;
    evolves_to: EvolutionChain[];
}

export interface Ability {
    name: string;
    effect_entries: {
        effect: string;
        short_effect: string;
        language: { name: string };
    }[];
}

export interface MoveDetail {
    name: string;
    type: string;
    power: number;
    accuracy: number;
    pp: number;
    effect: string;
    level: number;
    method: string;
}

export interface EvolutionChainStep {
    name: string;
    img: string;
}

export interface Description {
    flavor_text: string;
    version: string[];
}

export interface IEffectiveness {
    superEffective: any[];
    normal: any[];
    notVeryEffective: any[];
    noEffect: any[];
}
