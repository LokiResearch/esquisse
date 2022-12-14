/*
 * Author: Axel Antoine
 * mail: ax.antoine@gmail.com
 * website: http://axantoine.com
 * Created on Fri Sep 30 2022
 *
 * Loki, Inria project-team with Universit√© de Lille
 * within the Joint Research Unit UMR 9189 
 * CNRS - Centrale Lille - Universit√© de Lille, CRIStAL
 * https://loki.lille.inria.fr
 *
 * Licence: Licence.md
 */

import React from 'react';
import { HelpersPane, ObjectNamePane, ObjectTRSPane } from './base';
import { EObject } from "/objects";

export const BaseObjectPane = (props: {object: EObject}) => {

  const {object} = props;

  return (
    <>
      <ObjectNamePane object={object}/>
      <ObjectTRSPane object={object}/>
      <HelpersPane object={object}/>
    </>
  );
  
}