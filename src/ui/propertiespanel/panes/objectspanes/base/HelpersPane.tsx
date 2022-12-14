/*
 * Author: Axel Antoine
 * mail: ax.antoine@gmail.com
 * website: http://axantoine.com
 * Created on Fri Sep 30 2022
 *
 * Loki, Inria project-team with Université de Lille
 * within the Joint Research Unit UMR 9189 
 * CNRS - Centrale Lille - Université de Lille, CRIStAL
 * https://loki.lille.inria.fr
 *
 * Licence: Licence.md
 */

import React from 'react';
import { useEditorContext } from '/editor/Editor';
import { EAnchor, EBone, EMesh, EObject, ESkinnedMesh } from "/objects";
import { BooleanControl } from '/ui/base/controls';
import { AccordionView } from "../../../../base/views";
import { useForceUpdate } from '/utils/reactUtils';
import { HelpCenter } from '@mui/icons-material';

export const HelpersPane = (props: {object: EObject}) => {

  const {object} = props;
  const forceUpdate = useForceUpdate();

  React.useEffect(() => {
    object.signals.helpersVisibilityChanged.connect(forceUpdate);
    return () => {
      object.signals.helpersVisibilityChanged.disconnect(forceUpdate);
    }
  }, [object]);

  let child;
  if ((object as ESkinnedMesh).isSkinnedMesh) {
    child = <SkinnedMeshHelpers mesh={object as ESkinnedMesh}/>;
  } else if ((object as EAnchor).isAnchor) {
    child = <AnchorHelpers anchor={object as EAnchor}/>;
  } else if ((object as EBone).isBone) {
    child = <BoneHelpers bone={object as EBone}/>;
  } else if ((object as EMesh).isMesh) {
    child = <MeshHelpers mesh={object as EMesh}/>;
  } else {
    child = <ObjectHelpers object={object}/>;
  }

  return (
    <AccordionView title="Helpers" defaultExpanded icon={HelpCenter}>
      {child}
    </AccordionView>
  );
}

const ObjectHelpers = (_props: {object: EObject}) => {
  return <></>;
}

const MeshHelpers = (props: {mesh: EMesh}) => {

  const editor = useEditorContext();
  const {mesh} = props;
  const boxHelperVisble = mesh.boxHelper?.visible || false;
  
  const onBoxHelperChanged = (value: boolean) => {
    editor.helpersManager.showBoxHelpers([mesh], value);
  }

  return (
    <>
      <ObjectHelpers object={mesh}/>
      <BooleanControl
        label='Show Box Helper'
        value={boxHelperVisble}
        onChange={onBoxHelperChanged}
      />
    </>
  )
}

const SkinnedMeshHelpers = (props: {mesh: ESkinnedMesh}) => {

  const {mesh} = props;
  const skeleton = mesh.skeleton;
  const rootBones = skeleton.rootBones;
  
  const boneHelpers = rootBones.map((b, idx) => <BoneHelpers bone={b} key={idx}/>);

  return (
    <>
      <MeshHelpers mesh={mesh}/>
      {boneHelpers}
    </>
  );
}

const BoneHelpers = (props: {bone: EBone}) => {

  const editor = useEditorContext();
  const {bone} = props;
  const boneHelperVisible = bone.helper?.visible || false;

  const onBoneHelperChanged = (value: boolean) => {
    editor.helpersManager.showSkeletonHelpers([bone], value);
  }

  return (
    <>
      <ObjectHelpers object={bone}/>

      <BooleanControl
        label="Show skeleton helper"
        value={boneHelperVisible}
        onChange={onBoneHelperChanged}
      />

    </>
  );
}


const AnchorHelpers = (props: {anchor: EAnchor}) => {
  const {anchor} = props;
  const targetBone = anchor.targetBone;

  return (
    <>
      <MeshHelpers mesh={anchor}/>
      {targetBone &&
        <BoneHelpers bone={targetBone}/>
      }
    </>
  );
}

