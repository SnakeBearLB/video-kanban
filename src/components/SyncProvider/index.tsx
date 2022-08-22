// imports
import React, { useEffect, createContext, useState, useRef, useCallback } from 'react';
import { Paginator, SyncClient, SyncListItem } from 'twilio-sync';
import useVideoContext from '../../hooks/useVideoContext/useVideoContext';

// type
type SyncContextType = {
  connect: (token: string) => void;
  columnsList: SyncListItem[];
  cardsList: SyncListItem[];
  changingColumnTitle: string;
  setChangingColumnTitle: (columnId: string) => void;
  changingCardTitle: boolean;
  setChangingCardTitle: (value: boolean) => void;
  syncClient: SyncClient | undefined;
  deleteColumn: (index: number) => Promise<void>;
  columnToDelete: string;
  setColumnToDelete: (column: string) => void;
  isAddingColumn: boolean;
  setIsAddingColumn: (value: boolean) => void;
  addColumn: (titleText: string) => void;
  addCard: (cardText: string, fromColumn: number) => void;
  deleteCard: (cardId: number, columnId: number) => void;
  isAddingCardText: boolean;
  setIsAddingCardText: (value: boolean) => void;
  changeCardText: (cardText: string, cardId: number) => void;
  addingCardToColumn: string;
  setAddingCardToColumn: (value: string) => void;
  drag: (e: any) => void;
  dragStart: (e: any, startColumn?: number) => void;
  handleDragOver: (e: any) => void;
  dragOver: (e: any) => void;
  dragLeave: (e: any) => void;
  dragEnter: (e: any, columnId: number) => void;
  dropDragging: (e: any) => void;
};

export const SyncContext = createContext<SyncContextType>(null!);

