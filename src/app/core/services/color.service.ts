import { Injectable } from '@angular/core';

const Vibrant = require('node-vibrant');

@Injectable({
    providedIn: 'root',
})
export class ColorService {
    constructor() {}

    async getDominantColor(imageUrl: string): Promise<string> {
        return new Promise((resolve, reject) => {
            let defaultColor = '#f5f5f5';

            if (imageUrl) {
                const vibrantImg = Vibrant.from(imageUrl);

                vibrantImg.getPalette((err: any, palette: any) => {
                    if (err) {
                        console.error('Error getting palette:', err);
                        reject(err);
                        return;
                    }

                    if (palette.LightMuted) {
                        defaultColor = palette.LightMuted.getHex();
                    } else {
                        defaultColor = palette.Vibrant.getHex();
                    }

                    resolve(defaultColor);
                });
            } else {
                resolve(defaultColor);
            }
        });
    }
}
