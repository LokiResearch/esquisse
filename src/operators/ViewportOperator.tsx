/*
 * Author: Axel Antoine
 * mail: ax.antoine@gmail.com
 * website: http://axantoine.com
 * Created on Tue Sep 27 2022
 *
 * Loki, Inria project-team with Université de Lille
 * within the Joint Research Unit UMR 9189 
 * CNRS - Centrale Lille - Université de Lille, CRIStAL
 * https://loki.lille.inria.fr
 *
 * Licence: Licence.md
 */

import { PerspectiveCamera, Vector2 } from "three";
import { Operator } from "./Operator";
import { Editor } from "/editor/Editor";

export abstract class ViewportOperator extends Operator {

  protected readonly camera: PerspectiveCamera;
  protected readonly viewport: HTMLElement;

  constructor (editor: Editor, viewport: HTMLElement, camera: PerspectiveCamera) {
    super(editor);
    this.camera = camera;
    this.viewport = viewport;
  }

  abstract onPress(event: PointerEvent): boolean;

  abstract onDrag(event: PointerEvent): void;

  abstract onRelease(event: PointerEvent): void;

  abstract onClick(event: PointerEvent): void;

}

export function pointerEventToNDC(
    event: PointerEvent,
    viewport: HTMLElement,
    target: Vector2) {
  target.set(
    (event.offsetX / viewport.clientWidth) * 2 - 1,
    -(event.offsetY / viewport.clientHeight) * 2 + 1
  );
}