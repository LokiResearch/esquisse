// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 07/07/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import {Editor} from '/editor/Editor';

const isAppleLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);

export class EditorShortcuts {

  private readonly editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;

    window.addEventListener('keydown', this.onKeyDown);
  }

  onKeyDown = (event: KeyboardEvent) => {

    const ctrl = (isAppleLike && event.metaKey || event.ctrlKey)

    if (ctrl && event.key === 'z') {
      this.editor.command.undo();
    } else if (ctrl && event.key === 'Z') {
      this.editor.command.redo();
    } else if (ctrl && event.key === 's') {
      console.log('Save?');
    } else {
      return;
    }

    event.preventDefault();
  }
}

