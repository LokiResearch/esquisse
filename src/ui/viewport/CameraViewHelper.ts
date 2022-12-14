/*
 * Author: Axel Antoine
 * mail: ax.antoine@gmail.com
 * website: http://axantoine.com
 * Created on Fri Oct 07 2022
 *
 * Loki, Inria project-team with Université de Lille
 * within the Joint Research Unit UMR 9189 
 * CNRS - Centrale Lille - Université de Lille, CRIStAL
 * https://loki.lille.inria.fr
 *
 * Licence: Licence.md
 */

import { BoxGeometry, CanvasTexture, Color, ColorRepresentation, Euler, Mesh, 
  MeshBasicMaterial, MeshStandardMaterial, Object3D, OrthographicCamera, PerspectiveCamera, 
  Quaternion, Raycaster, Sprite, SpriteMaterial, Vector2, Vector3, Vector4, 
  WebGLRenderer } from "three";

// Copied and converted to typescript, and modified from
// https://github.com/mrdoob/three.js/blob/dev/examples/jsm/helpers/ViewHelper.js

const vpTemp = new Vector4();
const _point = new Vector3();
const _raycaster = new Raycaster();
const _dummy = new Object3D();
const _geometry = new BoxGeometry( 0.8, 0.05, 0.05 ).translate( 0.4, 0, 0 );
const _mouse = new Vector2();

export class CameraViewHelper extends Object3D {

  isViewHelper = true;
  animating = false;
  focusPoint = new Vector3();
  editorCamera: PerspectiveCamera;
  camera: OrthographicCamera;

  pxSize: number;
  turnRate = 2 * Math.PI; // turn rate in angles per second

  targetPosition = new Vector3();
  targetQuaternion = new Quaternion();
  q1 = new Quaternion();
  q2 = new Quaternion();
  radius = 0;
  onRequestAnimation?: () => void;
  
  readonly div: HTMLDivElement;
  private readonly posXAxisHelper: Sprite;
  private readonly posYAxisHelper: Sprite;
  private readonly posZAxisHelper: Sprite;
  private readonly negXAxisHelper: Sprite;
  private readonly negYAxisHelper: Sprite;
  private readonly negZAxisHelper: Sprite;
  private readonly interactiveObjects = new Array<Sprite>();


  private readonly xAxis: Mesh;
  private readonly yAxis: Mesh;
  private readonly zAxis: Mesh;

	constructor( editorCamera: PerspectiveCamera, pxSize = 128) {
		super();
    this.editorCamera = editorCamera;
    this.div = document.createElement('div');
    this.div.style.width = pxSize+'px';
    this.div.style.height = pxSize+'px';
    this.div.style.position = "absolute";
    this.div.style.right = '0';
    this.div.style.bottom = '0';
    this.pxSize = pxSize;

    this.div.addEventListener('pointerdown', this.onPointerDown);
    this.div.addEventListener('pointerup', this.onPointerUp);

		const color1 = new Color( '#ff3653' );
		const color2 = new Color( '#8adb00' );
		const color3 = new Color( '#2c8fff' );


		this.camera = new OrthographicCamera( - 2, 2, 2, - 2, 0, 4 );
		this.camera.position.set( 0, 0, 2 );


		this.xAxis = new Mesh( _geometry, getAxisMaterial( color1 ) );
		this.yAxis = new Mesh( _geometry, getAxisMaterial( color2 ) );
		this.zAxis = new Mesh( _geometry, getAxisMaterial( color3 ) );

		this.yAxis.rotation.z = Math.PI / 2;
		this.zAxis.rotation.y = - Math.PI / 2;

		this.add( this.xAxis );
		this.add( this.zAxis );
		this.add( this.yAxis );

		this.posXAxisHelper = new Sprite( getSpriteMaterial( color1, 'X' ) );
		this.posXAxisHelper.userData.type = 'posX';
		this.posYAxisHelper = new Sprite( getSpriteMaterial( color2, 'Y' ) );
		this.posYAxisHelper.userData.type = 'posY';
		this.posZAxisHelper = new Sprite( getSpriteMaterial( color3, 'Z' ) );
		this.posZAxisHelper.userData.type = 'posZ';
		this.negXAxisHelper = new Sprite( getSpriteMaterial( color1 ) );
		this.negXAxisHelper.userData.type = 'negX';
		this.negYAxisHelper = new Sprite( getSpriteMaterial( color2 ) );
		this.negYAxisHelper.userData.type = 'negY';
		this.negZAxisHelper = new Sprite( getSpriteMaterial( color3 ) );
		this.negZAxisHelper.userData.type = 'negZ';

		this.posXAxisHelper.position.x = 1;
		this.posYAxisHelper.position.y = 1;
		this.posZAxisHelper.position.z = 1;
		this.negXAxisHelper.position.x = - 1;
		this.negXAxisHelper.scale.setScalar( 0.8 );
		this.negYAxisHelper.position.y = - 1;
		this.negYAxisHelper.scale.setScalar( 0.8 );
		this.negZAxisHelper.position.z = - 1;
		this.negZAxisHelper.scale.setScalar( 0.8 );

		this.add( this.posXAxisHelper );
		this.add( this.posYAxisHelper );
		this.add( this.posZAxisHelper );
		this.add( this.negXAxisHelper );
		this.add( this.negYAxisHelper );
		this.add( this.negZAxisHelper );

		this.interactiveObjects.push( this.posXAxisHelper );
		this.interactiveObjects.push( this.posYAxisHelper );
		this.interactiveObjects.push( this.posZAxisHelper );
		this.interactiveObjects.push( this.negXAxisHelper );
		this.interactiveObjects.push( this.negYAxisHelper );
		this.interactiveObjects.push( this.negZAxisHelper );


	}

