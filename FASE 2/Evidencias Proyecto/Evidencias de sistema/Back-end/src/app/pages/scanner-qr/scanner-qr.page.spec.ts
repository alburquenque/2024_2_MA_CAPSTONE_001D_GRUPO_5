import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScannerQrPage } from './scanner-qr.page';

describe('ScannerQrPage', () => {
  let component: ScannerQrPage;
  let fixture: ComponentFixture<ScannerQrPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ScannerQrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
