// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 24/03/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import {Request} from './Request';

export class SaveFileRequest extends Request<void> {
  readonly name = "SaveFileRequest";
  readonly filename: string;
  readonly blob: Blob

  constructor(filename: string, blob: Blob) {
    super();
    this.filename = filename;
    this.blob = blob;
  }

  async process() {
    const url = URL.createObjectURL(this.blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = this.filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

}