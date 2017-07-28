# Vorlagensystem der LHM

## Installation

[Node.js](https://nodejs.org) muss installiert sein.

`npm install -g @angular/cli`

Installiert [angular-cli](https://github.com/angular/angular-cli).

`npm install`

Installiert alle Abhängigkeiten des Projekts.

## Starten des Servers

`ng serve`

Startet den Entwicklungsserver auf `http://localhost:4200/`.

`ng serve --sourcemaps=true`

Startet den Server mit zusätzlichen Debuginformationen.

## Einstellungen

### Internet Explorer

Unter Extras/Internetoptionen/Erweitert/Einstellungen/Browsen müssen die Checkboxen *Skriptdebugging deaktivieren (Andere)* und *Skriptdebugging deaktivieren (Internet Explorer)* abgeschaltet sein.

### Microsoft Office

Microsoft Office muss auf das Manifest `manifest/lhm-vorlagen-manifest.xml` zugreifen können. Dazu muss der Ordner `manifest` im Netzwerk freigegeben werden ([Anleitung](http://praxistipps.chip.de/ordner-fuer-netzwerk-freigeben-so-funktionierts_19213)).

Der Netzwerkpfad muss in Microsoft Office als Trusted Catalog registriert werden (`File/Options/Trust Center/Trust Center Settings/Trusted Add-In Catalogs`).

Anschließend kann das Add-In über das Einfügen-Menü zu einem neuen Dokument hinzugefügt werden.

## Bedienung
Zum Einfügen von Content Controls in ein Dokument muss der Developer-Tab im Ribbon aktiviert werden ([Anleitung](https://support.office.com/en-us/article/Show-the-Developer-tab-e1192344-5e56-4d45-931b-e5fd9bea2d45)).

Das Add-In kann zur Zeit nur Text-Controls lesen. Die Controls müssen einen Titel haben und das Tag 'WollMux'. Andere Felder werden ignoriert.

Beim Click auf den Link *Formulareditor* werden alle Content-Controls eingelesen und im Fenster des Add-Ins als Textfelder angezeigt. Über diese Textfelder kann der Text in den Content-Controls bearbeitet werden.

## Dokumentation
Zur Erzeugung der Dokumentation muss Typdoc installiert werden.

`npm install typedoc --global`

Die Dokumentation wird mit dem folgenden Kommando im Ordner *doc* erzeugt.

`npm run docs`

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
