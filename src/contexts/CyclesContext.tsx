import { ReactNode, createContext, useState, useReducer } from 'react'

interface Cycle {
    id: string
    task: string
    minuteAmount: number
    startDate: Date
    interruptedDate?: Date
    completedAt?: Date
}

interface createCycleData {
    task: string
    minutesAmount: number
}

interface CyclesContextType {
    cycles: Cycle[]
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    amountSecondsPassed: number
    markCurrentCycleAsFinished: () => void
    setSecondsPassed: (seconds: number) => void
    createNewCycle: (data: createCycleData) => void
    interruptCurrentCycle: () => void
}
export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children: ReactNode
}


interface CycleState {
    cycles: Cycle[]
    activeCycleId: string | null
}


export function CyclesContextProvider({
    children
}: CyclesContextProviderProps) {

    const [cyclesState, dispatch] = useReducer((state: CycleState, action: any) => {

        switch (action.type) {
            case 'ADD_NEW_CYCLE':
                return {
                    ...state,
                    cycles: [...state.cycles, action.payload.newCycle],
                    activeCycleId: action.payload.newCycle.id
                }
            case 'INTERRUPT_CURRENT_CYCLE':
                return {
                    ...state,
                    cycles: state.cycles.map((cycle) => {
                                if (cycle.id === state.activeCycleId) {
                                    return { ...cycle, interruptedDate: new Date() }
                                } else {
                                    return cycle
                                }
                            }),
                    activeCycleId: null
                }
            case 'MARK_CURRENT_CYCLE_AS_FINISHED':
                return {
                    ...state,
                    cycles: state.cycles.map((cycle) => {
                                if (cycle.id === state.activeCycleId) {
                                    return { ...cycle, completedAt: new Date() }
                                } else {
                                    return cycle
                                }
                            }),
                    activeCycleId: null
                }
            default:
                return state
        }
    }, {
        cycles: [],
        activeCycleId: null
    })
    
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const { cycles, activeCycleId } = cyclesState
    
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    function markCurrentCycleAsFinished() {
        dispatch({
            type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
            payload: {
                activeCycleId
            }
        })
    }

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }


    function createNewCycle(data: createCycleData) {
        const id = String(new Date().getTime())
        const newCycle: Cycle = {
            id: id,
            task: data.task,
            minuteAmount: data.minutesAmount,
            startDate: new Date()
        }

        dispatch({
            type: 'ADD_NEW_CYCLE',
            payload: {
                newCycle
            }
        })

        setAmountSecondsPassed(0)
    }

    function interruptCurrentCycle() {
        dispatch({
            type: 'INTERRUPT_CURRENT_CYCLE',
            payload: {
                activeCycleId
            }
        })
    }

    return (
        <CyclesContext.Provider
            value={{
                cycles,
                activeCycle,
                activeCycleId,
                markCurrentCycleAsFinished,
                amountSecondsPassed,
                setSecondsPassed,
                createNewCycle,
                interruptCurrentCycle
            }}
        >
            {children}
        </CyclesContext.Provider>
    )
}
