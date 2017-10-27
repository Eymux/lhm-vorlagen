import { Injectable } from "@angular/core";

import { InsertLocation, ControlType } from "app/services/office-types";

/**
 * Muss eine abstrakte Klasse sein, weil Interface nicht injected werden können.
 */
@Injectable()
export abstract class IOfficeService {
    abstract insertDocumentFromURL(url: string, loc: InsertLocation) : Promise<void>;
    abstract getContentControl(title: string) : Promise<Word.ContentControl>;
    abstract getAllContentControls() : Promise<Word.ContentControlCollection>;
    abstract createContentControl(range: Word.Range, title?: string, tags?:string[], editable?: boolean);
    abstract updateContentControl(data) : Promise<void>;
    abstract getParagraphs(tracked?: boolean) : Promise<Word.ParagraphCollection>;
    abstract hideRange(range: Word.Range) : Promise<void>;
    abstract unhideRange(range: Word.Range) : Promise<void>;
    abstract addXml(xml: string) : Promise<string>;
    abstract getXmlById(id: string) : Promise<string>;
    abstract getXmlIdsByNamespace(ns: string) : Promise<string[]>;
    abstract deleteXmlById(id: string) : Promise<void>;
    abstract addNodeInsertedHandler(id: string, handler: (e) => void) : Promise<void>;
    abstract addNodeDeletedHandler(id: string, handler: (e) => void) : Promise<void>;
    abstract showDialog(url: string, options?: Office.DialogOptions, callback?: (result: Office.AsyncResult) => void);
    abstract isWollMux(control: Word.ContentControl) : boolean;
    abstract getType(control: Word.ContentControl) : ControlType;
}
