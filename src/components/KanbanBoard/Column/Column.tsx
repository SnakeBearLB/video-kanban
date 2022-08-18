// TODO: imports
import React, { useState, useCallback } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import useSyncContext from '../../../hooks/useSyncContext/useSyncContext';
import ColumnTitleForm from '../ColumnTitleForm/ColumnTitleForm';
import ColumnMenu from '../ColumnMenu/ColumnMenu';
import AddCardForm from '../AddCardForm/AddCardForm';
import Card from '../Card/Card';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    columnWrapper: {
      width: '14em',
      height: 'auto',
      position: 'relative',
      overflowX: 'visible',
      margin: '.5em',
    },
    column: {
      width: '14em',
      height: '99vh',
      maxHeight: '99%',
      border: '1px solid black',
      borderRadius: '5px',
      overflowY: 'scroll',
      overflowX: 'hidden',
      flex: '0 0 auto',
      backgroundColor: 'rgb(37, 37, 37)',
    },
    columnTitle: {
      width: '100%',
      height: '0.9rem',
      marginTop: '2em',
      marginBottom: '1em',
      textAlign: 'center',
      color: 'white',
      borderStyle: 'hidden',
      wordWrap: 'break-word',
      whiteSpace: 'normal',
    },
    columnTitlePlaceholder: {
      fontStyle: 'italic',
      color: '#d3d3d3',
    },
    columnDivCards: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    addCardForm: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    columnDivBottom: {
      width: '90%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '2em',
      margin: 'auto',
      borderRadius: '5px',
    },
    columnDivButton: {
      width: '90%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '2em',
      margin: 'auto',
      borderRadius: '5px',
    },
    addCardButton: {
      width: '100%',
      height: '2em',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'rgb(145, 145, 145)',
      border: 'none',
      backgroundColor: 'rgb(37, 37, 37)',
    },
    addCardText: {
      marginLeft: '.5em',
    },
  })
);

interface ColumnProps {
  changeColumnTitle: (newTitle: string, columnId: number) => Promise<void>;
  id: number;
  columnTitle: string;
}

export default function Column({ changeColumnTitle, id, columnTitle }: ColumnProps) {
  const styleClasses = useStyles();
  const {
    setChangingColumnTitle,
    changingColumnTitle,
    columnsList,
    cardsList,
    addingCardToColumn,
    setAddingCardToColumn,
    drag,
    dragStart,
    dragEnter,
    dragLeave,
  } = useSyncContext();

  const changeTitle = (e: any) => {
    setChangingColumnTitle(`${id}`);
  };

  const allCards = useCallback(() => {
    if (columnsList === undefined && cardsList === undefined) {
      return;
    }

    const copyTwilioColumnList: Array<any> = [...columnsList];

    const columnIndex: Array<any> = copyTwilioColumnList.filter(column => column.index === id);

    // most recent cards first
    const cards: Array<any> = columnIndex[0].data.cards.map((card: any) => {
      const cardItem: Array<any> = cardsList.filter(cardItem => cardItem.index === card);
      if (columnIndex[0].data === undefined || cardItem.length === 0) {
        return;
      }
      return <Card key={card} id={card} columnId={id} text={cardItem[0].data.text} />;
    });
    return cards;
  }, [columnsList, cardsList]);

  return (
    <div className={styleClasses.columnWrapper}>
      <div
        className={`column ${styleClasses.column}`}
        id={`${id}`}
        draggable
        onDrag={e => drag(e)}
        onDragStart={e => dragStart(e, id)}
        onDragEnter={e => dragEnter(e, id)}
        onDragLeave={e => dragLeave(e)}
      >
        <ColumnMenu id={id} />

        <div className={styleClasses.columnTitle} id={`${id}`} onClick={e => changeTitle(e)}>
          <span>
            {changingColumnTitle === `${id}` ? (
              <ColumnTitleForm changeColumnTitle={changeColumnTitle} columnTitle={columnTitle} id={id} />
            ) : (
              columnTitle
            )}
          </span>
        </div>

        <div
          className={styleClasses.columnDivCards}
          //  onDragEnter={(e)=>enter(e, id)}
        >
          {allCards()}
        </div>
        {/* add card form */}
        <div className={styleClasses.addCardForm}>
          {/* Bookmark */}
          {addingCardToColumn === `${id}` ? <AddCardForm columnId={id} /> : null}
        </div>
        <div className={styleClasses.columnDivButton} id={`${id}`}>
          <button className={styleClasses.addCardButton} onClick={() => setAddingCardToColumn(`${id}`)}>
            <AddIcon /> <p className={styleClasses.addCardText}>Add Card</p>
          </button>
        </div>
      </div>
    </div>
  );
}
