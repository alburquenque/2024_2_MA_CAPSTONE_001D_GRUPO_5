import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeSuperadminPage } from './home-superadmin.page';

describe('HomeSuperadminPage', () => {
  let component: HomeSuperadminPage;
  let fixture: ComponentFixture<HomeSuperadminPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSuperadminPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
