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
import {SaveFileRequest} from './SaveFileRequest';
import type {Svg} from '@svgdotjs/svg.js';

export interface WriteSVGOptions {
  prettify?: boolean
}

export class SaveSvgRequest extends Request<void> {
  readonly name = "SaveSvgRequest";
  filename: string;
  svg: Svg;
  options: WriteSVGOptions;

  constructor(filename: string, svg: Svg, options: WriteSVGOptions = {}) {
    super();
    this.filename = filename;
    this.svg = svg;
    this.options = options;
  }

  async process() {
    const text = this.svg.svg();
    const blob = new Blob([text], {type:"image/svg+xml;charset=utf-8"});
    const request = new SaveFileRequest(this.filename, blob);
    request.process();
  }
}


