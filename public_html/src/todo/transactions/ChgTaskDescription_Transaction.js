'use strict'

import { jsTPS_Transaction } from "../../common/jsTPS.js"

export default class ChgTaskDescription_Transaction extends jsTPS_Transaction{
    constructor(initModel, listItemId, newText){
        super();
        this.model = initModel;
        this.id = listItemId;
        this.newText = newText;

    }
    doTransaction() {
        this.oldText = this.model.currentList.getItemById(this.id).getDescription();
        this.model.modifyItemDescription(this.id,this.newText);
    }
    
    undoTransaction() {
        this.model.modifyItemDescription(this.id, this.oldText);
    }
}