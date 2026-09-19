/* Eger Advanced Systems — interações do site
   Sem dependências. Tudo é progressivo: sem JS o conteúdo continua acessível. */
(function () {
  'use strict';

  var doc = document.documentElement;
  doc.classList.add('js');

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header: estado ao rolar ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- menu Serviços (desktop) ---------- */
  document.querySelectorAll('.nav__item').forEach(function (item) {
    var trigger = item.querySelector('.nav__trigger');
    if (!trigger) return;
    var closeTimer;
    function setOpen(open) {
      item.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    }
    trigger.addEventListener('click', function () { setOpen(trigger.getAttribute('aria-expanded') !== 'true'); });
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      item.addEventListener('mouseenter', function () { clearTimeout(closeTimer); setOpen(true); });
      item.addEventListener('mouseleave', function () { closeTimer = setTimeout(function () { setOpen(false); }, 140); });
    }
    item.addEventListener('focusout', function (e) { if (!item.contains(e.relatedTarget)) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && item.classList.contains('is-open')) { setOpen(false); trigger.focus(); }
    });
    document.addEventListener('click', function (e) { if (!item.contains(e.target)) setOpen(false); });
  });

  /* ---------- menu mobile ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  if (toggle && mobileNav) {
    var setMenu = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      mobileNav.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
      if (open) mobileNav.removeAttribute('inert'); else mobileNav.setAttribute('inert', '');
    };
    setMenu(false);
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    mobileNav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 860) setMenu(false); });
  }

  /* ---------- abas acessíveis (IDE do hero e explorador de stack) ---------- */
  function initTabs(root, opts) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return null;
    function select(i, focus) {
      tabs.forEach(function (tab, j) {
        var on = i === j;
        tab.setAttribute('aria-selected', String(on));
        tab.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(tab.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) tabs[i].focus();
      if (opts && opts.onSelect) opts.onSelect(i);
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(i); if (opts && opts.onUser) opts.onUser(); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'Home') next = 0;
        if (e.key === 'End') next = tabs.length - 1;
        if (next !== null) { e.preventDefault(); select(next, true); if (opts && opts.onUser) opts.onUser(); }
      });
    });
    return { select: select, count: tabs.length, current: function () { return tabs.findIndex(function (t) { return t.getAttribute('aria-selected') === 'true'; }); } };
  }

  /* IDE: alterna os arquivos sozinha até o usuário interagir */
  var ide = document.querySelector('[data-ide]');
  if (ide) {
    var timer = null;
    var stop = function () { clearInterval(timer); timer = null; };
    var ideTabs = initTabs(ide, { onUser: stop });
    if (ideTabs && !reduceMotion) {
      var start = function () {
        if (timer) return;
        timer = setInterval(function () { ideTabs.select((ideTabs.current() + 1) % ideTabs.count); }, 5200);
      };
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (en) { if (en.isIntersecting) start(); else stop(); });
        }, { threshold: .4 }).observe(ide);
      } else { start(); }
      ide.addEventListener('pointerenter', stop);
      ide.addEventListener('focusin', stop);
    }
  }

  document.querySelectorAll('[data-tabs]').forEach(function (root) { initTabs(root); });

  /* ---------- revelar ao rolar ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
      reveals.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- contatos protegidos ----------
     E-mail e WhatsApp não aparecem escritos no HTML: os links são montados aqui,
     o que evita a maior parte dos robôs que coletam endereços para spam.
     Para trocar os dados, altere só este objeto. */
  var CONTACT = {
    user: 'alexandreegermarques',
    domain: ['egeradvancedsystems', 'com'],
    phone: ['55', '51', '981214579'],
    waText: 'Olá! Vim pelo site da Eger Advanced Systems e gostaria de falar sobre um projeto.'
  };
  var contactEmail = CONTACT.user + '@' + CONTACT.domain.join('.');
  var whatsappUrl = 'https://wa.me/' + CONTACT.phone.join('') + '?text=' + encodeURIComponent(CONTACT.waText);

  document.querySelectorAll('[data-contact]').forEach(function (a) {
    var type = a.getAttribute('data-contact');
    if (type === 'email') {
      a.href = 'mailto:' + contactEmail;
    } else if (type === 'whatsapp') {
      a.href = whatsappUrl;
      a.target = '_blank';
      a.rel = 'noopener';
    }
  });

  /* ---------- formulário de contato ----------
     Com a chave do Web3Forms preenchida (campo access_key no index.html), a mensagem
     chega direto na caixa de e-mail cadastrada no Web3Forms, sem sair da página.
     Sem a chave, o formulário cai no modo antigo: abre o cliente de e-mail do visitante. */
  var form = document.querySelector('[data-contact-form]');
  if (form) {
    var status = form.querySelector('.form__status');
    var say = function (msg, isError) {
      if (!status) return;
      status.textContent = msg;
      status.style.color = isError ? 'var(--magenta)' : 'var(--teal)';
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.querySelector('[name="website"]').value) return; /* honeypot */
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var data = new FormData(form);
      var subject = '[' + (data.get('assunto') || 'Contato') + '] ' + (data.get('empresa') || data.get('nome'));
      var endpoint = form.getAttribute('data-endpoint');
      var key = data.get('access_key');
      var hasKey = key && key.indexOf('COLE_') !== 0;

      if (endpoint && hasKey) {
        var btn = form.querySelector('button[type="submit"]');
        data.set('subject', 'Site · ' + subject);
        data.set('replyto', data.get('email'));
        data.delete('website');
        btn.disabled = true;
        say('Enviando…');
        fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
          .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || j.success === false) throw new Error(j.message || r.status); }); })
          .then(function () { form.reset(); say('Mensagem enviada. Retornamos em breve.'); })
          .catch(function () { say('Não foi possível enviar agora. Tente pelo WhatsApp ou pelo e-mail ' + contactEmail + '.', true); })
          .then(function () { btn.disabled = false; });
        return;
      }

      var body = [
        'Nome: ' + data.get('nome'),
        'Empresa: ' + (data.get('empresa') || '-'),
        'E-mail: ' + data.get('email'),
        'Assunto: ' + data.get('assunto'),
        '',
        data.get('mensagem')
      ].join('\n');
      window.location.href = 'mailto:' + contactEmail + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      say('Abrimos seu cliente de e-mail com a mensagem pronta. Se nada abriu, escreva para ' + contactEmail + '.');
    });
  }

  /* ---------- ano no rodapé ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
