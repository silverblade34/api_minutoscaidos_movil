export enum TaskStatus{
    PENDING='PENDING',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE= 'DONE'
}

export class Task{
    id: String
    title: String
    description: String
    status: TaskStatus
}