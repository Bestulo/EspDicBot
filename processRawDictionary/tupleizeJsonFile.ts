import { arrIntoIndexedTuples } from '../src/dictools/utils.ts'
const text = await Deno.readTextFile('./espdicvalues.json')
const json = JSON.parse(text)
Deno.writeTextFile('./espdicvaluesTupleized.json', JSON.stringify(arrIntoIndexedTuples(json)))

export {}