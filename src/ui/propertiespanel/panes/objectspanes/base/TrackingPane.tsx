// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 03/08/2022

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import Box from '@mui/material/Box';
import React from 'react';
import { useEditorContext } from '/editor/Editor';
import { TrackingMode } from '/tracking/TrackingManager';
import { SelectControl, BooleanControl } from '/ui/base/controls';
import { FlexRow } from '../../../../base/layout/FlexItems';
import { Button, CircularProgress } from '@mui/material';
import type { Pose } from '@tensorflow-models/pose-detection';
import type { Hand } from '@tensorflow-models/hand-pose-detection';
import { ESkinnedMesh } from '/objects';
import { AccordionView } from '../../../../base/views';
import { GpsNotFixed } from '@mui/icons-material';

export interface TrackingPaneProps {
  mesh: ESkinnedMesh; 
}
 
export const TrackingPane = (props: TrackingPaneProps) => {

  const editor = useEditorContext();
  const {mesh} = props;
  const [isTracking, setIsTracking] = React.useState(false); 

  /**
   * Automatically stop tracking when hiding the component
   */
  React.useEffect(()=>{
    return () => {
      editor.tracking.stop();
    }
  }, []);

  /**
   * Suscribe to the pose changes
   */
  React.useEffect(() => {

    const applyPoses = (poses: Pose[]) => {
      editor.applyPose(mesh, poses);
    }

    editor.tracking.addPoseListener(applyPoses);

    return () => {
      editor.tracking.removePoseListener(applyPoses);
    }
  }, []);

  /**
   * Suscribe to the hand pose changes
   */
  React.useEffect(() => {

    const applyHandPoses = (hands: Hand[]) => {
      editor.applyHandPose(mesh, hands);
    }

    editor.tracking.addHandListener(applyHandPoses);

    return () => {
      editor.tracking.removeHandListener(applyHandPoses);
    }

  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {

    console.log('onKeyDown');

    if (event.key == 'Escape' && isTracking) {
      editor.tracking.stop();
      setIsTracking(false);
    }
  }

  const onTrackingModeChange = (mode: TrackingMode) => {
    editor.tracking.trackingMode = mode;
  }

  const onFlipChanged = (value: boolean) => {
    editor.tracking.flipHorizontal = value;
  }

  const onStartButtonClick = () => {
    editor.tracking.start();
    setIsTracking(true);
  }

  const onStopButtonClick = () => {
    editor.tracking.stop();
    setIsTracking(false);
  }

  const options = Object.values(TrackingMode).map((mode)=>{return {
    value: mode, label: mode}
  });


  const startStopButton = (
    <Button onClick={isTracking ? onStopButtonClick : onStartButtonClick}>
      {isTracking ? "Stop tracking" : "Start tracking"}
    </Button>
  );

  return (

    <AccordionView title="Tracking [WIP]" icon={GpsNotFixed}>

      <Box onKeyDown={onKeyDown} tabIndex={1}>

        <FlexRow>
          <SelectControl<TrackingMode> 
            options={options} 
            value={editor.tracking.trackingMode}
            onChange={onTrackingModeChange}
          />

          <BooleanControl 
            label="Flip"
            onChange={onFlipChanged}
            value={editor.tracking.flipHorizontal}
          />
          {startStopButton}
        </FlexRow>

        {isTracking && 
          <TrackingViewCanvas/> 
        }
          
      </Box>
    </AccordionView>
  );
}



interface TrackingViewProps {
  showCameraFeed?: boolean;
  showSkeletonOverlay?: boolean;
  flipVideo?: boolean;
}



export const TrackingViewCanvas = (props: TrackingViewProps) => {

  const editor = useEditorContext();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [showCameraFeed, setShowCameraFeed] = React.useState(props.showCameraFeed ?? true);
  const [flipVideo, setFlipVideo] = React.useState(props.flipVideo ?? false);
  const [ready, setReady] = React.useState(false);

  /**
   * Flip context 2D
   */

  const flipContext = () => {
    const ctx = canvasRef.current?.getContext('2d');

    if (ctx) {
      // ctx.translate(editor.tracking.camera.video.width, 0);
      // ctx.scale(-1, 1);
    } 
  }

  React.useEffect(()=>{
    if (flipVideo) {
      flipContext();
    }
  }, []);

  React.useEffect(()=>{
    flipContext();
  }, [flipVideo]);

  /**
   * Setup Body Tracking Listener
   */
  React.useEffect(() => {

    const drawPoses = (poses: Pose[]) => {
      setReady(true);
      const canvas = canvasRef.current;
      if (canvas) {
        editor.tracking.drawPoses(canvas, poses);
      }
    }

    editor.tracking.addPoseListener(drawPoses);

    return () => {
      editor.tracking.removePoseListener(drawPoses);
    }
  }, [showCameraFeed]);

  /**
   * Setup Hand Tracking Listener
   */
  React.useEffect(() => {


    const drawHandPoses = (hands: Hand[]) => {
      setReady(true);
      const canvas = canvasRef.current;
      if (canvas) {
        editor.tracking.drawHands(canvas, hands);
      }
    }

    if (showCameraFeed) {
      editor.tracking.addHandListener(drawHandPoses);
    }

    return () => {
      console.log("Unmounting");
      editor.tracking.removeHandListener(drawHandPoses);
    }

  }, [showCameraFeed]);


  const showCanvas = showCameraFeed && ready;
  const showLoading = showCameraFeed && !ready;

  const camera = editor.tracking.camera;

  return (
    <React.Fragment>
      <FlexRow>
        <BooleanControl
          label="Camera feed"
          value={showCameraFeed}
          onChange={setShowCameraFeed}
        />

        <BooleanControl
          label="Flip video"
          value={flipVideo}
          onChange={setFlipVideo}
        />

      </FlexRow>
     
      <canvas 
        style={{
          width:'100%',
          aspectRatio: `${camera.width} / ${camera.height}`
        }} 
        hidden={!showCanvas} ref={canvasRef}/>

      {showLoading &&
        <FlexRow>
          <CircularProgress/>
        </FlexRow>
      }
    </React.Fragment>
  );
}

