// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 10/11/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import * as React from 'react';
import {alpha, Box, Button, styled, Typography} from '@mui/material';
import {TreeItem, TreeItemContentProps, TreeItemProps, useTreeItem}  from '@mui/lab';
import {EObject} from '/objects/EObject';
import { useEditorContext } from '/editor/Editor';
import clsx from 'clsx';
import { DeleteObjectsCommand, SetParentCommand } from '/commands';
import { DeleteForever } from '@mui/icons-material';

/** Drag and Drop data format handled by the items */
const DnDDataFormat = "scene_tree_view_dnd_data_format";

/** Drag and Drop data interface */
interface DnDData {objectId: number}

/** As native DnD dropeffect cursors are limited to copy|move|none|link, we use
 * a ref to the dragged item DOM id to manually set its cursor appearance */

const styles = {
  labelContent: {
    itemIcon: {
      fontSize: '1rem'
    },
    itemType: {
      marginLeft: '0.3em',
      fontSize: '0.6rem',
    },
    itemName: {
      marginLeft: '0.3em',
      flexGrow: 1,
    },
  },
  actionButton: {
    padding: 0,
    margin: 0,
    minWidth: 0,
  },
  actionIcon: {
    fontSize: '1rem'
  }
};

interface SceneTreeItemProps extends TreeItemProps {
  object: EObject;
  onRightClick?: (object: EObject) => void;
}

export const SceneTreeItem = React.memo((props: SceneTreeItemProps) => {

  const {object} = props;
  const id = `SceneTreeItemContent-${object.id}`;
  const editor = useEditorContext();
  const [dragState, setDragState] = React.useState({
    isOver: false,
    canDrop: false, 
  });
  
  const onDragStart = (event: React.DragEvent) => {
    event.stopPropagation();
    
    if (!object.canChangeParent) {
      console.warn(`Drag is disabled for ${object.type} objects.`);
      event.preventDefault();
      return;
    }
    
    const data = JSON.stringify({objectId: object.id});
    event.dataTransfer.setData(DnDDataFormat, data);
    event.dataTransfer.effectAllowed = 'copy';
  }

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setDragState({isOver: false, canDrop: false});

    if (!object.canReceiveChildren) {
      console.warn(`Drop is disabled for ${object.type} objects.`);
      return;
    }

    const data = event.dataTransfer.getData(DnDDataFormat);
    if (data !== "") {
      const jsondata = JSON.parse(data) as DnDData;
      const draggedObject = editor.scene.getObjectById(jsondata.objectId);
      if (draggedObject) {
        let selection = new Array<EObject>();
        if (event.shiftKey) {
          // Only add selected object is shift key is enabled
          selection = [...editor.selectedObjects];
        }
        !selection.includes(draggedObject) && selection.push(draggedObject);

        const cmd = new SetParentCommand(editor, object, selection);
        cmd.exec();
      }
    }
  }

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const dataAvaiable = event.dataTransfer.types.includes(DnDDataFormat);
    const canDrop = (object.canReceiveChildren && dataAvaiable);
    event.dataTransfer.dropEffect = canDrop ? 'copy' : 'none';
    setDragState({isOver: true, canDrop: canDrop});
  }

  const onDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();    
    setDragState({isOver: false, canDrop: false});
  }

  return (
    <StyledTreeItem
      {...props}
      ContentComponent={Content}
      ContentProps={{className:clsx({
        ["isOver"]:dragState.isOver,
        ["canDrop"]:dragState.isOver && dragState.canDrop,
        ["noCanDrop"]:dragState.isOver && !dragState.canDrop,
      }), id: id}}
      draggable
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragStart={onDragStart}
      onDragLeave={onDragLeave}
      label={
        <LabelContent object={object}/>
      }
    />
  );
});

const StyledTreeItem = styled(TreeItem)(
  ({theme}) => ({
  
    WebkitTapHighlightColor: 'transparent',
    "& .MuiTreeItem-group": {
      borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
      marginLeft: '0.5em',
      paddingLeft: '1em',
    },

    "> .MuiTreeItem-content": {
      padding: 0,
      "&:hover": {
        backgroundColor: 'transparent',
      },
      "&.isOver": {
        backgroundColor: theme.palette.action.hover,
      },
      "&.canDrop": {
        color: theme.palette.success.light,
      },
      "&.noCanDrop": {
        color: theme.palette.error.light,
      },
    },
    "& .MuiTreeItem-label": {
      display: 'flex',
      alignItems: 'center',
      padding: 0,
    },
  }
  ));

type ContentProps = TreeItemContentProps

const Content = React.forwardRef(function CustomComponent(
    props: ContentProps, ref
) {

  const { className, classes, nodeId, expansionIcon, label, id } = props;
  const { selected, preventSelection, handleSelection, handleExpansion } = useTreeItem(nodeId);

  const onExpandIconClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    handleExpansion(event);
  }

  const onMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    preventSelection(event);
  }

  const onLabelClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    handleSelection(event);
  }

  return (
    <Box
      id={id}
      className={clsx(className, classes.root, {[classes.selected]: selected})}
      onMouseDown={onMouseDown}
      ref={ref as React.Ref<HTMLDivElement>}
    >
      <div className={classes.iconContainer} onClick={onExpandIconClick}>
        {expansionIcon}
      </div>
      <div className={classes.label} onClick={onLabelClick}>
        {label}
      </div>
    </Box>
  );
});



interface LabelContentProps {
  object: EObject;
}

/**
 * Tree Item Label Component 
 * @param obj 
 * @returns 
 */
const LabelContent = (props: LabelContentProps) => {

  const {object} = props;
  const [name, setName] = React.useState(object.name);
  const ObjectIcon = object.icon;
  const text = object.shortText;

  const updateName = () => {
    setName(object.name);
  }

  // Listen to the object name changes
  React.useEffect(() => {
    object.signals.nameUpdated.connect(updateName);
    return () => {
      object.signals.nameUpdated.disconnect(updateName);
    }
  }, []);

  const style = styles.labelContent;
  
  return (
    <>
      <ObjectIcon sx={style.itemIcon} color="primary"/>
      <Typography sx={style.itemType} color="primary">
        {text}
      </Typography>
      <Typography sx={style.itemName} noWrap>
        {name}
      </Typography>
      <ActionButtons object={object}/>
    </>
  );
}


const ActionButtons = (props: {object: EObject}) => {

  const {object} = props;
  const deleteButton = object.canBeDeleted ? <DeleteButton object={object}/> : null;
  
  return (
    <>
      {deleteButton}
    </>
  )

}

const DeleteButton = (props: {object: EObject}) => {
  
  const editor = useEditorContext();
  const {object} = props;

  const deleteObject = () => {
    const cmd = new DeleteObjectsCommand(editor, [object], true);
    cmd.exec();
  }

  return (
    <Button sx={styles.actionButton} onClick={deleteObject} color="error">
      <DeleteForever sx={styles.actionIcon}/>
    </Button>
  )
}
