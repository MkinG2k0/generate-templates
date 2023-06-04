#!/usr/bin/env node

import { Cli } from '../src/modules/cli.js'

// const main = new Main(process)
// main.read()

const cli = new Cli([{ title: 'вопрос', type: 'string' }])
cli.start()
