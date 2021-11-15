export function notifySuccess(msg) {
    services.Notification.queue([msg, UINotificationType.POSITIVE]);
}

export function notifyNeutral(msg) {
    services.Notification.queue([msg, UINotificationType.NEUTRAL]);
}

export function notifyFailure(msg) {
    services.Notification.queue([msg, UINotificationType.NEGATIVE]);
}