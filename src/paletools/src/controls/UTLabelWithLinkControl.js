import UTLabelControl from "./UTLabelControl";
import UTLinkControl from "./UTLinkControl";

const UTLabelWithLinkControl = function (t) {
    UTControl.call(this);
}

UTLabelWithLinkControl.prototype._generate = function _generate() {
    if (!this.generated) {
        const container = document.createElement("div");

        this._label = new UTLabelControl();
        this._link = new UTLinkControl();

        container.appendChild(this._label.getRootElement());
        container.appendChild(this._link.getRootElement());

        let self = this;
        this.__root = container;
        this.generated = true;
    }
}

UTLabelWithLinkControl.prototype.setLabel = function (text) {
    this._label.setText(text);
}

UTLabelWithLinkControl.prototype.setLinkText = function(text){
    this._link.setText(text);
}

UTLabelWithLinkControl.prototype.setLinkUrl = function(url){
    this._link.setUrl(url);
}

UTLabelWithLinkControl.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
    $(this.__root).remove();
    this.__root = null;
}

UTLabelWithLinkControl.prototype.getRootElement = function () {
    return this.__root;
}

export default UTLabelWithLinkControl;