// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 05/05/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import { Bone } from 'three';
import { IKChain } from './IKChain';
import { rootBone, parentBone, childrenBones } from './utils';

export class IKManager {

  private chains = new Set<IKChain>();
  private chainIdCounter = 0;

  /**
   * Creates and returns a new IK chain for the given effector bone and the
   * given chain size if possible, otherwise returns null.
   * @param effector The effector/head bone of the chain
   * @param size The size of the chain
   * @returns 
   */
  createChainFromBone(effector: Bone, size = 1) {

    if (size < 1) {
      console.warn("IKChain must have a min length of 1");
      return null;
    }

    // Check the start bone is not already in a chain
    if (!this.canAnyChainGrowFromBone(effector)) {
      console.warn(`Cannot create IKChain: Bone "${effector.name}" is already in a IKChain`);
      return null;
    }

    // For now create a Chain of size 1 we sure to be constructed in respect
    // of other chains
    const chain = new IKChain(this.chainIdCounter, effector, 1);
    this.chainIdCounter++;

    this.chains.add(chain);

    // Set the size of the chain. This will stop when another chain is met
    this.setChainSize(chain, size);

    return chain;
  }

  /**
   * Remove all tracked chains from the manager
   */
  removeAllChains() {
    for (const chain of this.chains) {
      chain.dispose();
    }
    this.chains.clear();
    this.chainIdCounter = 0;
  }

  /**
   * Add an existing chain to the manager and returns `True` if chain has been 
   * added.
   * @param chain The chain to be added
   * @returns Whether the chain has been added to the manager
   */
  addChain(chain: IKChain): boolean {
    if (this.chains.has(chain)) {
      return true;
    }

    /**
     * For the chain to be added to the manager, it must not be in conflict 
     * with existing chains, which means check that any chain can grow from
     * the 0 to n-1 bones of the to-be-added chain
     */
    for (let i=0; i<chain.bones.length-1; i++) {
      if (!this.canAnyChainGrowFromBone(chain.bones[i])) {
        console.warn(`Cannot add chain: bone n°${i} is used by another chain.`, chain.bones[i]);
        return false;
      }
    }
    return true;
  }

  /**
   * Check if a bone can be added to the tail of a chain.
   * @param bone 
   * @returns 
   */
  private canAnyChainGrowFromBone(bone: Bone) {

    // If bone has no ik property, it has not been used yet and is available
    if (!bone.ik) {
      return true;
    }

    // Bone can be added to a new chain only if :
    // a) it is not connected to a chain
    // b) it is only the tail bone of the connected chains

    // We take only into account chains tracked by the manager
    const chains = bone.ik.chains.filter(c => this.chains.has(c));

    return chains.every(chain => chain.tail === bone);
  }

  removeChain(chain: IKChain) {
    if (this.chains.has(chain)) {
      this.chains.delete(chain);
      chain.dispose();
    } 
  }

  /**
   * Sets the chain length and returns whether the chain has been modified
   * @param chain 
   * @param length 
   * @returns 
   */
  setChainSize(chain: IKChain, size: number) {
    if (!this.chains.has(chain)) {
      console.warn("Chain is not tracked by the manager, ignored.");
      return false;
    }

    // If length is increasing, check the parent bones can be added to the chain
    if (size > chain.size) {
      const n = size - chain.size;
      let i = 0;


      let current: Bone = chain.tail;
      let parent = parentBone(current);
      while (i<n && parent && this.canAnyChainGrowFromBone(current)) {
        i++;
        current = parent;
        parent = parentBone(current);
      }
      
      if (i<n) {
        console.warn(`Chain size cannot be increased to ${size}: not enough bones available.`);
      }

      size = chain.size + i;

    }


    const success =  chain.setSize(size);

    this.lockChainTails();

    return success;
  }

  lockChainTails() {
    // Lock bones tail
    for (const chain of this.chains) {
      const tail = chain.tail;
      chain.lockTail = false;

      // More than one chain connected at the bone
      if (tail.ik.chains.length > 1) {

        // If it exist another chain where the bone is not the tail,
        // then that chain has priority on the bone control, and so, we lock
        // it for the current chain (as tail)
        if (tail.ik.chains.some(c => c.tail !== tail)) {
          chain.lockTail = true;
        }
      }

      // If the chain tail is the root of the skeleton, lock it
      if (rootBone(tail) === tail) {
        chain.lockTail = true;
      }
    }
  }

  canIncreaseChain(chain: IKChain, delta = 1) {

    /**
     * We need to check 2 things:
     * 1. That parent from the current exist to be linked
     * 2. That chain can grow from the current bone
     */
    let current: Bone = chain.tail;
    for (let i=0; i<delta; i++) {
      const parent = parentBone(current);
      if (!parent || !this.canAnyChainGrowFromBone(current)) {
        return false;
      }
      current = parent;
    }

    return chain.canIncrease(delta);
  }

  canDecreaseChain(chain: IKChain, delta = 1) {
    return chain.canDecrease(delta);
  }

  solveChains(chains: Set<IKChain> = this.chains) {

    // Get the unique set of root bones of bones involved in chains
    const roots = new Set<Bone>();
    for (const chain of chains) {
      roots.add(rootBone(chain.tail));
    }

    // Traverse each bones tree in top-down order to update ik chains
    // Traversal is Breadth-First
    const updatedChains = new Set<IKChain>();
    
    for (const root of roots) {        
      boneBFTraverse(root, bone => {
        if (bone.ik) {
          for (const chain of bone.ik.chains) {
            // Update non already updated connected chains
            if (!updatedChains.has(chain)) {
              updatedChains.add(chain);
              chain.solve();
            }
          }
        }
      });
    }
  }

}

/**
 * Apply the given callback to a bone tree using a breadth-first traversal.
 * @param bone 
 * @param callback 
 */
function boneBFTraverse(root: Bone, callback: (bone: Bone) => void) {
  // As bone can only have one parent (from Object3D), no loop in the tree, no
  // need to mark visited bones
  const queue = new Array<Bone>();
  let bone: Bone | undefined = root;
  while (bone) {
    callback(bone);
    queue.push(...childrenBones(bone));
    bone = queue.shift();
  }
}





