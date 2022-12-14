// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 03/08/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import {Editor} from '/editor/Editor';

export abstract class Operator {
  abstract readonly name: string;

  protected readonly editor: Editor;

  constructor (editor: Editor) {
    this.editor = editor;
  }

  abstract exec(): void;
}
