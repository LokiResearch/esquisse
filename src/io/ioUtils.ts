// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 12/04/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import {Group, Bone, Mesh, Object3D, Scene, Material, MeshStandardMaterial,
  Color} from 'three';
import {EBone, EScene, EObject, EGroup, EBasicMesh, ESkinnedMesh, EEmptyObject,
  EMesh, EMeshBase, ESkinnedMeshBase, EScreen, EAnchor} from '/objects';

/**
 * Convert all materials used by meshes in a tree to MeshStandardMaterials
 * Meshes using the same material will keep a shared material
 * @param root Root of the object tree to transform
 * @returns The list of changed material
 */
export function convertAllMaterialsInTree(root: Object3D) {

  const newMaterialsMap = new Map<Material, MeshStandardMaterial>();

  root.traverse(obj => {
    const mesh = obj as Mesh;
    if (mesh.isMesh) {

      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      const newMats = [];
      for (const mat of mats) {
        if (!newMaterialsMap.has(mat)) {
          newMaterialsMap.set(mat, convertMaterial(mat));
        }
        newMats.push(newMaterialsMap.get(mat)!);
      }

      if (newMats.length === 1) {
        mesh.material = newMats[0];
      } else {
        mesh.material = newMats;
      } 
    }
  });

  const changedMaterial = new Array<Material>();
  newMaterialsMap.forEach((value, key) => {
    if (value !== key) {
      changedMaterial.push(key);
    }
  });

  return changedMaterial
}

export function convertMaterial(material: Material): MeshStandardMaterial {

  let newMaterial = material as MeshStandardMaterial

  if (!newMaterial.isMeshStandardMaterial) {

    newMaterial = new MeshStandardMaterial();

    const m = material as Material & {color: Color};
    newMaterial.color.copy(m.color ?? EMesh.defaultColor);
  }

  newMaterial.side = material.side;

  return newMaterial;
}

/**
 * Encapsulate all three objects in their corresponding EObject type and
 * init values from `Object3D.userData` if available
 * @param obj 
 * @returns 
 */
export function setupObjectsTree(obj: Object3D): EObject {

  /**
   * Convert material to MeshStandardMaterial for all 
   */
  const oldMat = convertAllMaterialsInTree(obj);
  oldMat.map(mat => mat.dispose());

  /**
   * Recursive function 
   */
  function _setupObjectsRec(obj: Object3D) {

    let EObject;

    let type = obj.type;
    let uuid = obj.uuid;
    const data = obj.userData.esquisse;
    if (data && data.type) {
      type = data.type as string;
      uuid = data.uuid as string;
    }
    // Put back the old uuid 
    obj.uuid = uuid;

    switch(type) {
    case "Scene":
      EObject = new EScene(obj as Scene);
      break;
    case "Group":
      EObject = new EGroup(obj as Group);
      break;
    case "Screen":
      EObject = new EScreen(obj as EMeshBase); 
      break;
    case "Anchor":
      EObject = new EAnchor(obj as EMeshBase);
      break;
    case "Mesh":
      EObject = new EBasicMesh(obj as EMeshBase);        
      break;
    case "SkinnedMesh":
      EObject = new ESkinnedMesh(obj as ESkinnedMeshBase);        
      break;
    case "Bone":
      EObject = new EBone(obj as Bone);
      break;
    case "Object3D":
      EObject = new EEmptyObject(obj);
      break;
    default:
      console.warn(`Unsupported object {type:${obj.type}, name:${obj.name}} was put in EEmptyObject`);
      EObject = new EEmptyObject(obj);
      break;
    }

    for (const child of obj.children) {
      _setupObjectsRec(child);
    }
    return EObject;
  }

  const root = _setupObjectsRec(obj);

  /**
   * Init each object with esquisse data if available
   */
  root.traverse(obj => {
    const data = obj.threeObject.userData.esquisse;
    if (data !== undefined) {
      obj.fromJson(data, root);
    }
  })

  return root;

}

export function findFirstScene(obj: EObject): EScene | null {

  if ((obj as EScene).isScene)
    return obj as EScene;

  for (const child of obj.children) {
    const scene = findFirstScene(child);
    if (scene) {
      return scene;
    }
  }

  return null;
}