/*
 * Author: Axel Antoine
 * mail: ax.antoine@gmail.com
 * website: http://axantoine.com
 * Created on Wed Sep 28 2022
 *
 * Loki, Inria project-team with Université de Lille
 * within the Joint Research Unit UMR 9189 
 * CNRS - Centrale Lille - Université de Lille, CRIStAL
 * https://loki.lille.inria.fr
 *
 * Licence: Licence.md
 */

export function degToRad(deg: number): number {
  return deg/180*Math.PI;
}

export function emToPx(em: number): number {
  let div = document.getElementById('emToPx');

  if (div) {
    return div.offsetWidth*em;
  }
  // At 100%, 1em is usually 16px, this is unsure, but we should never be in
  // this case anyway
  return 16;
}