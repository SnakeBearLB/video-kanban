import React, { useState } from 'react';
import useSyncContext from '../../../hooks/useSyncContext/useSyncContext';
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
    addCardTextForm: {
      width: '90%',
      fontSize: '16px',
      borderStyle: 'hidden',
      outline: 'none',
      resize: 'none',
      fontFamily: 'Fira Sans, sans-serif',
      textAlign: 'center',
      wordWrap: 'break-word',
      whiteSpace: 'normal',
      hyphens: 'auto',
    },
  })
);

interface AddCardFormProps {
  columnId: number;
}

export default function AddCardForm({ columnId }: AddCardFormProps) {
  const { addCard, setAddingCardToColumn } = useSyncContext();

  // styles
  const styleClasses = useStyles();

  const [cardText, setCardText] = useState('');

  const submitTextChange = (e: any) => {
    e.preventDefault();
    addCard(cardText, columnId);
    setAddingCardToColumn('');
  };

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      submitTextChange(e);
    }
  };

  return (
    <>
      <div className={styleClasses.card}>
        <form onSubmit={submitTextChange}>
          <textarea
            className={styleClasses.addCardTextForm}
            name="cardtext"
            placeholder={cardText}
            value={cardText}
            onChange={e => setCardText(e.target.value)}
            onBlur={submitTextChange}
            onKeyDown={e => handleKeyDown(e)}
            autoFocus
          />
          <input type="submit" hidden />
        </form>
      </div>
    </>
  );
}
