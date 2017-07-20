import { Injectable } from '@angular/core';
import { Http, Response, ResponseContentType } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class OfficeService {
    private chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    constructor(private http: Http) { }

    async insertDocumentFromURL(url: string) : Promise<void> {
         await this.http.get(url, { responseType: ResponseContentType.ArrayBuffer })
            .map(res => {
                return res.arrayBuffer();
            })
            .subscribe(buf => {
                debugger;
                Word.run(context => {
                    var body = context.document.body;
                    body.insertFileFromBase64(this.encode(buf), Word.InsertLocation.end);
                    return context.sync();
                });
            });
    }

    async getContentControl(title: string) : Promise<Word.ContentControl> {
        var control;

        await Word.run(async(context) => {
            var doc = context.document;

            var controls = doc.contentControls;
            var fields = controls.getByTitle(title);
            control = fields.getFirst()
            control.load('tag, title, text');

            await context.sync(control)
        });

        return control;
    }

    async getAllContentControls() : Promise<Word.ContentControlCollection> {
        var cc;

        await Word.run(async(context) => {
            var doc = context.document;
            var controls = doc.contentControls;
            controls.load('items');

            cc = controls;

            await context.sync(controls);
        });

        return cc;
    }

    async updateContentControls(data) : Promise<void> {
        await Word.run(async(context) => {
            for (var c of data) {
                var doc = context.document;

                var controls = doc.contentControls;
                var f = controls.getByTitle(c.title).getFirst();

                f.insertText(c.text, 'Replace');
            }

            await context.sync();
        });
    }

    showDialog(url: string, options?: Office.DialogOptions, callback?: (result: Office.AsyncResult) => void) {
        Office.context.ui.displayDialogAsync(url, options, callback);
    }

    private encode(arraybuffer) {
        var bytes = new Uint8Array(arraybuffer),
        i, len = bytes.length, base64 = "";

        for (i = 0; i < len; i+=3) {
          base64 += this.chars[bytes[i] >> 2];
          base64 += this.chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
          base64 += this.chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
          base64 += this.chars[bytes[i + 2] & 63];
        }

        if ((len % 3) === 2) {
          base64 = base64.substring(0, base64.length - 1) + "=";
        } else if (len % 3 === 1) {
          base64 = base64.substring(0, base64.length - 2) + "==";
        }

        return base64;
    }
}
