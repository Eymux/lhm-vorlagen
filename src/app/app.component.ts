/// <reference path="../../node_modules/@types/office-js/index.d.ts" />

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Http, Response, ResponseContentType } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { OfficeService } from './services/office.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'app works!';

    @ViewChild('text') msg : ElementRef;

    constructor (private http: Http, private office: OfficeService) {}

    ngOnInit() {
        //this.msg.nativeElement.textContent = "Init";
        // Word.run(context => {
        //     var body = context.document.body;
        //     context.load(body, 'text');
        //     body.insertText('This is text inserted after loading the body.text property', Word.InsertLocation.start);
        //     this.msg.nativeElement.innerHTML = "456";
        //     return context.sync()
        //         .then(() => {
        //             this.msg.nativeElement.innerHTML = "Hello World!";
        //         });
        //     })
        //     .catch(function (error) {
        //         console.log('Error: ' + JSON.stringify(error));
        //         this.msg.nativeElement.innerHTML = JSON.stringify(error);
        //         if (error instanceof OfficeExtension.Error) {
        //             console.log('Debug info: ' + JSON.stringify(error.debugInfo));
        //         }
        //     });
    }

    clicked() {
        //this.office.insertDocumentFromURL("http://192.168.1.104:4200/assets/test1.docx");

        // this.office.getContentControl('Field1')
        //     .then(f => {
        //         this.msg.nativeElement.innerHTML = f.text;
        //         f.insertText("Hello World!", 'Replace');
        //         return f.context.sync();
        //     });

        var url = `https://${location.host}/formular-editor`;
        this.office.showDialog(url, { width: 15, height: 27 }, function (asyncResult) {
            if (asyncResult.status !== Office.AsyncResultStatus.Succeeded) {
                // TODO: Handle error.
                return;
            }
        });
    }
}
