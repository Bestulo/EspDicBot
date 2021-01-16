const file = await Deno.readTextFile("./espdic2.txt")
const values = file.split('\n').map(line => line.length > 0 ? line.split(':')[0].trim() : undefined)
const buff = JSON.stringify(values)
Deno.writeTextFile("./espdickeys2.json", buff)

export {}
