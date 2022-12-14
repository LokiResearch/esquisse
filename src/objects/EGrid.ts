// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 18/08/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import { Color, LineSegments, BufferAttribute, BufferGeometry, LineBasicMaterial,
 ColorRepresentation} from 'three';
import { EObject } from './EObject';

const min_size = 1;
const max_size = 100;

// const redColor = new THREE.Color(0xAA0000);
// const greenColor = new THREE.Color(0x00AA00);
// const blueColor = new THREE.Color(0x0000AA);

export class EGrid extends EObject<LineSegments> {

  private _size : number;
  readonly color: Color;
  readonly shortText = 'GRD';
  readonly type = 'GridHelper';

  constructor(
      size: number = 10, 
      color: THREE.ColorRepresentation = 0x777777) {    

    const positions = new BufferAttribute(
      new Float32Array((4+max_size * 8) * 3), 3);

    const colors = new BufferAttribute(
      new Float32Array((4+max_size * 8) * 3), 3);

    // colors.setXYZ(0, blueColor.r, blueColor.g, blueColor.b);
    // colors.setXYZ(1, blueColor.r, blueColor.g, blueColor.b);
    // colors.setXYZ(2, redColor.r, redColor.g, redColor.b);
    // colors.setXYZ(3, redColor.r, redColor.g, redColor.b);

    const geometry = new BufferGeometry();
    geometry.setAttribute('position', positions);
    geometry.setAttribute('color', colors);

    const material = new LineBasicMaterial({ 
      vertexColors: true, 
      toneMapped: false
    });

    super(new LineSegments(geometry, material));


    this._size = Math.min(Math.max(size, min_size), max_size);;
    this.color = new Color(color);

    this.updateColors();
    this.updateVertices();
  }

  private updateColors() {

    const geometry = this.threeObject.geometry;
    const colors = geometry.getAttribute('color');

    const brighterFactor = 1.35;
    for (let i=0; i<4; i++) {
      colors.setXYZ(i, this.color.r * brighterFactor,
        this.color.g * brighterFactor, this.color.b * brighterFactor);
    }

    // update grid color
    const size = max_size*8+4;
    for (let i=4; i<size; i++) {
      colors.setXYZ(i, this.color.r, this.color.g, this.color.b);
    }
    colors.needsUpdate = true;
  }

  private updateVertices() {
    const geometry = this.threeObject.geometry;
    const positions = geometry.getAttribute('position');
    positions.setXYZ(0, 0, 0, this.size,);
    positions.setXYZ(1, 0, 0, -this.size);
    positions.setXYZ(2, this.size, 0, 0);
    positions.setXYZ(3, -this.size, 0, 0);

    let idx = 4;
    for (let i=1; i<=this.size; i++) {
      positions.setXYZ(idx, i, 0, this.size) ; idx +=1;
      positions.setXYZ(idx, i, 0, -this.size) ; idx +=1;
      positions.setXYZ(idx, -i, 0, this.size); idx +=1;
      positions.setXYZ(idx, -i, 0, -this.size); idx +=1;
      positions.setXYZ(idx, this.size, 0, i); idx +=1;
      positions.setXYZ(idx, -this.size, 0, i); idx +=1;
      positions.setXYZ(idx, this.size, 0, -i); idx +=1;
      positions.setXYZ(idx, -this.size, 0, -i); idx +=1;
    }
    
    geometry.setDrawRange(0, 4+this.size*8);
    positions.needsUpdate = true;
  }

  get size() {
    return this._size;
  }

  setColor(color: ColorRepresentation) {
    this.color.set(color);
    this.updateColors();
  }

  setSize(size: number) {
    this._size = Math.min(Math.max(size, min_size), max_size);
    this.updateVertices();
  }
}
