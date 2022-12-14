// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 03/06/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import {Request} from './Request';
import {EScene} from '../objects/EScene';
import {URLFile} from './ioTypes';
import {ObjectRequest} from './ObjectRequest';


export class SceneRequest extends Request<EScene> {
  static SupportedExtensions = [".glb", ".gltf"];
  readonly name = "SceneRequest";
  file: URLFile;

  constructor(file: URLFile) {
    super();
    this.file  = file;
  }

  process() : Promise<EScene> {

    return new Promise<EScene>((resolve, reject) => {

      // Check if the file format is supported
      let ext_ok = false;
      let i = 0;
      while (!ext_ok && i < SceneRequest.SupportedExtensions.length) {
        ext_ok = this.file.name.endsWith(SceneRequest.SupportedExtensions[i]);
        i++;
      }
      if (!ext_ok) {
        reject("Unsupported File Extension: "+this.file.name);
        return;
      }

      // We reuse the LoadObjectRequest code since scene is an object like other
      const request = new ObjectRequest(this.file);
      const promise = request.process();

      promise.then(objects => {

        const scene = new EScene();
        scene.add(objects);

        resolve(scene);
      });

      promise.catch(error => {
        reject(error);
      });

    });
  }
}