up:
	docker-compose up -d
build:
	docker-compose build
down:
	docker-compose down
restart:
	docker-compose restart
downrestart: down up
.PHONY: buildpage
buildpage:
	docker-compose exec app sh -c 'yarn build --base=/mudae-manager/ && rm -rf /app/docs/* && mv /app/dist/* /app/docs'