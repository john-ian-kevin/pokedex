import { Component, Input, OnInit } from '@angular/core';
import { Pokemon } from '@app/core/interfaces/pokemon.inteface';

@Component({
    selector: 'app-pokemon-card',
    templateUrl: './pokemon-card.component.html',
    styleUrls: ['./pokemon-card.component.scss'],
})
export class PokemonCardComponent {
    @Input() pokemon!: Pokemon;
    isFlipped = false;
    showModal = false;

    // toggleFlip() {
    //     this.isFlipped = !this.isFlipped;
    // }

    // openModal(pokemon: Pokemon) {
    //     // this.selectedPokemon = pokemon;
    //     this.showModal = true;
    // }

    closeModal() {
        this.showModal = false;
    }

    // playFlipSound() {
    //     const flipAudio = document.querySelector('audio[src$="flip.mp3"]') as HTMLAudioElement;
    //     if (flipAudio) flipAudio.play();
    // }

    // playModalSound() {
    //     const modalAudio = document.querySelector('audio[src$="modal.mp3"]') as HTMLAudioElement;
    //     if (modalAudio) modalAudio.play();
    // }

    toggleFlip() {
        this.isFlipped = !this.isFlipped;
    }

    // Play the modal sound when "More Info" button is clicked
    openModal(pokemon: any) {
        this.showModal = true;
    }
}
