$(function() {
    $(".nav-list").hide();
    $(".navbar-bars").on("click", function() {
        $(".nav-list").toggle("slow");
    });
})