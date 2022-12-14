// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 03/05/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// http://loki.lille.inria.fr

// LICENCE: Licence.md

import React from 'react';
import { MathUtils, Matrix4, Euler, Quaternion, Vector3 } from 'three';
import { EObject } from '/objects/EObject';
import { useEditorContext } from '/editor/Editor';
import { TransformCommand } from '/commands/objects/TransformCommand';
import { Vec3Control } from '/ui/base/controls/';
import { AccordionView } from '../../../../base/views';
import { action, makeObservable, observable } from 'mobx';
import { Transform } from '@mui/icons-material';

const epsilon = 1e-5;
const _vec = new Vector3();
const _pos = new Vector3();
const _scale = new Vector3();
const _quaternion = new Quaternion();
const _euler = new Euler();
const _matrix = new Matrix4();


interface Vec3 {
  x:number;
  y:number;
  z:number;
}


export class TRSState {
  object: EObject;
  position = observable({x:Infinity, y:Infinity, z:Infinity});
  rotation = observable({x:Infinity, y:Infinity, z:Infinity});
  scale = observable({x:Infinity, y:Infinity, z:Infinity});

  constructor(object: EObject) {
    this.object = object;
    this.update(object);

    makeObservable(this, {
      object: observable,
      update: action,
    })
  }

  update = (object: EObject) => {
    this.object = object;
    object.matrix.decompose(_pos, _quaternion, _scale);
    _euler.setFromQuaternion(_quaternion);
    _vec.setFromEuler(_euler).multiplyScalar(MathUtils.RAD2DEG);

    if (Math.abs(this.position.x - _pos.x) > epsilon) {this.position.x = _pos.x}
    if (Math.abs(this.position.y - _pos.y) > epsilon) {this.position.y = _pos.y}
    if (Math.abs(this.position.z - _pos.z) > epsilon) {this.position.z = _pos.z}

    if (Math.abs(this.rotation.x - _vec.x) > epsilon) {this.rotation.x = _vec.x}
    if (Math.abs(this.rotation.y - _vec.y) > epsilon) {this.rotation.y = _vec.y}
    if (Math.abs(this.rotation.z - _vec.z) > epsilon) {this.rotation.z = _vec.z}

    if (Math.abs(this.scale.x - _scale.x) > epsilon) {this.scale.x = _scale.x}
    if (Math.abs(this.scale.y - _scale.y) > epsilon) {this.scale.y = _scale.y}
    if (Math.abs(this.scale.z - _scale.z) > epsilon) {this.scale.z = _scale.z}
  }
}


export const ObjectTRSPane = (props: {object: EObject}) =>  {

  const {object} = props;
  const transformProxy = object.transformProxyObject;

  const stateRef = React.useRef(new TRSState(transformProxy));

  React.useEffect(() => {

    const updateState = () => {
      stateRef.current.update(transformProxy);
    }

    updateState();

    transformProxy.signals.transformUpdated.connect(updateState);
    transformProxy.signals.transformEnded.connect(updateState);

    return () => {
      transformProxy.signals.transformUpdated.disconnect(updateState);
      transformProxy.signals.transformEnded.disconnect(updateState);
    }

  }, [object]);

  /**
   * We track the proxy object since some object (e.g. SkinnedMesh) cannot be
   * moved directly
   */

  return (
    <AccordionView title='Transform' defaultExpanded icon={Transform}>
      <PositionVectorControl2 state={stateRef.current}/>
      <RotationVectorControl2 state={stateRef.current}/>
      <ScaleVectorControl2 state={stateRef.current}/>
    </AccordionView>
  );
}



const PositionVectorControl2 = (props: {state: TRSState}) => {

  const editor = useEditorContext();
  const {position, object} = props.state;

  const onChange = ({x, y, z}: Partial<Vec3>) => {
    // Get the current postion and scale from the matrix
    object.matrix.decompose(_pos, _quaternion, _scale);

    // Update the position
    x !== undefined && _pos.setComponent(0, x);
    y !== undefined && _pos.setComponent(1, y);
    z !== undefined && _pos.setComponent(2, z);

    // Build the new transform matrix
    _matrix.compose(_pos, _quaternion, _scale);
    
    const cmd = new TransformCommand(editor, [object], object.matrix);
    cmd.update(_matrix);
    cmd.exec();
  }

  return (
    <Vec3Control
      label="T:"
      value={position}
      onChange={onChange}
    />
  );
}

const RotationVectorControl2 = (props: {state: TRSState}) => {

  const editor = useEditorContext();
  const {rotation, object} = props.state;

  const onChange = ({x, y, z}: Partial<Vec3>) => {
    // Get the current postion and scale from the matrix
    object.matrix.decompose(_pos, _quaternion, _scale);

    // Update the orientation
    _euler.setFromQuaternion(_quaternion);
    _vec.setFromEuler(_euler);
    x !== undefined && _vec.setComponent(0, x*MathUtils.DEG2RAD);
    y !== undefined && _vec.setComponent(1, y*MathUtils.DEG2RAD);
    z !== undefined && _vec.setComponent(2, z*MathUtils.DEG2RAD);
    _euler.setFromVector3(_vec);
    _quaternion.setFromEuler(_euler);

    // Build the new transform matrix
    _matrix.compose(_pos, _quaternion, _scale);
    
    const cmd = new TransformCommand(editor, [object], object.matrix);
    cmd.update(_matrix);
    cmd.exec();
  }

  return (
    <Vec3Control 
      label="R:"
      value={rotation} 
      onChange={onChange}
    />
  );
}

const ScaleVectorControl2 = (props: {state: TRSState}) => {

  const editor = useEditorContext();
  const {scale, object} = props.state;

  const onChange = ({x, y, z}: Partial<Vec3>) => {
    // Get the current postion and scale from the matrix
    object.matrix.decompose(_pos, _quaternion, _scale);

    // Update the scale
    x !== undefined && _scale.setComponent(0, x);
    y !== undefined && _scale.setComponent(1, y);
    z !== undefined && _scale.setComponent(2, z);

    // Build the new transform matrix
    _matrix.compose(_pos, _quaternion, _scale);

    const cmd = new TransformCommand(editor, [object], object.matrix);
    cmd.update(_matrix);
    cmd.exec();
  }


  return (
    <Vec3Control 
      label="S:"
      value={scale} 
      onChange={onChange}
    />
  );
}
