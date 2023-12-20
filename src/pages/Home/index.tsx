import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { differenceInSeconds } from 'date-fns'
import { useEffect, useState } from 'react'

import {
    CountdownContainer,
    FormContainer,
    HomeContainer,
    MinuteAmmountInput,
    Separator,
    StartCountdownButton,
    StopCountdownButton,
    TaskInput
} from './styles'

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

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    })

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)
    const totalSeconds = activeCycle ? activeCycle.minuteAmount * 60 : 0

    useEffect(() => {
        let interval: number

        if (activeCycle) {
            interval = setInterval(() => {
                const secondsDifference = differenceInSeconds(
                    new Date(),
                    activeCycle.startDate
                )
                if (secondsDifference >= totalSeconds) {
                    setCycles((state) =>
                        state.map((cycle) => {
                            if (cycle.id === activeCycleId) {
                                return { ...cycle, completedAt: new Date() }
                            } else {
                                return cycle
                            }
                        })
                    )
                    
                    setActiveCycleId(null)
                    setAmountSecondsPassed(totalSeconds)
                    clearInterval(interval)

                } else {
                    setAmountSecondsPassed(secondsDifference)
                }
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }

    }, [activeCycle, totalSeconds, activeCycleId])

    console.log(cycles)

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
        setCycles( state =>
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

    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

    const minutesAmount = Math.floor(currentSeconds / 60)
    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    useEffect(() => {
        if (activeCycle) {
            document.title = `${minutes}:${seconds}`
        }
    }, [minutes, seconds, activeCycle])

    const task = watch('task')
    const isSubmitDisabled = !task


    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <FormContainer>
                    <label htmlFor="task">I'm working on</label>
                    <TaskInput
                        id="task"
                        list="task-suggestions"
                        placeholder="Insert the name of your project"
                        {...register('task')}
                        disabled={!!activeCycle}
                    />
                    <datalist id="task-suggestions">
                        <option value="Project 1"></option>
                        <option value="Project 2"></option>
                        <option value="Project 3"></option>
                    </datalist>

                    <label htmlFor="minuteAmmount">for</label>
                    <MinuteAmmountInput
                        type="number"
                        id="minuteAmmount"
                        placeholder="00"
                        step={5}
                        min={1}
                        max={60}
                        disabled={!!activeCycle}
                        {...register('minutesAmount', { valueAsNumber: true })}
                    />
                    <span>minutes</span>
                </FormContainer>

                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>

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
