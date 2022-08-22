import React from 'react';
import { makeStyles, Theme, Typography } from '@material-ui/core';
import Swoosh from './swoosh';
import VideoLogo from './VideoLogo';
import TwilioLogo from './TwilioLogo';
import { useAppState } from '../../state';
import UserMenu from './UserMenu/UserMenu';
import { useLocation } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) => ({
  background: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgb(27, 27, 27)',
    height: '100%',
  },
  container: {
    position: 'relative',
    flex: '1',
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '50vw',
    height: '379px',
    borderRadius: '8px',
    // border: 'solid 1px #FDC844',
    // boxShadow: '0px 2px 4px 0px rgba(40, 42, 43, 0.3)',
    overflow: 'hidden',
    position: 'relative',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      display: 'block',
      height: 'auto',
      width: 'calc(100% - 40px)',
      margin: 'auto',
      maxWidth: '400px',
    },
  },
  swooshContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: Swoosh,
    backgroundSize: 'cover',
    width: '296px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: '100px',
      backgroundPositionY: '140px',
    },
  },
  logoContainer: {
    position: 'absolute',
    width: '210px',
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      alignItems: 'center',
      width: '90%',
      textAlign: 'initial',
      '& svg': {
        height: '64px',
      },
    },
  },
  twilioLogo: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '20px',
  },
  content: {
    // background: 'white',
    overflow: 'visible',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: '4em',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      padding: '2em',
    },
  },
  title: {
    color: '#03fcd7',
    margin: '1em 0 1em',
    fontSize: '3.125rem',
    'font-weight': '600',
    [theme.breakpoints.down('sm')]: {
      margin: 0,
      fontSize: '2rem',
    },
  },
}));

interface IntroContainerProps {
  children: React.ReactNode;
}

const IntroContainer = (props: IntroContainerProps) => {
  const classes = useStyles();
  const { user } = useAppState();
  const location = useLocation();

  return (
    <div className={classes.background}>
      <Typography variant="h1" className={classes.title}>
        Virtual Venue
      </Typography>
      {/* <TwilioLogo className={classes.twilioLogo} /> */}
      {user && location.pathname !== '/login' && <UserMenu />}
      <div className={classes.container}>
        <div className={classes.innerContainer}>
          {/* <div className={classes.swooshContainer}>
            <div className={classes.logoContainer}>
              <VideoLogo />
              <Typography variant="h6" className={classes.title}>
                Twilio Programmable Video
              </Typography>
            </div>
          </div> */}
          <div className={classes.content}>{props.children}</div>
        </div>
      </div>
    </div>
  );
};

export default IntroContainer;
