import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent {
    constructor(private router: Router) {}

    enterPokedex() {
        this.router.navigate(['/pokedex']);
    }

    onMouserOver(e: MouseEvent) {
        const target = e.target as HTMLElement;
        target.textContent = "Let's Go!";
    }

    onMouseLeave(e: MouseEvent) {
        const target = e.target as HTMLElement;
        target.textContent = 'Enter the world of Pokémon';
    }
}
