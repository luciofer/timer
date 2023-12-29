import { useContext } from 'react'
import { HistoryContainer, HistoryList, Status } from './styles'
import { CyclesContext } from '../../contexts/CyclesContext'
import { formatDistanceToNow } from 'date-fns'

export function History() {
    const { cycles } = useContext(CyclesContext)

    return (
        <HistoryContainer>
            <h1>History</h1>

            <HistoryList>
                <table>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Duration</th>
                            <th>Start</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {cycles.map((cycle) => {
                            return (
                                <tr key={cycle.id}>
                                    <td>{cycle.task}</td>
                                    <td>{cycle.minuteAmount} minutes</td>
                                    <td>{formatDistanceToNow(cycle.startDate, {
                                        addSuffix: true
                                    })}</td>
                                    <td>
                                        {cycle.completedAt && (
                                            <Status $statusColor="green">
                                                Completed
                                            </Status>
                                        )}
                                        {cycle.interruptedDate && (
                                            <Status $statusColor="red">
                                                Interrupted
                                            </Status>
                                        )}
                                        {!cycle.completedAt &&
                                            !cycle.interruptedDate && (
                                                <Status $statusColor="yellow">
                                                    In progress
                                                </Status>
                                            )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </HistoryList>
        </HistoryContainer>
    )
}
