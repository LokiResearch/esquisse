// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 01/06/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import * as React from 'react';
import {ServerScenesListRequest} from '/io/ServerScenesListRequest';
import * as Constants from '/constants';

// interface SceneMenuProps {

// }

// interface SceneMenuState {
//   serverScenes: string[];
//   selectedScene: string
// }

export class SceneMenu extends React.Component<SceneMenuProps, SceneMenuState> {

  constructor(props: SceneMenu) {
    super(props);
    this.state = {
      serverScenes: [],
      selectedScene: ""
    };
  }

  onFetchServerScenesList = () => {
    const request = new ServerScenesListRequest();
    request.process().then(list => {
      this.setState({
        serverScenes: list
      });
      if (list.length > 0 && !list.includes(this.state.selectedScene)){
        this.setState({
          selectedScene: list[0]
        })
      }
    })
  }

  onLoad3DScene = () => {
    const op = new LoadSceneOperator(Constants.SERVER_SCENES_DIR+this.state.selectedScene);
    op.do();
  }

  onSelect3DSceneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({
      selectedScene: e.target.value
    })
  }

  onImportObject = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = ".obj";

    input.onchange = function() {
      if (input.files) {
        const obj = input.files[0];
        const fr = new FileReader();  
        fr.onload = function() {
          if (fr.result && typeof fr.result === "string") {
            console.log("Import object:", obj.name);
            const op = new LoadObjectsOperator([fr.result]);
            op.do();
          }
        }
        fr.readAsDataURL(obj);
      }
    };

    input.click();
  }

  onRenderScene = () => {
    const op = new RenderOperator();
    op.do();
  }

  render() {
    const items = this.state.serverScenes.map(
      (item:string, index:number) => {
        return (
          <option key={index}>
            {item}
          </option> 
        );
      });

    return (
      <div className="SceneMenu">
        <div className="row">
          <button type="button" className="btn btn-primary"
            color="primary" onClick={this.onFetchServerScenesList}
          >
            Fetch 3D scenes
          </button>
        </div>
        <div className="row">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <label className="input-group-text" htmlFor="sceneSelect">Options</label>
            </div>
            <select className="custom-select" id="sceneSelect" onChange={this.onSelect3DSceneChange}>
              {items}
            </select>
          </div>
        </div>
        <div className="row">
          <button type="button" className="btn btn-primary"
            color="primary" onClick={this.onLoad3DScene}>
              Load 3D Scene
          </button>
        </div>
        <div className="row">
          <button type="button" className="btn btn-primary"
            color="primary" onClick={this.onImportObject}>
              import object
          </button>
        </div>
        <div className="row">
          <button type="button" className="btn btn-primary"
            color="primary" onClick={this.onRenderScene}>
              Render Scene
          </button>
        </div>
      </div>
    );
  }
}