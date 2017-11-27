// tslint:disable-next-line:no-reference
/// <reference path="../../node_modules/@types/office-js/index.d.ts" />

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LocationStrategy } from '@angular/common';
import { Http, Response, ResponseContentType } from '@angular/http';

import { XMLSerializer } from 'xmldom';

import { IOfficeService } from 'app/services/ioffice-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'app works!';

    @ViewChild('text') msg: ElementRef;

    constructor(private http: Http, private office: IOfficeService) {}

    ngOnInit(): void {
        // this.msg.nativeElement.textContent = "Init";
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

    onNodeInserted(e): void {
        debugger;
    }

    clicked(): void {
        let p;

        this.office.getParagraphs().then(async paragraphs => {
            p = paragraphs;
            paragraphs.load('font');

            await paragraphs.context.sync().then(async () => {
                const para = paragraphs.items[2];
                const font = para.font;
                const ooxml = para.getOoxml();

                await paragraphs.context.sync().then(() => {
                    debugger;
                    console.log(ooxml);
                });
            });
        });

        // this.office.getContentControl('Field1')
        //     .then(f => {
        //         this.msg.nativeElement.innerHTML = f.text;
        //         f.insertText("Hello World!", 'Replace');
        //         return f.context.sync();
        //     });
    }

    onInsertDocument(): void {
        const url = `${location.origin}/assets/test1.docx`;
        this.office.insertDocumentFromURL(url, 'End');
    }

    onOpenDialog(): void {
        const url = `${location.origin}/formular-editor`;
        this.office.showDialog(url, { width: 64, height: 64 }, asyncResult => {
            if (asyncResult.status !== Office.AsyncResultStatus.Succeeded) {
                // TODO: Handle error.
                return;
            }
        });
    }

    hideSelection(): void {
        Word.run(context => {
            const rng = context.document.getSelection();
            context.trackedObjects.add(rng);
            this.office.hideRange(rng);
            context.trackedObjects.remove(rng);
            return context.sync();
        });
    }

    unhideSelection(): void {
        Word.run(context => {
            const rng = context.document.getSelection();
            context.trackedObjects.add(rng);
            this.office.unhideRange(rng);
            context.trackedObjects.remove(rng);
            return context.sync();
        });
    }

    wrapSelection(): void {
        Word.run(context => {
            const rng = context.document.getSelection();
            context.trackedObjects.add(rng);
            this.office.createContentControl(rng, 'Feld4', ['WollMux'], true);
            context.trackedObjects.remove(rng);
            return context.sync();
        });
    }

    async testXml(): Promise<void> {
        this.office.addXml('<test xmlns="http://muenchen.de"></test>').then(id => {
            this.office.addNodeInsertedHandler(id, this.onNodeInserted);

            Office.context.document.customXmlParts.getByIdAsync(id, result => {
                const p: Office.CustomXmlPart  = result.value;
                p.getNodesAsync('*', res => {
                    const nodes: Office.CustomXmlNode[] = res.value;
                    const node = nodes.pop();
                    node.getXmlAsync(res2 => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(res2.value, 'application/xml');
                        const n = doc.createElementNS('http://muenchen.de', 'testNode');
                        doc.getElementsByTagName('test').item(0).appendChild(n);

                        const ser = new XMLSerializer();
                        const xml = ser.serializeToString(doc);
                        debugger;
                        node.setXmlAsync(xml);
                    });
                });
            });

            // this.office.deleteXmlById(id).then(() => {
            //     console.log("Success!");
            // });
        });
    }
}
