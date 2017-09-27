$(function() {
    $(".links-menu").hide();
    $(".link__button").on("click", function() {
        $(".links-menu").toggle("slow");
    });
    
})