export const SyncProvider: React.FC = ({ children }) => {
  const { room, onError } = useVideoContext();

  const [syncClient, setSyncClient] = useState<SyncClient>();
  const [columnsList, setColumnsList] = useState<SyncListItem[]>([]);
  const [cardsList, setCardsList] = useState<SyncListItem[]>([]);
  const [changingColumnTitle, setChangingColumnTitle] = useState<string>('');
  const [changingCardTitle, setChangingCardTitle] = useState<boolean>(false);
  const [columnToDelete, setColumnToDelete] = useState<string>('');
  const [isAddingColumn, setIsAddingColumn] = useState<boolean>(false);
  const [isAddingCardText, setIsAddingCardText] = useState<boolean>(false);
  const [addingCardToColumn, setAddingCardToColumn] = useState<string>('');

  const [dragging, setDragging] = useState<any | undefined>();
  const [columnOrigin, setColumnOrigin] = useState<number>();
  const [droppingType, setDroppingType] = useState<string | undefined>();
  const [columnDestination, setColumnDestination] = useState<any | undefined>();
  const [cardDestination, setCardDestination] = useState<number | undefined>();
  const [cardList, setCardList] = useState<any | undefined>();
  const [destination, setDestination] = useState<number | undefined>();

  const handleSyncClient = async (token: string) => {
    // const client = new SyncClient(token)
    const client = new SyncClient(token, { loglevel: 'debug' });
    return client;
  };

  const connect = useCallback(
    (token: string) => {
      handleSyncClient(token)
        .then(client => {
          //@ts-ignore
          window.syncClient = client;
          setSyncClient(client);
        })
        //@ts-ignore
        .catch(e => {
          onError(new Error("There was a problem connecting to Twilio's sync service."));
        });
    },
    [onError]
  );

  // console.log(connect);

  useEffect(() => {
    if (room && syncClient) {
      // Get columns
      syncClient
        .list(`columns${room.sid}`)
        .then(function(list) {
          list
            //@ts-ignore
            .getItems()
            //@ts-ignore
            .then(function(columns) {
              setColumnsList(columns.items);
            });
        })
        .catch(e => {
          onError(new Error('There was a problem getting data from twilio sync.'));
        });

      // Get cards
      syncClient
        .list(`cards${room.sid}`)
        .then(function(list) {
          //@ts-ignore
          list.getItems().then(function(cards) {
            setCardsList(cards.items);
          });
        })
        .catch(e => {
          onError(new Error('There was a problem getting data from twilio sync.'));
        });

      syncClient!.list(`columns${room.sid}`).then(list => {
        list.on('itemRemoved', () => {
          updateColumns();
        });

        list.on('itemAdded', args => {
          // console.log('column added: ', args)
          updateColumns();
          setIsAddingColumn(false);
        });

        list.on('itemUpdated', item => {
          // console.log('column updated: ', item);
          updateColumns();
        });
      });

      syncClient!.list(`cards${room.sid}`).then(list => {
        list.on('itemRemoved', () => {
          updateCards();
        });

        list.on('itemAdded', card => {
          updateCards();
        });

        list.on('itemUpdated', card => {
          // console.log('video chat card updated: ', card)
          updateCards();
        });
      });

      const updateCards = async () => {
        const cards = await syncClient!.list(`cards${room.sid}`);
        // @ts-ignore
        const cardsList = await cards.getItems();
        setCardsList(cardsList.items);
      };
    }
  }, [room, syncClient, onError]);

  useEffect(() => {}, [columnsList]);

  const deleteColumn = async (index: number) => {
    const cards = await syncClient!.list(`cards${room!.sid}`);
    syncClient!.list(`columns${room!.sid}`).then(columns => {
      columns
        .mutate(index, (column: any) => {
          column.cards.forEach((card: any) => {
            cards.remove(card);
            return card;
          });
          return column;
        })
        .then(() => {
          columns.remove(index);
        });
    });
  };

  // add to function helper doc
  const updateColumns = async () => {
    const columns = await syncClient!.list(`columns${room!.sid}`);
    //@ts-ignore
    const columnsList = await columns.getItems();
    // console.log(columnsList)
    setColumnsList(columnsList.items);
    // console.log('column updated')
  };

  const addColumn = async (titleText: string) => {
    if (titleText === '') {
      setIsAddingColumn(false);
      return;
    }
    const columns = await syncClient!.list(`columns${room!.sid}`);
    // have to use ts-ignore here. typescript requires an argument be passed to getItems() even though it's not required by twilio.
    // @ts-ignore
    const columnsList = await columns.getItems();
    const columnsLength = columnsList.items.length;
    // if (columnsLength === 0) {

    // }
    columns.push({
      text: titleText,
      position: columnsLength,
      cards: [],
    });
  };

  const addCard = async (cardText: string, fromColumn: number) => {
    if (cardText === '') {
      return;
    }
    syncClient!.list(`cards${room!.sid}`).then((cards: any) => {
      cards
        .push({
          text: cardText,
        })
        .then((cardItem: any) => {
          return cardItem.index;
        })
        .then((index: any) => {
          syncClient!.list(`columns${room!.sid}`).then(columns => {
            columns.get(fromColumn).then((column: any) => {
              const cards = column.data.cards;
              cards.push(index);
              columns.update(fromColumn, { cards: cards });
            });
          });
        });
    });
  };

  const deleteCard = async (id: number, columnId: number) => {
    const cards = await syncClient!.list(`cards${room!.sid}`);
    syncClient!
      .list(`columns${room!.sid}`)
      .then(columns => {
        columns.get(columnId).then((column: any) => {
          const cards = column.data.cards;
          const cardIndex = cards.findIndex((card: any) => card === id);
          cards.splice(cardIndex, 1);
          columns.update(columnId, { cards: cards });
        });
      })
      .then(() => {
        cards.remove(id);
      });
  };

  const changeCardText = async (cardText: string, cardId: number) => {
    const cards = await syncClient!.list(`cards${room!.sid}`);
    cards.update(cardId, { text: cardText });
  };

  // drag and drop

  // might be unecessary
  const drag = (e: any) => {};

  const dragStart = (e: any, startColumn?: number) => {
    setDragging(e.target);
    setColumnOrigin(startColumn);
    // e.target.style.backgroundColor = 'red'
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const dragLeave = (e: any) => {};

  const dragOver = (e: any) => {
    e.preventDefault();
  };

  const dragEnter = (e: any, columnId: any) => {
    e.preventDefault();
    e.stopPropagation();
    const enterId: any = parseInt(e.currentTarget.id, 10);
    // const targetCardList = cardList.find((card: any)=> card.column === enterId);

    if (dragging.classList[0] === 'card' && e.target.classList[0] === 'card') {
      setDroppingType('card');
      setCardDestination(enterId);
      setColumnDestination(columnId);

      // move card to different column
    } else if (dragging.classList[0] === 'card' && e.target.classList[0] === 'column') {
      setCardDestination(enterId);
      setColumnDestination(columnId);
      setDroppingType('crossColumn');
    } else if (dragging.classList[0] === 'column') {
      setDestination(enterId);
      setDroppingType('column');
      setColumnDestination(columnId);
    }
  };

  const dropDragging = (e: any) => {
    // dragging.style.backgroundColor = null;
    const id = parseInt(dragging.id, 10);
    const destinationId = parseInt(e.target.id, 10);
    const copyList: Array<any> = [...columnsList];

    if (!destinationId) {
      return;
    }

    if (droppingType === 'column') {
      const currentList: Array<any> = copyList.sort((a, b) => a.data.position - b.data.position);
      const draggedColumnIndex = currentList.findIndex(column => column.index === id);
      const columnDestinationIndex = currentList.findIndex(column => column.index === columnDestination);
      const itemToInsert = currentList.splice(draggedColumnIndex, 1);
      currentList.splice(columnDestinationIndex, 0, itemToInsert[0]);

      syncClient!.list(`columns${room!.sid}`).then(columns => {
        currentList.forEach((column, i) => {
          columns.update(column.index, { position: i });
        });
      });
    }

    if (droppingType === 'crossColumn') {
      const toColumn = copyList.find(column => column.index === columnDestination);
      if (toColumn.data.cards.length === 0) {
      }
      syncClient!.list(`columns${room!.sid}`).then((columns: any) => {
        columns
          .get(columnOrigin)
          .then((column: any) => {
            const cards: Array<any> = column.data.cards;
            const removeIndex = cards.findIndex(card => card === id);
            cards.splice(removeIndex, 1);
            columns.update(columnOrigin, { cards: cards });
          })
          .then(() => {
            columns.get(destinationId).then((column: any) => {
              const cards = column.data.cards;
              cards.push(id);
              columns.update(destinationId, { cards: cards });
            });
          });
      });
    }

    if (droppingType === 'card') {
      const toColumn = copyList.find(column => column.index === columnDestination);

      syncClient!.list(`columns${room!.sid}`).then((columns: any) => {
        columns.get(columnOrigin).then((column: any) => {
          const cards: Array<any> = column.data.cards;
          const cardTargetId = cards.findIndex(card => card === cardDestination);
          const removeIndex = cards.findIndex(card => card === id);
          const movingCard = cards.splice(removeIndex, 1);
          columns.get(toColumn.index).then((column: any) => {
            const cards = column.data.cards;
            cards.splice(cardTargetId, 0, movingCard[0]);
            columns.update(toColumn.index, { card: cards });
          });
          columns.update(columnOrigin, { cards: cards });
          return movingCard;
        });
      });
    }
  };

  return (
    <SyncContext.Provider
      value={{
        connect,
        columnsList,
        cardsList,
        changingColumnTitle,
        setChangingColumnTitle,
        changingCardTitle,
        setChangingCardTitle,
        syncClient,
        deleteColumn,
        columnToDelete,
        setColumnToDelete,
        isAddingColumn,
        setIsAddingColumn,
        addColumn,
        addCard,
        deleteCard,
        isAddingCardText,
        setIsAddingCardText,
        changeCardText,
        addingCardToColumn,
        setAddingCardToColumn,
        drag,
        dragStart,
        handleDragOver,
        dragOver,
        dragLeave,
        dragEnter,
        dropDragging,
      }}
    >
      {children}
    </SyncContext.Provider>
  );
};
