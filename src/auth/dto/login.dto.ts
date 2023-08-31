export class LoginAuthDto{
    user: string
    password: string
}

export class RegisterAuthDto{
    user: string
    password: string
    rol: string
    status: Boolean
    code: number
    business: string
    name: string
}
