import UTLabelControl from "./UTLabelControl";

const UTLabelWithToggleControl = function (t) {
    UTControl.call(this);
}

UTLabelWithToggleControl.prototype._generate = function _generate() {
    if (!this.generated) {
        const container = document.createElement("div");

        this._label = new UTLabelControl();
        this._toggle = new UTToggleControl();

        container.appendChild(this._label.getRootElement());
        container.appendChild(this._toggle.getRootElement());

        this._toggle.init();
        this._toggle.addTarget(this, this._onToggled, EventType.TAP);


        this.__root = container;
        this.generated = true;
    }
}

UTLabelWithToggleControl.prototype.setLabelLocale = function(localeKey){
    this._label.getRootElement().dataset.locale = localeKey;
}

UTLabelWithToggleControl.prototype.setLabel = function (text) {
    this._label.setText(text);
}

UTLabelWithToggleControl.prototype.setToggleId = function (value) {
    this._toggle.getRootElement().id = value;
}

UTLabelWithToggleControl.prototype.toggle = function () {
    this._toggle.toggle();
    this._toggle._triggerActions(EventType.TAP, {
        toggleState: this._toggle.getToggleState()
    });
}

UTLabelWithToggleControl.prototype.getToggleState = function(){
    return this._toggle.getToggleState();
}

UTLabelWithToggleControl.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
    $(this.__root).remove();
    this.__root = null;
}

UTLabelWithToggleControl.prototype._onToggled = function (elem, eventType, value) {
    if (this.onToggle) {
        (this.onToggle)(elem, eventType, value);
    }
}

UTLabelWithToggleControl.prototype.getRootElement = function () {
    return this.__root;
}

export default UTLabelWithToggleControl;