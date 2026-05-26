import '@css/style.scss';

import App from '@js/App';
import Accordion from '@js/components/Accordion';
import Equinox from '@js/components/Equinox';
import Nav from '@js/components/Nav';
import TextSplit from '@js/components/TextSplit';
import Ticker from '@js/components/Ticker';

window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a[href]').forEach(link => {
        try {
            const url = new URL(link.href);

            if (url.hostname !== window.location.hostname) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        } catch {}
    });

    window.__APP__ = new App([
        {
            component: Accordion,
            name: 'accordion',
        },
        {
            component: Equinox,
            name: 'equinox',
        },
        {
            component: Nav,
            name: 'nav',
        },
        {
            component: TextSplit,
            name: 'textSplit',
        },
        {
            component: Ticker,
            name: 'ticker',
        },
    ]);
});

// Vite HMR
if (import.meta.hot) {
    import.meta.hot.accept(() => {
        console.log('HMR');
    });
}
