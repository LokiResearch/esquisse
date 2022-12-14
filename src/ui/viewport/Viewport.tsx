// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 23/02/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import React from 'react';
import { Scene, Vector3} from 'three';
import { TransformControlsWidget } from './widgets/TransformControlsWidget';
import { InteractionModeWidget } from './widgets/InteractionModeWidget';
import { Paper, Box } from '@mui/material';
import useResizeObserver from "use-resize-observer";
import { ViewportRenderer } from './ViewportRenderer';
import { Editor, useEditorContext } from '/editor/Editor';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from '/thirdparty/three/TransformControls';
import { ViewportObjectModeOperator, ViewportIKModeOperator,
  ViewportBoneModeOperator } from '/operators';
import { DeleteSelectionCommand, TransformCommand, ClearSelectionCommand } from '/commands';
import { CameraViewHelper } from './CameraViewHelper';
import { autorun } from 'mobx';
import { throttle } from 'lodash';

const styles = {
  viewport: {
    outlineStyle: 'none',
    flexGrow: 1,
    minWidth: '1em',
    height: '100%',
    position: 'relative',
    backgroundColor: 'background.paper'
  },
  infosPanel: {
    fontSize: "small",
    position: "absolute",
    left: "0.5em",
    bottom: "0.5em",
    padding: "0.1em",
  },
  transformControlsWidget: {
    position: "absolute",
    top: "0.5em",
    left: "0.5em",
  },
  interactionModeWidget: {
    position: "absolute",
    top: "0.5em",
    right: "0.5em",
  },
  cameraView: {
    position: "absolute",
    bottom: 0,
    right: 0,
  }
};

export enum TransformMode {
  Rotate = "rotate",
  Translate = "translate",
  Scale = "scale",
}

export enum TransformSpace {
  Local = "local",
  Global = "global"
}

export enum InteractionMode {
  Object = "object",
  Bone = "bone",
  Pose = "pose"
}

interface ViewportProps {
  cameraPosition: Vector3;
  cameraTarget: Vector3;
}

const ViewportAttributes = (editor: Editor) => {

  const { scene } = editor;
  const viewportHelpers = new Scene();
  const renderer = new ViewportRenderer(scene, viewportHelpers);
  
  const { camera, canvas } = renderer;
  const cameraViewHelper = new CameraViewHelper(camera, 120);

  return {
    renderer: renderer,
    transformControls: new TransformControls(camera, canvas),
    orbitControls: new OrbitControls(camera, canvas),
    cameraViewHelper: cameraViewHelper,
    viewportHelpers: viewportHelpers,
    state: {
      isDragging: false,
      isPressing: false,
      isTransforming: false,
    }
  }
}

