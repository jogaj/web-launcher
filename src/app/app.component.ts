import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MiniToolbarComponent } from '../components/mini-toolbar/mini-toolbar.component';
import { ToasterComponent } from '../components/toaster/toaster.component';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, MiniToolbarComponent, ToasterComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss',
})
export class AppComponent {
	title = 'web-launcher';
}
