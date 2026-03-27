import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default class Equinox {
    constructor($el) {
        this.$el = $el;
        this.$scroller = $el.closest('.js-equinoxScroller') ?? window;
        this.isInitialized = false;
        this.isOnce = $el.dataset.hasOwnProperty('equinoxOnce');

        this.init();
        this.initListeners();
    }

    init() {
        let horizontal = false;

        if (this.$scroller instanceof HTMLElement) {
            horizontal = this.$scroller.scrollWidth > this.$scroller.offsetWidth;
        }

        ScrollTrigger.create({
            horizontal,
            once: this.isOnce,
            onToggle: self => {
                const $el = self.trigger;
                $el.classList.toggle('is-visible', self.isActive);

                if (self.isActive) {
                    $el.classList.add('is-visibleOnce');
                }

                $el.dispatchEvent(
                    new CustomEvent('equinox:toggle', {
                        detail: {
                            isVisible: self.isActive,
                        },
                    })
                );
            },
            onUpdate: self => {
                if (self.isActive) {
                    const $el = self.trigger;
                    const equinox = self.progress * -2 + 1;

                    $el.style.setProperty('--equinox', String(equinox));
                    $el.style.setProperty('--equinox-abs', String(Math.abs(equinox)));
                    $el.style.setProperty('--equinox-pos', String(self.progress));

                    if (!this.isInitialized) {
                        $el.classList.add('is-equinoxSet');
                        this.isInitialized = true;
                    }
                }
            },
            scroller: this.$scroller,
            trigger: this.$el,
        });
    }

    initListeners() {
        window.addEventListener('load', () => {
            ScrollTrigger.refresh(true);
        });
    }
}
