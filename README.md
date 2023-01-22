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

`cy:run`

`cy:run:cloud`

`cy:nokey:spec1:run`

`cy:nokey:spec2:run`

`cy:nokey:run:parallel`

`cy:spec1:run:cloud`

`cy:spec2:run:cloud`

`cy:run:parallel`

