import { ReactNode, createContext, useState } from "react"

interface Cycle {
    id: string
    task: string
    minuteAmount: number
    startDate: Date
    interruptedDate?: Date
    completedAt?: Date
}

interface createCycleData{
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
    setActId: (seconds: string | null) => void
    createNewCycle: (data: createCycleData) => void
    interruptCurrentCycle: () => void
}

interface CyclesContextProviderProps{
    children: ReactNode
}


export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({ children }:CyclesContextProviderProps){
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    function markCurrentCycleAsFinished() {
        setCycles((state) =>
            state.map((cycle) => {
                if (cycle.id === activeCycleId) {
                    return { ...cycle, completedAt: new Date() }
                } else {
                    return cycle
                }
            })
        )
    }

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function setActId(id: string | null) {
        setActiveCycleId(id)
    }


    function createNewCycle(data: createCycleData) {
        const id = String(new Date().getTime())
        const newCycle: Cycle = {
            id: id,
            task: data.task,
            minuteAmount: data.minutesAmount,
            startDate: new Date()
        }
        setCycles((state) => [...state, newCycle])
        setActiveCycleId(id)
        setAmountSecondsPassed(0)
    }

    function interruptCurrentCycle() {
        setCycles((state) =>
            state.map((cycle) => {
                if (cycle.id === activeCycleId) {
                    return { ...cycle, interruptedDate: new Date() }
                } else {
                    return cycle
                }
            })
        )

        setActiveCycleId(null)
    }

    return (
        <CyclesContext.Provider
                    value={{
                        cycles,
                        activeCycle,
                        activeCycleId,
                        markCurrentCycleAsFinished,
                        amountSecondsPassed,
                        setActId,
                        setSecondsPassed,
                        createNewCycle,
                        interruptCurrentCycle
                    }}
                >
                    {children}
        </CyclesContext.Provider>
    )
}