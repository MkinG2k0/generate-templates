import { failedArgs, realArgs, realTestArgs } from './args.js'

export const processMock = { ...process }
processMock.argv = realArgs

export const processTestMock = { ...process }
processTestMock.argv = realTestArgs

export const processFailedMock = { ...process }
processFailedMock.argv = failedArgs
