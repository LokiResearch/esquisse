// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 24/03/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import {Object3D} from 'three';
import {GLTFExporter, GLTFExporterOptions} from 'three/examples/jsm/exporters/GLTFExporter';
import {Request} from './Request';
import {SaveFileRequest} from './SaveFileRequest';
import { Editor } from '/editor/Editor';
import { EObject } from '/objects';

export interface ExportOptions {
  prettify?: boolean;
  binary?: boolean;
}

export class SaveSceneRequest extends Request<void> {
  readonly name = "SaveSceneRequest";
  filename: string;
  editor: Editor;
  options: ExportOptions;

  constructor(filename: string, editor: Editor, options: ExportOptions = {}) {
    super();
    this.filename = filename;
    this.editor = editor;
    this.options = {
      prettify: false,
      binary: false,
      ...options};
  }

  async process() {
    const scene = this.editor.scene;

    let nonExportableObjectsMap = new Map<EObject, EObject>();
    let obj: EObject | undefined = scene;
    let queue = [];
    // Get non exportable objects and their parent
    while (obj) {
      if (obj.canBeExported) {
        queue.push(...obj.children);
      } else {
        if (obj.parent) {
          nonExportableObjectsMap.set(obj, obj.parent);
        } else {
          throw `Object {name:${obj.name}, type:${obj.type}} has no parent`;
        }
      }
      obj = queue.shift();
    }

    // Remove non exportable objects
    for (const [obj, _parent] of nonExportableObjectsMap){
      obj.removeFromParent();
    }

    scene.traverse(obj => {
      obj.threeObject.userData.esquisse = obj.toJson();
    });

    this.export(scene.threeObject);

    // Put back non exportable objects
    for (const [obj, parent] of nonExportableObjectsMap){
      parent.attach(obj);
    }

  }

  export(object: Object3D) {

    const extension = this.options.binary ? '.glb' : '.gltf';

    const onParseCompleted = (gltf: object | ArrayBuffer) => {

      let blob;
      if (this.options.binary) {
        blob = new Blob([gltf as ArrayBuffer])
      } else {
        blob = blobFromData(gltf, this.options.prettify);
      }

      const filename = this.filename + (this.filename.endsWith(extension) ? "" : extension);
      const request = new SaveFileRequest(filename, blob);
      request.process();

    }

    const onParseError = (error: any) => {
      console.error(`Error occured while exporting scene in ${extension}`, error);
    }

     // Get the GLTF data
    const exporter = new GLTFExporter();
    const parseOptions: GLTFExporterOptions = {
      onlyVisible: false,
    }
    exporter.parse(object, onParseCompleted, onParseError, parseOptions);
  }

}

function blobFromData(data: object, prettify = false) {
  const space = prettify ? 2 : 0;
  const text = JSON.stringify(data, null, space);
  const blob = new Blob([text], {type:"application/json"});
  return blob;
}



