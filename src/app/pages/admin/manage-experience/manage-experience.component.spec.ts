import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageExperienceComponent } from './manage-experience.component';

describe('ManageExperienceComponent', () => {
  let component: ManageExperienceComponent;
  let fixture: ComponentFixture<ManageExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageExperienceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
