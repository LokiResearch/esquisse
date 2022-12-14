// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 02/07/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import React from 'react';
import {Button, Box, Typography} from '@mui/material';
import {ServerDataType, ServerItemsListRequest} from '/io/ServerItemsListRequest';
import { SetSceneCommand, AddObjectsCommand } from '/commands';
import {ObjectRequest} from '/io/ObjectRequest';
import {SaveSceneRequest} from '/io/SaveSceneRequest';
import {SceneRequest} from '/io/SceneRequest';
import {FlexRow} from '../../base/layout/FlexItems';
import { useEditorContext } from '/editor/Editor';
import {FileButton, URLFile} from '../../base/controls/FileButton';
import {ServerItemData} from '/io/ioTypes';
import { ServerItemsModalView } from './ServerItemsModalView';

export const LibraryPane = () => {

  const editor = useEditorContext();

  const onSaveButtonClick = () => {
    const request = new SaveSceneRequest(
      editor.scene.name,
      editor,
      {prettify: true});
    request.process();
  }

  const onObjectSelected = (file: URLFile) => {
    const request = new ObjectRequest(file);
    request.process().then(objects => {
      const cmd = new AddObjectsCommand(editor, objects);
      cmd.exec();
    });
  }

  const onSceneSelected = (file: URLFile) => {
    const request = new SceneRequest(file);
    request.process().then(scene => {
      const cmd = new SetSceneCommand(editor, scene);
      cmd.exec();
    });
  }


  return (
    <Box>

      <Typography>
        Server
      </Typography>
      <FlexRow>
        <ServerItemSelector
          label="Load object"
          dataType="objects"
          onItemSelected={onObjectSelected}
        />
        <ServerItemSelector
          label="Load scene"
          dataType="scenes"
          onItemSelected={onSceneSelected}
        />
      </FlexRow>

      <Typography>
      Local
      </Typography>
      <FlexRow>
        <LocalFileSelector
          label="Import object"
          onLoad={onObjectSelected}
          fileExtensions={ObjectRequest.SupportedExtensions}
        />
        <LocalFileSelector
          label="Import scene"
          onLoad={onSceneSelected}
          fileExtensions={SceneRequest.SupportedExtensions}
        />
      </FlexRow>

      <Typography>
      Export
      </Typography>
      <FlexRow>
        <Button variant="outlined" fullWidth
            onClick={onSaveButtonClick}>
          Save
        </Button>
      </FlexRow>
    </Box>
  );
}


interface LocalFileSelectorProps {
  label: string;
  onLoad: (file: URLFile) => void;
  fileExtensions: string[];
}

const LocalFileSelector = (props: LocalFileSelectorProps) => {

  const {onLoad, fileExtensions, label} = props;
 
  return (
    <FileButton
      variant="outlined"
      fullWidth
      tooltip={"Accepted formats: "+fileExtensions.join(" ")}
      label={label}
      fileFormats={fileExtensions}
      onFileLoaded={onLoad}
    />
  );
}





interface ServerItemSelectorProps {
  label: string;
  dataType: ServerDataType;
  onItemSelected: (data: ServerItemData) => void;
}

const ServerItemSelector = (props: ServerItemSelectorProps) => {

  const {dataType, onItemSelected, label} = props;
  const [items, setItems] = React.useState<ServerItemData[]>([]);

  const loadItems = () => {
    const request = new ServerItemsListRequest(dataType);
    request.process().then(items => {
      setItems(items);
    });
  }

  const onClose = () => {
    setItems([]);
  }

  const onModelItemSelected = (data: ServerItemData) => {
    setItems([]);
    onItemSelected(data);
  }
  
  return (
    <>

    <Button fullWidth variant="outlined" onClick={loadItems}>
      {label}
    </Button>

    <ServerItemsModalView
      open={items.length > 0}
      items={items}
      onClose={onClose}
      onItemSelected={onModelItemSelected}
    />
    </>
  );

}
