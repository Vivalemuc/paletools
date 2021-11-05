import UTLabelControl from "./UTLabelControl";

const UTLabelWithTextInputControl = function (t) {
    UTControl.call(this);
}

UTLabelWithTextInputControl.prototype._generate = function _generate() {
    if (!this.generated) {
        const container = document.createElement("div");

        this._label = new UTLabelControl();
        this._input = new UTTextInputControl();

        container.appendChild(this._label.getRootElement());
        container.appendChild(this._input.getRootElement());

        this._onInputChangeCallbacks = [];

        let self = this;

        $(this._input.getRootElement()).keydown(function (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            e.stopPropagation();

            for (let callback of self._onInputChangeCallbacks) {
                (callback)(this, e.originalEvent.code);
            }
            return false;
        });

        this.__root = container;
        this.generated = true;
    }
}

UTLabelWithTextInputControl.prototype.setLabel = function (text) {
    this._label.setText(text);
}

UTLabelWithTextInputControl.prototype.setInputId = function (value) {
    this._input.getRootElement().id = value;
}

UTLabelWithTextInputControl.prototype.setInputValue = function (value) {
    this._input.setValue(value);
}

UTLabelWithTextInputControl.prototype.onInputChange = function (callback) {
    this._onInputChangeCallbacks.push(callback);
}

UTLabelWithTextInputControl.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
    $(this.__root).remove();
    this.__root = null;
}

UTLabelWithTextInputControl.prototype.getRootElement = function () {
    return this.__root;
}

export default UTLabelWithTextInputControl;