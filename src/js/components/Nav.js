export default class Nav {
    constructor($el) {
        this.$el = $el;
        this.$menu = this.$el.querySelector('.js-navMenu');
        this.$menuOverlay = this.$el.querySelector('.js-navMenuOverlay');
        this.$menuToggle = this.$el.querySelector('.js-navMenuToggle');

        this.previousScrollY = null;
        this.scrollDirection = null;

        this.initListeners();
    }

    initListeners() {
        const onScroll = () => {
            if (this.previousScrollY !== null) {
                this.scrollDirection = window.scrollY > this.previousScrollY ? 'down' : 'up';
            }

            this.previousScrollY = window.scrollY;

            if (this.scrollDirection === 'down') {
                if (window.scrollY >= window.innerHeight * 0.1) {
                    // Scrolling down, hide menu bar
                    this.$el.classList.add('is-scrolled');
                }
            } else {
                // Scrolling back up, show menu bar
                this.$el.classList.remove('is-scrolled');
            }
        };

        this.$menuToggle.addEventListener('click', () => {
            const isExpanded = this.$menuToggle.getAttribute('aria-expanded') === 'false';
            this.$menuToggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        });

        this.$menuOverlay.addEventListener('click', () => {
            this.$menuToggle.setAttribute('aria-expanded', 'false');
        });

        window.addEventListener('scroll', onScroll);
        onScroll();
    }
}
