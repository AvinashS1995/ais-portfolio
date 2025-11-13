import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageContactInfoComponent } from './manage-contact-info.component';

describe('ManageContactInfoComponent', () => {
  let component: ManageContactInfoComponent;
  let fixture: ComponentFixture<ManageContactInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageContactInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
