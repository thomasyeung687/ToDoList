'use strict'

/**
 * ToDoView
 * Minipulate the DOM through this file
 * This class generates all HTML content for the UI.
 */
export default class ToDoView {
    constructor() {}

    // ADDS A LIST TO SELECT FROM IN THE LEFT SIDEBAR
    appendNewListToView(newList) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");
        
        // MAKE AND ADD THE NODE
        let newListId = "todo-list-" + newList.id;
        let listElement = document.createElement("div");
        listElement.setAttribute("id", newListId);
        listElement.setAttribute("class", "todo_button textCard");
        // listElement.setAttribute("contenteditable","true");
        listElement.appendChild(document.createTextNode(newList.name));
        let textDiv = document.createElement("div");
        listsElement.appendChild(listElement);

        // SETUP THE HANDLER FOR WHEN SOMEONE MOUSE CLICKS ON OUR LIST
        let thisController = this.controller;
        // listElement.addEventListener('dblclick', ()=>{
        //     console.log("db clicked");
        //     let listElementToEdit = listsElement.getElementById("todo-list-"+newList.id);
        //     var inputTypeText = document.createElement("input");
        //     inputTypeText.setAttribute("type", "text");
        //     inputTypeText.setAttribute("value", newList.name);
        //     listsElement.replaceChild(inputTypeText, listElementToEdit);

