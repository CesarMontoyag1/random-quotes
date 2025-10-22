# Random Quotes - instrucciones rápidas

Ejecutar local:
npm install
npm run dev
curl http://localhost:3000/quotes

Build Docker:
docker build -t cesarmon25/random-quotes:1.0.1 .
docker run --rm -p 3000:3000 -v /ruta/local/data:/usr/src/app/data cesarmon25/random-quotes:1.0.1

Publicar en Docker Hub:
docker login
docker push cesarmon25/random-quotes:1.0.1

Swarm (deploy):
docker network create --driver overlay --attachable random-quotes-net
docker volume create random-quotes-data
docker service create --name random-quotes-service --replicas 3 --publish published=3001,target=3000 --mount type=volume,source=random-quotes-data,target=/usr/src/app/data --network random-quotes-net cesarmon25/random-quotes:1.0.1

Limpiar:
docker service rm random-quotes-service
docker network rm random-quotes-net
docker volume rm random-quotes-data
docker swarm leave --force

Usar metodo Post:
ejemplo:
curl.exe --% -X POST -H "Content-Type: application/json" -d "{\"text\":\"Probando el metodo Post\",\"author\":\"Cesar\"}" http://localhost:3000/quotes
