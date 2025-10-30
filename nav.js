/*
 * nav.js
 * Script de comportamento da navegação e zoom da imagem de perfil.
 * - Gerencia menu mobile (hamburger)
 * - Transições de página (fade)
 * - Zoom/overlay da imagem de navegação com suporte a ESC
 */

// Elementos importantes da navegação
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
let navLogo = null; // assigned on DOMContentLoaded
let overlay = null; // assigned on DOMContentLoaded

function safeSetBodyOverflow(value) {
	try { document.body.style.overflow = value; } catch (e) { /* ignore */ }
}

// Menu mobile
function openMenu() {
	if (navMenu) navMenu.classList.add('active');
	if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
	safeSetBodyOverflow('hidden');
}

function closeMenu() {
	if (navMenu) navMenu.classList.remove('active');
	if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
	safeSetBodyOverflow('');
}

function toggleMenu() {
	if (!navMenu || !hamburger) return;
	const open = navMenu.classList.toggle('active');
	hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
	safeSetBodyOverflow(open ? 'hidden' : '');
}

// Page transition (fade). Se o atributo data-no-transition estiver true, navega direto.
function pageTransition(e, href) {
	if (e) e.preventDefault();
	if (!href) return;
	if (document.body.dataset && document.body.dataset.noTransition === 'true') {
		window.location.href = href; return;
	}
	document.body.style.transition = 'opacity 0.28s ease';
	document.body.style.opacity = '0';
	setTimeout(() => { window.location.href = href; }, 280);
}

// Fade-in on load and setup dynamic elements (overlay, logo handlers)
document.addEventListener('DOMContentLoaded', () => {
	try {
		document.body.style.transition = 'opacity 0.28s ease';
		document.body.style.opacity = '1';
	} catch (e) {}

	// obter elemento do logo e criar overlay se necessário
	navLogo = document.querySelector('.nav-logo');
	overlay = document.querySelector('.nav-overlay');
	if (!overlay) {
		overlay = document.createElement('div');
		overlay.classList.add('nav-overlay');
		document.body.appendChild(overlay);
	}

	console.log('[nav.js] DOMContentLoaded: navLogo=', !!navLogo, ' overlay=', !!overlay);

	// ligar evento de clique no logo (abre/fecha zoom)
	if (navLogo) {
		navLogo.addEventListener('click', (e) => {
			e.preventDefault();
			toggleLogoZoom();
		});
		// permitir abrir via teclado (Enter / Space) quando focado
		navLogo.setAttribute('tabindex', '0');
		navLogo.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				toggleLogoZoom();
			}
		});
	}
	// Delegação: captura cliques mesmo se o elemento for coberto por outro elemento
	document.addEventListener('click', (e) => {
		const logoHit = e.target.closest('.nav-logo, .nav-logo-wrapper');
		if (logoHit) {
			e.preventDefault();
			// se navLogo não estiver definido por algum motivo, atualiza a referência
			if (!navLogo) navLogo = document.querySelector('.nav-logo');
			toggleLogoZoom();
		}
	});

	// clicar no overlay fecha o zoom
	if (overlay) {
		overlay.addEventListener('click', () => {
			closeLogoZoom();
		});
	}
});

// --- Logo zoom functions ---
function toggleLogoZoom() {
	if (!navLogo) return;
	const isExpanded = navLogo.classList.toggle('expanded');
	overlay.classList.toggle('active', isExpanded);
	safeSetBodyOverflow(isExpanded ? 'hidden' : '');
}

function closeLogoZoom() {
	if (!navLogo) return;
	navLogo.classList.remove('expanded');
	overlay.classList.remove('active');
	safeSetBodyOverflow('');
}

// Eventos
if (hamburger) {
	hamburger.addEventListener('click', (e) => {
		e.stopPropagation();
		toggleMenu();
	});
}

// NOTE: logo / overlay event listeners are attached on DOMContentLoaded above

// Fechar zoom com ESC
document.addEventListener('keydown', (e) => {
	if (e.key === 'Escape' || e.key === 'Esc') {
		closeLogoZoom();
		closeMenu();
	}
});

// Close menu on click outside
document.addEventListener('click', (e) => {
	if (navMenu && navMenu.classList.contains('active')) {
		if (navMenu.contains(e.target) || (hamburger && hamburger.contains(e.target))) return;
		closeMenu();
	}
});

// Nav links behavior: close mobile menu and perform page transition for regular links
if (navLinks && navLinks.length) {
	navLinks.forEach(link => {
		link.addEventListener('click', (e) => {
			// close mobile menu
			closeMenu();
			const href = link.getAttribute('href');
			if (!href) return;
			// allow internal anchors (handled by smooth scroll below)
			if (href.startsWith('#')) return;
			pageTransition(e, href);
		});
	});
}

// Navbar scroll behaviour (hide on scroll down, show on scroll up)
if (navbar) {
	let lastScroll = 0;
	window.addEventListener('scroll', () => {
		const st = window.pageYOffset || document.documentElement.scrollTop;
		navbar.classList[st > 50 ? 'add' : 'remove']('scrolled');
		if (st > lastScroll && st > 80) {
			navbar.style.transform = 'translateY(-110%)';
		} else {
			navbar.style.transform = 'translateY(0)';
		}
		lastScroll = st;
	});
}

// Smooth scroll for internal anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		const targetId = this.getAttribute('href');
		if (targetId === '#' || !targetId) return;
		const targetElement = document.querySelector(targetId);
		if (targetElement) {
			e.preventDefault();
			targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	});
});
