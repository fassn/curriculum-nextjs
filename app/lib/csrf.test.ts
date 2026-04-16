import { describe, expect, it } from 'vitest'
import { areCsrfTokensEqual } from './csrf'

describe('areCsrfTokensEqual', () => {
    it('return true for equal tokens', () => {
        expect(areCsrfTokensEqual('abc123', 'abc123')).toBe(true)
    })

    it('return false for different tokens', () => {
        expect(areCsrfTokensEqual('abc123', 'abc124')).toBe(false)
    })

    it('return false for different length tokens', () => {
        expect(areCsrfTokensEqual('abc123', 'abc1234')).toBe(false)
    })
})
