
import { defineEventHandler, getRequestHeader, createError } from 'h3'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_super_segura'

export default defineEventHandler(async (event) => {
    const authHeader = getRequestHeader(event, 'Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { valid: false }
    }

    const token = authHeader.split(' ')[1]

    try {
        jwt.verify(token, JWT_SECRET)
        return { valid: true }
    } catch (error) {
        return { valid: false }
    }
})
