// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 15/03/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import React from 'react';
import {StringControl} from '/ui/base/controls';
import {EObject} from '/objects/EObject';
import { useEditorContext } from '/editor/Editor';
import {SetNameCommand} from '/commands/objects/SetNameCommand';
import { Paper } from '@mui/material';

const styles = {
  root: {
    padding: '0.3em',
  },
}

interface ObjectNamePaneProps {
  object: EObject,
}

export const ObjectNamePane = (props: ObjectNamePaneProps) => {

  const editor = useEditorContext();
  const {object} = props;

  const onNameChanged = (name: string) => {
    const cmd = new SetNameCommand(editor, object, name);
    cmd.exec();
  }

  return (
    <Paper sx={styles.root} elevation={2}>
      <StringControl
        value={object.name}
        label={object.type}
        icon={object.icon}
        typographyProps={{
          color:'primary'
        }}
        iconColor='primary'
        onChange={onNameChanged}/>
    </Paper>
  );
  
}