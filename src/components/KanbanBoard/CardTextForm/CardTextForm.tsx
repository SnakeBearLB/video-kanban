import React, { useState } from 'react';

import useSyncContext from '../../../hooks/useSyncContext/useSyncContext';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardTextForm: {
      fontSize: '16px',
      borderStyle: 'hidden',
      outline: 'none',
      resize: 'none',
      fontFamily: 'Fira Sans, sans-serif',
      textAlign: 'center',
      wordWrap: 'break-word',
      whiteSpace: 'normal',
      hyphens: 'auto',
      width: '100%',
    },
    cardForm: {
      width: '100%',
      padding: 'none',
    },
  })
);

interface CardTextFormProps {
  cardId: number;
  text: string;
}

export default function CardTextForm({ cardId, text }: CardTextFormProps) {
  // styles
  const styleClasses = useStyles();

  const { changeCardText, setIsAddingCardText } = useSyncContext();
  const [value, setValue] = useState(text);

  const submitTextChange = (e: any) => {
    e.target.value = '';
    e.preventDefault();
    setValue(e.target.value);
    changeCardText(value, cardId);
    setIsAddingCardText(false);
  };

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      submitTextChange(e);
    }
  };

  const handleFocus = (e: any) => {
    e.target.value = '';
    e.target.value = value;
  };

  return (
    <>
      <form className={styleClasses.cardForm} onSubmit={submitTextChange}>
        <textarea
          className={styleClasses.cardTextForm}
          contentEditable="true"
          name="cardtext"
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={submitTextChange}
          onFocus={handleFocus}
          onKeyDown={e => handleKeyDown(e)}
          autoFocus
        />
        <button type="submit" hidden />
      </form>
    </>
  );
}
