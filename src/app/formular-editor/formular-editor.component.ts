import { ApplicationRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IOfficeService } from 'app/services/ioffice-service';

@Component({
    selector: 'app-formular-editor',
    templateUrl: './formular-editor.component.html',
    styleUrls: ['./formular-editor.component.css']
})
export class FormularEditorComponent implements OnInit {
    controls = [];
    private form: FormGroup;

    constructor(private formbuilder: FormBuilder, private office: IOfficeService, private appRef: ApplicationRef) {
    }

    async ngOnInit(): Promise<void> {
        this.form = this.formbuilder.group({});

        const controls = await this.office.getAllContentControls();
        for (const c of controls.items) {
            if (c.tag.startsWith('WollMux')) {
                const tags = c.tag.split(' ');
                let maxLength = 524288;
                const tagMaxLength = tags.find(tag => tag.startsWith('MaxLength:'));
                if (tagMaxLength) {
                    maxLength = parseInt(tagMaxLength.split(':').slice(-1)[0]);
                }

                const ctrl = this.formbuilder.control(c.text);
                this.controls.push({ name: c.title, control: ctrl, maxlength: maxLength });

                Office.context.document.bindings.addFromNamedItemAsync(c.title, Office.BindingType.Text, {id: c.title}, result => {
                    if (result.status === Office.AsyncResultStatus.Succeeded) {
                        const binding = result.value;
                        binding.addHandlerAsync(Office.EventType.BindingDataChanged, eventArgs => {
                            const bind = eventArgs.binding;
                            bind.getDataAsync(res => {
                                debugger;
                                const options = {};
                                options[bind.id] = res.value;
                                this.form.patchValue(options);
                            });

                        });
                    }
                });
            }
        }
    }

    // tslint:disable-next-line:no-empty
    save(): void {
    }

}
