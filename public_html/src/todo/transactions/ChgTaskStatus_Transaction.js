'use strict'

import { jsTPS_Transaction } from "../../common/jsTPS.js"

export default class ChgTaskStatus_Transaction extends jsTPS_Transaction{
    constructor(initModel, listItemId, newText){
        super();
        this.model = initModel;
        this.id = listItemId;
        this.newText = newText; //newStatus

    }
    doTransaction() {
        this.oldText = this.model.currentList.getItemById(this.id).getStatus(); //oldStatus
        this.model.modifyItemStatus(this.id,this.newText);
    }
    
    undoTransaction() {
        this.model.modifyItemStatus(this.id, this.oldText);
    }
}