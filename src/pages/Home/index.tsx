import { Play } from 'phosphor-react'
import {
    CountdownContainer,
    FormContainer,
    HomeContainer,
    MinuteAmmountInput,
    Separator,
    StartCountdownButton,
    TaskInput
} from './styles'

export function Home() {
    return (
        <HomeContainer>
            <form action="">
                <FormContainer>
                    <label htmlFor="task">I'm working on</label>
                    <TaskInput
                        id="task"
                        placeholder="Insert the name of your project"
                        list='task-suggestions'
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

                <StartCountdownButton type="submit">
                    <Play size={24} />
                    Start
                </StartCountdownButton>
            </form>
        </HomeContainer>
    )
}
