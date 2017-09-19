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
    controls = [];

    constructor(private formbuilder: FormBuilder, private office: OfficeService, private appRef: ApplicationRef) {
    }

    async ngOnInit() : Promise<void> {
        this.form = this.formbuilder.group({});

        var controls = await this.office.getAllContentControls();
        for (var c of controls.items) {
            if (c.tag.startsWith("WollMux")) {
                var tags = c.tag.split(' ')
                var maxLength = 524288;
                var tagMaxLength = tags.find((tag) => tag.startsWith("MaxLength:"))
                if (tagMaxLength) {
                    maxLength = parseInt(tagMaxLength.split(":").slice(-1)[0]);
                }

                var ctrl = this.formbuilder.control(c.text);
                this.controls.push({ name: c.title, control: ctrl, maxlength: maxLength });

                Office.context.document.bindings.addFromNamedItemAsync(c.title, Office.BindingType.Text, {id: c.title}, (result) => {
                    if (result.status == Office.AsyncResultStatus.Succeeded) {
                        var binding = result.value;
                        binding.addHandlerAsync(Office.EventType.BindingDataChanged, (eventArgs) => {
                            var binding = eventArgs.binding;
                            binding.getDataAsync((result) => {
                                debugger
                                var options = {};
                                options[binding.id] = result.value;
                                this.form.patchValue(options);
                            });

                        });
                    }
                });
            }
        }
    }

    save() {
    }

}
