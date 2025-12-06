import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLinkComponent } from './list-link.component';

describe('ListLinkComponent', () => {
	let component: ListLinkComponent;
	let fixture: ComponentFixture<ListLinkComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ListLinkComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ListLinkComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
