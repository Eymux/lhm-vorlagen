import { Injectable } from '@angular/core';
import { IOfficeService } from "app/services/ioffice-service";
import { ControlType, InsertLocation } from "app/services/office-types";

@Injectable()
export class OfficeMockService implements IOfficeService {
    isWollMux(control: Word.ContentControl): boolean {
        return true;
    }
    getType(control: Word.ContentControl): ControlType {
        let n = Math.trunc((Math.random() * 3) + 1) 
        
        switch (n) {
        case 1:
            return ControlType.RichText;
        case 2:
            return ControlType.CheckBox;
        case 3:
            return ControlType.ComboBox;
        default:
            return ControlType.RichText;
        }
    }
    insertDocumentFromURL(url: string, loc: InsertLocation): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getContentControl(title: string): Promise<Word.ContentControl> {
        throw new Error("Method not implemented.");
    }
    getAllContentControls(): Promise<Word.ContentControlCollection> {
        return new Promise((resolve, reject) => { 
            resolve(<Word.ContentControlCollection>{items: [{ title: 'Feld1', text: 'Hello World!' }]});
        });
    }
    createContentControl(range: Word.Range, title?: string, tags?: string[], editable?: boolean) {
        throw new Error("Method not implemented.");
    }
    updateContentControl(data: any): Promise<void> {
        return new Promise<void>((resolve) => {
            resolve();
        });
    }
    getParagraphs(tracked?: boolean): Promise<Word.ParagraphCollection> {
        throw new Error("Method not implemented.");
    }
    hideRange(range: Word.Range): Promise<void> {
        throw new Error("Method not implemented.");
    }
    unhideRange(range: Word.Range): Promise<void> {
        throw new Error("Method not implemented.");
    }
    addXml(xml: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    getXmlById(id: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    getXmlIdsByNamespace(ns: string): Promise<string[]> {
        throw new Error("Method not implemented.");
    }
    deleteXmlById(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    addNodeInsertedHandler(id: string, handler: (e: any) => void): Promise<void> {
        throw new Error("Method not implemented.");
    }
    addNodeDeletedHandler(id: string, handler: (e: any) => void): Promise<void> {
        throw new Error("Method not implemented.");
    }
    showDialog(url: string, options?: Office.DialogOptions, callback?: (result: Office.AsyncResult) => void) {
        throw new Error("Method not implemented.");
    }

  constructor() { }

}
