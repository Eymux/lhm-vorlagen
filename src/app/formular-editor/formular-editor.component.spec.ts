import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularEditorComponent } from './formular-editor.component';

describe('FormularEditorComponent', () => {
  let component: FormularEditorComponent;
  let fixture: ComponentFixture<FormularEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
