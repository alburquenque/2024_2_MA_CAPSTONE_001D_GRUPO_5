import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditPasswordPage } from './edit-password.page';

describe('EditPasswordPage', () => {
  let component: EditPasswordPage;
  let fixture: ComponentFixture<EditPasswordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
