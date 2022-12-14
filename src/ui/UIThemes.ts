// Author: Axel Antoine
// mail: ax.antoine@gmail.com
// website: http://axantoine.com
// 29/04/2021

// Loki, Inria project-team with Université de Lille
// within the Joint Research Unit UMR 9189 CNRS-Centrale
// Lille-Université de Lille, CRIStAL.
// https://loki.lille.inria.fr

// LICENCE: Licence.md 

// import {deepmerge} from '@mui/utils';
import {createTheme, Theme} from '@mui/material';

declare module '@mui/material/styles' {
  interface Theme {
    esquisse: {
      background: {
        scene: string;
      }
    }
  }

  interface ThemeOptions {
    esquisse?: {
      background?: {
        scene?: string;
      }
    }
  }
}

const commonTheme: Partial<Theme> = {
  components: {
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: '0.8rem',
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        body1: {
          fontSize: '0.8rem',
        }
      }
    },
    MuiTooltip: {
      defaultProps: {
        arrow: true,
        enterDelay: 1000,
      },
      styleOverrides: {
        arrow: {
          color: '#111111'
        },
        tooltip: {
          background: '#111111'
        }
      }
    },
    MuiIconButton: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          padding: 0
        }
      }
    },
    MuiButton: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          padding: 0,
        }
      }
    },
    MuiToggleButton: {
      defaultProps: {
        size: "small",
      }
    },
    MuiToggleButtonGroup: {
      defaultProps: {
        size: "small",
      }
    },
    MuiCheckbox: {
      defaultProps: {
        size: "small",
      }
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
        variant: 'outlined',
        margin: 'none'
      },
      styleOverrides: {
        root: {
          padding: 0,
          margin: 0,
        }
      }
    },
    MuiSelect: {
      defaultProps: {
        size: "small",
        variant: 'outlined',
        margin: 'none',
      },
      styleOverrides: {
        select: {
          padding: 0,
          margin: 0,
        }
      }
    },
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0,
          margin: 0,
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: 0,
          margin: 0,
        }
      }
    }
  },
};

export const darkTheme = createTheme(
  {
    esquisse: {
      background: {
        scene: '#555555',
      }
    },
    palette: {
      mode: 'dark',
      background: {
        paper: '#444444',
        default: '#444444'
      }
    },
  },
  commonTheme
);

export const lightTheme = createTheme(
  {
    esquisse: {
      background: {
        scene: '#CCCCCC',
      }
    },
    palette: {
      mode: 'light',
    },
  },
  commonTheme,
);
