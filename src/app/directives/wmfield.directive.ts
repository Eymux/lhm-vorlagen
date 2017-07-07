import { Directive, Input, OnInit, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';

import { InputFieldComponent } from '../components/input-field/input-field.component'

@Directive({
    selector: '[appWmfield]'
})
export class WmfieldDirective {
    @Input() label: string;
    @Input() control: FormControl;

    private component;

    constructor( private resolver: ComponentFactoryResolver, private container: ViewContainerRef) {

    }

    ngOnInit() {
        var factory = this.resolver.resolveComponentFactory<any>(InputFieldComponent);
        this.component = this.container.createComponent(factory);
        this.component.instance.name = this.label;
        this.component.instance.value = this.control.value;
    }
}