export const Viewport = (props: ViewportProps) => {

  const editor = useEditorContext();
  const {cameraPosition, cameraTarget} = props;

  const ref = React.useRef<HTMLDivElement>(null);
  const cameraViewRef = React.useRef<HTMLDivElement>(null);
  const attributes = React.useRef(ViewportAttributes(editor));

  const {renderer, transformControls, orbitControls, cameraViewHelper,
    state, viewportHelpers} = attributes.current;
  const {camera, canvas, cameraFocusObject} = renderer;

  const [transformMode, setTransformMode] = React.useState(TransformMode.Translate);
  const [transformSpace, setTransformSpace] = React.useState(TransformSpace.Global);
  const [interactionMode, setInteractionMode] =  React.useState(InteractionMode.Object);

  useResizeObserver<HTMLDivElement>({
    ref: ref, 
    onResize: ({width, height}) => {
      if (width !== undefined && height !== undefined) {
        renderer.resize(width, height);
        editor.renderCamera.aspect = width/height;
        editor.renderCamera.updateProjectionMatrix();
      }
    }
  });

  /**
   * Renders the threejs scene using WebGL
   * @param reason Reason why render is called
   */
  const render = throttle((reason?: string) => {
    renderer.render(reason);
    cameraViewHelper.render(renderer.renderer);
  }, 5, {leading:true});

  /**
   * Listen for mobx settings value changes
   */
  React.useEffect(() => {
    autorun(() => {
      renderer.verbose = editor.settings.verbose.value;
    });
  }, []);

  /**
   *      Setup renderer
   */
  React.useEffect(() => {
    ref.current?.append(canvas);
    return () => {
      ref.current?.removeChild(canvas);
      renderer.dispose();
    }
  }, []);

  /**
   * Setup Camera View
   */
  React.useEffect(() => {
    cameraViewRef.current?.append(cameraViewHelper.div);

    const animateCamera = () => {
      cameraViewHelper.focusPoint.copy(cameraFocusObject.position);
      render("AnimateCamera");
      if (cameraViewHelper.animating) {
        cameraViewHelper.update(0.01);
        window.requestAnimationFrame(animateCamera);
      }
    }

    cameraViewHelper.onRequestAnimation = animateCamera;

    return () => {
      cameraViewRef.current?.removeChild(cameraViewHelper.div);
      cameraViewHelper.dispose();
    }
  }, []);


  /**
   *      Setup Camera point of view from props
   */
  React.useEffect(() => {
    camera.position.copy(cameraPosition);
    camera.lookAt(cameraTarget);
    cameraFocusObject.position.copy(cameraTarget);
    
  }, [cameraPosition, cameraTarget]);


  /**
   *      Setup signals
   */
  React.useEffect(() => {

    const sceneUpdated = () => {
      render("SceneUpdated");
    }
    const sceneChanged = () => {
      renderer.setScene(editor.scene);
      render("Scene")
    }
    const sceneGraphUpdated = () => {
      render("SceneGraphUpdated");
    }
  
    const onSelectionChange = () => {
  
      // Show transform controls only if one of selected objects is transformable
      const showControls = editor.selectedObjects.some(obj => obj.isTransformable);
  
      // Attach/detach the transform pivot to/from the transform control
      if (showControls) {
        transformControls.attach(editor.transformPivot);
      } else {
        transformControls.detach();
      }
      
      renderer.setOutlinedObjects(editor.selectedObjects);
      render("SelectionChanged");
    }

    editor.signals.selectionChanged.connect(onSelectionChange);
    editor.signals.sceneUpdated.connect(sceneUpdated);
    editor.signals.sceneChanged.connect(sceneChanged);
    editor.signals.sceneGraphUpdated.connect(sceneGraphUpdated);

    return () => {
      editor.signals.selectionChanged.connect(onSelectionChange);
      editor.signals.sceneUpdated.connect(sceneUpdated);
      editor.signals.sceneChanged.connect(sceneChanged);
      editor.signals.sceneGraphUpdated.connect(sceneGraphUpdated);  
    }
  }, []);


  /**
   *      Setup orbit controls
   */
  React.useEffect(() => {

    const onChange = () => {
      // Update the camera target point from the current camera orientation
      const size = 0.002 * orbitControls.getDistance();
      cameraFocusObject.position.copy(orbitControls.target);
      cameraFocusObject.scale.set(size, size, size);
      render("OrbitControlChange");
    }

    const onEnd = () => {
      // Set the render camera position to the current viewport camera position
      editor.renderCamera.copy(camera);
    }

    orbitControls.addEventListener('change', onChange);
    orbitControls.addEventListener('end', onEnd);

    return () => {
      orbitControls.dispose();
    }
  }, []);

  
  
  /**
   *      Setup transform controls
   */
  React.useEffect(() => {
    
    viewportHelpers.add(transformControls);
    let transformCommand: TransformCommand | null = null;

    const onMouseDown = () => {
      state.isTransforming = true;
      orbitControls.enabled = false;
      transformCommand = new TransformCommand(
        editor, editor.selectedObjects, editor.transformPivot.matrix
      );
    }

    const onChange = () => {
      if (state.isTransforming) {
        editor.transformPivot.updateMatrix();
        transformCommand?.update(editor.transformPivot.matrix);
      } else {
        render("TransformControlChange");
      }
    }

    const onMouseUp = () => {
      transformCommand?.exec();
      state.isTransforming = false;
      orbitControls.enabled = true;

    }

    transformControls.addEventListener('mouseDown', onMouseDown);
    transformControls.addEventListener('mouseUp', onMouseUp);
    transformControls.addEventListener('change', onChange);

    return () => {
      viewportHelpers.remove(transformControls);
      transformControls.dispose();
    }

  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key == "Backspace") {
      const op = new DeleteSelectionCommand(editor, !event.shiftKey);
      op.exec();
    }
  }

  const onPointerDown = (_event: React.PointerEvent) => {
    if (state.isTransforming) {
      return
    }
    state.isPressing = true;
  }

  const onPointerMove = (_event: React.PointerEvent) => {
    if (state.isTransforming) {
      return;
    }
    state.isDragging = state.isPressing;
  }

  const onPointerUp = (event: React.PointerEvent) => {
    if (state.isTransforming) {
      return;
    }

    // Simulate a click 
    if (!state.isDragging) {
      onClick(event.nativeEvent);
    }
    state.isDragging = false;
    state.isPressing = false;
  }

  const onClick = (event: PointerEvent) => {

    if (interactionMode === InteractionMode.Object) {
      const op = new ViewportObjectModeOperator(editor, event, canvas, camera);
      op.exec();
    } else if (interactionMode === InteractionMode.Pose) {
      const op = new ViewportIKModeOperator(editor, event, canvas, camera);
      op.exec();
    } else if (interactionMode === InteractionMode.Bone) {
      const op = new ViewportBoneModeOperator(editor, event, canvas, camera);
      op.exec();
    }
  }

  const onInteractionModeChange = (mode: InteractionMode) => {
    setInteractionMode(mode);
    const cmd = new ClearSelectionCommand(editor);
    cmd.exec();
  }

  const onTransformModeChange = (mode: TransformMode) => {
    setTransformMode(mode);
    transformControls.setMode(mode);
  }

  const onTransformSpaceChange = (space: TransformSpace) => {
    setTransformSpace(space);
    transformControls.setSpace(space);
  }

  return (
    <Box id="Viewport" sx={styles.viewport} ref={ref}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <Box id="ViewportWidgets"
        onPointerDown={stopPropagation}
        onPointerUp={stopPropagation}    
      >
        <TransformControlsWidget 
          sx={styles.transformControlsWidget}
          mode={transformMode}
          space={transformSpace}
          onModeChange={onTransformModeChange}
          onSpaceChange={onTransformSpaceChange}
        />
        <InteractionModeWidget
          sx={styles.interactionModeWidget}
          mode={interactionMode}
          onModeChange={onInteractionModeChange}
        />
        </Box>
        <Box sx={styles.cameraView} ref={cameraViewRef}/>
      <ViewportInfo renderer={renderer}/>
    </Box>
    );
}


const ViewportInfo = (props: {renderer: ViewportRenderer}) => {

  const {renderer} = props;
  const [frametime, setFrametime] = React.useState(0);

  /**
   * Display the frametime on each frame update
   */
  React.useEffect(() => {
    const onNewFrame = (frametime: number) => {
      setFrametime(frametime);
    }

    renderer.signals.frameHasRendered.connect(onNewFrame);

    return () => {
      renderer.signals.frameHasRendered.disconnect(onNewFrame);
    };
  }, []);

  return (
    <Paper variant="outlined" sx={styles.infosPanel}>
      {Number(frametime).toFixed(0)} ms
    </Paper>
  );

}

function stopPropagation(e: React.SyntheticEvent) {
  e.stopPropagation();
  e.preventDefault();
}
