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

describe("Array class", () => {

  test("Remove value from array", () => {
    const array = [1, 2, 3];
    let ret = array.remove(2);
    expect(ret).toBeTruthy();
    expect(array).not.toContain(2);

    ret = array.remove(2);
    expect(ret).toBeFalsy();
  })

  test("Clear array", () => {
    const array = [1, 2, 3];
    array.clear();
    expect(array).toHaveLength(0);
  });

});
