/*
 * Author: Axel Antoine
 * mail: ax.antoine@gmail.com
 * website: http://axantoine.com
 * Created on Tue Oct 04 2022
 *
 * Loki, Inria project-team with Université de Lille
 * within the Joint Research Unit UMR 9189 
 * CNRS - Centrale Lille - Université de Lille, CRIStAL
 * https://loki.lille.inria.fr
 *
 * Licence: Licence.md
 */

import React from 'react';

/**
 * Custom React hook allowing to force update a function component
 * 
 * ```ts
 * const Component () => {
 *  const forceUpdate = useForceUpdate();
 *  
 *  React.useEffect(() => {
 *    suscribeService(forceUpdate);
 *    return () => {
 *      unsuscribeService(forceUpdate);
 *    }
 *  });
 * 
 *  return (<div></div>);
 * }
 * 
 * ``` 
 * See 
 * [https://stackoverflow.com/questions/46240647](https://stackoverflow.com/questions/46240647/react-how-to-force-a-function-component-to-render)
 * 
 * @returns A callable function to update the state
 */
export function useForceUpdate(){
  const [, setValue] = React.useState(0);
  return () => setValue(value => value + 1);
}