MONGO_URL_DEV = 'mongodb://127.0.0.1:27017'
MONGO_URL_CICD = 'mongodb://db'
all:
	cd ./server && MONGO_URL=$(MONGO_URL_DEV) npm run start
	cd ./ui && npm run dev

backend:
	cd ./server && MONGO_URL=$(MONGO_URL_DEV) npm run start

frontend:
	cd ./ui && npm run dev

dev-setup:
	cd ./server && MONGO_URL=$(MONGO_URL_DEV) npm run setup 

kubernetes-first:
	docker build -t numscore-server ./server
	docker build -t numscore-ui ./ui
	kubectl create -f k8s/

kubernetes-full:
	docker build -t numscore-server ./server
	docker build -t numscore-ui ./ui
	kubectl delete -f k8s/
	kubectl create -f k8s/