import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const filename = path.join(__dirname, "db.json")
const configname = path.join(__dirname, "config.json")

const writeData = data => fs.writeFile(filename, JSON.stringify(data))

const readData = async () => {
    const data = await fs.readFile(filename, 'utf-8')
    if (!data) {
        return null
    }
    return JSON.parse(data)
}

const getAll = readData

const getPage = async (start) => {
    const data = await getAll()
    const pages = Math.ceil( data.length / 10.0 )
    const res = {data: data.slice((start-1)*10, start*10), active: start, pages: pages}

    return (res.data.length == 0 ? null : res)
}

const getSortedPage = async (start) => {
    const data = await getAll()
    const pages = Math.ceil( data.length / 10.0 )
    data.sort((a, b) => a.model.localeCompare(b.model))
    const res = {data: data.slice((start-1)*10, start*10), active: start, pages: pages}

    return (res.data.length == 0 ? null : res)
}

const getById = async (id) => {
    const data = await readData()
    for (const el of data) {
        if (el.id == id) {
            return el
        }
    }
    return null
}

const getByName = async (model) => {
    const data = await readData() 
    model = model.replaceAll('%20', ' ');
    console.log(model);
    let arr = []
    for (const el of data) {
        if (el.model === model) {
            arr.push(el)
        }
    }
    const res = {data: arr, active: 0, pages: 0}

    return (res.data.length == 0 ? null : res)
    return (res.length == 0 ? null : res)
}

const updateById = async (id, value) => {
    let data = await readData()
    let flag = true
    for (let el of data) {
        if (el.id == id) {
            el.model = value.model
            el.year = value.year
            flag = false
        }
    }
    if (flag) {
        return null
    }
    await writeData(data)
    return { "id": id, "model": value["model"], "year": value["year"]}
}

const deleteById = async (id) => {
    let data = await readData()
    let index = -1
    for (let i = 0; i < data.length; i++) {
        if (data[i].id == id) {
            index = i
        }
    }

    if (index == -1) {
        return null
    }

    data = data.splice(index, 1)
    await writeData(data)
    return elem
}

const createElem = async (value) => {
    const config_data = await fs.readFile(configname, 'utf-8')
    let lastID = JSON.parse(config_data).lastID + 1
    let data = await readData()
    if (!data) {
        data = []
    }
    const elem = {
        "id": lastID,
        "model": value["model"],
        "year": value["year"]
    }
    data.push(elem)
    await writeData(data)
    await fs.writeFile(configname, JSON.stringify({"lastID": lastID}))
    return elem
}

export { getAll, getById, updateById, deleteById, createElem, getByName, getPage, getSortedPage }