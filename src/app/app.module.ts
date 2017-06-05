import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

import { AppComponent } from './app.component';
import { FormularEditorComponent } from './formular-editor/formular-editor.component';
import { OfficeService } from './services/office.service';
import { WmfieldDirective } from './directives/wmfield.directive';
import { InputFieldComponent } from './components/input-field/input-field.component'

const routes = [
    { path: 'formular-editor', component: FormularEditorComponent },
    { path: 'functions', component: AppComponent }
];

@NgModule({
    declarations: [
        AppComponent,
        FormularEditorComponent,
        InputFieldComponent,
        WmfieldDirective
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        RouterModule.forRoot(routes)
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
