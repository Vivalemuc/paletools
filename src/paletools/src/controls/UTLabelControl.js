const UTLabelControl = function (t) {
    UTControl.call(this);
}

UTLabelControl.prototype._generate = function _generate() {
    if (!this.generated) {
        this._label = document.createElement("label");
        this.__root = this._label;
        this.generated = true;
    }
}

UTLabelControl.prototype.setText = function (text) {
    this._label.innerHTML = text;
}

UTLabelControl.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
    $(this.__root).remove();
    this.__root = null;
}

UTLabelControl.prototype.getRootElement = function () {
    return this.__root;
}

export default UTLabelControl;