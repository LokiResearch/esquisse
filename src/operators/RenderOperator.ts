// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 06/08/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import { Operator } from './Operator';
import { SaveSvgRequest } from '/io/SaveSvgRequest';
import { EMesh, EScreen } from '/objects';
import type { ChainPassOptions, SVGMesh } from 'three-svg-renderer';

export class RenderOperator extends Operator {
  readonly name = "RenderOperator";

  async exec() {


    const {
      SVGMesh,
      SVGRenderer,
      SVGRenderInfo,
      FillPass, 
      VisibleChainPass,
      HiddenChainPass,
      SingularityPointPass,
      TexturePass,
    } = await import(
      /* webpackChunkName: "viewmap" */
      'three-svg-renderer');
    
    const scene = this.editor.scene;
    const camera = this.editor.renderCamera;
    const settings = this.editor.settings.svg;

    const renderer = new SVGRenderer({
      ignoreVisibility: settings.debug.ignoreContoursVisibility.value,
      creaseAngle: {min: 80, max: 100},
    }, {
      prettifySVG: settings.debug.prettifySVG.value
    });


    /**
     * Setup meshes
     */
    const meshesMap = new Map<EMesh, SVGMesh>();
    const meshes = scene.listMeshes();
    for (const mesh of meshes) {
      meshesMap.set(mesh, new SVGMesh(mesh.threeObject));
    }
    
    let params, debug;

    /**
     * Fills draw pass
     */
    params = settings.fills;
    debug = settings.debug.fills
    if (params.draw.value) {

      const options = {
        useRandomColors: debug.useRandomColors.value,
        drawPolygonId: debug.drawPolygonIds.value,
        drawRaycastPoint: debug.drawPolygonRaycastPoints.value,
      }

      renderer.addPass(new FillPass(options));
    }

    /**
     * Texture draw pass
     */
    if (params.drawInterfaces.value) {

      for (const [mesh, svgMesh] of meshesMap) {

        /**
         * Add texture to svgMesh
         */
        const screen = mesh as EScreen;
        if (screen.isScreen && screen.texture) {
          svgMesh.addTexture({
            name: screen.texture.name, 
            url: screen.texture.sourceFile
          });
          svgMesh.drawFills = !screen.useTransparentTexture;
        }
      }
      
      console.log("Draw interfaces", meshes);
      renderer.addPass(new TexturePass());
    }

    /**
     * Visible chains draw pass 
     */
    params = settings.visibleContours;
    debug = settings.debug.contours;
    if (params.draw.value) {

      const options: ChainPassOptions = {
        
        useRandomColors: debug.useRandomColors.value,
        drawRaycastPoint: debug.drawContoursRaycastPoints.value,
        defaultStyle: {
          color: params.color.value,
          width: params.width.value,
          dasharray: params.dash.useDashStyle.value ? 
            params.dash.solidLength.value+","+params.dash.holeLength.value: "",
        }
      };
        
      renderer.addPass(new VisibleChainPass(options));
    }


    /**
     * Hidden contours draw pass
     */
    params = settings.hiddenContours;
    debug = settings.debug.contours;
    if (params.draw.value) {

      const options: ChainPassOptions = {
        
        useRandomColors: debug.useRandomColors.value,
        drawRaycastPoint: debug.drawContoursRaycastPoints.value,
        defaultStyle: {
          color: params.color.value,
          width: params.width.value,
          dasharray: params.dash.useDashStyle.value ? 
            params.dash.solidLength.value+","+params.dash.holeLength.value: "",
        }
      };
        

      renderer.addPass(new HiddenChainPass(options));
    }

    /**
     * Singularity points draw pass
     */
    params = settings.debug.singularityPoints;
    if (params.draw.value) {

      const options = {
        pointSize: params.size.value,
        drawVisiblePoints: params.drawVisiblePoints.value,
        drawHiddenPoints: params.drawHiddenPoints.value,
        drawLegend: params.drawLegend.value
      };

      renderer.addPass(new SingularityPointPass(options));
    }


    /**
     * Render
     */
    const size = {
      w: 1000,
      h: 1000
    };

    const info = new SVGRenderInfo();

    const svgMeshes = Array.from(meshesMap.values());

    const svg = await renderer.generateSVG(svgMeshes, camera, size, info);
 
    const request = new SaveSvgRequest(scene.name, svg);
    request.process();
    
    console.info("Render Info", info);
  }
}