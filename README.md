# cypress-cloud-parallel-runs

# Данный проект создан для изучения возможностей параллельного запуска тестов в облаке Cypress на примере тестирования сайта "Тайный санта"

## Установка Cypress в проек

1. Скопируйте проект в локальный репозиторий
2. Выполните команды:

   `npm install cypress --save dev`

   `npm init`

   либо

   `npm update` - если это форк проекта

3. Установите Jenkins:

- с сайта jenkins.io\downloads скачать последнюю стабильную сборку в виде war-файла

- положить jenkins.war в корень проекта

- запустить в командной строке (терминале) команду:

`java -jar jenkins.war -httpsPort=8080 --enable-future-java`

- в ходе установки сохранить пароль к админской учетке и путь к файлу, где он хранится

- перейти на localhost:8080 и сконфигурить проект, задав его имя, директорию для запуска и шаги сборки shell-командами

4. Установите плагин для генерации отчетов о тестах в xml-формате для загрузки в проект Jira (плагин Xray):

   'npm install mocha-junit-reporter --save-dev'

   В приложении Xray сгенерируйте API ключи для аутентификации, запишите их в credentials.json (внесите его в .gitignore)

   Для получения токена выполните в командной строке:

   'curl -H "Content-Type: application/json" -X POST --data @"credentials.json" https://xray.cloud.getxray.app/api/v2/authenticate'

## Запуск тестов в различных конфигурациях

Для запуска тестов введите в командной строке `npm run` и далее через пробел одну из команд (см. package.json):

`cy:open`

`cy:run`

`cy:run:cloud`

`cy:nokey:spec1:run`

`cy:nokey:spec2:run`

`cy:nokey:run:parallel`

`cy:spec1:run:cloud`

`cy:spec2:run:cloud`

`cy:run:parallel`

