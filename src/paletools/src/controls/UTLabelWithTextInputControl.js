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

        this.__root = container;
        this.generated = true;
    }
}

UTLabelWithTextInputControl.prototype.onKeyDown = function (callback) {
    $(this._input.getRootElement()).keydown(function (e) {
        (callback)(this);
    });
}

UTLabelWithTextInputControl.prototype.setLabelLocale = function (localeKey) {
    this._label.getRootElement().dataset.locale = localeKey;
}

UTLabelWithTextInputControl.prototype.setLabel = function (text) {
    this._label.setText(text);
}


UTLabelWithTextInputControl.prototype.setInputValue = function (value) {
    this._input.setValue(value);
}


UTLabelWithTextInputControl.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
    $(this.__root).remove();
    this.__root = null;
}

UTLabelWithTextInputControl.prototype.getRootElement = function () {
    return this.__root;
}

export default UTLabelWithTextInputControl;