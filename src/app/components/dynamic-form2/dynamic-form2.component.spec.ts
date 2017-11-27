import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicForm2Component } from './dynamic-form2.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DynamicFormService, DynamicFormValidationService } from '@ng2-dynamic-forms/core';
import { IOfficeService } from 'app/services/ioffice-service';
import { OfficeMockService } from 'app/services/office-mock.service';
import { FormBuilder, FormGroupDirective } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('DynamicForm2Component', () => {
  let component: DynamicForm2Component;
  let fixture: ComponentFixture<DynamicForm2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicForm2Component, FormGroupDirective],
      providers: [
        {provide: IOfficeService, useClass: OfficeMockService},
        DynamicFormService,
        DynamicFormValidationService,
        FormBuilder
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicForm2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
