'use strict';

// Сайт — сатира. Здесь нет продаж, аналитики, сбора данных и сетевых запросов.
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Анимированное появление секций с уважением к настройкам доступности.
const reveals = $$('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -25px 0px' });
  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add('visible'));
}

// Навигация.
const menuToggle = $('#menuToggle');
const mainNav = $('#mainNav');
function closeMenu() {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Открыть меню');
}
menuToggle.addEventListener('click', () => {
  const next = menuToggle.getAttribute('aria-expanded') !== 'true';
  mainNav.classList.toggle('open', next);
  menuToggle.setAttribute('aria-expanded', String(next));
  menuToggle.setAttribute('aria-label', next ? 'Закрыть меню' : 'Открыть меню');
});
$$('.nav a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
document.addEventListener('click', (event) => {
  if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});

// Прогресс просмотра страницы — только в памяти браузера.
const progress = $('#readingProgress');
let rafPending = false;
function updateProgress() {
  const available = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${available > 0 ? Math.min(100, (window.scrollY / available) * 100) : 100}%`;
  rafPending = false;
}
window.addEventListener('scroll', () => {
  if (!rafPending) { rafPending = true; requestAnimationFrame(updateProgress); }
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

// Заведомо пародийный и прямо подписанный бесконечный таймер.
const countdown = $('#countdown');
let timeLeft = 599;
function tick() {
  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;
  countdown.textContent = [h, m, s].map((x) => String(x).padStart(2, '0')).join(':');
  timeLeft = timeLeft === 0 ? 599 : timeLeft - 1;
}
tick();
setInterval(tick, 1000);

// Воображаемые продукты открывают одно и то же честное сатирическое окно.
const dialog = $('#vipDialog');
const dialogTitle = $('#dialogTitle');
const dialogDescription = $('#dialogDescription');
const dialogReward = $('#dialogReward');
const collectReward = $('#collectReward');
const defaultTitle = 'ПОЗДРАВЛЯЕМ.<br>ТЫ ПОЧТИ <span>ПОПАЛСЯ.</span>';
const offers = {
  mind: {
    title: 'МЫШЛЕНИЕ <span>МИЛЛИАРДЕРА.</span>',
    description: 'Ты почти купил курс, в котором единственный секрет богатства — очень уверенно произносить слово «масштаб». К счастью, здесь он бесплатен и полностью выдуман.',
    reward: '+1 К ИММУНИТЕТУ К ОБЕЩАНИЯМ'
  },
  quantum: {
    title: 'КВАНТОВЫЙ <span>ПРОРЫВ!</span>',
    description: 'Открыто седьмое измерение маркетинга: в нём всегда последний шанс. Но это пародия, и ни один космический наставник не получит твои деньги.',
    reward: '+7 К ЗДРАВОМУ СМЫСЛУ'
  },
  mastermind: {
    title: 'ТЫ ВЫШЕЛ <span>НА УРОВЕНЬ.</span>',
    description: 'Мастермайнд мастермайндов одобряет твою амбицию. Настоящая суперсила — отличать красивую упаковку от реального результата.',
    reward: '+100 К РАСПОЗНАВАНИЮ ВОРОНОК'
  }
};
function openDialog(offer) {
  const data = offers[offer];
  dialogTitle.innerHTML = data?.title ?? defaultTitle;
  dialogDescription.textContent = data?.description ?? 'Всё выглядело настолько заманчиво, что ты нажал кнопку. Но этот сайт — пародия, и тут никто не попросит твои деньги.';
  dialogReward.textContent = data?.reward ?? '+100 К КРИТИЧЕСКОМУ МЫШЛЕНИЮ';
  collectReward.innerHTML = 'ЗАБРАТЬ МОРАЛЬНЫЙ БОНУС <span class="btn-arrow" aria-hidden="true">↗</span>';
  collectReward.dataset.collected = 'false';
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('modal-open');
}
$$('[data-open]').forEach((button) => button.addEventListener('click', () => openDialog(null)));
$$('[data-offer]').forEach((button) => button.addEventListener('click', () => openDialog(button.dataset.offer)));
$('#closeDialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
collectReward.addEventListener('click', () => {
  if (collectReward.dataset.collected === 'true') { dialog.close(); return; }
  collectReward.dataset.collected = 'true';
  dialogReward.textContent = 'БОНУС ПОЛУЧЕН. КОШЕЛЁК ЦЕЛ.';
  collectReward.innerHTML = 'ТЕПЕРЬ Я ВСЁ ПОНЯЛ <span class="btn-arrow" aria-hidden="true">✓</span>';
});

// Колесо предсказаний: 8 равных секторов, предсказания — юмор, не обещания.
const wheel = $('#wheel');
const spinButton = $('#spinButton');
const result = $('#fortuneResult strong');
const fortuneList = [
  'ДЖЕКПОТ: +1 повод собой гордиться.',
  'ВАЙБ: сегодня ты выглядишь на миллион воображаемых.',
  'ВАУ: близится удивительно обычный вторник.',
  'КОФЕ: богатство может подождать. Эспрессо — нет.',
  'VIP: ты принят в клуб всех, кто нажал кнопку.',
  'ХАЙП: твоя внутренняя легенда ставит лайк.',
  'ЛЮКС: роскошно ничего не делать тоже навык.',
  'МЕМ: вселенная отправила тебе смешную картинку.'
];
let rotation = 0;
let isSpinning = false;
spinButton.addEventListener('click', () => {
  if (isSpinning) return;
  isSpinning = true;
  spinButton.disabled = true;
  spinButton.style.opacity = '.75';
  spinButton.innerHTML = 'СУДЬБА ДУМАЕТ... <span class="btn-arrow" aria-hidden="true">✳</span>';
  result.textContent = 'Вселенная притворяется, что считает...';
  const choice = Math.floor(Math.random() * fortuneList.length);
  const current = ((rotation % 360) + 360) % 360;
  const desired = (360 - choice * 45) % 360;
  const adjustment = (desired - current + 360) % 360;
  rotation += 360 * 6 + adjustment;
  wheel.style.transform = `rotate(${rotation}deg)`;
  const finish = () => {
    result.textContent = fortuneList[choice];
    spinButton.disabled = false;
    spinButton.style.opacity = '';
    spinButton.innerHTML = 'ЕЩЁ РАЗОК? <span class="btn-arrow" aria-hidden="true">↗</span>';
    isSpinning = false;
  };
  window.setTimeout(finish, reduceMotion ? 100 : 5300);
});

// «Диагностика» без запроса или хранения данных.
const trustRange = $('#trustRange');
const trustNumber = $('#trustNumber');
const trustFeedback = $('#trustFeedback');
function updateTrust() {
  const value = Number(trustRange.value);
  trustNumber.textContent = value;
  trustRange.style.background = `linear-gradient(to right, #d9fc56 ${value}%, #4b4e49 ${value}%)`;
  const message = value <= 15
    ? 'Внутренний детектор ерунды работает лучше швейцарских часов.'
    : value <= 40
      ? 'Осторожен. Но красивые карточки уже делают своё дело.'
      : value <= 65
        ? '«А вдруг сработает?» — знакомая мысль. Перепроверь факты.'
        : value <= 85
          ? 'Вы почти готовы купить воздух. Но с премиальной доставкой.'
          : 'СРОЧНО: отойди от кнопки «купить» и попроси независимое мнение.';
  trustFeedback.textContent = message;
}
trustRange.addEventListener('input', updateTrust);
updateTrust();

// Постановочные уведомления с явной маркировкой.
const toast = $('#toast');
const toastText = $('#toastText');
const toastLines = [
  'Анонимус сейчас понял, что VIP здесь бесплатный.',
  'Кто-то избежал необязательной покупки века.',
  'Уровень критического мышления в комнате вырос.',
  'Воображаемый клиент только что разбогател на мем.'
];
let toastTimeout;
let toastCount = 0;
function hideToast() { toast.classList.remove('show'); }
function showToast() {
  if (dialog.open || toastCount >= 3 || document.hidden) return;
  toastText.textContent = toastLines[toastCount % toastLines.length];
  toast.classList.add('show');
  toastCount += 1;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(hideToast, 5500);
}
$('#toastClose').addEventListener('click', hideToast);
setTimeout(showToast, 8500);
setInterval(showToast, 19000);
