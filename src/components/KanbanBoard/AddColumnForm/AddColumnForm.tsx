import React, { useState } from 'react';
import useSyncContext from '../../../hooks/useSyncContext/useSyncContext';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    columnFormContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderStyle: 'none',
      borderRadius: '5px',
      width: '14em',
      height: '4em',
      margin: '.5em',
      backgroundColor: 'rgb(37, 37, 37)',
    },
    columnForm: {
      borderStyle: 'none',
      color: 'white',
      backgroundColor: 'rgb(37, 37, 37)',
    },
    columnFormTextInput: {
      borderStyle: 'none',
      color: 'white',
      backgroundColor: 'rgb(37, 37, 37)',
      '&:focus': {
        outline: 'none',
      },
    },
  })
);

export default function AddColumnForm() {
  const styleClasses = useStyles();

  // custom hook: useSyncContext
  const { addColumn } = useSyncContext();

  const [titleText, setTitleText] = useState<string>('');

  const submitTitle = (e: any) => {
    e.preventDefault();
    addColumn(titleText);
  };

  return (
    <div>
      <div className={styleClasses.columnFormContainer}>
        <form className={styleClasses.columnForm} onSubmit={submitTitle}>
          <input
            className={styleClasses.columnFormTextInput}
            name="cardtext"
            type="text"
            placeholder={'column title'}
            value={titleText}
            onChange={e => setTitleText(e.target.value)}
            onBlur={submitTitle}
            autoFocus
          />
          <input type="submit" hidden />
        </form>
      </div>
    </div>
  );
}
