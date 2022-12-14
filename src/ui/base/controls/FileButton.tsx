// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 15/09/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md

import React from 'react';
import {ButtonProps, Button, Tooltip} from '@mui/material';

export interface URLFile {
  name: string;
  url: string;
}

interface Props extends ButtonProps {
  fileFormats?: Array<string>
  label: string;
  tooltip?: string;
  onFileLoaded?: (file: URLFile) => void;
}

interface State {
  loading: boolean;
  progress: number;
  startedTime: number;
}

export class FileButton extends React.Component<Props, State> {

  private readonly fileReader = new FileReader();
  private input: HTMLInputElement;
  private filename = "";

  constructor(props: Props) {
    super(props);

    this.input = document.createElement('input');
    this.input.type = 'file';
    this.input.onchange = this.onInputChange;
    this.input.accept = props.fileFormats?.join(",") ?? "";
    console.log(this.input.accept);

    this.fileReader.onloadend = this.onFileLoadEnd;
    this.fileReader.onprogress = this.onFileLoadProgress;
    this.fileReader.onloadstart = this.onFileLoadStart;

    this.state = {
      loading: false,
      progress: 0,
      startedTime: 0,
    }
  }

  onFileLoadEnd = (event: ProgressEvent<FileReader>) => {
    this.setState({
      loading: false,
      progress: event.loaded / event.total * 100,
    }, () => {
      console.log("FileLoaded", this.filename, this.fileReader.result);
      this.props.onFileLoaded && this.props.onFileLoaded({
        name: this.filename,
        url: this.fileReader.result as string
      });
    });
  }

  onFileLoadProgress = (event: ProgressEvent<FileReader>) => {


    const percent = event.loaded / event.total * 100;

    this.setState({
      progress: percent
    })
  }

  onFileLoadStart = (event: ProgressEvent<FileReader>) => {
    this.setState({
      loading: true,
      progress: event.loaded / event.total * 100,
      startedTime: Date.now(),
    })
  }

  onInputChange = (event: Event) => {

    const target = event.target as HTMLInputElement;
    const files = target.files;

    if (files && files.length > 0) {
      const file = files[0];

      this.fileReader.readAsDataURL(file);
      this.filename = file.name;

    }
  }

  onButtonClick = () => {
    this.input.click();
  }

  render() {

    const {fileFormats, onFileLoaded, label, tooltip = "", ...otherProps} = this.props;

    // If loading time is above 2 sec, then display progression percentage
    let displayedLabel = label;
    const elapsedTime = Date.now() - this.state.startedTime;
    if (this.state.loading && elapsedTime > 2000) {
      displayedLabel += " ["+this.state.progress+"%]";
    }

    return (
      <Tooltip title={tooltip}>
        <Button {...otherProps}
          onClick={this.onButtonClick}
        >
          {displayedLabel}
        </Button>
      </Tooltip>
    );
  }
}

export {Props as UIFileInputControlProps};