'use strict'

import ToDoList from './ToDoList.js'
import ToDoListItem from './ToDoListItem.js'
import jsTPS from '../common/jsTPS.js'
import AddNewItem_Transaction from './transactions/AddNewItem_Transaction.js'
import ChgTaskDescription_Transaction from './transactions/ChgTaskDescription_Transaction.js'
import ChgTaskDate_Transaction from './transactions/ChgTaskDate_Transaction.js'
import ChgTaskStatus_Transaction from './transactions/ChgTaskStatus_Transaction.js'
import MoveTaskUpDown_Transaction from './transactions/MoveTaskUpDown_Transaction.js'
import DeleteTask_Transaction from './transactions/DeleteTask_Transaction.js'
import EditListName_Transaction from './transactions/EditListName_Transaction.js'

/**
 * ToDoModel
 * "Make a model that minipulates all the data"
 * This class manages all the app data.
 * all of the functionality to update the state if you will.
 */
export default class ToDoModel {
    constructor() {
        // THIS WILL STORE ALL OF OUR LISTS
        this.toDoLists = [];

        // THIS IS THE LIST CURRENTLY BEING EDITED
        this.currentList = null;

        // THIS WILL MANAGE OUR TRANSACTIONS
        this.tps = new jsTPS();

        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST
        this.nextListId = 0;
        // WE'LL USE THIS TO ASSIGN ID NUMBERS TO EVERY LIST ITEM
        this.nextListItemId = 0;
    }

    /**
     * addItemToCurrentList
     * 
     * This function adds the itemToAdd argument to the current list being edited.
     * 
     * @param {*} itemToAdd A instantiated item to add to the list.
     */
    addItemToCurrentList(itemToAdd) {
        this.currentList.push(itemToAdd);
    }

