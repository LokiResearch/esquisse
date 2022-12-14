// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 02/02/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import * as THREE from 'three';
import React from 'react';
import {Viewport} from './ui/viewport/Viewport';
import {MenuBar} from '/ui/menubar/MenuBar';
import {ThemeProvider, Box} from '@mui/material';
import {MainPanel} from './ui/mainpanel/MainPanel';
import {PropertiesPanel} from './ui/propertiespanel/PropertyPanel';
import {useEditorContext, EditorContextProvider, Editor} from '/editor/Editor';
import { observer } from 'mobx-react-lite';

const styles = {
  app: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  container: {
    flexGrow: 1,
    flexShrink: 10,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
};

interface AppProps {
  onAppLoad?: (editor: Editor) => void;
}

export const App = (props: AppProps) => {

  const {onAppLoad} = props;
  const editor = new Editor();
  
  React.useEffect(() => {
    onAppLoad && onAppLoad(editor);
  }, []);

  return (
    <EditorContextProvider value={editor}>
      <AppThemeProvider>
        <Box sx={styles.app}>
          <MenuBar/>
          <Box sx={styles.container}>
            <MainPanel defaultExpanded={true}/>
            <Viewport
              cameraPosition={new THREE.Vector3(10,9,5)}
              cameraTarget={new THREE.Vector3()}
            />
            <PropertiesPanel defaultExpanded={true}/>
          </Box>
        </Box>
      </AppThemeProvider>
    </EditorContextProvider>
  );
}

export const AppThemeProvider = observer((props: {children: React.ReactNode}) => {
  const editor = useEditorContext();
  return (
    <ThemeProvider {...props} theme={editor.settings.theme}/>
  );
});



