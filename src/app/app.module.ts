import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { environment } from '../environments/environment';

import { DynamicFormsCoreModule } from '@ng2-dynamic-forms/core';
import { DynamicFormsBootstrapUIModule } from '@ng2-dynamic-forms/ui-bootstrap';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { AppComponent } from './app.component';
import { FormularEditorComponent } from './formular-editor/formular-editor.component';
import { OfficeService } from './services/office.service';
import { WmfieldDirective } from './directives/wmfield.directive';
import { InputFieldComponent } from './components/input-field/input-field.component';
import { DynamicForm2Component } from './components/dynamic-form2/dynamic-form2.component';
import { IOfficeService } from 'app/services/ioffice-service';

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
        DynamicFormsBootstrapUIModule,
        AccordionModule.forRoot()
    ],
    entryComponents: [
        InputFieldComponent
    ],
    providers: [
        { provide: IOfficeService, useClass: environment.officeService },
        { provide: LocationStrategy, useClass: HashLocationStrategy }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
