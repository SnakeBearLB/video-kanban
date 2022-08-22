import { createTheme } from '@material-ui/core';

declare module '@material-ui/core/styles/createTheme' {
  interface Theme {
    sidebarWidth: number;
    sidebarMobileHeight: number;
    brand: string;
    footerHeight: number;
    mobileTopBarHeight: number;
    mobileFooterHeight: number;
    sidebarMobilePadding: number;
    participantBorderWidth: number;
    rightDrawerWidth: number;
  }

  // allow configuration using `createMuiTheme`
  interface ThemeOptions {
    sidebarWidth?: number;
    sidebarMobileHeight?: number;
    brand: string;
    footerHeight: number;
    mobileTopBarHeight: number;
    mobileFooterHeight: number;
    sidebarMobilePadding: number;
    participantBorderWidth: number;
    rightDrawerWidth?: number;
  }
}

const defaultTheme = createTheme();

export default createTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        'html, body, #root': {
          height: '100%',
        },
      },
    },
    MuiMenu: {
      list: {
        backgroundColor: 'black',
      },
    },
    MuiButton: {
      root: {
        borderRadius: '4px',
        textTransform: 'none',
        color: '#FDC844',
        fontSize: '0.9rem',
        transition: defaultTheme.transitions.create(['background-color', 'box-shadow', 'border', 'color'], {
          duration: defaultTheme.transitions.duration.short,
        }),
      },
      text: {
        padding: '6px 14px',
      },
      contained: {
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
        '&:disabled': {
          backgroundColor: 'gray',
        },
      },
      outlinedPrimary: {
        border: '2px solid #FDC844',
        '&:hover': {
          border: '2px solid rgba(2, 122, 197, .20)',
        },
      },
      startIcon: {
        marginRight: '6px',
      },
    },
    MuiTypography: {
      body1: {
        color: '#ffffff',
        fontSize: '0.9rem',
      },
    },
    MuiInputBase: {
      root: {
        fontSize: '0.9rem',
        backgroundColor: '#ffffff',
      },
    },
    MuiSelect: {
      root: {
        padding: '0.85em',
      },
    },
    MuiDialogActions: {
      root: {
        padding: '16px',
      },
    },
    MuiTextField: {
      root: {
        color: '#ffffff',
        backgroundColor: '#ffffff',
      },
    },
    MuiInputLabel: {
      root: {
        color: '#ffffff',
        fontSize: '1.1rem',
        marginBottom: '0.2em',
        fontWeight: 500,
      },
    },
    MuiOutlinedInput: {
      notchedOutline: {
        borderColor: '#FDC844',
      },
    },
  },
  typography: {
    fontFamily: 'sans-serif',
  },
  palette: {
    primary: {
      main: '#FDC844',
    },
  },
  brand: '#03fcd7',
  footerHeight: 72,
  mobileFooterHeight: 56,
  sidebarWidth: 300,
  sidebarMobileHeight: 90,
  sidebarMobilePadding: 8,
  participantBorderWidth: 2,
  mobileTopBarHeight: 52,
  rightDrawerWidth: 320,
});
