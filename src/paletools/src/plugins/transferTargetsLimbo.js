import settings from "../settings";

export default function runTransferTagetsLimbo() {
    const UTItemDomainRepository_isPileFull = UTItemDomainRepository.prototype.isPileFull;
    UTItemDomainRepository.prototype.isPileFull = function (e) {
        if (!settings.enabled) {
            UTItemDomainRepository_isPileFull.call(this, e);
            return;
        }

        var t = 0
            , i = this.pileSizes.get(e);
        switch (e) {
            case ItemPile.PURCHASED:
                t = this.unassigned.length;
                break;
            case ItemPile.TRANSFER:
                t = this.transfer.length;
                break;
            case ItemPile.INBOX:
                return 0;
            case ItemPile.CLUB:
                return !1
        }
        return (i || 0) <= t
    }
}