// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 10/06/2021

// Loki, Inria project-team with Universit√© de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Universit√© de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import {Request} from './Request';
import {ServerItemData} from './ioTypes';

export type ServerDataType = 'scenes' | 'objects';
const ServerDataUrl = "https://expe.lille.inria.fr/esquisse/data/";
const ServerDataIndexUrl = ServerDataUrl + 'index.json';

export class ServerItemsListRequest extends Request<ServerItemData[]> {
  readonly name = "ServerItemsListRequest";
  private readonly dataType: ServerDataType;

  constructor(dataType: ServerDataType) {
    super();
    this.dataType = dataType;
  }

  process(): Promise<ServerItemData[]> {
    return new Promise<ServerItemData[]>((resolve, reject) => {

      fetch(ServerDataIndexUrl)
        .then(response => {
          if (!response.ok)
            reject("Scene list fetch failed: "+response.statusText);
          return response.text();
        })
        .then(text => {
          const serverData = JSON.parse(text);

          const serverItems = new Array<ServerItemData>();

          const data = serverData[this.dataType];

          if (data) {

            for (const item of data) {

              if (item.filename !== undefined && item.path !== undefined) {

                const serverItem : ServerItemData = {
                  name: item.filename,
                  url: ServerDataUrl+item.path
                }

                if (item.image !== undefined) {
                  serverItem.image = ServerDataUrl+item.image;
                }

                serverItems.push(serverItem);

              }
            }
          }
          resolve(serverItems);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}