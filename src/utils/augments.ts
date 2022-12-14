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


declare global {

  interface Array<T> {
    /**
     * Remove all elements from the array.
     */
    clear(): Array<T>;

    /**
    * Remove the given element from the array.
    */
    remove(arg: T): boolean;

    /**
     * Make 
     * @param arg 
     */
    toArray(arg: T | T[]): T[];
  }

  // interface ArrayConstructor {
  //   /**
  //    * Returns an array for the single value or the given array
  //    * @param arg value or array of values
  //    */
  //   toArray<T=any>(arg: T | T[]): T[];
  // }

}


Array.prototype.clear = function() {
  this.splice(0, this.length);
  return this;
}

Array.prototype.remove = function<T>(arg: T) {
  const idx = this.indexOf(arg);
  if (idx === -1) {
    return false;
  }
  this.splice(idx, 1);
  return true;
}

// Array.toArray = function<T>(arg: T | T[]) {
//   if (Array.isArray(arg)) return arg;
//   return [arg];
// }

export {}

