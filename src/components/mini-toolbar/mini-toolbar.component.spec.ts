import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniToolbarComponent } from './mini-toolbar.component';

describe('MiniToolbarComponent', () => {
	let component: MiniToolbarComponent;
	let fixture: ComponentFixture<MiniToolbarComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MiniToolbarComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(MiniToolbarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
