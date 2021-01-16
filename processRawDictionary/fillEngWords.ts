const file = await Deno.readTextFile("./espdic2.txt")
const values = file.split('\n').map(line => line.length > 0 ? line.split(':')[1].trim() : undefined)
const buff = JSON.stringify(values)
Deno.writeTextFile("./espdicvalues2.json", buff)

/**
* If you have the following error: Cannot read property 'trim' of undefined
* There's most likely one or more problematic entries in the dictionary.
* Run the following code to find which lines are causing the trouble.
**/

// const values = file.split('\n').forEach((line, index) => line.split(':')[1] || console.log(index))

export {}