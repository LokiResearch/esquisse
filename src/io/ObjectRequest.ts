// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 03/06/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import {Group} from 'three';
import {EObject} from '/objects/EObject';
import {Request} from './Request';
import {FileLoader} from './FileLoader';
import {setupObjectsTree} from './ioUtils';
import {URLFile} from './ioTypes';

const loader = new FileLoader();

export class ObjectRequest extends Request<Array<EObject>> {
  static SupportedExtensions = FileLoader.SupportedExtensions;
  readonly name = "ObjectRequest";
  file: URLFile;

  constructor(file: URLFile) {
    super();
    this.file = file;
  }

  process() : Promise<Array<EObject>> {
    return new Promise<Array<EObject>>((resolve, reject) => {

      const onLoadSuccess = (group: Group) => {

        // Encapsulate the three objects in EObjects
        const g = setupObjectsTree(group);

        // Objects loaded are put within a group by the loader, 
        // We just return the children if any

        if (g.children.length > 0)
          resolve(g.children);
        else
          reject(`No object was found in the file ${this.file.name}`);
      }

      const onLoadProgress = (_: ProgressEvent) => {
        // do nothing
      }

      const onLoadError = (e: ErrorEvent) => {
        console.error("Error while loading "+this.file.name, e);
        reject(e);
      }

      loader.load(this.file, onLoadSuccess, onLoadProgress, onLoadError);
    });
  }

}

