import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { Effect } from '@app/core/enums/pokemon.enum';
import {
    Ability,
    EvolutionChainStep,
    IEffectiveness,
    MoveDetail,
    Pokemon,
    PokemonWithDetails,
    TypeEffectiveness,
} from '@app/core/interfaces/pokemon.inteface';
import { PokemonService } from '@app/core/services/pokemon.service';
import { TypeEffectivenessService } from '@app/core/services/type-effectiveness.service';
import { forkJoin } from 'rxjs';

@Component({
    templateUrl: './pokemon-details.component.html',
    styleUrls: ['./pokemon-details.component.scss'],
})
export class PokemonDetailsComponent {
    @Input() pokemon: any;
    closing = false;

    description: string = '';
    abilities: { name: string; effect: string }[] = [];
    evolutionChain: { name: string; img: string; showArrow?: boolean }[] = [];
    typeEffectiveness: any[] = [];

    groupedEffectiveness!: IEffectiveness;

    moveDetails: any[] = [];
    tmMoves: any[] = [];
    hmMoves: any[] = [];
    naturalMoves: any[] = [];
    displayedColumns: string[] = [
        'move',
        'type',
        'level',
        'method',
        'power',
        'pp',
        'accuracy',
        'effect',
    ];

    constructor(
        private service: PokemonService,
        private cd: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.loadEvolutionChain();
        this.loadDescription();
        this.loadAbilities();
        this.loadAllMoveDetails();
        this.loadTypeEffectiveness();
    }

    triggerClose() {
        this.closing = true;
        setTimeout(() => this.close(), 300);
    }

    close() {
        // emit close to parent or use service to hide overlay
    }

    loadDescription() {
        this.service.getSpecies(this.pokemon.species.url).subscribe((species) => {
            this.description =
                species.flavor_text_entries.find((entry: any) => entry.language.name === 'en')
                    ?.flavor_text || '';
        });
    }

    loadAbilities() {
        this.pokemon.abilities.forEach((ab: any) => {
            this.service.getAbilityDetails(ab.ability.url).subscribe((data: Ability) => {
                const effect =
                    data.effect_entries.find((e) => e.language.name === 'en')?.effect || '';
                this.abilities.push({ name: ab.ability.name, effect });
            });
        });
    }

    loadEvolutionChain() {
        this.service.getEvolutionData(this.pokemon.id).subscribe((data) => {
            const names: string[] = [];
            let evoData = data.chain;

            // Traverse evolution chain
            do {
                names.push(evoData.species.name);
                evoData = evoData.evolves_to[0];
            } while (evoData && evoData.hasOwnProperty('evolves_to'));

            // Fetch all images in parallel
            forkJoin(names.map((n) => this.service.getPokemonImg(n))).subscribe((results) => {
                this.evolutionChain = results.map((res, index) => ({
                    name: res.name,
                    img: res.sprites.other['official-artwork'].front_default,
                    showArrow: index < results.length - 1,
                }));
            });
        });
    }

    loadAllMoveDetails() {
        const requests = this.pokemon.moves.map((m: any) =>
            this.service.getMoveDetails(m.move.url).pipe(),
        );

        forkJoin(requests).subscribe((results: any) => {
            const allMoves = results.map((data: any, i: string | number) => {
                const moveData = this.pokemon.moves[i];
                const learnDetail = moveData.version_group_details[0];
                const level = learnDetail.level_learned_at;
                const methodRaw = learnDetail.move_learn_method.name;
                const method = methodRaw === 'machine' ? 'TM/TR' : methodRaw.replace('-', ' ');

                return {
                    name: moveData.move.name.replace('-', ' '),
                    type: data.type.name,
                    power: data.power,
                    accuracy: data.accuracy,
                    pp: data.pp,
                    effect:
                        data.effect_entries.find((e: any) => e.language.name === 'en')
                            ?.short_effect || '',
                    level,
                    method,
                };
            });

            // Separate moves into categories
            this.tmMoves = allMoves.filter((move: { method: string }) => move.method === 'TM/TR');
            this.hmMoves = allMoves.filter((move: { method: string }) => move.method === 'HM');
            this.naturalMoves = allMoves.filter(
                (move: { method: string }) => move.method !== 'TM/TR' && move.method !== 'HM',
            );

            // Sort moves by level (or fallback to 9999 if no level)
            this.tmMoves.sort((a, b) => (a.level ?? 9999) - (b.level ?? 9999));
            this.hmMoves.sort((a, b) => (a.level ?? 9999) - (b.level ?? 9999));
            this.naturalMoves.sort((a, b) => (a.level ?? 9999) - (b.level ?? 9999));

            this.moveDetails = [this.tmMoves, this.hmMoves, this.naturalMoves];
        });
    }

