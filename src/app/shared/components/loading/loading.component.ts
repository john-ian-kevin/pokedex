import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnChanges, OnDestroy {
    @Input() loading: boolean = false;

    loadingGif: string = '';

    private _subscription?: Subscription;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['loading']) {
            if (this.loading) {
                this.showLoadingAnimation();
            } else {
                this.stopLoadingAnimation();
            }
        }
    }

    ngOnDestroy(): void {
        this.stopLoadingAnimation();
    }

    private showLoadingAnimation(): void {
        this._subscription?.add(
            (this._subscription = interval(3000).subscribe(() => {
                const randomNum = Math.floor(Math.random() * 10) + 1;
                this.loadingGif = `assets/loading/loading-${randomNum}.gif`;
            })),
        );

        const randomNum = Math.floor(Math.random() * 10) + 1;
        this.loadingGif = `assets/loading/loading-${randomNum}.gif`;
    }

    private stopLoadingAnimation(): void {
        this._subscription?.unsubscribe();
    }
}
