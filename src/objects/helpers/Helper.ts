

// import { Object3D } from "three";

// type GConstructor<T = {}> = new (...args: any[]) => T;

// export function Helper<T extends GConstructor<Object3D>> (Base: T) {

//   return class Helper extends Base {

//     needsUpdate = false;

//     update() {
//       this.needsUpdate = false;
//     }
    
//     dispose() {}

//     show() {
//       this.visible = true;
//     };

//     hide() {
//       this.visible = false;
//     };

//   }

// }

export interface Helper {
  visible: boolean;
  update(): void;
  dispose(): void;
}
