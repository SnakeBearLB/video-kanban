// TODO: imports
import React, { useState, useCallback } from 'react';
import Column from './Column/Column';
// import AddColumnForm from './addColumnForm'
// TODO: material ui icons
// import { Container } from '@mui/material';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import useSyncContext from '../../hooks/useSyncContext/useSyncContext';
import AddColumnForm from './AddColumnForm/AddColumnForm';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      width: '100%',
      height: '60vh',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      backgroundColor: 'white',
      overflow: 'auto',
      whiteSpace: 'nowrap',
    },
    addColumn: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'grey',
      borderStyle: 'none',
      borderRadius: '5px',
      minWidth: '14em',
      height: '3em',
      margin: '.5em',
      backgroundColor: 'rgb(37, 37, 37)',
    },
    addColumnButtonText: {
      marginLeft: '.5em',
    },
  })
);

export default function KanbanBoard() {
  const styleClasses = useStyles();

  const { columnsList, syncClient, isAddingColumn, setIsAddingColumn, handleDragOver, dropDragging } = useSyncContext();

  const { room } = useVideoContext();

  // TODO: change column title function
  const changeColumnTitle = async (newTitle: string, columnId: number) => {
    if (syncClient) {
      syncClient.list(`columns${room!.sid}`).then(function(columns) {
        columns.update(columnId, { text: newTitle });
      });
    }
  };

  // try useCallback to prevent from unnessary rerenders and to rerender when the column list updates in twilio
  const allColumns = useCallback(() => {
    if (columnsList === undefined) {
      return;
    }

    const copyColumnsList: Array<any> = [...columnsList];

    const sortedColumns: Array<any> = copyColumnsList.sort((a, b) => a.data.position - b.data.position);

    const columns = sortedColumns.map(column => {
      return (
        <Column
          key={column.index}
          id={column.index}
          columnTitle={column.data.text}
          changeColumnTitle={changeColumnTitle}
        ></Column>
      );
    });
    return columns;
  }, [columnsList]);

  return (
    <div className={styleClasses.container} onDragOver={e => handleDragOver(e)} onDrop={e => dropDragging(e)}>
      {allColumns()}
      {isAddingColumn ? <AddColumnForm /> : null}
      <button className={styleClasses.addColumn} onClick={() => setIsAddingColumn(true)}>
        <AddIcon />
        <p className={styleClasses.addColumnButtonText}>Add Column</p>
      </button>
    </div>
  );
}
