#!/usr/bin/env node

import { Main } from '../src/modules/main-class.js'

const main = new Main(process)
main.read()
