import { createContext, useContext, useReducer } from 'react';
import { Action } from './actions';
import { TState, TPack } from './types';

const StoreContext = createContext({} as any);
const DispatchContext = createContext({} as any);


const initialState: TState = {
    packs: [],
};


// TODO fix props type
export const StoreProvider = ({ children }: any) => {
    const [tasks, dispatch] = useReducer(
        storeReducer,
        initialState // initial state
    );

    return (
        <StoreContext.Provider value={tasks}>
            <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    return useContext(StoreContext);
};

export const useSelector = (selector: (arg0: TState) => any) => {
    return selector(useContext(StoreContext));
};

export const useDispatch = () => {
    return useContext(DispatchContext);
};

function storeReducer(state: TState, action: any) {
    switch (action.type) {
        case Action.POPULATE_PACKS: {
            return {
                ...state,
                packs: action.packs,
            };
        }
        case Action.ADD_PACK: {
            return {
                ...state,
                packs: [
                    ...state.packs,
                    action.pack
                ]
            };
        }
        case 'changed': {
            return state.map((t) => {
                if (t.id === action.task.id) {
                    return action.task;
                } else {
                    return t;
                }
            });
        }
        case 'deleted': {
            return tasks.filter((t) => t.id !== action.id);
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}

