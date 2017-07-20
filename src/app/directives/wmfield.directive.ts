import { Directive, Input, OnInit, ComponentFactoryResolver, ViewContainerRef, forwardRef } from '@angular/core';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { InputFieldComponent } from '../components/input-field/input-field.component'
import { OfficeService } from '../services/office.service';

@Directive({
    selector: '[appWmfield]',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => WmfieldDirective),
        multi: true
    }]
})
export class WmfieldDirective implements ControlValueAccessor {
    @Input() label: string;
    @Input() control: FormControl;

    private component;
    private value: string;

    private changed = new Array<(value: string) => void>();

    constructor( private resolver: ComponentFactoryResolver,
        private container: ViewContainerRef,
        private office: OfficeService) {

    }

    ngOnInit() {
        var factory = this.resolver.resolveComponentFactory<any>(InputFieldComponent);
        this.component = this.container.createComponent(factory);
        this.component.instance.name = this.label;
        this.component.instance.value = this.control.value;
        this.component.instance.changed.subscribe(this.onChange.bind(this));
    }

    onChange(value: any) {
        var data = [{ title: this.label, text: value }]
        this.office.updateContentControls(data).then(() => {
            this.propagateChange(value);            
        });
    }

    writeValue(val: any) {
        this.value = val;
    }

    registerOnChange(fn: any) {
        this.changed.push(fn);
    }

    registerOnTouched(fn: any) {}

    propagateChange(value: string) {
        this.changed.forEach(f => {
            f(value);
        });
    }
}
