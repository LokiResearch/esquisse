// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 29/04/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// http://loki.lille.inria.fr

// LICENCE: Licence.md 

import { action, makeObservable, observable } from 'mobx';
import { Editor } from './Editor';
import { BooleanSetting, ColorSetting, NumberSetting } from './EditorSettingsControl';
import {darkTheme, lightTheme} from '/ui/UIThemes';

export class EditorSettings {

  editor: Editor;

  verbose = new BooleanSetting({
    value: false,
    label: 'Enable verbose logs',
  })

  objects = {
    showFaceNormalsHelper: new BooleanSetting({
      value: false,
      label: "Show all face normals helpers",
      onChange: (value: boolean) => {
        const meshes = this.editor.scene.listMeshes();
        this.editor.helpersManager.showFaceNormalsHelpers(meshes, value);
      },
    }),
    showSkeletonHelper: new BooleanSetting({
      value: false,
      label: "Show all skeleton helpers",
      onChange: (value: boolean) => {
        const skMeshes = this.editor.scene.listSkinnedMeshes();
        this.editor.helpersManager.showSkeletonHelpers(skMeshes, value);
      },
    }),
    showBoxHelper: new BooleanSetting({
      value: false,
      label: "Show all box helpers",
      onChange: (value: boolean) => {
        const meshes = this.editor.scene.listMeshes();
        this.editor.helpersManager.showBoxHelpers(meshes, value);
      },
    }),
    keepIKChainsVisible: new BooleanSetting({
      value: true,
      label: 'Keep IK chains visible'
    }),
  }

  // scene
  scene = {
    grid: {
      color: new ColorSetting({
        value: "#777777",
        label: "Grid color",
      }),
      size: new NumberSetting({
        value: 20,
        label: "Grid Size",
        limits: {min: 1, max: 100},
      }),
    },
  }

  // SVG
  svg = {

    fills: {
      draw: new BooleanSetting({
        value: true,
        label: "Fills",
        tooltip: "Draw fills on the SVG",
      }),
      drawInterfaces: new BooleanSetting({
        value: true,
        label: "Draw interfaces"
      }),
    },

    visibleContours: {
      draw: new BooleanSetting({
        value: true,
        label: "Visible contours",
        tooltip: "Draw visible contours on the SVG"
      }),
      color: new ColorSetting({
        value: "#000000",
        label: "Color",
      }),
      width: new NumberSetting({
        value: 1,
        label: "Width",
        tooltip: "Width of the stroke."
      }),
      dash: {
        useDashStyle: new BooleanSetting({
          value: false,
          label: "Dashed strokes",
          tooltip: 'Draw stroke as dashed lines.'
        }),
        solidLength: new NumberSetting({
          value: 1,
          label: "Solid length"
        }),
        holeLength: new NumberSetting({
          value: 1,
          label: "Hole length"
        }),
      },
    },

    hiddenContours: {
      draw: new BooleanSetting({
        value: false,
        label: "Hidden contours",
      }),
      color: new ColorSetting({
        value: "#FF0000",
        label: "Color",
      }),
      width: new NumberSetting({
        value: 1,
        label: "Width"
      }),
      dash: {
        useDashStyle: new BooleanSetting({
          value: true,
          label: "Dashed strokes"
        }),
        solidLength: new NumberSetting({
          value: 1,
          label: "Solid length"
        }),
        holeLength: new NumberSetting({
          value: 1,
          label: "Hole length"
        }),
      },
      drawContoursRaycastPoints: new BooleanSetting({
        value: false,
        label: "Draw contours raycast points",
      }),
    },

    debug: {
      ignoreContoursVisibility: new BooleanSetting({
        value: false,
        label: "Ignore contours visibility"
      }),
      prettifySVG: new BooleanSetting({
        value: false,
        label: "Prettify SVG"
      }),
      fills: {
        useRandomColors: new BooleanSetting({
          value: false,
          label: "Random colors",
        }),
        drawPolygonIds: new BooleanSetting({
          value: false,
          label: "Draw polygon ids",
        }),
        drawPolygonRaycastPoints: new BooleanSetting({
          value: false,
          label: "Draw polygons raycast points",
        }),
      },
      contours: {
        useRandomColors: new BooleanSetting({
          value: false,
          label: "Random colors",
          tooltip: "Draw contours with random colors."
        }),
        drawContoursRaycastPoints: new BooleanSetting({
          value: false,
          label: "Draw contours raycast points",
        }),
      },
      singularityPoints: {
        draw: new BooleanSetting({
          value: false,
          label: "Singularity points",
        }),
        drawVisiblePoints: new BooleanSetting({
          value: true,
          label: "Draw visible points",
        }),
        drawHiddenPoints: new BooleanSetting({
          value: false,
          label: "Draw hidden points",
        }),
        size: new NumberSetting({
          value: 1,
          label: "Size"
        }),
        drawLegend: new BooleanSetting({
          value: true,
          label: "Draw legend",
        }),
      },
    },
  }

  theme = darkTheme;

  setTheme = (type: "light"|"dark") => {
    if (type === "light") {
      this.theme = lightTheme;
    } else {
      this.theme = darkTheme;
    }
  }

  constructor(editor: Editor) {
    this.editor = editor;
    makeObservable(this, {
      theme: observable,
      setTheme: action
    });
  }
}