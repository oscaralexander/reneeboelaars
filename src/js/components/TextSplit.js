import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default class TextSplit {
    constructor($el) {
        this.$el = $el;
        this.content = (this.$el.innerHTML ?? '').trim();

        if (this.content !== '') {
            this.split();
            this.initListeners();
        }
    }

    initListeners() {
        if (document.fonts) {
            document.fonts.ready.then(() => {
                this.updateLineIndexes();
            });
        }

        const resizeObserver = new ResizeObserver(([entry]) => {
            this.updateLineIndexes();
        });

        resizeObserver.observe(this.$el);
    }

    split() {
        const words = this.content.split(/ (?![^<>]*>)/);
        let wordCounter = 0;
        this.$el.innerHTML = '';

        words.forEach(word => {
            const $word = document.createElement('span');
            $word.className = 'word';
            $word.style.setProperty('--word-index', String(++wordCounter));

            const $wordInner = document.createElement('span');
            $wordInner.innerHTML = word;

            $word.append($wordInner);
            this.$el.appendChild($word);
        });

        this.$el.style.setProperty('--num-words', String(wordCounter));
        this.updateLineIndexes();

        requestAnimationFrame(() => {
            ScrollTrigger.create({
                once: true,
                start: 'top bottom',
                toggleClass: 'is-textSplitVisible',
                trigger: this.$el,
            });
        });
    }

    updateLineIndexes() {
        const $$words = this.$el.querySelectorAll('.word');
        let currentOffsetTop = -1;
        let lineCounter = 0;

        $$words.forEach($word => {
            if ($word instanceof HTMLElement) {
                if ($word.offsetTop !== currentOffsetTop) {
                    currentOffsetTop = $word.offsetTop;
                    lineCounter++;
                }

                $word.style.setProperty('--line-index', String(lineCounter));
                $word.dataset.lineIndex = String(lineCounter);
            }
        });

        this.$el.style.setProperty('--num-lines', String(lineCounter));
    }
}
