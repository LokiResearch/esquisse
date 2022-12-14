import React from 'react';
import {createRoot} from 'react-dom/client';
import '/utils/augments';
import {App} from './App';
import {Editor} from './editor/Editor';
import { SceneRequest } from '/io/SceneRequest';
import config from './config.json';

const container = document.getElementById('app');

if (container) {
  const root = createRoot(container);
  root.render(<App onAppLoad={onAppLoad}/>);
}

/**
 * Default behavior when the app is loaded
 */
function onAppLoad (editor: Editor) {
  try {
    if (config.defaultScene){
      const req = new SceneRequest({
        name: config.defaultScene,
        url: window.location+config.defaultScene
      });
      req.process().then(scene => {
        editor.setScene(scene);
      });
    }
  } catch {
    console.error(`Default scene ${config.defaultScene} does not exist`);
  }
}