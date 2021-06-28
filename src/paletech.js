(function(){
    let boughtFor = parseInt(prompt('Precio de compra'));
    let tech = parseInt(boughtFor + ((Math.floor(boughtFor / 10000) - 1) * 1000) + 3500);

    alert(tech);
})();