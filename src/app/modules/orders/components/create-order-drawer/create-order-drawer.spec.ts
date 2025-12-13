import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrderDrawer } from './create-order-drawer';

describe('CreateOrderDrawer', () => {
  let component: CreateOrderDrawer;
  let fixture: ComponentFixture<CreateOrderDrawer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateOrderDrawer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateOrderDrawer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
