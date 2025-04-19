import { Component, Input, OnInit } from '@angular/core';
import { Pokemon } from '@app/core/interfaces/pokemon.inteface';

@Component({
    selector: 'app-pokemon-modal',
    templateUrl: './pokemon-modal.component.html',
    styleUrls: ['./pokemon-modal.component.scss'],
})
export class PokemonModalComponent {
    @Input() pokemon!: Pokemon;

    closeModal() {
        const modal = document.querySelector('.modal') as HTMLElement;
        modal.style.display = 'none';
    }
}
