// Site behaviour: nav dropdown, mobile menu, footer year, solutions filter, contact form.

document.addEventListener('DOMContentLoaded', () => {
    initDropdowns();
    initMobileMenu();
    initFooterYear();
    initSolutionsFilter();
    initContactForm();
});

function initDropdowns() {
    document.querySelectorAll('[data-dropdown]').forEach((dropdown) => {
        const toggle = dropdown.querySelector('[data-dropdown-toggle]');
        const menu = dropdown.querySelector('[data-dropdown-menu]');
        const setOpen = (open) => {
            menu.hidden = !open;
            toggle.setAttribute('aria-expanded', String(open));
        };

        toggle.addEventListener('click', () => setOpen(menu.hidden));
        document.addEventListener('click', (event) => {
            if (!dropdown.contains(event.target)) setOpen(false);
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') setOpen(false);
        });
    });
}

function initMobileMenu() {
    const toggle = document.querySelector('[data-mobile-toggle]');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    const openIcon = toggle.querySelector('[data-icon-open]');
    const closeIcon = toggle.querySelector('[data-icon-close]');

    toggle.addEventListener('click', () => {
        const open = menu.hidden;
        menu.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
        openIcon.style.display = open ? 'none' : '';
        closeIcon.style.display = open ? '' : 'none';
    });
}

function initFooterYear() {
    document.querySelectorAll('[data-year]').forEach((el) => {
        el.textContent = new Date().getFullYear();
    });
}

// Filters solution cards by industry; `?industry=` links keep working.
function initSolutionsFilter() {
    const links = document.querySelectorAll('[data-filter]');
    if (!links.length) return;

    const activeClasses = ['border-electric-blue', 'text-electric-blue'];
    const cards = document.querySelectorAll('[data-industry]');

    const apply = (industry) => {
        links.forEach((link) => {
            link.classList.toggle(activeClasses[0], link.dataset.filter === industry);
            link.classList.toggle(activeClasses[1], link.dataset.filter === industry);
        });
        cards.forEach((card) => {
            card.hidden = industry !== '' && card.dataset.industry !== industry;
        });
    };

    links.forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            history.pushState(null, '', link.href);
            apply(link.dataset.filter);
        });
    });

    const fromUrl = () => apply(new URLSearchParams(location.search).get('industry') || '');
    window.addEventListener('popstate', fromUrl);
    fromUrl();
}

// Sends the contact form to Web3Forms (emails the submission to the site inbox).
function initContactForm() {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;

    const success = document.querySelector('[data-form-success]');
    const failure = document.querySelector('[data-form-failure]');
    const button = form.querySelector('[data-submit]');

    const rules = {
        name: (v) => (!v ? 'Please enter your name.' : v.length > 200 ? 'The name may not be greater than 200 characters.' : ''),
        email: (v) => (!v ? 'Please enter your email address.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Please enter a valid email address.' : ''),
        company: (v) => (v.length > 200 ? 'The company may not be greater than 200 characters.' : ''),
        phone: (v) => (v.length > 50 ? 'The phone may not be greater than 50 characters.' : ''),
        message: (v) => (!v ? 'Please enter a message.' : v.length < 10 ? 'Your message must be at least 10 characters.' : ''),
    };

    const validate = () => {
        let valid = true;
        Object.entries(rules).forEach(([field, rule]) => {
            const error = rule(form.elements[field].value.trim());
            const el = form.querySelector(`[data-error-for="${field}"]`);
            el.textContent = error;
            el.hidden = !error;
            if (error) valid = false;
        });
        return valid;
    };

    const setBusy = (busy) => {
        button.disabled = busy;
        button.classList.toggle('opacity-50', busy);
        button.classList.toggle('cursor-not-allowed', busy);
        button.querySelector('[data-label-idle]').hidden = busy;
        button.querySelector('[data-label-busy]').hidden = !busy;
    };

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        success.hidden = true;
        failure.hidden = true;
        if (!validate()) return;

        setBusy(true);
        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body: new FormData(form),
            });
            const result = await response.json();
            if (!response.ok || !result.success) throw new Error(result.message);
            form.reset();
            success.hidden = false;
        } catch (error) {
            console.error('Contact form submission failed:', error);
            failure.hidden = false;
        } finally {
            setBusy(false);
        }
    });
}
