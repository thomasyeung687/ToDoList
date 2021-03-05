'use strict'

/**
 * ToDoController
 * "handles all the callback stuff"
 * This class serves as the event traffic manager, routing all
 * event handling responses.
 * 
 * Ex: Someone clicks the 'undo button'? well call the undo function in the model (This is what controller does)
 */
export default class ToDoController {    
    constructor() {}

    setModel(initModel) {
        this.model = initModel;
        let appModel = this.model;

        // SETUP ALL THE EVENT HANDLERS SINCE THEY USE THE MODEL
        document.getElementById("add-list-button").onmousedown = function() {
            appModel.addNewList();
        }
        document.getElementById("undo-button").onmousedown = function() {
            appModel.undo();
        }
        document.getElementById("redo-button").onmousedown = function() {
            appModel.redo();
        }
        document.getElementById("delete-list-button").onmousedown = function() {
            appModel.removeCurrentList();
        }
        document.getElementById("add-item-button").onmousedown = function() {
            appModel.addNewItemTransaction();
        }
        document.getElementById("delete-list-button").onmousedown = function(){
            let modal = document.getElementById("myModal");
            var span = document.getElementsByClassName("close")[0];
            let myModalyesbtn = document.getElementById("myModalyes");
            let myModalnobtn = document.getElementById("myModalno");
            modal.style.display = "block";
            // When the user clicks on <span> (x), close the modal
            span.onclick = function() {
                modal.style.display = "none";
            }
            myModalnobtn.onclick = function() {
                modal.style.display = "none";
            }
            window.onclick = function(event) {
                if (event.target == modal) {
                  modal.style.display = "none";
                }
            }
            myModalyesbtn.onclick = function() {
                //send to model to delete current list.
                appModel.deleteCurrentList();
            }
        }
        document.getElementById("close-list-button").onmousedown = function(){
            console.log("clicked closelist?");
            document.getElementById("add-list-button").className = "material-icons todo_button";
            document.getElementById("add-list-button").style.color = "white";
            //when list closed there are no undo redos
            document.getElementById("undo-button").className = "material-icons noHover";
            document.getElementById("redo-button").className = "material-icons noHover";

            document.getElementById("add-item-button").className = "listeditdissapear";
            document.getElementById("delete-list-button").className = "listeditdissapear";
            document.getElementById("close-list-button").className = "listeditdissapear";
            appModel.clearTasksList();
            // document.getElementById("add-list-button").style = "noHover";
        }
        // document.getElementById("todo_button").ondblclick = function() {
        //     console.log('dblclicked');
        // }
    }
    
    // PROVIDES THE RESPONSE TO WHEN A USER CLICKS ON A LIST TO LOAD
    handleLoadList(listId) {
        // UNLOAD THE CURRENT LIST AND INSTEAD LOAD THE CURRENT LIST
        this.model.loadList(listId);
        this.model.swapToTop(listId);
        document.getElementById("add-list-button").className = "material-icons noHover";
        document.getElementById("add-item-button").className = "list-item-control material-icons todo_button";
        document.getElementById("delete-list-button").className = "list-item-control material-icons todo_button";
        document.getElementById("close-list-button").className = "list-item-control material-icons todo_button";
        document.getElementById("undo-button").className = "material-icons noHover";
        document.getElementById("redo-button").className = "material-icons noHover";
    }
    //create handle functions
    handleEditListName(listId, newListName){
        this.model.editListName(listId, newListName);
    }
    /**
     * This will handle the event of changing the name of description of list object. 
     * triggered upon the input type text of taskcol going out of focus. 
     * @param {*} listId,
     */
    handleEditTaskDescription(listItemId, newDescription){
        this.model.editTaskDescription(listItemId, newDescription);
    }

    handleEditTaskDueDate(listItemId, newDueDate){
        this.model.editTaskDueDate(listItemId, newDueDate);
    }

    handleEditTaskStatus(listItemId, newStatus){
        this.model.editTaskStatus(listItemId, newStatus);
    }
    handleMoveTaskUp(listItemId){
        this.model.moveTaskUp(listItemId);
    }

    handleMoveTaskDown(listItemId){
        this.model.moveTaskDown(listItemId);
    }

    handleDeleteTask(listItemId){
        this.model.deleteTask(listItemId);
    }
}
