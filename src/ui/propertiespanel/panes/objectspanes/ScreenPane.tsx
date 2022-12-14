// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 16/03/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import { IconButton, Typography } from '@mui/material';
import * as React from 'react';
import { HelpersPane, MaterialListPane, ObjectNamePane, ObjectTRSPane } from './base';
import {EScreen} from '/objects';
import { FileButton, URLFile } from '/ui/base/controls/FileButton';
import { FlexRow } from '/ui/base/layout/FlexItems';
import { AccordionView } from '/ui/base/views';
import { SetInterfaceCommand } from '/commands';
import { useEditorContext } from '/editor/Editor';
import { Texture, TextureLoader } from 'three';
import { Clear, MobileScreenShare } from '@mui/icons-material';
import { useForceUpdate } from '/utils/reactUtils';
import { BooleanControl } from '/ui/base/controls';

const ImageFormats = ['.png', '.jpg', '.svg'];

export const ScreenPane = (props: {screen: EScreen}) => {

  const {screen} = props;
  
  return (
    <>
      <ObjectNamePane object={screen}/>
      <ObjectTRSPane object={screen}/>
      <MaterialListPane mesh={screen}/>
      <InterfacePane screen={screen}/>
      <HelpersPane object={screen}/>
    </>
  );
  
}

export const InterfacePane = (props: {screen: EScreen}) => {

  const {screen} = props;
  const texture = screen.firstMaterial.map;
  const editor = useEditorContext();
  const forceUpdate = useForceUpdate();

  /**
   * Suscribe to the screen interface changes
   */
  React.useEffect(() => {
    screen.signals.interfaceChanged.connect(forceUpdate);
    return () => {
      screen.signals.interfaceChanged.disconnect(forceUpdate);
    }
  });

  const onAddInterface = (file: URLFile) => {
    loadTextureFromFile(file).then(texture => {
      const cmd = new SetInterfaceCommand(editor, screen, texture);
      cmd.exec();
    });
  }

  const onRemoveInterface = () => {
    const cmd = new SetInterfaceCommand(editor, screen, null);
    cmd.exec();
  }

  const onTransparencyChange = (value: boolean) => {
    screen.setUseTransparentTexture(value);
    editor.signals.sceneChanged.emit("InterfaceTransparencyChanged");
  }

  return (

    <AccordionView title="Interface" defaultExpanded icon={MobileScreenShare}>
      <FlexRow>
        <Typography noWrap>
          {texture ? texture.name : "<No Interface>"}
        </Typography>
        
        <FileButton
          label="Select Image"
          tooltip={'Supported formats: '+ImageFormats.join(', ')}
          fileFormats={ImageFormats}
          onFileLoaded={onAddInterface}
        />
        {texture &&
          <IconButton onClick={onRemoveInterface} color='error'>
            <Clear/>
          </IconButton>
        }
      </FlexRow>

      {texture &&
        <FlexRow>
          <BooleanControl 
            value={screen.useTransparentTexture}
            onChange={onTransparencyChange}
            label={"TransparentTexture"}/>
        </FlexRow>
      }
    </AccordionView>
  );
}

async function loadTextureFromFile(file: URLFile) {
  const loader = new TextureLoader();

  return new Promise<Texture>((resolve, reject) => {

    const loadTexture = (url: string) => {
      loader.loadAsync(url)
        .then(texture => {
          texture.name = file.name;
          texture.sourceFile = file.url;
          resolve(texture);
        })
        .catch(reject);
    }

    loadTexture(file.url);
  });
}