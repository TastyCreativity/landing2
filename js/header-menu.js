$(function() {
    $(".nav-list").hide();
    $(".navbar-bars").on("click", function() {
        $(".nav-list").toggle("slow");
    });
    
    $(".nav-list a").on("click", function() {
        $(".nav-list").toggle("slow");
    })
})