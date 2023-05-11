const def = '_node _path /config/config.js '
// tempName
export const mockArgs = `${def}
   tempName --flagTemplate  nameGenerate --flagName ./pathToGen  nameGenerate-2  ./pathTo/ --flagPath ,  
   tempName2 --flagTemplate  nameGenerate --flagName ./pathToGen  nameGenerate-2  ./pathTo/ --flagPath  
  `.split(' ')

export const realArgs = '_node _path /config/config.js page Main Auth '.split(' ')
export const realTestArgs =
  '_node _path /config/config.js test NewName NewName-2 , page newPage '.split(' ')
export const failedArgs = '_node _path /another_path/config.js page comp name: Main Auth '.split(
  ' ',
)