  onPointerDown = ( event: PointerEvent ) => {
    event.stopPropagation();
    event.preventDefault();
  }

  onPointerUp = ( event: PointerEvent ) => {
    event.stopPropagation();
    event.preventDefault();
    this.onClick(event);
  }

  onClick = ( event: PointerEvent ) => {

    if ( this.animating === true ) {
      return;
    }

    _mouse.x = (event.offsetX / this.div.clientWidth) * 2 - 1,
    _mouse.y = -(event.offsetY / this.div.clientHeight) * 2 + 1

    _raycaster.setFromCamera( _mouse, this.camera );

    const intersects = _raycaster.intersectObjects( this.interactiveObjects );

    console.log(intersects, _mouse);

    if ( intersects.length > 0 ) {

      const intersection = intersects[ 0 ];
      const object = intersection.object;

      this.prepareAnimationData( object );

      this.animating = true;

      this.onRequestAnimation && this.onRequestAnimation();
    } 

  };

  update = ( delta: number ) => {

    const step = delta * this.turnRate;

    // animate position by doing a slerp and then scaling the position on the unit sphere

    this.q1.rotateTowards( this.q2, step );
    this.editorCamera.position.set( 0, 0, 1 )
      .applyQuaternion( this.q1 ).multiplyScalar( this.radius ).add( this.focusPoint );

    // animate orientation

    this.editorCamera.quaternion.rotateTowards( this.targetQuaternion, step );

    if ( this.editorCamera.quaternion.angleTo( this.targetQuaternion ) === 0 ) {

      this.animating = false;

    }

  };

  prepareAnimationData = ( object: Object3D) => {

    switch ( object.userData.type ) {
  
      case 'posX':
        this.targetPosition.set( 1, 0, 0 );
        this.targetQuaternion.setFromEuler( new Euler( 0, Math.PI * 0.5, 0 ) );
        break;
  
      case 'posY':
        this.targetPosition.set( 0, 1, 0 );
        this.targetQuaternion.setFromEuler( new Euler( - Math.PI * 0.5, 0, 0 ) );
        break;
  
      case 'posZ':
        this.targetPosition.set( 0, 0, 1 );
        this.targetQuaternion.setFromEuler( new Euler() );
        break;
  
      case 'negX':
        this.targetPosition.set( - 1, 0, 0 );
        this.targetQuaternion.setFromEuler( new Euler( 0, - Math.PI * 0.5, 0 ) );
        break;
  
      case 'negY':
        this.targetPosition.set( 0, - 1, 0 );
        this.targetQuaternion.setFromEuler( new Euler( Math.PI * 0.5, 0, 0 ) );
        break;
  
      case 'negZ':
        this.targetPosition.set( 0, 0, - 1 );
        this.targetQuaternion.setFromEuler( new Euler( 0, Math.PI, 0 ) );
        break;
    
      default:
        console.error( 'ViewHelper: Invalid axis.' );
  
    }
  
    //
  
    this.radius = this.editorCamera.position.distanceTo( this.focusPoint );
    this.targetPosition.multiplyScalar( this.radius ).add( this.focusPoint );
  
    _dummy.position.copy( this.focusPoint );
  
    _dummy.lookAt( this.editorCamera.position );
    this.q1.copy( _dummy.quaternion );
  
    _dummy.lookAt( this.targetPosition );
    this.q2.copy( _dummy.quaternion );
  
  }

