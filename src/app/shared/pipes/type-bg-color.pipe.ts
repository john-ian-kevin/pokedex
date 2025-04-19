import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'typeBgColor',
})
export class TypeBgColorPipe implements PipeTransform {
    private typeColors: Record<string, string> = {
        normal: '#A8A77A',
        fire: '#EE8130',
        water: '#6390F0',
        electric: '#F7D02C',
        grass: '#7AC74C',
        ice: '#96D9D6',
        fighting: '#C22E28',
        poison: '#A33EA1',
        ground: '#E2BF65',
        flying: '#A98FF3',
        psychic: '#F95587',
        bug: '#A6B91A',
        rock: '#B6A136',
        ghost: '#735797',
        dragon: '#6F35FC',
        dark: '#705746',
        steel: '#B7B7CE',
        fairy: '#D685AD',
    };

    private typeEmojis: Record<string, string> = {
        normal: '🔘',
        fire: '🔥',
        water: '💧',
        electric: '⚡',
        grass: '🌿',
        ice: '❄️',
        fighting: '🥊',
        poison: '☠️',
        ground: '🌍',
        flying: '🕊️',
        psychic: '🔮',
        bug: '🐛',
        rock: '🪨',
        ghost: '👻',
        dragon: '🐉',
        dark: '🌑',
        steel: '🔩',
        fairy: '✨',
    };

    transform(
        types: string[] | string,
        mode: 'background' | 'text' | 'emoji' = 'background',
    ): string {
        if (mode === 'emoji') {
            const list = Array.isArray(types) ? types : [types];
            return list.map((type) => this.typeEmojis[type.toLowerCase()] || '').join(' ');
        }

        const typeList = Array.isArray(types) ? types : [types];
        const colors = typeList.map((t) => this.typeColors[t.toLowerCase()] || '#777');

        if (mode === 'background') {
            return colors.length > 1 ? `linear-gradient(135deg, ${colors.join(', ')})` : colors[0];
        }

        const rgb = this.hexToRgb(colors[0]);
        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        return brightness > 125 ? '#000' : '#FFF';
    }

    private hexToRgb(hex: string): { r: number; g: number; b: number } {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result
            ? {
                  r: parseInt(result[1], 16),
                  g: parseInt(result[2], 16),
                  b: parseInt(result[3], 16),
              }
            : { r: 0, g: 0, b: 0 };
    }
}
