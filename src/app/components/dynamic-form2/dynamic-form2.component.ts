import { Component, OnInit, NgZone, Inject, forwardRef } from '@angular/core';
import { DynamicFormControlModel, DynamicFormService, DynamicCheckboxModel, DynamicInputModel, DynamicRadioGroupModel, DynamicSelectModel } from "@ng2-dynamic-forms/core";
import { FormGroup } from '@angular/forms';

import { IOfficeService } from "app/services/ioffice-service";
import { ControlType } from "app/services/office-types";

@Component({
    selector: 'app-dynamic-form2',
    templateUrl: './dynamic-form2.component.html',
    styleUrls: ['./dynamic-form2.component.css']
})
export class DynamicForm2Component implements OnInit {
    formModel: DynamicFormControlModel[] = [];
    formGroup: FormGroup;

    constructor(private office: IOfficeService, private formService: DynamicFormService, private zone: NgZone) { }

    ngOnInit() {
        this.office.getAllContentControls().then ((controls) => {
            for (var c of controls.items) {
                if (this.office.isWollMux(c)) {
                    var m;
                    switch (this.office.getType(c)) {
                        case ControlType.RichText: {
                            m = new DynamicInputModel({
                                id: c.title,
                                label: c.title,
                                value: c.text
                            });
                            break;
                        }
                        case ControlType.CheckBox: {
                            m = new DynamicCheckboxModel({
                                id: c.title,
                                label: c.title,
                                value: false
                            });
                            this.office.updateContentControl([{ title: c.title, text: "\u2610" }]);
                            break;
                        }
                        case ControlType.ComboBox: {
                            m = new DynamicSelectModel<string>({
                                id: c.title,
                                label: c.title,
                                options: [{label: "eins", value: "eins"}, {label: "zwei", value: "zwei"}, {label: "drei", value: "drei"}],
                                value: "eins"
                            });
                            break;
                        }
                    }
                    this.formModel.push(m);
                    m.valueUpdates.subscribe(function(model, value) {
                        var data;
                        if (model.type === "CHECKBOX") {
                            if (model.value) {
                                data = [{ title: model.id, text: "\u2611" }];
                            } else {
                                data = [{ title: model.id, text: "\u2610" }];
                            }
                        } else {
                            data = [{ title: model.id, text: value }];
                        }
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
                this.formGroup = this.formService.createFormGroup(this.formModel);
            }
        });
    }
}
