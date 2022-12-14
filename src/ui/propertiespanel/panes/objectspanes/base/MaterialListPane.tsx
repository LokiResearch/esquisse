/*
 * Author: Axel Antoine
 * mail: ax.antoine@gmail.com
 * website: http://axantoine.com
 * Created on Fri Sep 30 2022
 *
 * Loki, Inria project-team with Université de Lille
 * within the Joint Research Unit UMR 9189 
 * CNRS - Centrale Lille - Université de Lille, CRIStAL
 * https://loki.lille.inria.fr
 *
 * Licence: Licence.md
 */

import React from 'react';
import { EMesh } from "/objects";
import { MaterialControl } from './MaterialControl';
import { AccordionView, ListView } from '../../../../base/views';
import ColorLensIcon from '@mui/icons-material/ColorLens';

export interface MaterialListPaneProps {
  mesh: EMesh;
}

export const MaterialListPane = (props: MaterialListPaneProps) => {

  const {mesh} = props;
  const matArray = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

  const [materials, setMaterials] = React.useState(matArray);

  /**
   * Suscribe to update to materials
   */
  React.useEffect(() => {
    
    const updateMaterials = () => {
      const matArray = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      setMaterials([...matArray]);
    }
    updateMaterials();
    mesh.signals.materialChanged.connect(updateMaterials);
    return () => {
      mesh.signals.materialChanged.disconnect(updateMaterials);
    }
  }, [mesh]);
    
  const children = materials.map(m => 
    <MaterialControl mesh={mesh} material={m} key={m.id}/>
  );
  
  return (
    <AccordionView 
      title='Materials'
      icon={ColorLensIcon}
      defaultExpanded
    >
      <ListView
        height={100}
        width={'100%'}
        itemSize={20}
      >
        {children}
      </ListView>
    </AccordionView>
  );

}