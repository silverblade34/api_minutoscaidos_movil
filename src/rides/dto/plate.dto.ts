import { IsNotEmpty } from 'class-validator'

export class plateReportDto {
    @IsNotEmpty()
    plate: string
}