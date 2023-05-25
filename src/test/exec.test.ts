import { exec } from 'child_process'

test('exec', async () => {
  await new Promise((resolve) => {
    exec('eslint --fix src/**/*.ts*', (error, stdout, stderr) => {
      console.log('asdasd')
      console.log(stdout, stderr)
      resolve(stdout)
    })
  })
})
