import React, { ChangeEvent, useState } from 'react';
import useSyncContext from '../../../hooks/useSyncContext/useSyncContext';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    columnTitleForm: {
      padding: '0',
      borderTopStyle: 'hidden',
      border: 'none',
      background: 'none',
      color: 'white',
      outline: 'none',
      fontFamily: 'Fira Sans, sans-serif',
      textAlign: 'center',
    },
    columnTitlePlaceholder: {
      fontStyle: 'italic',
      color: '#d3d3d3',
    },
  })
);

interface ColumnTitleProps {
  changeColumnTitle: (newTitle: string, columnId: number) => Promise<void>;
  columnTitle: string;
  id: number;
}

export default function ColumnTitleForm({ changeColumnTitle, columnTitle, id }: ColumnTitleProps) {
  const [value, setValue] = useState('');
  const { setChangingColumnTitle } = useSyncContext();
  const styleClasses = useStyles();

  const submitTitleChange = (e: any) => {
    e.preventDefault();
    changeColumnTitle(value, id);
    setChangingColumnTitle('');
  };

  return (
    <div>
      <form onSubmit={submitTitleChange}>
        <input
          className={styleClasses.columnTitleForm}
          name="title"
          type="text"
          placeholder={columnTitle ? columnTitle : '...click to edit'}
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          // onBlur={(e) => submitTitleChange(e, value)}
          onBlur={submitTitleChange}
          autoFocus
        />
        <input type="submit" hidden />
      </form>
    </div>
  );
}
