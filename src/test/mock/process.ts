import { failedArgs, realArgs } from './args.js'

export const processMock = { ...process }
processMock.argv = realArgs

export const processFailedMock = { ...process }
processFailedMock.argv = failedArgs
