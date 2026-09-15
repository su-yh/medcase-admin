import assert from 'node:assert/strict'
import test from 'node:test'
import { logoutAndClearSession } from './userSession.js'

test('continues after remote logout fails and clears the local session', async () => {
  let clearCount = 0

  await logoutAndClearSession(
    async () => {
      throw Object.assign(new Error('forbidden'), { status: 403 })
    },
    () => {
      clearCount += 1
    }
  )

  assert.equal(clearCount, 1)
})