  render = ( renderer: WebGLRenderer ) => {

    this.quaternion.copy( this.editorCamera.quaternion ).invert();
    this.updateMatrixWorld();

    _point.set( 0, 0, 1 );
    _point.applyQuaternion( this.editorCamera.quaternion );

    if ( _point.x >= 0 ) {
      this.posXAxisHelper.material.opacity = 1;
      this.negXAxisHelper.material.opacity = 0.5;
    } else {
      this.posXAxisHelper.material.opacity = 0.5;
      this.negXAxisHelper.material.opacity = 1;
    }

    if ( _point.y >= 0 ) {
      this.posYAxisHelper.material.opacity = 1;
      this.negYAxisHelper.material.opacity = 0.5;
    } else {
      this.posYAxisHelper.material.opacity = 0.5;
      this.negYAxisHelper.material.opacity = 1;
    }

    if ( _point.z >= 0 ) {
      this.posZAxisHelper.material.opacity = 1;
      this.negZAxisHelper.material.opacity = 0.5;
    } else {
      this.posZAxisHelper.material.opacity = 0.5;
      this.negZAxisHelper.material.opacity = 1;
    }

    /**
     * Get the relative position of the div to the gl canvas
     */
    const canvasRect = renderer.domElement.getBoundingClientRect();
    const rect = this.div.getBoundingClientRect();
    const x = rect.x - canvasRect.x;
    const y = rect.bottom - canvasRect.bottom;

    renderer.clearDepth();

    renderer.getViewport( vpTemp );
    renderer.setViewport( x, y, this.pxSize, this.pxSize );

    renderer.autoClear = false;
    renderer.render( this, this.camera );

    renderer.setViewport( vpTemp.x, vpTemp.y, vpTemp.z, vpTemp.w );

  };

  dispose = () => {

    (this.xAxis.material as MeshStandardMaterial).dispose();
    (this.yAxis.material as MeshStandardMaterial).dispose();
    (this.zAxis.material as MeshStandardMaterial).dispose();

    this.posXAxisHelper.material.map?.dispose();
    this.posYAxisHelper.material.map?.dispose();
    this.posZAxisHelper.material.map?.dispose();
    this.negXAxisHelper.material.map?.dispose();
    this.negYAxisHelper.material.map?.dispose();
    this.negZAxisHelper.material.map?.dispose();

    this.posXAxisHelper.material.dispose();
    this.posYAxisHelper.material.dispose();
    this.posZAxisHelper.material.dispose();
    this.negXAxisHelper.material.dispose();
    this.negYAxisHelper.material.dispose();
    this.negZAxisHelper.material.dispose();

    this.div.removeEventListener('pointerdown', this.onPointerDown);
    this.div.removeEventListener('pointerup', this.onPointerUp);
  };
}


function getAxisMaterial( color: ColorRepresentation ) {

  return new MeshBasicMaterial( { color: color, toneMapped: false } );

}

function getSpriteMaterial( color: Color, text?: string) {

  const canvas = document.createElement( 'canvas' );
  canvas.width = 64;
  canvas.height = 64;

  const context = canvas.getContext( '2d' );

  if (context) {
    context.beginPath();
    context.arc( 32, 32, 16, 0, 2 * Math.PI );
    context.closePath();
    context.fillStyle = color.getStyle();
    context.fill();

    if ( text ) {

      context.font = '24px Arial';
      context.textAlign = 'center';
      context.fillStyle = '#000000';
      context.fillText( text, 32, 41 );

    }
  }

  const texture = new CanvasTexture( canvas );

  return new SpriteMaterial( { map: texture, toneMapped: false } );

}