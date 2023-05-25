const def = '_node _path /config/config.js '
// tempName
export const mockArgs = `${def}
   tempName --flagTemplate  nameGenerate --flagName ./pathToGen  nameGenerate-2  ./pathTo/ --flagPath ,  
   tempName2 --flagTemplate-2  nameGenerate --flagName-2 ./pathToGen  nameGenerate-2  ./pathTo/ --flagPath-2  
  `.split(' ')

export const realArgs = '_node _path /config/config.js page Main Auth '.split(' ')
export const realTestArgs =
  '_node _path /config/config.js test --type newName --style new-name-2 --flag-name-2 ./path --flag-path, page --flag-page newPage --flag-comp-page'.split(
    ' ',
  )
// --type
//
export const failedArgs = '_node _path /another_path/config.js page comp name: Main Auth '.split(
  ' ',
)
