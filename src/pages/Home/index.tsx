import { HandPalm, Play } from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { createContext, useState } from 'react'

import {
    HomeContainer,
    StartCountdownButton,
    StopCountdownButton
} from './styles'
import { NewCycleForm } from './components/NewCycleForm'
import { Countdown } from './components/Countdown'

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Inform the task'),
    minutesAmount: zod.number().min(1).max(60)
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
    id: string
    task: string
    minuteAmount: number
    startDate: Date
    interruptedDate?: Date
    completedAt?: Date
}

interface CyclesContextType {
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    amountSecondsPassed: number

    markCurrentCycleAsFinished: () => void
    setSecondsPassed: (seconds: number) => void
    setActId: (seconds: string | null) => void
}

export const CyclesContext = createContext({} as CyclesContextType)

export function Home() {
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    })

    const { handleSubmit, watch, reset } = newCycleForm

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

    function handleCreateNewCycle(data: NewCycleFormData) {
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
        reset()
    }

    function handleInterruptCycle() {
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

    const task = watch('task')
    const isSubmitDisabled = !task

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <CyclesContext.Provider
                    value={{
                        activeCycle,
                        activeCycleId,
                        markCurrentCycleAsFinished,
                        amountSecondsPassed,
                        setActId,
                        setSecondsPassed
                    }}
                >
                    <FormProvider {...newCycleForm}>
                        <NewCycleForm />
                    </FormProvider>
                    <Countdown />
                </CyclesContext.Provider>

                {activeCycle ? (
                    <StopCountdownButton
                        type="button"
                        onClick={handleInterruptCycle}
                    >
                        <HandPalm size={24} />
                        Stop
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton
                        type="submit"
                        disabled={isSubmitDisabled}
                    >
                        <Play size={24} />
                        Start
                    </StartCountdownButton>
                )}
            </form>
        </HomeContainer>
    )
}
