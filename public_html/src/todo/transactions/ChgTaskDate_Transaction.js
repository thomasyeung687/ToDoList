'use strict'

import { jsTPS_Transaction } from "../../common/jsTPS.js"

export default class ChgTaskDate_Transaction extends jsTPS_Transaction{
    constructor(initModel, listItemId, newText){
        super();
        this.model = initModel;
        this.id = listItemId;
        this.newText = newText; //newDueDate

    }
    doTransaction() {
        this.oldText = this.model.currentList.getItemById(this.id).getDueDate(); //oldDueDate
        this.model.modifyItemDueDate(this.id,this.newText);
    }
    
    undoTransaction() {
        this.model.modifyItemDueDate(this.id, this.oldText);
    }
}