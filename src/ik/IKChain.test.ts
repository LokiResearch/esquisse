/*
 * Author: Axel Antoine
 * mail: ax.antoine@gmail.com
 * website: http://axantoine.com
 * Created on Thu Sep 29 2022
 *
 * Loki, Inria project-team with Université de Lille
 * within the Joint Research Unit UMR 9189 
 * CNRS - Centrale Lille - Université de Lille, CRIStAL
 * https://loki.lille.inria.fr
 *
 * Licence: Licence.md
 */

import { Bone } from "three";
import { IKChain, MinSizeWarning, NotEnoughBonesWarning } from "./IKChain";

/**
 *          b0
 *          |
 *          b1
 *          |
 *          b2
 *         /  \
 *       b3a  b3b
 *       /      \
 *     b4a      b4b
 */   


let b0 : Bone;
let b1 : Bone;
let b2 : Bone;
let b3a: Bone;
let b4b: Bone;
let b3b: Bone;
let b4a: Bone;

let mockWarn: jest.SpyInstance;

beforeAll(() => {
  mockWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  mockWarn.mockRestore();
});

beforeEach(() => {
  b0 = new Bone();
  b1 = new Bone();
  b2 = new Bone();
  b3a = new Bone();
  b3b = new Bone();
  b4a = new Bone();
  b4b = new Bone();
  b0.add(b1);
  b1.add(b2);
  b2.add(b3a, b3b);
  b3a.add(b4a);
  b4a.add(b4b);
});

describe("IKChain", () => {

  let chain;

  test("Default size size", () => {

    // Default size is 1
    chain = new IKChain(0, b3a);
    expect(chain.size).toBe(1);

    chain = new IKChain(0, b3a, 0);
    expect(chain.size).toBe(0);
    expect(mockWarn).toHaveBeenCalledWith(MinSizeWarning);
    mockWarn.mockClear();

    chain = new IKChain(0, b3a, 3);
    expect(chain.size).toBe(3);

    // Not enough bones to increase size above 3
    chain = new IKChain(0, b3a, 4);
    expect(chain.size).toBe(3);
    expect(mockWarn).toHaveBeenCalledWith(NotEnoughBonesWarning(4, 3));
    mockWarn.mockClear();

  });


});