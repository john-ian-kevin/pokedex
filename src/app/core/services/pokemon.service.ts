import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {
    debounceTime,
    distinctUntilChanged,
    forkJoin,
    from,
    map,
    Observable,
    of,
    switchMap,
} from 'rxjs';

import { ColorService } from '@services/color.service';

import {
    Ability,
    EvolutionChainStep,
    Pokemon,
    PokemonListResponse,
    PokemonResponse,
} from '@interfaces/pokemon.inteface';

@Injectable({
    providedIn: 'root',
})
export class PokemonService {
    private _offset = 0;
    private _apiUrl = 'https://pokeapi.co/api/v2/pokemon';

    constructor(
        private _http: HttpClient,
        private _colorService: ColorService,
    ) {}

    getPokemonList(offset = 0, limit = 20): Observable<PokemonResponse> {
        this._offset += offset;
        return this._http
            .get<PokemonListResponse>(`${this._apiUrl}`, {
                params: { offset: this._offset, limit },
            })
            .pipe(
                distinctUntilChanged(),
                switchMap((resp: PokemonListResponse) => {
                    const pokemonDetails = resp.results.map((pokemon: any) =>
                        this.getPokemonDetails(pokemon.url),
                    );
                    return forkJoin(pokemonDetails).pipe(
                        map((pokemonDetails: Pokemon[]) => ({
                            count: resp.count,
                            pokemonDetails,
                        })),
                    );
                }),
            );
    }

    getPokemonDetails(url: string): Observable<Pokemon> {
        return this._http.get<Pokemon>(url).pipe(
            distinctUntilChanged(),
            switchMap((resp: Pokemon) => {
                return from(this._generatePokemonUI(resp)).pipe(
                    switchMap((ui) => {
                        return of({ ...resp, ui });
                    }),
                );
            }),
        );
    }

    getPokemonByName(name: string): Observable<PokemonResponse> {
        return this._http.get<Pokemon>(`${this._apiUrl}/${name.toLowerCase()}`).pipe(
            distinctUntilChanged(),
            switchMap((resp: Pokemon) => {
                return from(this._generatePokemonUI(resp)).pipe(
                    switchMap((ui) => {
                        return of({
                            count: 1,
                            pokemonDetails: [{ ...resp, ui }],
                        });
                    }),
                );
            }),
        );
    }

    getPokemonByAdvancedSearch(description: string): Observable<PokemonResponse> {
        return this._http
            .post<string>('http://localhost:3000/api/pokemon-advance-search', {
                description,
            })
            .pipe(
                debounceTime(1000),
                distinctUntilChanged(),
                switchMap((pokemonName: string) => {
                    if (pokemonName) {
                        const pokemonDetails = pokemonName.split(',').map((name) => {
                            return this.getPokemonByName(name.trim());
                        });
                        return forkJoin(pokemonDetails).pipe(
                            map((responses) => {
                                const pokemonDetails = responses.flatMap(
                                    (resp) => resp.pokemonDetails,
                                );
                                return {
                                    count: pokemonDetails.length,
                                    pokemonDetails,
                                };
                            }),
                        );
                    } else {
                        return of({
                            count: 0,
                            pokemonDetails: [],
                        });
                    }
                }),
            );
    }

    private async _generatePokemonUI(resp: Pokemon): Promise<Pokemon['ui']> {
        const other = resp.sprites.other;
        const { 'official-artwork': officialArtwork, home } = other;
        const { front_default, front_shiny } =
            (officialArtwork.front_default ?? officialArtwork.front_shiny) ? officialArtwork : home;
        const img = front_default || front_shiny;
        const bg = await this._colorService.getDominantColor(img);
        const ui = {
            img,
            bg,
            color: bg === '#f5f5f5' ? '#000' : '#fff',
            isFlipped: false,
        };
        return ui;
    }

    getSpecies(url: string): Observable<any> {
        return this._http.get(url);
    }

    getAbilityDetails(url: string): Observable<Ability> {
        return this._http.get<Ability>(url);
    }

    getMoveDetails(url: string): Observable<any> {
        return this._http.get(url);
    }

    getTypeEffectiveness(typeNames: string[]): Observable<any[]> {
        const requests = typeNames.map((name) =>
            this._http.get(`https://pokeapi.co/api/v2/type/${name}`),
        );
        return forkJoin(requests);
    }

    getPokemonSpecies(pokemonId: number): Observable<any> {
        return this._http.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
    }

    getEvolutionChain(url: string): Observable<any> {
        return this._http.get(url);
    }

    getEvolutionData(pokemonId: number): Observable<any> {
        return this.getPokemonSpecies(pokemonId).pipe(
            switchMap((species: any) => this.getEvolutionChain(species.evolution_chain.url)),
        );
    }

    getPokemonImg(name: string): Observable<any> {
        return this._http.get(`${this._apiUrl}/${name}`);
    }
}
