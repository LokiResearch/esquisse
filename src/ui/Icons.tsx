
import React from 'react';
import {createSvgIcon} from '@mui/material';
import {Undo, Save, Create, Redo, FolderOpen, Brightness7, Brightness4,
ChevronRight, ChevronLeft, AccountTree, ExpandLess, ExpandMore, Menu, Settings,
PhotoCamera, LibraryBooks, OpenWith, Loop, ZoomOutMap, Language, Add, Remove,
Publish, Accessibility, ViewInAr, CropFree, Flare, SmartScreen, DataObject, PushPin} from '@mui/icons-material';

// Custom icons
export const Bone = createSvgIcon(
  <path d="M5,18 C2.790861,18 1,16.209139 1,14 C1,13.2857412 1.18859035,12.5994674 1.53521022,12 C1.18859035,11.4005326 1,10.7142588 1,10 C1,7.790861 2.790861,6 5,6 C6.45671341,6 7.7639237,6.78584495 8.4650385,8 L15.5349615,8 C16.2360763,6.78584495 17.5432866,6 19,6 C21.209139,6 23,7.790861 23,10 C23,10.7142588 22.8114096,11.4005326 22.4647898,12 C22.8114096,12.5994674 23,13.2857412 23,14 C23,16.209139 21.209139,18 19,18 C17.5432866,18 16.2360763,17.214155 15.5349615,16 L8.4650385,16 C7.7639237,17.214155 6.45671341,18 5,18 Z M6.88645441,14.6667539 L7.1221181,14 L16.8778819,14 L17.1135456,14.6667539 C17.393601,15.4591036 18.1454758,16 19,16 C20.1045695,16 21,15.1045695 21,14 C21,13.5002312 20.8173095,13.0315273 20.4909716,12.6669138 L19.8940676,12 L20.4909716,11.3330862 C20.8173095,10.9684727 21,10.4997688 21,10 C21,8.8954305 20.1045695,8 19,8 C18.1454758,8 17.393601,8.54089645 17.1135456,9.33324608 L16.8778819,10 L7.1221181,10 L6.88645441,9.33324608 C6.606399,8.54089645 5.85452417,8 5,8 C3.8954305,8 3,8.8954305 3,10 C3,10.4997688 3.18269047,10.9684727 3.50902838,11.3330862 L4.10593238,12 L3.50902838,12.6669138 C3.18269047,13.0315273 3,13.5002312 3,14 C3,15.1045695 3.8954305,16 5,16 C5.85452417,16 6.606399,15.4591036 6.88645441,14.6667539 Z"/>,
  'Bone'
);
export const Cube = createSvgIcon(
  <path viewBox="0 0 16 16" d="M7.816 1.034a.5.5 0 0 1 .372 0l6.5 2.6a.5.5 0 0 1 .311.518.6.6 0 0 1 0 .019v7.698a.5.5 0 0 1-.311.463l-6.493 2.633a.5.5 0 0 1-.2.037.502.502 0 0 1-.19-.037l-6.492-2.633A.5.5 0 0 1 1 11.87V4.171c0-.016 0-.031.002-.046v-.026a.5.5 0 0 1 .313-.464l6.5-2.601Zm.678 12.73L14 11.532V4.838l-5.5 2.2-.006 6.726ZM2.001 4.837v6.695l5.493 2.227.006-6.723-5.5-2.2Zm6.001-2.8L2.848 4.099l5.154 2.06 5.154-2.06-5.154-2.062Z"/>,
  'Object3D'
);

export const BlankIcon = createSvgIcon(
  <path viewBox="0 0 16 16" d=""/>,
  'Blank'
);

export const MinusSquareIcon = createSvgIcon(
  <path viewBox="0 0 16 16" d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z"/>,
  'MinusSquare'
);

export const PlusSquareIcon = createSvgIcon(
  <path viewBox="0 0 16 16" d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z"/>,
  'PlusSquare'
);

// Objects icons
export const Object3DIcon = CropFree;
export const LightIcon = Flare;
export const SkinnedMeshIcon = Accessibility;
export const SceneIcon = AccountTree;
export const ScreenIcon = SmartScreen;
export const GroupIcon = DataObject;
export const IKTargetIcon = PushPin;
export const MeshIcon = Cube;
export const BoneIcon = Bone;

// UI Controls icons
export const PlusIcon = Add;
export const MinusIcon = Remove;
export const UploadFileIcon = Publish;

// Toolbars icons
export const TranslateModeIcon = OpenWith;
export const RotateModeIcon = Loop;
export const ScaleModeIcon = ZoomOutMap;
export const GlobalTransformIcon = Language;
export const PoseModeIcon = Accessibility;
export const ObjectModeIcon = ViewInAr;
export const BoneModeIcon = BoneIcon;

// Menu icons
export const SceneGraphIcon = AccountTree;
export const OpenCloseMenuIcon = Menu;
export const SceneSettingsIcon = ViewInAr;
export const SettingsIcon = Settings;
export const RenderSettingsIcon = PhotoCamera;
export const LibrarySettingsIcon = LibraryBooks;

// Menu Bar icons
export const UndoIcon = Undo;
export const RedoIcon = Redo;
export const SaveIcon = Save;
export const NewFileIcon = Create;
export const OpenFileIcon = FolderOpen;

// Navigation icons
export const ExpandRightIcon = ChevronRight;
export const ExpandLeftIcon = ChevronLeft;
export const ExpandLessIcon = ExpandLess;
export const ExpandMoreIcon = ExpandMore;
export const MenuBarItemExpandIcon = ExpandRightIcon;

// ui icons
export const DarkModeIcon = Brightness4;
export const LightModeIcon = Brightness7;