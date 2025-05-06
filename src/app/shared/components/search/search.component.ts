import { Component, EventEmitter, Output } from '@angular/core';

import { BehaviorSubject, distinctUntilChanged, Observable, switchMap } from 'rxjs';

import { PokemonService } from '@app/core/services/pokemon.service';

import { PokemonResponse } from '@app/core/interfaces/pokemon.inteface';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
    @Output() searchClicked = new EventEmitter<void>();
    @Output() searchPokemon = new EventEmitter<PokemonResponse>();

    searchQuery: string = '';
    isAdvancedSearch: boolean = false;

    private searchQuerySubject = new BehaviorSubject<string>('');
    searchQuery$ = this.searchQuerySubject.asObservable();

    private isAdvancedSearchSubject = new BehaviorSubject<boolean>(false);

    constructor(private _pokemonService: PokemonService) {}

    get placeholder(): string {
        return this.isAdvancedSearch
            ? '🧠 Describe the pokemon you are looking for'
            : '🔍 Search Pokémon by name';
    }

    ngOnInit(): void {
        this.searchQuery$
            .pipe(
                distinctUntilChanged(),
                switchMap((query) => this._getSearchResults(query)),
            )
            .subscribe({
                next: (pokemonResponse) => {
                    this.searchPokemon.emit(pokemonResponse);
                },
                error: () => {
                    this.searchPokemon.emit({
                        count: 0,
                        pokemonDetails: [],
                    });
                },
            });
    }

    onSearchPokemon(): void {
        const currentQuery = this.searchQuery.trim();

        if (this._isSearchParamsNoChanges(currentQuery)) {
            return;
        }

        this.searchClicked.emit();
        this.searchQuerySubject.next(currentQuery);
        this.isAdvancedSearchSubject.next(this.isAdvancedSearch);
    }

    private _getSearchResults(query: string): Observable<PokemonResponse> {
        let searchResults$: Observable<PokemonResponse>;

        if (query.length === 0) {
            searchResults$ = this._pokemonService.getPokemonList();
        } else {
            if (this.isAdvancedSearch) {
                searchResults$ = this._pokemonService.getPokemonByAdvancedSearch(this.searchQuery);
            } else {
                searchResults$ = this._pokemonService.getPokemonByName(this.searchQuery);
            }
        }

        return searchResults$;
    }

    private _isSearchParamsNoChanges(currentQuery: string): boolean {
        return (
            this.searchQuerySubject.getValue().trim() === currentQuery &&
            this.isAdvancedSearchSubject.getValue() === this.isAdvancedSearch
        );
    }
}
