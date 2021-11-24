

export function updateBanner(msg){
    let bannerMessage = $("#banner-message");
    if(bannerMessage.length === 0){
        bannerMessage = $(document.createElement("div"));
        bannerMessage.attr("id", "banner-message").addClass("title");
        bannerMessage.insertAfter($(".ut-navigation-bar-view .title"));
    }

    bannerMessage.text(msg);
}