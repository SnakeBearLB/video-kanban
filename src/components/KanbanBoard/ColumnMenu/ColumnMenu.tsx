import React, { useState, useRef, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import DeleteIcon from '@material-ui/icons/Delete';
import useSyncContext from '../../../hooks/useSyncContext/useSyncContext';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    columnMenuButton: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      color: 'grey',
      border: 'none',
      background: 'none',
      top: '.15em',
      right: '.5em',
      ZIndex: '51',
    },
    columnMenu: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      visibility: 'hidden',
      border: 'solid 1px grey',
      width: '12em',
      height: '10em',
      position: 'absolute',
      background: 'black',
      top: '2em',
      // right: '-3em',
      left: '3em',
      'z-index': '1000',
      borderRadius: '5px',
    },
    columneDeleteButton: {
      width: '10em',
      height: '5em',
      background: 'none',
      border: 'none',
      color: 'grey',
    },
    deleteButtonElements: {
      width: '10em',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeColumnButtonText: {
      marginLeft: '.5em',
    },
  })
);

interface ColumnMenuProps {
  id: number;
}

export default function ColumnMenu({ id }: ColumnMenuProps) {
  const styleClasses = useStyles();

  const { deleteColumn } = useSyncContext();

  const columnMenuDiv = useRef<HTMLDivElement | null>(null);
  const node = useRef<HTMLDivElement>(null);

  const columnMenu = () => {
    columnMenuDiv.current!.style.visibility = 'visible';
  };

  const handleClick = (e: any) => {
    if (node.current!.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    columnMenuDiv.current!.style.visibility = 'hidden';
  };

  useEffect(() => {
    // add when mounted
    document.addEventListener('mousedown', handleClick);
    // return function to be called when unmounted
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <div ref={node}>
      <button className={styleClasses.columnMenuButton} onClick={columnMenu} autoFocus>
        <MoreHorizIcon />
      </button>

      <div className={styleClasses.columnMenu} ref={columnMenuDiv}>
        <button className={styleClasses.columneDeleteButton} onClick={() => deleteColumn(id)}>
          <div className={styleClasses.deleteButtonElements}>
            <DeleteIcon />
            <p className={styleClasses.removeColumnButtonText}>Remove Column</p>
          </div>
        </button>
      </div>
    </div>
  );
}
