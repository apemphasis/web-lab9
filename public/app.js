const updateCardHandle = (e) => {
    const cont = e.currentTarget.parentElement.parentElement
    const id = cont.getAttribute('data-id')
    document.getElementById('form').setAttribute('data-method', 'PUT')
    document.getElementById('form').setAttribute('data-id', id)
    
    const model = cont.getAttribute('data-model')
    const year = cont.getAttribute('data-year')
    document.getElementById("model-input").value = model
    document.getElementById("year-input").value = year
    OpenForm()
}

const deleteCardHandle = (e) => {
    const id = e.currentTarget.parentElement.parentElement.getAttribute('data-id')
    console.log(e);
    $.ajax(`http://localhost:3000/items/${id}`, {
        type: 'DELETE', 
        dataType: 'json',
        success: ShowAllCards, 
        error: ErrorHandle,
    })
}

const hashChangeResolve = () => {
    let URLHash = window.location.hash

    let stateStr = URLHash.substring(1)

    if (stateStr == "") {
        stateStr = ""
    }
    let pageNumber

    switch (true) {

        case /^\/items\/sorted\/page\/(\d+)$/.test(stateStr):
                pageNumber = stateStr.split('/')[4];
                console.log("get sorted page: " + pageNumber);
                $.ajax(`http://localhost:3000/items/sorted/page/${pageNumber}`,{
                    type: 'GET', dataType: 'html', success: InsertHTML, error: ErrorHandle
                })
            break;

        case /^\/items\/page\/(\d+)$/.test(stateStr):
                pageNumber = stateStr.split('/')[3];
                console.log("get page: " + pageNumber);
                $.ajax(`http://localhost:3000/items/page/${pageNumber}`,{
                    type: 'GET', dataType: 'html', success: InsertHTML, error: ErrorHandle
                })
            break;

        case /^\/items\/search\/(.+)$/.test(stateStr):
                const name = stateStr.split('/')[3];
                console.log("search by name: " + name);
                $.ajax(`http://localhost:3000/items/search/${name}`,{
                    type: 'GET', dataType: 'html', success: InsertHTML, error: ErrorHandle
                })
            break;

        case /^\/items$/.test(stateStr):
                console.log("get all");
                $.ajax("http://localhost:3000/items",{
                    type: 'GET', dataType: 'html', success: InsertHTML, error: ErrorHandle
                })
            break;

        case (/^\/items\/(\d+)$/.test(stateStr)):
                const id = stateStr.split('/')[2];
                console.log("get:", id);
                $.ajax(`http://localhost:3000/items/${id}`,{
                    type: 'GET', dataType: 'html', success: InsertHTML, error: ErrorHandle
                })
            break;
        
    
        default:
            break;
    }

}
window.onhashchange = hashChangeResolve
window.onload = hashChangeResolve

const ShowAllCards = () => {
    if (window.location.hash === "#/items"){
        hashChangeResolve()
    }
    else {
        location.hash = "/items"
    }
}

const InsertHTML = (data) => {
    document.getElementById("view").innerHTML = data
}

function ErrorHandle(jqXHR, StatusStr, ErrorStr) {
    alert(StatusStr + ' ' + ErrorStr)
    InsertHTML("Ошибка")
}

const CreateNew = () => {
    document.getElementById('form').setAttribute('data-method', 'POST')
    OpenForm()
}

const ShowById = () => {
    const id = prompt("enter id")
    if (id * 1 < 0) {
        alert("Ошибка: id должен быть больше 1")
        return
    }
    if (window.location.hash === "#/items/" + id) {
        hashChangeResolve()
    } else {
        location.hash = "/items/"+id
    }
}

const ShowByName = () => {
    const name = prompt("enter name")
    if (window.location.hash === "#/items/search/" + name) {
        hashChangeResolve()
    } else {
        location.hash = "/items/search/" + name
    }
}

const ShowDefault = () => {
    location.hash = "/items/page/1"
}

const isSorted = () => {
    return window.location.hash.split('/')[3] == "sorted"
} 

const ShowPage = (pageIdx) => {
    if (!isSorted()) {
        if (window.location.hash === "#/items/page/" + pageIdx) {
        hashChangeResolve()
        } else {
            location.hash = "/items/page/"+pageIdx
        }
    } else {
        if (window.location.hash === "#/items/sorted/page/" + pageIdx) {
        hashChangeResolve()
        } else {
            location.hash = "/items/sorted/page/"+pageIdx
        }
    }
    
}

const SortByModel = () => {
    location.hash = "/items/sorted/page/1"
}

// FORM CONTROLLS


const OpenForm = () => {
    document.getElementById("form-wrapper").classList.toggle("ds-none")
}

const CloseForm = () => {
    document.getElementById("form-wrapper").classList.toggle("ds-none")
    document.getElementById("model-input").value = ""
    document.getElementById("year-input").value = ""
}

const SubmitForm = () => {
    const model = document.getElementById("model-input").value
    const year = document.getElementById("year-input").value

    if (year === "" || model === ""){
        alert("Введены неверные значения")
        return
    }

    console.log(year, model);
    const method = document.getElementById("form").getAttribute("data-method")
    const id = document.getElementById("form").getAttribute('data-id')
    switch (method) {
        case 'POST':
            $.ajax("http://localhost:3000/items", {
                type: 'POST', 
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({"model": model, "year": year}),
                success: ShowAllCards, 
                error: ErrorHandle,
            })
            break;
        case 'PUT':
            $.ajax(`http://localhost:3000/items/${id}`, {
                type: 'PUT', 
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify({"model": model, "year": year}),
                success: ShowAllCards, 
                error: ErrorHandle,
            })
            break;
    
        default:
            break;
    }
    CloseForm()
}


