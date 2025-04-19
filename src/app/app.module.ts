import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppComponent } from '@app/app.component';
import { LandingPageComponent } from '@components/landing-page/landing-page.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { PokedexComponent } from '@components/pokedex/pokedex.component';
import { SearchComponent } from '@app/shared/components/search/search.component';
import { TypeBgColorPipe } from './shared/pipes/type-bg-color.pipe';
import { PokemonDetailsComponent } from './components/pokemon-details/pokemon-details.component';

@NgModule({
    declarations: [
        AppComponent,
        LandingPageComponent,
        LoadingComponent,
        PokedexComponent,
        SearchComponent,
        TypeBgColorPipe,
        PokemonDetailsComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        MatBadgeModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatSelectModule,
        MatSlideToggleModule,
    ],
    exports: [LoadingComponent, SearchComponent],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
