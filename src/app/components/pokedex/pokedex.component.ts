import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';

import { PokemonDetailsComponent } from '@app/components/pokemon-details/pokemon-details.component';
import { SearchComponent } from '@app/shared/components/search/search.component';

import { DynamicComponentService } from '@app/core/services/dynamic-component.service';
import { PokemonService } from '@app/core/services/pokemon.service';

import { Pokemon, PokemonResponse } from '@app/core/interfaces/pokemon.inteface';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-pokedex',
    templateUrl: './pokedex.component.html',
    styleUrls: ['./pokedex.component.scss'],
})
export class PokedexComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('paginator') paginator!: MatPaginator;
    @ViewChild('searchElement') searchElement!: SearchComponent;

    pokemonList: ReadonlyArray<Pokemon> = [];
    filteredPokemonList: Pokemon[] = [];
    noResult = '';

    pageSize = 20;
    currentPage = 0;
    totalCount = 0;

    loading = true;
    isFlipped = false;

    knowMoreIcon = 'catching_pokemon';

    private _subscription = new Subscription();

    constructor(
        private _pokemonService: PokemonService,
        private _dynamicComponentService: DynamicComponentService,
    ) {}

    ngOnInit(): void {
        this.fetchNewData();
    }

    ngAfterViewInit(): void {
        this._subscription.add(
            this.searchElement.searchPokemon.subscribe((pokemonResponse: PokemonResponse) => {
                this.onPokemonSearch(pokemonResponse);
            }),
        );

        this._subscription.add(
            this.paginator.page.subscribe((event) => {
                this.onPageChange(event);
            }),
        );
    }

    ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }

    fetchNewData(offset?: number): void {
        this.loading = true;
        this._pokemonService.getPokemonList(offset).subscribe({
            next: (data) => {
                console.log('Pokémon list:', data.pokemonDetails);
                this.pokemonList = data.pokemonDetails;
                this.filteredPokemonList = [...this.pokemonList];
                this.totalCount = data.count;
            },
            error: (error) => {
                console.error('Error fetching Pokémon list:', error);
            },
            complete: () => {
                this._stopLoadingAnimation();
            },
        });
    }

    onPageChange(event: any): void {
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize;

        const prev = event.previousPageIndex;
        const next = event.pageIndex;
        let offset = -20;

        if (next > prev) {
            offset = 20;
        }

        this.fetchNewData(offset);
    }

    onSearchClick(): void {
        this.loading = true;
    }

    onPokemonSearch(pokemonResponse: PokemonResponse): void {
        const { pokemonDetails, count } = pokemonResponse;

        if (pokemonDetails.length === 0) {
            if (this.searchElement.isAdvancedSearch) {
                this.noResult =
                    'No Pokémon matched your search criteria. Try using different keywords!';
            } else {
                this.noResult = 'Pokémon not found. Try searching for something else!';
            }
        }

        this.filteredPokemonList = [...pokemonDetails];
        this.totalCount = count;
        this.currentPage = 0;
        this.loading = false;
    }

    onToggleFlip(pokemon: Pokemon): void {
        if (pokemon.ui) {
            pokemon.ui.isFlipped = !pokemon.ui.isFlipped;
        }
    }

    onShowModal(pokemon: Pokemon): void {
        const detailsRef = this._dynamicComponentService.create(PokemonDetailsComponent, {
            pokemon,
            close: () => detailsRef.destroy(),
        });
    }

    private _stopLoadingAnimation(): void {
        setTimeout(() => {
            this.loading = false;
        }, 1000);
    }
}
