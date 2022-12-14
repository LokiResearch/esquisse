// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 18/06/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

import * as React from 'react';
import packageInfo from '/../package.json';
import {AppBar, Toolbar, IconButton} from '@mui/material';
import {MenuBarList} from './MenuBarList';
import {Item} from './MenuBarItem';
import * as Icons from '/ui/Icons';
import {AddObjectsCommand} from '/commands';
import { MeshFactory, MeshType, EScreen, EBasicMesh } from '/objects';
import {enumKeys} from '/utils/typescript';
import {styled} from '@mui/system';
import { useEditorContext } from '/editor/Editor';
import { observer } from 'mobx-react-lite';


const StyledAppBar = styled(AppBar)(({theme}) => ({
  background: theme.palette.background.default,
  position: 'relative',
}));

const StyledToolbar = styled(Toolbar)(({theme}) => ({
  minHeight: theme.spacing(1)
}));


export const MenuBar = () =>  {
  
  return (
    <StyledAppBar>
      <StyledToolbar variant="dense">
        <FileMenu/>
        <EditMenu/>
        <ObjectsMenu/>
        <div style={{flexGrow:100}}/>
        <QuickIcons/>
        <div>
          {"v"+packageInfo.version}
        </div>
      </StyledToolbar>
    </StyledAppBar>
  );  
}

//##############################################################################
//  File Menu
//##############################################################################

function FileMenu() {

  const items: Array<Item> = [
    {type: 'action', name: 'New', icon: Icons.NewFileIcon, shortcut: '⌘N'},
    {type: 'action', name: 'Open', icon: Icons.OpenFileIcon, shortcut: '⌘O'},
    {type: 'action', name: 'Save', icon: Icons.SaveIcon, shortcut: '⌘S'},
    {type: 'separator'},
    {type: 'action', name: 'Quit', shortcut: '⌘Q'},
  ];

  return (
    <MenuBarList items={items} name="File" primary={true}/>
  );
}

//##############################################################################
//  Edit Menu
//##############################################################################

function EditMenu() {

  const items: Array<Item> = [
    {type: 'action', name: 'Undo', icon: Icons.UndoIcon},
    {type: 'action', name: 'Redo', icon: Icons.RedoIcon},
  ];

  return (
    <MenuBarList items={items} name="Edit" primary={true}/>
  );
}

//##############################################################################
//  Objects Menu
//##############################################################################

function ObjectsMenu() {

  const editor = useEditorContext();

  const addObjectSubitems = new Array<Item>();
  for (const objtype of enumKeys(MeshType)) {
    addObjectSubitems.push({
      type: 'action',
      name:MeshType[objtype],
      action: () => {
        const mesh = MeshFactory.getStandardMesh(MeshType[objtype]);
        const eObj = new EBasicMesh(mesh);
        const cmd = new AddObjectsCommand(editor, eObj);
        cmd.exec();
      }
    });
  }

  const data = [{constructor: EScreen, name: "Screen"}];
  const EObjects = new Array<Item>();
  for (const d of data) {
    EObjects.push({
      type: 'action',
      name: d.name,
      action: () => {
        const cmd = new AddObjectsCommand(editor, new d.constructor());
        cmd.exec();
      }
    })
  }

  const items: Array<Item> = [
    {type: 'list', name: 'Add basic object', subitems: addObjectSubitems},
    {type: 'list', name: 'Add esquisse object', subitems: EObjects},
  ];

  return (
    <MenuBarList items={items} name="Objects" primary={true}/>
  );
}

//##############################################################################
//  Quick icons
//##############################################################################

function QuickIcons() {

  return (
    <ThemeButton/>
  )
}

const ThemeButton = observer(() => {

  const editor = useEditorContext();
  let ThemeIcon = Icons.LightModeIcon;
  const theme = editor.settings.theme;
  let value : "dark" | "light" = "light";
  if (theme.palette.mode === "light") {
    ThemeIcon = Icons.DarkModeIcon;
    value = "dark";
  }

  const onClick = () => {
    editor.settings.setTheme(value);
  }

  return (
    <IconButton size="small" onClick={onClick} value={value}>
      <ThemeIcon fontSize="small"/>
    </IconButton>
  );
});
