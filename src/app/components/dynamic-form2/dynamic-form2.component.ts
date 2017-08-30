import { Component, OnInit, NgZone } from '@angular/core';
import { DynamicFormControlModel, DynamicFormService, DynamicCheckboxModel, DynamicInputModel, DynamicRadioGroupModel } from "@ng2-dynamic-forms/core";
import { FormGroup } from '@angular/forms';

import { OfficeService } from '../../services/office.service';

@Component({
    selector: 'app-dynamic-form2',
    templateUrl: './dynamic-form2.component.html',
    styleUrls: ['./dynamic-form2.component.css']
})
export class DynamicForm2Component implements OnInit {
    formModel: DynamicFormControlModel[] = [];
    formGroup: FormGroup;

    constructor(private office: OfficeService, private formService: DynamicFormService, private zone: NgZone) { }

    ngOnInit() {
        this.office.getAllContentControls().then ((controls) => {
            debugger
            for (var c of controls.items) {
                if (c.tag.startsWith("WollMux")) {
                    var m;
                    switch (c.type) {
                        case "RichText": {
                            m = new DynamicInputModel({
                                id: c.title,
                                label: c.title,
                                value: c.text
                            });
                            break;
                        }
                        case "CheckBox": {
                            m = new DynamicCheckboxModel({
                                id: c.title,
                                label: c.title,
                                value: false
                            });
                            break;
                        }
                    }
                    this.formModel.push(m);
                    m.valueUpdates.subscribe(function(model, value) {
                        var data = [{ title: model.id, text: value }];
                        this.office.updateContentControl(data);
                    }.bind(this, m));

                    // Office.context.document.bindings.addFromNamedItemAsync(c.title, Office.BindingType.Text, {id: c.title}, (result) => {
                    //     if (result.status == Office.AsyncResultStatus.Succeeded) {
                    //         var binding = result.value;
                    //         binding.addHandlerAsync(Office.EventType.BindingDataChanged, (eventArgs) => {
                    //             var binding = eventArgs.binding;
                    //             binding.getDataAsync((result) => {
                    //                 this.zone.run(() => {
                    //                     var inputModel = this.formService.findById(binding.id, this.formModel) as DynamicInputModel;
                    //                     inputModel.valueUpdates.next(result.value);
                    //                     inputModel.valueUpdates.subscribe(value => console.log("new value: ", value));
                    //                 });
                    //             });
                    //
                    //         });
                    //     }
                    // });
                }
            }

            this.formGroup = this.formService.createFormGroup(this.formModel);
        });
    }
}
