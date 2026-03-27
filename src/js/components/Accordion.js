export default class Accordion {
    constructor($el) {
        this.$el = $el;
        this.initListeners();
    }

    initListeners() {
        this.$$toggle = this.$el.querySelectorAll('.js-accordionItemToggle');

        this.$$toggle.forEach($toggle => {
            $toggle.addEventListener('click', this.onToggle.bind(this), false);
        });
    }

    onToggle(e) {
        this.$$toggle.forEach($toggle => {
            if ($toggle === e.currentTarget) {
                if ($toggle.getAttribute('aria-expanded') == 'true') {
                    $toggle.setAttribute('aria-expanded', false);
                } else {
                    $toggle.setAttribute('aria-expanded', true);
                }
            } else {
                $toggle.setAttribute('aria-expanded', false);
            }
        });
    }
}
