# cypress-cloud-parallel-runs

# Данный проект создан для изучения возможностей параллельного запуска тестов в облаке Cypress на примере тестирования сайта "Тайный санта"

## Установка Cypress в проек

1. Скопируйте проект в локальный репозиторий
2. Выполните команды:

   `npm install cypress --save dev`

   `npm init`

   либо

   `npm update` - если это форк проекта

## Запуск тестов в различных конфигурациях

Для запуска тестов введите в командной строке `npm run` и далее через пробел одну из команд:

`cy:open`

`cy:run:test:loginregisterPages`

`cy:run:test:pwdChangeApi`

`cy:run:test:mainPage`

`cy:run:prod:loginregisterPages`

`cy:dashboard:run:test:loginregisterPages`

`cy:dashboard:run:test:pwdChangeApi`

`cy:dashboard:run:test:mainPage`

`cy:dashboard:run:prod:loginregisterPages`

`cy:dashboard:run:test:chrome`

`cy:dashboard:run:test:electron`

`cy:dashboard:run:test:all`
