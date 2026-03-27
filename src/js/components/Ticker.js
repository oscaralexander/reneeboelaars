import { gsap } from 'gsap';

export default class Ticker {
    constructor($el) {
        this.$el = $el;
        this.$inner = this.$el.querySelector('.js-tickerInner');
        this.dragStartX = 0;
        this.inertia = 0.1;
        this.isDragging = false;
        this.isVisible = true;
        this.moveToX = 0;
        this.nodes = [];
        this.nodeWidthFirst = 0;
        this.nodeWidthLast = 0;
        this.nodeWidthMax = 0;
        this.onDragRef = this.onDrag.bind(this);
        this.onDragStopRef = this.onDragStop.bind(this);
        this.translateX = 0;

        // Settings
        this.direction = this.$el.dataset.tickerDirection === 'right' ? 1 : -1;
        this.isPauseOnHover = this.$el.dataset.tickerPauseOnHover !== 'false';
        this.speed = parseFloat(this.$el.dataset.tickerSpeed ?? '0.5');
        this.speedRestore = this.speed;

        if (this.$inner && this.$inner.childNodes.length) {
            // Remove all non-element nodes
            this.nodes = Array.from(this.$inner.childNodes).filter($node => $node.nodeType === Node.ELEMENT_NODE);
            this.$inner.innerHTML = '';
            this.$inner.append(...this.nodes);

            this.initListeners();
            this.update();
            this.animate();
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        if (!this.isVisible) {
            return;
        }

        if (!this.isDragging) {
            this.moveToX += this.speed * this.direction;
        }

        this.translateX += (this.moveToX - this.translateX) * this.inertia;

        if (this.translateX > 0) {
            this.translateX -= this.nodeWidthLast;
            this.moveToX -= this.nodeWidthLast;
            this.dragStartX += this.nodeWidthLast;

            if (this.$inner.lastChild) {
                this.$inner.insertBefore(this.$inner.lastChild, this.$inner.firstChild);
                this.updateNodeWidths();
            }
        }

        if (this.translateX < -this.nodeWidthFirst) {
            this.translateX += this.nodeWidthFirst;
            this.moveToX += this.nodeWidthFirst;
            this.dragStartX -= this.nodeWidthFirst;

            if (this.$inner.firstChild) {
                this.$inner.appendChild(this.$inner.firstChild);
                this.updateNodeWidths();
            }
        }

        this.$inner.style.transform = `translateX(${this.translateX}px)`;
    }

    initListeners() {
        // Intersection observer
        const intersectionObserver = new IntersectionObserver(([entry]) => {
            this.isVisible = entry.isIntersecting;
        });
        intersectionObserver.observe(this.$el);

        // Resize observer
        const resizeObserver = new ResizeObserver(() => {
            this.update();
        });
        resizeObserver.observe(this.$el);

        this.$el.querySelectorAll('img').forEach($img => {
            $img.addEventListener('load', () => {
                this.update();
            });
        });

        window.addEventListener('load', () => {
            this.update();
        });

        this.$el.addEventListener('pointerdown', e => {
            this.onDragStart(e);
            document.addEventListener('pointermove', this.onDragRef, false);
            document.addEventListener('pointercancel', this.onDragStopRef, false);
            document.addEventListener('pointerup', this.onDragStopRef, false);
        });

        if (this.isPauseOnHover) {
            this.$el.addEventListener('mouseout', () =>
                gsap.to(this, {
                    duration: 1,
                    ease: 'power2.out',
                    speed: this.speedRestore,
                })
            );

            this.$el.addEventListener('mouseover', () =>
                gsap.to(this, {
                    duration: 1,
                    ease: 'power2.out',
                    speed: 0,
                })
            );
        }
    }

    onDrag(e) {
        if (this.dragStartX) {
            this.moveToX = e.pageX - this.dragStartX;
        }
    }

    onDragStart(e) {
        this.$el.classList.add('is-grabbing');
        this.dragStartX = e.pageX - this.translateX;
        this.isDragging = true;
    }

    onDragStop() {
        this.$el.classList.remove('is-grabbing');
        this.isDragging = false;

        document.removeEventListener('pointermove', this.onDragRef, false);
        document.removeEventListener('pointercancel', this.onDragStopRef, false);
        document.removeEventListener('pointerup', this.onDragStopRef, false);
    }

    update() {
        this.$inner.innerHTML = '';
        this.$inner.append(...this.nodes);

        requestAnimationFrame(() => {
            this.updateNodeWidths();

            const minWidth = this.$el.offsetWidth + this.nodeWidthMax;
            const width = this.$inner.offsetWidth;
            const repeat = Math.ceil(minWidth / width) - 1;

            for (let i = 0; i < repeat; i++) {
                this.nodes.forEach($node => {
                    this.$inner.appendChild($node.cloneNode(true));
                });
            }
        });
    }

    updateNodeWidths() {
        let maxWidth = 0;

        Array.from(this.$inner.children).forEach($node => {
            if ($node instanceof HTMLElement) {
                maxWidth = Math.max(maxWidth, $node.offsetWidth);
            }
        });

        this.nodeWidthMax = maxWidth;

        if (this.$inner.firstChild instanceof HTMLElement) {
            this.nodeWidthFirst = this.$inner.firstChild.offsetWidth;
        }

        if (this.$inner.lastChild instanceof HTMLElement) {
            this.nodeWidthLast = this.$inner.lastChild.offsetWidth;
        }
    }
}
