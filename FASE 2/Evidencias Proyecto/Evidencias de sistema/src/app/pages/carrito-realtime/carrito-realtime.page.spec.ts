import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarritoRealtimePage } from './carrito-realtime.page';

describe('CarritoRealtimePage', () => {
  let component: CarritoRealtimePage;
  let fixture: ComponentFixture<CarritoRealtimePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarritoRealtimePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
