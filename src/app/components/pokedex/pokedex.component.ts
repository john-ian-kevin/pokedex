import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { PokemonService } from '@app/core/services/pokemon.service';
import { DynamicComponentService } from '@app/core/services/dynamic-component.service';
import { PokemonDetailsComponent } from '@app/components/pokemon-details/pokemon-details.component';
import { Pokemon, PokemonResponse } from '@app/core/interfaces/pokemon.inteface';
import { SearchComponent } from '@app/shared/components/search/search.component';

@Component({
    selector: 'app-pokedex',
    templateUrl: './pokedex.component.html',
    styleUrls: ['./pokedex.component.scss'],
})
export class PokedexComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('pagination') paginator: MatPaginator | undefined;
    @ViewChild('pokemonSearch') pokemonSearch: SearchComponent | undefined;

    pokemonList: ReadonlyArray<Pokemon> = [];
    filteredPokemonList: Pokemon[] = [];
    noResult = '';

    pageSize = 20;
    currentPage = 0;
    totalCount = 0;

    loading = true;
    isFlipped = false;

    knowMoreIcon = 'catching_pokemon';

    idleTimeout: any;

    constructor(
        private _pokemonService: PokemonService,
        private _dynamicComponentService: DynamicComponentService,
    ) {}

    ngOnInit(): void {
        this.fetchNewData();
    }

    ngAfterViewInit(): void {
        this.startPulseTimer();
    }

    ngOnDestroy(): void {
        this.paginator?.page.unsubscribe();
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

    onSearchPokemon(pokemonResponse: PokemonResponse): void {
        const { pokemonDetails, count } = pokemonResponse;

        if (pokemonDetails.length === 0) {
            if (this.pokemonSearch?.isAdvancedSearch) {
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

    private _stopLoadingAnimation() {
        setTimeout(() => {
            this.loading = false;
        }, 1000);
    }

    onPokemonClick(pokemon: Pokemon): void {
        const detailsRef = this._dynamicComponentService.create(PokemonDetailsComponent, {
            pokemon,
            close: () => detailsRef.destroy(),
        });
    }

    onToggleFlip(pokemon: Pokemon): void {
        if (pokemon.ui) {
            pokemon.ui.isFlipped = !pokemon.ui.isFlipped;
        }
    }

    // Open a modal with more details about the Pokémon
    openModal(pokemon: any) {
        const detailsRef = this._dynamicComponentService.create(PokemonDetailsComponent, {
            pokemon,
            close: () => detailsRef.destroy(),
        });
    }

    onShowModal(pokemon: Pokemon): void {
        const detailsRef = this._dynamicComponentService.create(PokemonDetailsComponent, {
            pokemon,
            close: () => detailsRef.destroy(),
        });
    }

    startPulseTimer() {
        this.clearPulse(); // Just in case
        this.idleTimeout = setTimeout(() => {
            const btn = document.querySelector('.know-more-btn');
            if (btn) {
                btn.classList.add('pulse');
            }
        }, 5000); // Trigger after 5s
    }

    clearPulse() {
        clearTimeout(this.idleTimeout);
        const btn = document.querySelector('.know-more-btn');
        if (btn) {
            btn.classList.remove('pulse');
        }
    }
}
