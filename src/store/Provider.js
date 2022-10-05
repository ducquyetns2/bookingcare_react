import { createContext, useReducer } from 'react'
import initState from './initState'
import reducer from './reducer'

export const Context = createContext()

function Provider({ children }) {
    const [state, dispatch] = useReducer(reducer, initState)
    return <Context.Provider value={[state, dispatch]}>
        {children}
    </Context.Provider>
}
export default Provider