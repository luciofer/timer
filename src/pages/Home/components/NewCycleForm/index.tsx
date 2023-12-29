import { FormContainer, MinuteAmmountInput, TaskInput } from './styles'
import { useContext } from 'react'
import { CyclesContext } from '../../../../contexts/CyclesContext'
import { useFormContext } from 'react-hook-form'

export function NewCycleForm() {
    const { activeCycle } = useContext(CyclesContext)
    const { register } = useFormContext()

    return (
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
    )
}
