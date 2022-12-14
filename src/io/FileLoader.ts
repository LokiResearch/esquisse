// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 02/05/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import {Group} from 'three';
import {URLFile} from './ioTypes';
import {GLTFLoader, GLTF} from 'three/examples/jsm/loaders/GLTFLoader';
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';

export class FileLoader {

  static SupportedExtensions = [".obj", ".gltf", ".glb", ".fbx"]

  load(
      file: URLFile,
      onSuccess: (group: Group) => void,
      onProgress: (event: ProgressEvent) => void,
      onError: (event: ErrorEvent) => void
    ) {

    const format = file.name.split(".").pop();
    let loader;

    switch (format) {

      case 'gltf':
      case 'glb':

        const onGLTFSuccess = (gltf: GLTF) => onSuccess(gltf.scene);
        loader = new GLTFLoader();
        loader.load(file.url, onGLTFSuccess, onProgress, onError);
        break;

      case 'obj':

       loader = new OBJLoader();
       loader.load(file.url, onSuccess, onProgress, onError);
       break;

      case 'fbx':

        loader = new FBXLoader();
        loader.load(file.url, onSuccess, onProgress, onError);
        break;

      default:

        console.error(`Unsupported file format ${format}`);
        break;

    }

  }
}

