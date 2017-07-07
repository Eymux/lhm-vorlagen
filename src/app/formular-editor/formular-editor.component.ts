import { Component, OnInit } from '@angular/core';
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

    constructor(private formbuilder: FormBuilder, private office: OfficeService) {
    }

    ngOnInit() {
        this.form = this.formbuilder.group({});
        this.form.valueChanges.subscribe(data => {
            debugger;
            console.log(data);
        });

        this.office.getAllContentControls()
            .then(controls => {
                for (var c of controls.items) {
                    if (c.tag === "WollMux") {
                        this.controls.push({ name: c.title, control: this.formbuilder.control(c.text) });
                    }
                }
            });
    }

    save() {
    }

}
