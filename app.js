// Responsive navigation menu
function toggleNav() {
    $(".menu").toggleClass("close");
    $(".nav-links").toggleClass("open");
    $(".nav-links li").toggleClass("fade");
}

$(".hamburger").click( function() {
    toggleNav()
});

$("#about").click(function() {
    toggleNav()
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#about-section").offset().top
    }, 500);
});
$("#work").click(function() {
    toggleNav()
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#work-section").offset().top
    }, 500);
});

$("#contact").click(function() {
    toggleNav()
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#contact-section").offset().top
    }, 500);
});


$("#aboutme").click(function() {
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#about-section").offset().top
    }, 500);
});


// Color fade effect
$(window).scroll(function() {

    // selectors
    var $window = $(window),
        $body = $('body'),
        $panel = $('.panel');

    // Change 50% earlier than scroll position so colour is there when you arrive.
    var scroll = $window.scrollTop() + ($window.height() / 2);

    $panel.each(function () {
        var $this = $(this);

        // if position is within range of this panel.
        // So position of (position of top of div <= scroll position) && (position of bottom of div > scroll position).
        // Remember we set the scroll to 50% earlier in scroll var.
        if ($this.position().top <= scroll && $this.position().top + $this.height() > scroll) {

            // Remove all classes on body with color-
            $body.removeClass(function (index, css) {
                return (css.match (/(^|\s)color-\S+/g) || []).join(' ');
            });

            // Add class of currently active div
            $body.addClass('color-' + $(this).data('color'));
        }
    });

}).scroll();


// Loading animation
$(window).on('load', function () {
    $('body').removeAttr('style');
    $(".loader-wrapper").fadeOut("slow");
});



;(function(){

    // Scroll class monitor
    var latestKnownScrollY = window.pageYOffset || 0,
        scrollDebounce = false,
        scrollListeners = [];


    function resetScrollDebounce() {

        scrollDebounce = false;

    }

    function onScroll() {

        if(scrollDebounce) {
            return;
        }

        requestAnimationFrame(resetScrollDebounce);

        latestKnownScrollY = window.pageYOffset; // No IE8

        for (var i = scrollListeners.length - 1; i >= 0; i--) {
            scrollListeners[i]({
                latestKnownScrollY
            });
        }

        scrollDebounce = true;

    }

    window.addEventListener('scroll', onScroll, { passive: false });


    class ScrollSection {

        constructor(element, { onInView, onOutOfView, onScroll, threshold = 0 }) {

            this.el = element;

            this.onInView = onInView;
            this.onOutOfView = onOutOfView;
            this.onScroll = onScroll;

            this.observer = new IntersectionObserver((e) => this.intersectionObserver(e), {
                threshold
            });
            this.observer.observe(this.el);

        }

        intersectionObserver([event]) {

            if (event.isIntersecting == true) {
                this.inView(event);
                return;
            }

            this.outOfView(event);

        }

        inView(event) {

            if(this.onInView) {
                this.onInView(event);
            }

            if(this.onScroll) {
                this.onScroll({
                    latestKnownScrollY
                });

                scrollListeners.push(this.onScroll);

            }

        }

        outOfView(event) {

            if(this.onOutOfView) {
                this.onOutOfView(event);
            }

            if(this.onScroll) {

                scrollListeners = scrollListeners.filter(item => {
                    return item != this.onScroll;
                });
            }

        }

        get relativeScrollY() {
            return latestKnownScrollY - this.el.offsetTop;
        }

    }



    // Video autoplay on scroll

    (function(){
        var videoElements = document.querySelectorAll("[data-play-on-scroll]");

        if (!videoElements) return;

        var videoReset;

        for (var i = videoElements.length - 1; i >= 0; i--) {

            videoElements[i].dataset.playOnScroll = 1;

            new ScrollSection(videoElements[i], {
                threshold: [0, 0.6, 1],
                onInView: videoInView,
                onOutOfView: videoOutOfView
            });

        }

        function videoInView(event) {

            if (videoReset) {
                clearTimeout(videoReset);
            }

            if (event.intersectionRatio > 0.6 && event.target.dataset.playOnScroll === '1') {

                event.target.play().catch(function () {
                    var fallbackImageSrc = event.target.dataset.fallbackImage;
                    if (fallbackImageSrc) {
                        var image = document.createElement("img");
                        image.src = fallbackImageSrc;
                        event.target.parentNode.replaceChild(image, event.target);
                    }
                });

                event.target.dataset.playOnScroll = 0;
            }
        }

        function videoOutOfView(event) {

            videoReset = setTimeout(() => {

                event.target.pause();
                event.target.currentTime = 0;
                event.target.dataset.playOnScroll = 1;

            }, 500);
        }

    })();

})();
;
