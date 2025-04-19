import { Injectable } from '@angular/core';
import { TypeEffectiveness } from '../interfaces/pokemon.inteface';

@Injectable({
    providedIn: 'root',
})
export class TypeEffectivenessService {
    private typeChart: Record<string, TypeEffectiveness> = {
        normal: {
            double_damage_from: ['fighting'],
            double_damage_to: [],
            half_damage_from: [],
            half_damage_to: ['rock', 'steel'],
            no_damage_from: ['ghost'],
            no_damage_to: ['ghost'],
        },
        fire: {
            double_damage_from: ['water', 'ground', 'rock'],
            double_damage_to: ['grass', 'ice', 'bug', 'steel'],
            half_damage_from: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
            half_damage_to: ['fire', 'water', 'rock', 'dragon'],
            no_damage_from: [],
            no_damage_to: [],
        },
        // Add other types here following the same pattern
    };

    getEffectiveness(types: string[]): TypeEffectiveness {
        const result: TypeEffectiveness = {
            double_damage_from: [],
            double_damage_to: [],
            half_damage_from: [],
            half_damage_to: [],
            no_damage_from: [],
            no_damage_to: [],
        };

        types.forEach((type) => {
            const effectiveness = this.typeChart[type];
            if (effectiveness) {
                result.double_damage_from.push(...effectiveness.double_damage_from);
                result.double_damage_to.push(...effectiveness.double_damage_to);
                result.half_damage_from.push(...effectiveness.half_damage_from);
                result.half_damage_to.push(...effectiveness.half_damage_to);
                result.no_damage_from.push(...effectiveness.no_damage_from);
                result.no_damage_to.push(...effectiveness.no_damage_to);
            }
        });

        // Remove duplicates
        Object.keys(result).forEach((key) => {
            result[key as keyof TypeEffectiveness] = [
                ...new Set(result[key as keyof TypeEffectiveness]),
            ];
        });

        return result;
    }
}
