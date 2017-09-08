import { Injectable } from '@angular/core';
import { Http, Response, ResponseContentType } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

export type InsertLocation = 'Replace' | 'Start' | 'End' | 'Before' | 'After';

export enum ControlType {
    RichText,
    CheckBox,
    ComboBox,
    Button
}


/**
 * Stellt High-Level-Funktionen für die Arbeit mit MS Office-Dokumenten
 * zur Verfügung.
 *
 * Alle Funktionen sind asynchron und geben Promises zurück.
 */
@Injectable()
export class OfficeService {
    private chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    constructor(private http: Http) { }

    /**
     * Lädt ein Dokument über HTTP und fügt es in das aktive Dokument ein.
     *
     * @param {String} url
     *  Die Adresse des Dokuments auf einem Web-Server.
     *
     * @param {InsertLocation} loc
     *  Position an der das Dokument eingefügt werden soll.
     */
    async insertDocumentFromURL(url: string, loc: InsertLocation) : Promise<void> {
         await this.http.get(url, { responseType: ResponseContentType.ArrayBuffer })
            .map(res => {
                return res.arrayBuffer();
            })
            .subscribe(buf => {
                Word.run(context => {
                    var body = context.document.body;
                    body.insertFileFromBase64(this.encode(buf), loc);
                    return context.sync();
                });
                err => console.log(err);
            });
    }

    /**
     * Gibt ein ContentControl aus dem aktiven Dokument zurück.
     *
     * @param {string} title
     *  Feldname des ContentControls
     */
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

    /**
     * Gibt eine Liste aller ContentControls im aktiven Dokument zurück.
     */
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

    /**
     * Ändert den Text eines ContentControls.
     *
     * @param {} data
     *  Dictionary mit den Feldern 'title' und 'text'. Z.B. { title: 'Feld', text: 'Inhalt' }
     */
    async updateContentControl(data) : Promise<void> {
        await Word.run(async(context) => {
            var doc = context.document;
            var controls = doc.contentControls;

            for (var c of data) {
                var res = controls.getByTitle(c.title);
                var f = res.getFirstOrNullObject();

                f.insertText(c.text, 'Replace');
            }

            await context.sync();
        });
    }

    getTags(control: Word.ContentControl) : string[] {
        var tag = control.tag;
        return tag.split(" ");
    }

    isWollMux(control: Word.ContentControl) : boolean {
        var tags = this.getTags(control);
        var wmTag = tags.find(tag => tag === "WollMux");
        return (wmTag != null);
    }

    getType(control: Word.ContentControl) : ControlType {
        var tags = this.getTags(control);

        if (tags.find(tag => tag === "CheckBox") != null) {
            return ControlType.CheckBox;
        } else if (tags.find(tag => tag === "ComboBox") != null) {
            return ControlType.ComboBox;
        } else {
            return ControlType.RichText;
        }
    }

    /**
     * Gibt eine Liste von Absätzen im Dokument zurück.
     *
     * ```
     * this.office.getParagraphs().then(async(paragraphs) => {
     *     p = paragraphs;
     *     paragraphs.load('font');
     *
     *     await paragraphs.context.sync().then(async() => {
     *         var p = paragraphs.items[2];
     *         var font = p.font;
     *         var ooxml = p.getOoxml();
     *
     *         await paragraphs.context.sync().then(() => {
     *             console.log(ooxml);
     *         });
     *     });
     * }).finally(() => {
     *     p.context.trackedObjects.remove(p);
     * });
     * ```
     *
     * @param {boolean} tracked
     *      Wenn true, dann kann die Liste für weitere Office.js-Operationen verwendet werden.
     *      Anschließend muss die Liste aus den trackedObjects des Contexts entfernt werden.
     */
    async getParagraphs(tracked: boolean = true) : Promise<Word.ParagraphCollection> {
        var paragraphs;

        await Word.run(async(context) => {
            paragraphs = context.document.body.paragraphs;
            paragraphs.load('items');

            if (tracked)
                context.trackedObjects.add(paragraphs);

            await context.sync(paragraphs);
        });

        return paragraphs;
    }

    /**
     * Öffnet eine Webseite in einem modalen Dialog.
     * Funktioniert nur mit HTTPS.
     *
     * @param {string} url
     * @param {Office.DialogOptions} options
     * @param {} callback
     */
    showDialog(url: string, options?: Office.DialogOptions, callback?: (result: Office.AsyncResult) => void) {
        Office.context.ui.displayDialogAsync(url, options, callback);
    }

    /**
     * Codiert ein Byte-Array als Base64.
     *
     * @param  {ArrayBuffer} arraybuffer description
     */
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
