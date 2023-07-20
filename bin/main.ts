#!/usr/bin/env node

import { Main } from '../src/index.js'

const main = new Main(process)
main.read()

// const cli = new Cli([{ title: 'вопрос', type: 'string' }])
// cli.start()
