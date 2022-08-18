import React, { useRef } from 'react';
import CloseIcon from '@material-ui/icons/Close';
import useSyncContext from '../../../hooks/useSyncContext/useSyncContext';
import CardTextForm from '../CardTextForm/CardTextForm';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      width: '90%',
      height: '6em',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '.5em 0 .5em 0',
      backgroundColor: 'white',
      borderRadius: '5px',
      ZIndex: '1',
      padding: '1em',
    },
    deleteButtonContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '2em',
      height: '2em',
      position: 'absolute',
      top: '.15em',
      right: '.15em',
      ZIndex: '2',
    },
    deleteCard: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '2em',
      height: '2em',
      backgroundColor: 'white',
      borderStyle: 'none',
      visibility: 'hidden',
    },
    cardText: {
      width: '100%',
      fontSize: '16px',
      display: 'inline-block',
      textAlign: 'center',
      wordWrap: 'break-word',
      whiteSpace: 'normal',
      hyphens: 'auto',
    },
  })
);

interface CardProps {
  id: number;
  columnId: number;
  text: string;
}

// TODO: card component
export default function Card({ id, columnId, text }: CardProps) {
  // styles
  const styleClasses = useStyles();

  const { deleteCard, isAddingCardText, setIsAddingCardText, drag, dragStart, dragEnter } = useSyncContext();

  const deleteCardButton = useRef<HTMLButtonElement | null>(null);

  const handleHoverOver = () => {
    deleteCardButton.current!.style.visibility = 'visible';
  };

  const handleHoverOut = () => {
    deleteCardButton.current!.style.visibility = 'hidden';
  };

  return (
    <div
      className={`card ${styleClasses.card}`}
      id={`${id}`}
      draggable
      onDrag={e => drag(e)}
      onDragStart={e => dragStart(e)}
      onDragEnter={e => dragEnter(e, columnId)}
    >
      <div className={styleClasses.deleteButtonContainer} onMouseOver={handleHoverOver} onMouseOut={handleHoverOut}>
        <button
          className={styleClasses.deleteCard}
          onClick={() => deleteCard(id, columnId)}
          id={`${id}`}
          ref={deleteCardButton}
        >
          <CloseIcon />
        </button>
      </div>
      <div
        onClick={() => {
          setIsAddingCardText(true);
        }}
      >
        <span className={styleClasses.cardText}>
          {isAddingCardText ? <CardTextForm cardId={id} text={text} /> : text}
        </span>
      </div>
    </div>
  );
}
