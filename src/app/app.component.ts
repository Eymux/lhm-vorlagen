/// <reference path="../../node_modules/@types/office-js/index.d.ts" />

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Http, Response, ResponseContentType } from '@angular/http';

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
        //var p;

        // this.office.getParagraphs().then(async(paragraphs) => {
        //     p = paragraphs;
        //     paragraphs.load('font');
        //
        //     await paragraphs.context.sync().then(async() => {
        //         var p = paragraphs.items[2];
        //         var font = p.font;
        //         var ooxml = p.getOoxml();
        //
        //         await paragraphs.context.sync().then(() => {
        //             debugger;
        //             console.log(ooxml);
        //         });
        //     });
        // }).finally(() => {
        //     p.context.trackedObjects.remove(p);
        // });


        // this.office.getContentControl('Field1')
        //     .then(f => {
        //         this.msg.nativeElement.innerHTML = f.text;
        //         f.insertText("Hello World!", 'Replace');
        //         return f.context.sync();
        //     });
    }

    onInsertDocument() {
        this.office.insertDocumentFromURL("https://127.0.0.1:4200/assets/test1.docx", 'End');
    }

    onOpenDialog() {
        var url = `https://${location.host}/formular-editor`;
        this.office.showDialog(url, { width: 64, height: 64 }, function (asyncResult) {
            if (asyncResult.status !== Office.AsyncResultStatus.Succeeded) {
                // TODO: Handle error.
                return;
            }
        });
    }

    //Create Binding to selected Text and change Text
    onCreatedBindingAndChangeSelectedText(event) {
        Office.context.document.bindings.addFromSelectionAsync(Office.BindingType.Text, { id: 'myBinding' }, function (asyncResult) {
        if (asyncResult.status == Office.AsyncResultStatus.Failed) {
            write('Action failed. Error: ' + asyncResult.error.message);
        } else {
            write('Added new binding with type: ' + asyncResult.value.type + ' and id: ' + asyncResult.value.id);
            Office.select('bindings#myBinding').setDataAsync('Text Changed',function (asyncResult){
                if (asyncResult.status == "failed") {
                    write('Error: ' + asyncResult.error.message);
                }
            });
        }
        });

        function write(message){
            document.getElementById('message').innerText += message;
        }
    }
}
