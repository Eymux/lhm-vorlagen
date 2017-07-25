import { Component, OnInit, ApplicationRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { OfficeService } from '../services/office.service';

@Component({
    selector: 'app-formular-editor',
    templateUrl: './formular-editor.component.html',
    styleUrls: ['./formular-editor.component.css']
})
export class FormularEditorComponent implements OnInit {
    private form : FormGroup;
    private controls = [];

    constructor(private formbuilder: FormBuilder, private office: OfficeService, private appRef: ApplicationRef) {
    }

    async ngOnInit() : Promise<void> {
        this.form = this.formbuilder.group({});

        var controls = await this.office.getAllContentControls();
        for (var c of controls.items) {
            if (c.tag === "WollMux") {
                var ctrl = this.formbuilder.control(c.text);
                this.controls.push({ name: c.title, control: ctrl });
            }
        }
    }

    save() {
    }

}
