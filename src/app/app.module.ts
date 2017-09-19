import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { DynamicFormsCoreModule } from "@ng2-dynamic-forms/core";
import { DynamicFormsBootstrapUIModule } from "@ng2-dynamic-forms/ui-bootstrap";

import { AppComponent } from './app.component';
import { FormularEditorComponent } from './formular-editor/formular-editor.component';
import { OfficeService } from './services/office.service';
import { WmfieldDirective } from './directives/wmfield.directive';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { DynamicForm2Component } from './components/dynamic-form2/dynamic-form2.component'

const routes = [
    { path: 'dynamic-editor', component: DynamicForm2Component }
];

@NgModule({
    declarations: [
        AppComponent,
        FormularEditorComponent,
        InputFieldComponent,
        WmfieldDirective,
        DynamicForm2Component
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule.forRoot(routes),
        DynamicFormsCoreModule.forRoot(),
        DynamicFormsBootstrapUIModule
    ],
    entryComponents: [
        InputFieldComponent
    ],
    providers: [
        OfficeService,
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
