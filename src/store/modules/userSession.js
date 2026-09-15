export async function logoutAndClearSession(logoutRequest, clearSession) {
  try {
    await logoutRequest()
  } catch {
    // A failed remote logout must not keep the local session alive.
  } finally {
    clearSession()
  }
}
