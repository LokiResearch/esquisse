// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 28/07/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import React from 'react';
import { ObjectNamePane, ObjectTRSPane, MaterialListPane } from './base';
import { useEditorContext } from '/editor/Editor';
import { NumberControl, SelectControl } from '/ui/base/controls';
import { EAnchor, EAnchorShape } from '/objects';
import { AccordionView } from '../../../base/views';
import { PoseModeIcon } from '/ui/Icons';
import { Button } from '@mui/material';
import { RemoveIKChainCommand, SetAnchorShapeCommand, SetIKChainSizeCommand } from '/commands';
import { useForceUpdate } from '/utils/reactUtils';

export interface AnchorPaneProps {
  anchor: EAnchor,
}

const selectShapeOptions = Object.values(EAnchorShape).map(v => {return {
  value: v,
  label: v,
}});

export const AnchorPane = (props: AnchorPaneProps) => {

  const {anchor} = props;



  return (
    <>
      <ObjectNamePane object={anchor}/>
      <ObjectTRSPane object={anchor}/>
      <MaterialListPane mesh={anchor}/>
      <IKPane anchor={anchor}/>
    </>
  );
}

const IKPane = (props: {anchor: EAnchor}) => {

  const {anchor} = props;

  const forceUpdate = useForceUpdate();

  React.useEffect(() => {
    anchor.signals.ikDataUpdated.connect(forceUpdate);
    return () => {
      anchor.signals.ikDataUpdated.disconnect(forceUpdate);
    }
  }, [anchor]);

  return (
    <AccordionView title="IK" icon={PoseModeIcon} defaultExpanded={true}>
      <AnchorShapeControl anchor={anchor}/>
      <AnchorIKChainSizeControl anchor={anchor}/>
      <AnchorTemporaryButton anchor={anchor}/>
      <AddRemoveChainButton anchor={anchor}/>
    </AccordionView>
  );

}


const AnchorIKChainSizeControl = (props: {anchor: EAnchor}) => {

  const {anchor} = props;
  const ikChain = anchor.ikChain;
  const editor = useEditorContext();

  const onSizeChanged = (size: number) => {
    const cmd = new SetIKChainSizeCommand(editor, anchor, size);
    cmd.exec();
  }

  if (!ikChain) {
    return <></>
  }

  return (
    <NumberControl
      label="Chain size"
      value={ikChain.size}
      step={1}
      canIncrease={() => {
        return ikChain.canIncrease(1);
      }}
      canDecrease={() => {
        return ikChain.canDecrease(1);
      }}
      onChange={onSizeChanged}
    />
  )
}

const AnchorShapeControl = (props: {anchor: EAnchor}) => {

  const {anchor} = props;
  const editor = useEditorContext();

  const onShapeChanged = (shape: EAnchorShape) => {
    const cmd = new SetAnchorShapeCommand(editor, anchor, shape);
    cmd.exec();
  }

  if (anchor.isTemporary) {
    return <></>;
  }

  return (
    <SelectControl<EAnchorShape>
      label='Shape'
      options={selectShapeOptions}
      value={anchor.shape}
      onChange={onShapeChanged}
    />
  );

}

const AnchorTemporaryButton = (props: {anchor: EAnchor}) => {
  
  const {anchor} = props;
  const editor = useEditorContext();
  
  const onClick = () => {
    editor.makeAnchorNonTemporary(anchor);
  }

  if (!anchor.isTemporary) {
    return <></>
  }

  return (
    <Button fullWidth variant="outlined" onClick={onClick}>
      Keep Anchor
    </Button>
  );
}

const AddRemoveChainButton = (props: {anchor: EAnchor}) => {

  const editor = useEditorContext();
  const {anchor} = props;

  if (anchor.ikChain) {

    const removeChain = () => {
      const cmd = new RemoveIKChainCommand(editor, anchor);
      cmd.exec();
    }

    return (
      <Button fullWidth variant='outlined' onClick={removeChain}>
        Remove IK chain
      </Button>
    );
  } else {

    const addChain = () => {
      
    }

    return (
      <Button fullWidth variant='outlined' onClick={addChain}>
        Add IK chain
      </Button>
    );
  }
}


