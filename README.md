# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# HelpDesk Приложение

Современное веб-приложение для управления внутренними заявками компании с улучшенным интерфейсом и юзабилити.

## Улучшения интерфейса

### 1. Шрифты и типографика
- Внедрён шрифт Montserrat для всего приложения
- Настроены CSS-переменные для поддержки различных весов шрифта
- Улучшена читаемость текста

### 2. Главная страница
- Переработан блок выбора действий (создать/найти заявку)
- Добавлены карточки с иконками и градиентным оформлением
- Улучшены анимации переходов и наведения

### 3. Форма создания заявки
- Внедрён улучшенный степпер с анимированными переходами
- Добавлены градиентные разделители между шагами
- Улучшены иконки шагов формы с анимацией активного состояния
- Добавлены эффекты наведения для кнопок навигации
- Оптимизирована компоновка карточек

### 4. Визуальные эффекты
- Добавлены красивые градиенты для заголовков и элементов интерфейса
- Внедрены анимированные переходы между состояниями
- Улучшена цветовая схема и отзывчивость интерфейса

### 5. Отзывчивость
- Оптимизированы компоненты для мобильных и планшетных устройств
- Адаптивный дизайн для разных размеров экрана

## Используемые технологии
- React
- Material UI
- CSS3 с переменными и анимациями
- Flexbox и Grid для макетов

## Структура компонентов

### Общие компоненты
- `AnimatedButton` - Кнопка с эффектами анимации
- `AnimatedCard` - Карточка с анимированным появлением
- `AnimatedContainer` - Контейнер с настраиваемыми анимациями

### Компоненты страниц
- `HomePage` - Главная страница с выбором действий
- `TicketForm` - Форма создания заявки с шагами
