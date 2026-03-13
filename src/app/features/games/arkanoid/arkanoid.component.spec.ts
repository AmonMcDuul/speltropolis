import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArkanoidComponent } from './arkanoid.component';

describe('ArkanoidComponent', () => {
  let component: ArkanoidComponent;
  let fixture: ComponentFixture<ArkanoidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArkanoidComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArkanoidComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
