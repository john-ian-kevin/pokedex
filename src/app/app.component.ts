import { Component } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    ngOnInit(): void {
        const frames = [
            'assets/favicons/abra.png',
            'assets/favicons/caterpie.png',
            'assets/favicons/dratini.png',
            'assets/favicons/mankey.png',
            'assets/favicons/meowth.png',
            'assets/favicons/pidgey.png',
            'assets/favicons/rattata.png',
            'assets/favicons/snorlax.png',
            'assets/favicons/venonat.png',
            'assets/favicons/weedle.png',
        ];

        let current = 0;

        setInterval(() => {
            const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
            if (link) {
                link.href = frames[current];
                current = (current + 1) % frames.length;
            }
        }, 1000);
    }
}