    expandedTypeIndex: number | null = 0;

    toggleAccordion(index: number) {
        this.expandedTypeIndex = this.expandedTypeIndex === index ? null : index;
    }

    loadTypeEffectiveness() {
        if (!this.pokemon?.types?.length) return;

        const typeNames = this.pokemon.types.map((t: any) => t.type.name);

        this.service.getTypeEffectiveness(typeNames).subscribe((typeDataArray: any[]) => {
            let effectivenessMap: Record<string, number> = {};
            const data: any[] = [];

            typeDataArray.forEach((typeData) => {
                const relations = typeData.damage_relations;
                effectivenessMap = {};

                relations.double_damage_to.forEach((t: any) => {
                    effectivenessMap[t.name] = 2;
                });

                relations.half_damage_to.forEach((t: any) => {
                    effectivenessMap[t.name] = 0.5;
                });

                relations.no_damage_to.forEach((t: any) => {
                    effectivenessMap[t.name] = 0;
                });

                data.push({
                    type: typeData.name,
                    effectiveness: Object.assign({}, effectivenessMap),
                });
            });

            data.forEach((entry) => {
                const typeGroup: any = {};

                const fromType = entry.type;

                const superEffective: Record<string, string | number>[] = [];
                const notVeryEffective: Record<string, string | number>[] = [];
                const noEffect: Record<string, string | number>[] = [];

                Object.entries(entry.effectiveness).forEach(([type, multiplier]) => {
                    const transformed: any = {
                        type,
                        multiplier,
                    };

                    if (multiplier === 2) {
                        superEffective.push(transformed); // Super effective
                    } else if (multiplier === 0.5) {
                        notVeryEffective.push(transformed); // Not very effective
                    } else if (multiplier === 0) {
                        noEffect.push(transformed); // No effect
                    }
                });

                this.typeEffectiveness.push([
                    entry.type,
                    { superEffective, notVeryEffective, noEffect },
                ]);
            });
        });
    }

    getMethodClass(method: string): string {
        return method.toLowerCase().replace(/\s+/g, '-');
    }

    getTabLabel(index: number): string {
        switch (index + 1) {
            case 1:
                return 'TM/TR Moves';
            case 2:
                return 'HM Moves';
            default:
                return 'Natural Moves';
        }
    }

    getTypeLabel(index: number): string {
        switch (index + 1) {
            case 1:
                return 'Super Effective';
            case 2:
                return 'Normal';
            case 3:
                return 'Not Very Effective';
            case 4:
                return 'No Effect';
            default:
                return '';
        }
    }

    hasEffectGroups(effectGroup: any): boolean {
        return (
            effectGroup.superEffective.length > 0 ||
            effectGroup.notVeryEffective.length > 0 ||
            effectGroup.noEffect.length > 0
        );
    }

    effectTitle(effect: any): string {
        let effectStr = '';
        switch (effect) {
            case 'superEffective':
                effectStr = Effect.SuperEffective;
                break;
            case 'notVeryEffective':
                effectStr = Effect.NotVeryEffective;
                break;
            case 'noEffect':
                effectStr = Effect.NoEffect;
                break;
        }

        return effectStr;
    }
}
