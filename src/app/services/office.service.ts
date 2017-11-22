import { Injectable } from '@angular/core';
import { Http, Response, ResponseContentType } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { XMLSerializer } from 'xmldom';
import { IOfficeService } from 'app/services/ioffice-service';
import { ControlType, InsertLocation } from 'app/services/office-types';

/**
 * Stellt High-Level-Funktionen für die Arbeit mit MS Office-Dokumenten
 * zur Verfügung.
 *
 * Alle Funktionen sind asynchron und geben Promises zurück.
 */
@Injectable()
export class OfficeService implements IOfficeService {
    private chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    constructor(private http: Http) { }

    /**
     * Öffnet eine Webseite in einem modalen Dialog.
     * Funktioniert nur mit HTTPS.
     *
     * @param {string} url
     * @param {Office.DialogOptions} options
     * @param {} callback
     */
    showDialog(url: string, options?: Office.DialogOptions, callback?: (result: Office.AsyncResult) => void): void {
        Office.context.ui.displayDialogAsync(url, options, callback);
    }

    /**
     * Lädt ein Dokument über HTTP und fügt es in das aktive Dokument ein.
     *
     * @param {String} url
     *  Die Adresse des Dokuments auf einem Web-Server.
     *
     * @param {InsertLocation} loc
     *  Position an der das Dokument eingefügt werden soll.
     */
    async insertDocumentFromURL(url: string, loc: InsertLocation): Promise<void> {
        debugger;
        await this.http.get(url, { responseType: ResponseContentType.ArrayBuffer })
        .map(res => {
            return res.arrayBuffer();
        })
        .subscribe(buf => {
            Word.run(context => {
                const body = context.document.body;
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
    async getContentControl(title: string): Promise<Word.ContentControl> {
        return Word.run(context => {
            return new Promise<Word.ContentControl>(resolve => {
                const doc = context.document;

                const controls = doc.contentControls;
                const fields = controls.getByTitle(title);
                const control = fields.getFirst();
                control.load('tag, title, text');

                context.sync(control).then(cont => {
                    resolve(cont);
                });
            });
        });
    }

    /**
     * Gibt eine Liste aller ContentControls im aktiven Dokument zurück.
     */
    async getAllContentControls(): Promise<Word.ContentControlCollection> {
        return Word.run(context => {
            return new Promise<Word.ContentControlCollection>(resolve => {
                const doc = context.document;
                const controls = doc.contentControls;
                controls.load('items');

                context.sync(controls).then(cont => {
                    resolve(cont);
                });
            });
        });
    }

    async createContentControl(range: Word.Range, title = '', tags: string[] = [], editable = false): Promise<void> {
        Word.run(context => {
            const cc = range.insertContentControl();
            cc.title = title;
            if (tags.length > 0) {
                cc.tag = tags.join(' ');
            }
            cc.cannotEdit = !editable;

            return context.sync();
        });
    }

    /**
     * Ändert den Text eines ContentControls.
     *
     * @param {} data
     *  Dictionary mit den Feldern 'title' und 'text'. Z.B. { title: 'Feld', text: 'Inhalt' }
     */
    async updateContentControl(data): Promise<void> {
        Word.run(context => {
            const doc = context.document;
            const controls = doc.contentControls;
            controls.load('items');

            return context.sync().then(() => {
                for (const c of data) {
                    const items = controls.items;
                    const f = items.find(cc => {
                       return cc.title === c.title;
                    });

                    if (f !== undefined) {
                      f.insertText(c.text, 'Replace');
                    }
                }

                context.sync();
            });
        });
    }

    getTags(control: Word.ContentControl): string[] {
        const tag = control.tag;
        return tag.split(' ');
    }

    isWollMux(control: Word.ContentControl): boolean {
        const tags = this.getTags(control);
        const wmTag = tags.find(tag => tag === 'WollMux');
        return (wmTag !== undefined);
    }

    getType(control: Word.ContentControl): ControlType {
        const tags = this.getTags(control);

        if (tags.find(tag => tag === 'CheckBox') !== undefined) {
            return ControlType.CheckBox;
        } else if (tags.find(tag => tag === 'ComboBox') !== undefined) {
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
    async getParagraphs(tracked = true): Promise<Word.ParagraphCollection> {
        return Word.run(context => {
            return new Promise<Word.ParagraphCollection>(resolve => {
                const paragraphs = context.document.body.paragraphs;
                paragraphs.load('items');

                if (tracked) {
                    context.trackedObjects.add(paragraphs);
                }

                context.sync(paragraphs).then(() => {
                    resolve(paragraphs);
                });
            });
        });
    }

    async hideRange(range: Word.Range): Promise<void> {
        Word.run (context => {
            debugger;
            range.select();

            return context.sync().then(() => {
                const ooxml = Office.context.document.getSelectedDataAsync(Office.CoercionType.Ooxml, result => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(result.value, 'application/xml');

                    const el = doc.getElementsByTagName('w:t');

                    for (let i = 0; i < el.length; i++) {
                        const t = el.item(i);
                        const vanish = doc.createElementNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'w:vanish');
                        let rpr = t.previousSibling;

                        if (rpr === null) {
                            rpr = doc.createElementNS('http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'w:rPr');
                            t.parentNode.insertBefore(rpr, t);
                        }

                        rpr.appendChild(vanish);
                    }

                    const ser = new XMLSerializer();
                    const xml = ser.serializeToString(doc);

                    Office.context.document.setSelectedDataAsync(xml, { coercionType: Office.CoercionType.Ooxml });
                });
            });
        }).catch(error => console.log(error));
    }

    async unhideRange(range: Word.Range): Promise<void> {
        Word.run (async context => {
            range.select();

            return context.sync().then(() => {
                const ooxml = Office.context.document.getSelectedDataAsync(Office.CoercionType.Ooxml, result => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(result.value, 'application/xml');

                    const el = doc.getElementsByTagName('w:vanish');

                    while (el.length > 0) {
                        const t = el.item(0);
                        t.parentNode.removeChild(t);
                    }

                    const ser = new XMLSerializer();
                    const xml = ser.serializeToString(doc);

                    Office.context.document.setSelectedDataAsync(xml, { coercionType: Office.CoercionType.Ooxml });
                });
            });
        });
    }

    async addXml(xml: string): Promise<string> {
        return new Promise<string>(resolve => {
            Office.context.document.customXmlParts.addAsync(xml, undefined, result => {
                resolve(result.value.id);
            });
        });
    }

    async getXmlById(id: string): Promise<string> {
        return new Promise<string>(resolve => {
            Office.context.document.customXmlParts.getByIdAsync(id, result => {
                result.value.getXmlAsync({}, e => {
                    resolve(e.value);
                });
            });
        });
    }

    async getXmlIdsByNamespace(ns: string): Promise<string[]> {
        return new Promise<string[]>(resolve => {
            Office.context.document.customXmlParts.getByNamespaceAsync(ns, result => {
                const ret = [];
                for (const r of result.value as Office.CustomXmlPart[]) {
                    ret.push(r.id);
                }
                resolve(ret);
            });
        });
    }

    async deleteXmlById(id: string): Promise<void> {
        return new Promise<void>(resolve => {
            Office.context.document.customXmlParts.getByIdAsync(id, result => {
                result.value.deleteAsync(() => {});
                resolve();
            });
        });
    }

    async addNodeInsertedHandler(id: string, handler: (e) => void): Promise<void> {
        return this.addNodeEventHandler(id, Office.EventType.NodeInserted, handler);
    }
    async addNodeDeletedHandler(id: string, handler: (e) => void): Promise<void> {
        return this.addNodeEventHandler(id, Office.EventType.NodeDeleted, handler);
    }

    async addNodeEventHandler(id: string, eventType: Office.EventType, handler: (e) => void): Promise<void> {
        return new Promise<void>(resolve => {
            Office.context.document.customXmlParts.getByIdAsync(id, result => {
                result.value.addHandlerAsync(eventType, handler);
                resolve();
            });
        });
    }

    /**
     * Codiert ein Byte-Array als Base64.
     *
     * @param  {ArrayBuffer} arraybuffer description
     */
    /* tslint:disable:no-bitwise prefer-template */
    private encode(arraybuffer): string {
        const bytes = new Uint8Array(arraybuffer);
        const len = bytes.length;
        let base64 = '';

        for (let i = 0; i < len; i += 3) {
          base64 += this.chars[bytes[i] >> 2];
          base64 += this.chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
          base64 += this.chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
          base64 += this.chars[bytes[i + 2] & 63];
        }

        if ((len % 3) === 2) {
          base64 = base64.substring(0, base64.length - 1) + '=';
        } else if (len % 3 === 1) {
          base64 = base64.substring(0, base64.length - 2) + '==';
        }

        return base64;
    }
}