    /**
     * addNewItemToCurrentList
     * 
     * This function adds a brand new default item to the current list.
     */
    addNewItemToCurrentList() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.addItemToList(this.currentList, newItem); //??????????????????WHERE IS THIS FUNCTION?
        return newItem;
    }

    /**
     * addItemToList
     * 
     * Function for adding a new item to the list argument using the provided data arguments.
     */
    addNewItemToList(list, initDescription, initDueDate, initStatus) {
        let newItem = new ToDoListItem(this.nextListItemId++);
        newItem.setDescription(initDescription);
        newItem.setDueDate(initDueDate);
        newItem.setStatus(initStatus);
        list.addItem(newItem);
        if (this.currentList) {
            this.view.refreshList(list);
        }
    }

    /**
     * addNewItemTransaction
     * 
     * Creates a new transaction for adding an item and adds it to the transaction stack.
     */
    addNewItemTransaction() {
        let transaction = new AddNewItem_Transaction(this);
        this.tps.addTransaction(transaction);
    }

    /**
     * addNewList
     * 
     * This function makes a new list and adds it to the application. The list will
     * have initName as its name.
     * 
     * @param {*} initName The name of this to add.
     */
    addNewList(initName) {
        let newList = new ToDoList(this.nextListId++);
        if (initName)
            newList.setName(initName);
        this.toDoLists.push(newList);
        this.view.appendNewListToView(newList);
        return newList;
    }

    /**
     * Adds a brand new default item to the current list's items list and refreshes the view.
     */
    addNewItem() {
        let newItem = new ToDoListItem(this.nextListItemId++);
        this.currentList.items.push(newItem);
        this.view.viewList(this.currentList);
        return newItem;
    }

    /**
     * Makes a new list item with the provided data and adds it to the list.
     */
    loadItemIntoList(list, description, due_date, assigned_to, completed) {
        let newItem = new ToDoListItem();
        newItem.setDescription(description);
        newItem.setDueDate(due_date);
        newItem.setAssignedTo(assigned_to);
        newItem.setCompleted(completed);
        this.addItemToList(list, newItem);
    }

    //Transaction stack needs to be reset in this function. When we load a new list, we should reset the transactions stack
    /**
     * Load the items for the listId list into the UI.
     * passes the listid not the index of the list.
     */
    loadList(listId) {
        let listIndex = -1;
        for (let i = 0; (i < this.toDoLists.length) && (listIndex < 0); i++) {
            if (this.toDoLists[i].id === listId)
                listIndex = i;
        }
        if (listIndex >= 0) {
            let listToLoad = this.toDoLists[listIndex];
            this.currentList = listToLoad;
            this.view.viewList(this.currentList);
        }
        this.tps.clearAllTransactions();
    }

    /**
     * Swaps the currentlist to the top of the list Array.
     */
    swapToTop(listId){
        let listIndex = -1;
        for (let i = 0; (i < this.toDoLists.length) && (listIndex < 0); i++) {
            if (this.toDoLists[i].id === listId)
                listIndex = i;
        }
        let thisList = this.toDoLists[listIndex];
        for(let i = listIndex; i > 0; i--){
            this.toDoLists[i] = this.toDoLists[i-1]; //shifting all lists from original list position to 0 one index up. 
        }
        this.toDoLists[0] = thisList;
        this.view.refreshLists(this.toDoLists);
    }

    /**
     * Redo the current transaction if there is one.
     */
    redo() {
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();
        }
        if(!this.tps.hasTransactionToRedo()){
            console.log("no more transactions to redo");
            document.getElementById("redo-button").className = "material-icons noHover";
        }
    }   


    //this removeItem is not a transaction for some reason so it is not currently undoable
    //big hint is addNewItemTransaction()
    /**
     * Remove the itemToRemove from the current list and refresh.
     */
    removeItem(itemToRemove) {
        this.currentList.removeItem(itemToRemove);
        this.view.viewList(this.currentList);
    }

    /**
     * Finds and then removes the current list.
     */
    removeCurrentList() {
        let indexOfList = -1;
        for (let i = 0; (i < this.toDoLists.length) && (indexOfList < 0); i++) {
            if (this.toDoLists[i].id === this.currentList.id) {
                indexOfList = i;
            }
        }
        this.toDoLists.splice(indexOfList, 1);
        this.currentList = null;
        this.view.clearItemsList();
        this.view.refreshLists(this.toDoLists);
    }

    // WE NEED THE VIEW TO UPDATE WHEN DATA CHANGES.
    setView(initView) {
        this.view = initView;
    }

    /**
     * Undo the most recently done transaction if there is one.
     */
    undo() {
        if (this.tps.hasTransactionToUndo()) {
            this.tps.undoTransaction();
        }
        if(!this.tps.hasTransactionToRedo()){
            console.log("no more transactions to redo");
            document.getElementById("undo-button").className = "material-icons noHover";
        }
    } 

    editTaskDescription(listItemId, newDescription){
        console.log("ChgTaskDescription_Transaction= listId:"+this.currentList.id+" listItemId:"+listItemId+" newDescription:"+newDescription);
        let transaction = new ChgTaskDescription_Transaction(this, listItemId, newDescription);
        this.tps.addTransaction(transaction);
    }

    /**
     * 
     * @param {*} listItemid id of listItem to edit.
     * @param {*} newText new Description to set listItem Description to
     */
    modifyItemDescription(listItemid, newText){
        this.currentList.getItemById(listItemid).setDescription(newText);
        this.view.viewList(this.currentList); //refreshes the workspace with theupdated current list.
    }

    editTaskDueDate(listItemId, newDueDate){
        console.log("ChgTaskDueDate_Transaction= listId:"+this.currentList.id+" listItemId:"+listItemId+" newDueDate:"+newDueDate);
        let transaction = new ChgTaskDate_Transaction(this, listItemId, newDueDate);
        this.tps.addTransaction(transaction);
    }

    /**
     * 
     * @param {*} listItemid id of listItem to edit.
     * @param {*} newText new Due Date to set listItem Due Date to
     */
    modifyItemDueDate(listItemid, newText){
        this.currentList.getItemById(listItemid).setDueDate(newText);
        this.view.viewList(this.currentList); //refreshes the workspace with theupdated current list.
    }

    editTaskStatus(listItemid, newStatus){
        console.log("ChgTaskStatus_Transaction listItemid:"+listItemid+" newStatus:"+newStatus);
        let transaction = new ChgTaskStatus_Transaction(this, listItemid, newStatus);
        this.tps.addTransaction(transaction);
    }

    /**
     * 
     * @param {*} listItemid id of listItem to edit.
     * @param {*} newText new status to set listItem status to
     */
    modifyItemStatus(listItemid, newText){
        this.currentList.getItemById(listItemid).setStatus(newText);
        this.view.viewList(this.currentList); //refreshes the workspace with theupdated current list.
    }
    
    moveTaskUp(listItemid){
        let transaction = new MoveTaskUpDown_Transaction(this, listItemid, 'up');
        this.tps.addTransaction(transaction);
    }

    moveTaskDown(listItemid){
        let transaction = new MoveTaskUpDown_Transaction(this, listItemid, 'down');
        this.tps.addTransaction(transaction);
    }

    deleteTask(listItemid){
        let transaction = new DeleteTask_Transaction(this, listItemid);
        this.tps.addTransaction(transaction);
    }

    modifyTaskPosition(listItemid, action){
        let moved = 0;
        if(action == 'up'){
            moved = this.currentList.moveItemUp(listItemid);
        }else if(action == 'down'){
            moved = this.currentList.moveItemDown(listItemid);
        }
        console.log(this.currentList);
        this.view.viewList(this.currentList); //refreshes with the new indexes of each item.
        return moved;
    }
    getListById(listId){
        // console.log("called?");
        for(let i = 0; i < this.toDoLists.length; i++){
            if(this.toDoLists[i].id === listId){
                // console.log(this.toDoLists[i]);
                return this.toDoLists[i];
            }
        }
        return -1;
    }
    // let list = this.getListById(listId);
    // list.setName(newListName);
    editListName(listId, newListName){
        let Transaction = new EditListName_Transaction(this, listId, newListName);
        this.tps.addTransaction(Transaction);
    }

    //REMOVES ALL THE TASKS FROM THE WORKSPACE
    clearTasksList(){
        document.getElementById("todo-lists-list").firstChild.className ="todo_button textCard";
        this.view.clearTasksList();
    }

    //DELTES CURRENT LIST AFTER USER CLICKS YES ON MODAL
    deleteCurrentList(){
        this.toDoLists.splice(0,1); //at index 0 remove 1. the list we would be trying to remove must be at the top bc we do swaptotop.
        this.view.refreshLists(this.toDoLists); //reloads the sidebar with the updated list to todolists.
        this.view.clearTasksList(); //clears the workspace because we have just deleted the list
        document.getElementById("myModal").style.display = "none"; //closes the modal
        document.getElementById("undo-button").className = "material-icons noHover";
        document.getElementById("redo-button").className = "material-icons noHover";
    }
}