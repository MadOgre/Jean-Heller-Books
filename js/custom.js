/*global $, jQuery, alert, angular*/
(function () {
    'use strict';
    $(document).ready(function () {
        function showMorePictures() {
            var testimonialsDiv = $("#fourth-div"),
                button = $("#gallery-expander div"),
                galleryContents = $("#gallery-contents");
            if (button.hasClass("up-arrow")) {
                testimonialsDiv.animate({"max-height": "450px"}, 600, function () {
                    button.removeClass("up-arrow");
                    button.addClass("down-arrow");
                    $("#show-more-pictures-button").show();
                });
            } else {
                $("#show-more-pictures-button").hide();

                testimonialsDiv.animate({"max-height": galleryContents.height() + "px"}, 600, function () {
                    button.removeClass("down-arrow");
                    button.addClass("up-arrow");
                });
            }
        }
        $("#testimonials-expander").click(function () {
            var testimonialsDiv = $("#second-div"),
                button = $("#testimonials-expander div"),
                testimonialsContents = $("#second-div-contents");
            if (button.hasClass("up-arrow")) {
                testimonialsDiv.css("maxHeight", testimonialsDiv.css("height"));
                testimonialsDiv.animate({"max-height": "250px"}, 600, function () {
                    button.removeClass("up-arrow");
                    button.addClass("down-arrow");
                });
            } else {
                testimonialsDiv.animate({"max-height": testimonialsContents.height() + "px"}, 600, function () {

                    button.removeClass("down-arrow");
                    button.addClass("up-arrow");
                });
            }
        });
        $("#gallery-expander").click(showMorePictures);
        $("#show-more-pictures-button").click(showMorePictures);
        $("nav ul li a[href^='#']").on("click", function (e) {
            e.preventDefault();
            $("#bs-navbar-collapse-1").collapse('hide');
            var hash = this.hash;
            $("html, body").animate({
                scrollTop: $(hash).offset().top - 90
            }, 300, function () {
                document.location.hash = hash;
            });
        });
        $('#contactModal').on('show.bs.modal', function (e) {
            $("#bs-navbar-collapse-1").collapse('hide');
            $(".follow-button").parent().removeClass("active");
        });
        $('#contactModal').on('hidden.bs.modal', function (e) {
            $("#bs-navbar-collapse-1").collapse('hide');
            $(".follow-button").parent().removeClass("active");
        });
        $(".contact-button").focusin(function () {
            $(this).blur();
        });
        $('[data-toggle="tooltip"]').tooltip();
    });
}());
