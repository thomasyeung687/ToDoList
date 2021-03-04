'use strict'

/**
 * ToDoList.js
 * Data type
 * This class represents a list with all the items in our todo list.
 * 
 * @author McKilla Gorilla
 */
export default class ToDoList {
    /**
     * The constructor creates a default, empty list.
     */
    constructor(initId) {
        this.id = initId;
        this.name = "Unnknown";
        this.items = [];
    }   
    
    // GETTER/SETTER METHODS

    setName(initName) {
        this.name = initName;
    }

    getName() {
        return this.name;
    }

    getId() {
        return this.id;
    }

    /**
     * Adds an item to the end of the list.
     * 
     * @param {TodoListItem} itemToAdd Item to add to the list.
     */
    addItem(itemToAdd) {
        this.items.push(itemToAdd);
    }

    /**
     * Finds and then removes the argument from the list.
     * 
     * @param {TodoListItem} itemToRemove Item to remove from the list.
     */
    removeItem(itemToRemove) {
        let indexOfItem = -1;
        for (let i = 0; (i < this.items.length) && (indexOfItem < 0); i++) {
            if (this.items[i].id === itemToRemove.id) {
                indexOfItem = i;
            }
        }
        this.items.splice(indexOfItem, 1);
    }
    /**
     * Finds and then removes the argument from the list by itemId.
     * 
     * @param {itemId} itemToRemove Item with itemId will be removed from the list.
     */
    removeItemByID(itemId) {
        let indexOfItem = this.getIndexOfItemById(itemId);
        this.items.splice(indexOfItem, 1);
        return indexOfItem; //returns indexOfItem
    }

    /**
     * Finds the index of the argument in the list.
     * 
     * @param {TodoListItem} item Item to search for in the list.
     */
    getIndexOfItem(item) {
        for (let i = 0; i < this.items.length; i++) {
            let testItem = this.items[i];
            if (testItem === item) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Finds the index of the argument with id given in the list.
     * 
     * @param {TodoListItem} item Item to search for in the list.
     */
    getIndexOfItemById(itemId) {
        for (let i = 0; i < this.items.length; i++) {
            let testItem = this.items[i];
            if (testItem.id == itemId) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Gets and returns the item at the index location.
     * 
     * @param {Number} index Location in the list of item to return.
     */
    getItemAtIndex(index) {
        return this.items[index];
    }

    /**
     * 
     * @param {*} id 
     */
    getItemById(id){
        for (let i = 0; i < this.items.length; i++) {
            let testItem = this.items[i];
            if (testItem.id === id) {
                return testItem;
            }
        }
        return -1;
    }
    /**
     * if listitem with id given is at index 0, nothing is done.
     * @param {*} id id of listitem to move up.
     */
    moveItemUp(id){
        console.log("moving item up id"+id);
        let indexOfListItem = this.getIndexOfItemById(id);
        console.log(this.items);
        console.log(indexOfListItem);
        let moved = 0; //used to check if we actually moved the id.
        if(indexOfListItem != 0){
            let temp = this.getItemAtIndex(indexOfListItem-1); // getting item above the item we are moving up.
            console.log(temp);
            this.items[indexOfListItem-1] = this.items[indexOfListItem]; //moving item we want to move up, up by one index.
            this.items[indexOfListItem] = temp; //putting temp back in the right place.
            moved = 1;
        }
        console.log(this.items);
        return moved;
    }
    moveItemDown(id){
        console.log("moving item down id"+id);
        let indexOfListItem = this.getIndexOfItemById(id);
        console.log("b4 moving"+this.items);
        let moved = 0; //used to check if we actually moved the id.
        if(indexOfListItem != this.items.length-1){
            let temp = this.getItemAtIndex(indexOfListItem+1); // getting item below the item we are moving down.
            console.log(temp);
            this.items[indexOfListItem+1] = this.items[indexOfListItem]; //moving item we want to move down, down by one index.
            this.items[indexOfListItem] = temp; //putting temp back in the right place.
            moved = 1;
        }
        console.log(this.items);
        return moved;
    }

    /**
     * 
     * @param {*} TodoListItem item to add
     * @param {*} index index to ad too
     */
    addItemAtIndex(TodoListItem, index){
        let i = index;
        this.items.splice(i,0,TodoListItem);
    }
}