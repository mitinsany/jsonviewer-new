# Makefile для проекта ExtJS с Docker

.PHONY: docker-build docker-shell sencha-generate sencha-build sencha-watch sencha-build-production

# Сборка Docker-образа
docker-build:
	docker build -t jsonviewer .

# Запуск интерактивной оболочки в контейнере
docker-shell:
	docker run --rm -it -v ${PWD}:/code -w /code jsonviewer /bin/bash

# Генерация нового приложения ExtJS
sencha-generate:
	docker run --rm -v ${PWD}:/code -w /code jsonviewer sencha -sdk /opt/ext generate app -ext -classic JsonViewer /code

# Сборка приложения (development)
sencha-build:
	docker run --rm -v ${PWD}:/code -w /code jsonviewer sencha app build

# Сборка приложения (production с включенным фреймворком)
sencha-build-production:
	docker run --rm -v ${PWD}:/code -w /code jsonviewer sencha app build production

# Запуск в режиме разработки с watch
sencha-watch:
	docker run --rm -p 1841:1841 -v ${PWD}:/code -w /code jsonviewer sencha app watch

# Алиасы для удобства
build: docker-build
shell: docker-shell
generate: sencha-generate
prod: sencha-build-production
dev: sencha-watch
