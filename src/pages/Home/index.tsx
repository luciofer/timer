import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import {
    CountdownContainer,
    FormContainer,
    HomeContainer,
    MinuteAmmountInput,
    Separator,
    StartCountdownButton,
    TaskInput
} from './styles'

const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, "Inform the task"),
    minutesAmount: zod.number().min(5).max(60)
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
    
    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    })

    function handleCreateNewCycle(data: NewCycleFormData) {
        console.log(data)
        reset()
    }

    const task = watch('task')
    const isSubmitDisabled = !task

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <FormContainer>
                    <label htmlFor="task">I'm working on</label>
                    <TaskInput
                        id="task"
                        list='task-suggestions'
                        placeholder="Insert the name of your project"
                        {...register('task')}
                    />
                    <datalist id='task-suggestions'>
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
                        min={5}
                        max={60}
                        {...register('minutesAmount', { valueAsNumber: true })}
                    />
                    <span>minutes</span>
                </FormContainer>

                <CountdownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountdownContainer>

                <StartCountdownButton type="submit" disabled={isSubmitDisabled } >
                    <Play size={24} />
                    Start
                </StartCountdownButton>
            </form>
        </HomeContainer>
    )
}
