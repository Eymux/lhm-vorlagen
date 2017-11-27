import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularEditorComponent } from './formular-editor.component';
import { WmfieldDirective } from 'app/directives/wmfield.directive';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { OfficeMockService } from 'app/services/office-mock.service';
import { IOfficeService } from 'app/services/ioffice-service';

describe('FormularEditorComponent', () => {
  let component: FormularEditorComponent;
  let fixture: ComponentFixture<FormularEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormularEditorComponent, WmfieldDirective, FormGroupDirective ],
      providers: [
        FormBuilder,
        { provide: IOfficeService, useClass: OfficeMockService}
      ]
    }).compileComponents();
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
