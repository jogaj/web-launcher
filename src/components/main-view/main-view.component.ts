import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListCardComponent } from '../list-card/list-card.component';
import { SearchBoxComponent } from '../search-box/search-box.component';

@Component({
	selector: 'app-main-view',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RouterOutlet, SearchBoxComponent, ListCardComponent],
	templateUrl: './main-view.component.html',
	styleUrl: './main-view.component.scss',
})
export class MainViewComponent {}