        //     inputTypeText.addEventListener('focusout', (event)=>{
        //         console.log(inputTypeText.value);
        //     })
        // })
        let clicks = 0;
        listElement.addEventListener('click',(event)=> {
            clicks++;
            setTimeout(function(){
                if(clicks === 2){
                    console.log("db clicked");
                    let listElementToEdit = document.getElementById("todo-list-"+newList.id);
                    var inputTypeText = document.createElement("input");
                    inputTypeText.setAttribute("type", "text");
                    inputTypeText.setAttribute("value", newList.name);
                    listsElement.replaceChild(inputTypeText, listElementToEdit);
                    inputTypeText.addEventListener('focusout', (event)=>{
                        console.log(inputTypeText.value+" listid ="+newList.id);
                        thisController.handleEditListName(newList.id, inputTypeText.value);
                    })
                }else if (clicks === 1 && clicks != 2) {
                    console.log("single clicked");
                    thisController.handleLoadList(newList.id);//call moveListToTop function.
                    document.getElementById(newListId).className = "todo_button textCard listselected";
                }
            }, 250); 
        })
        
    }

    // REMOVES ALL THE LISTS FROM THE LEFT SIDEBAR
    clearItemsList() {
        let itemsListDiv = document.getElementById("todo-list-items-div");
        // BUT FIRST WE MUST CLEAR THE WORKSPACE OF ALL CARDS BUT THE FIRST, WHICH IS THE ITEMS TABLE HEADER
        let parent = itemsListDiv;
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    //REMOVES ALL THE TASKS FROM THE WORKSPACE
    clearTasksList(){
        let itemsListDiv = document.getElementById("todo-list-items-div");
        while (itemsListDiv.firstChild) {
            itemsListDiv.removeChild(itemsListDiv.firstChild);
        }
    }

    // REFRESHES ALL THE LISTS IN THE LEFT SIDEBAR
    refreshLists(lists) {
        // GET THE UI CONTROL WE WILL APPEND IT TO
        let listsElement = document.getElementById("todo-lists-list");
        listsElement.innerHTML = "";

        for (let i = 0; i < lists.length; i++) {
            let list = lists[i];
            this.appendNewListToView(list);
        }
    }

    // LOADS THE list ARGUMENT'S ITEMS INTO THE VIEW
    viewList(list) {
        // WE'LL BE ADDING THE LIST ITEMS TO OUR WORKSPACE
        let itemsListDiv = document.getElementById("todo-list-items-div");

        // GET RID OF ALL THE ITEMS
        this.clearItemsList();

        for (let i = 0; i < list.items.length; i++) {
            // NOW BUILD ALL THE LIST ITEMS
            let listItem = list.items[i]; //                    vvvvvv  dynamically generated id for the model (model handles data)
            let listItemElement = "<div id='todo-list-item-" + listItem.id + "' class='list-item-card'>" //these divs are the rows in the table of todo
                                + "<div class='task-col todo_button textCard' id='task-col-" + listItem.id + "'>" + listItem.description + "</div>"
                                + "<div class='due-date-col todo_button textCard' id='due-date-col-" + listItem.id + "'>" + listItem.dueDate + "</div>"
                                + "<div class='status-col todo_button textCard' id='status-col-" + listItem.id + "'>" + listItem.status + "</div>"
                                + "<div class='list-controls-col' id='list-controls-col'>"
                                + " <div class='list-item-control material-icons todo_button' id='arrow-up-" + listItem.id + "'>keyboard_arrow_up</div>"
                                + " <div class='list-item-control material-icons todo_button' id='arrow-down-" + listItem.id + "'>keyboard_arrow_down</div>"
                                + " <div class='list-item-control material-icons todo_button' id='delete-" + listItem.id + "'>close</div>"
                                + " <div class='list-item-control'></div>"
                                + " <div class='list-item-control'></div>"
                                + "</div>";
            itemsListDiv.innerHTML += listItemElement;
        }
        let myController = this.controller;
        for (let i = 0; i < list.items.length; i++) {
            
            let listItem = list.items[i];
            let listItemDiv = document.getElementById('todo-list-item-' + listItem.id);
            let taskCol = document.getElementById('task-col-'+ listItem.id);
            let dueDateCol = document.getElementById('due-date-col-' + listItem.id);
            let statusCol = document.getElementById('status-col-' + listItem.id);
            let arrowUp = document.getElementById('arrow-up-' + listItem.id );
            let arrowDown = document.getElementById('arrow-down-' + listItem.id );
            let deleteButton = document.getElementById('delete-' + listItem.id );
            if(i == 0){
                arrowUp.className = "list-item-control material-icons noHover";
            }
            if(i == list.items.length-1){
                arrowDown.className = "list-item-control material-icons noHover";
            }
            if(listItem.status == "complete"){
                statusCol.style.color = "#8ed4f8";
            }else{
                statusCol.style.color = "#f5bc75";
            }
            taskCol.onmousedown = function (event) {
                console.log("taskcol-pressed id="+listItem.id);
                // taskCol.removeChild(taskCol.firstChild);
                let taskColOld = listItemDiv.children[0];
                var inputTypeText = document.createElement("input");
                inputTypeText.setAttribute("type", "text");
                inputTypeText.setAttribute("value", listItem.description);
                inputTypeText.className = "task-col inputs";
                // inputTypeText.onclick = function (event){
                //     console.log("changing taskDesc id="+listItem.id);
                // }
                inputTypeText.addEventListener('focusout', (event)=>{
                    console.log("focus out list.id = "+list.id+" id="+listItem.id + " value:"+inputTypeText.value);
                    myController.handleEditTaskDescription(listItem.id, inputTypeText.value) // passing list.id, listItem.id, and newDescription
                })
                listItemDiv.replaceChild(inputTypeText, taskColOld);
            }
            dueDateCol.onmousedown = function (event) {
                console.log("dueDateCol id="+listItem.id);
                let DateColOld = listItemDiv.children[1];
                var inputTypeDate = document.createElement("input");
                inputTypeDate.setAttribute("type", "date");
                inputTypeDate.setAttribute("value", listItem.dueDate);
                inputTypeDate.className = "due-date-col inputs";
                inputTypeDate.addEventListener("focusout", (event)=>{
                    console.log("focus out list.id:"+list.id+" listItem.id:"+listItem.id+" value:"+inputTypeDate.value);
                    myController.handleEditTaskDueDate(listItem.id, inputTypeDate.value);
                })
                listItemDiv.replaceChild(inputTypeDate, DateColOld);
            }
            statusCol.onmousedown = function (event) {
                let oldStatus = listItemDiv.children[2];
                console.log("statusCol id="+listItem.id+" innerhtml"+oldStatus.textContent);

                let inputTypeDropDown = document.createElement("select");
                let inputOption1 = document.createElement("option");
                inputOption1.setAttribute("value", "complete");
                if(oldStatus.textContent == "complete"){
                    inputOption1.setAttribute("selected", "true");
                }
                let inputOption1Text = document.createTextNode("complete");
                inputOption1.appendChild(inputOption1Text);

                let inputOption2 = document.createElement("option");
                inputOption2.setAttribute("value", "incomplete");
                if(oldStatus.textContent == "incomplete"){
                    inputOption2.setAttribute("selected", "true");
                }
                let inputOption2Text = document.createTextNode("incomplete");
                inputOption2.appendChild(inputOption2Text);

                inputTypeDropDown.appendChild(inputOption1);
                inputTypeDropDown.appendChild(inputOption2);
                
                inputTypeDropDown.addEventListener("focusout", (event)=>{
                    console.log("handleEditTaskStatus listItem.id="+listItem.id+" value:"+inputTypeDropDown.value);
                    myController.handleEditTaskStatus(listItem.id, inputTypeDropDown.value);
                })
                inputTypeDropDown.className = "status-col inputs";
                listItemDiv.replaceChild(inputTypeDropDown, oldStatus);
            }
            arrowUp.onmousedown = function (event) {
                console.log("arrowUp id="+listItem.id);
                myController.handleMoveTaskUp(listItem.id);
            }
            arrowDown.onmousedown = function (event) {
                console.log("arrowDown id="+listItem.id);
                myController.handleMoveTaskDown(listItem.id);
            }
            deleteButton.onmousedown = function (event) {
                console.log("deleteButton id="+listItem.id);
                myController.handleDeleteTask(listItem.id);
            }

        }
    }

    // THE VIEW NEEDS THE CONTROLLER TO PROVIDE PROPER RESPONSES
    setController(initController) {
        this.controller = initController;
    }
}