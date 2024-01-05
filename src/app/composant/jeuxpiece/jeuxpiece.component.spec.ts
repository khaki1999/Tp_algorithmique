import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JeuxpieceComponent } from './jeuxpiece.component';

describe('JeuxpieceComponent', () => {
  let component: JeuxpieceComponent;
  let fixture: ComponentFixture<JeuxpieceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JeuxpieceComponent]
    });
    fixture = TestBed.createComponent(JeuxpieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
