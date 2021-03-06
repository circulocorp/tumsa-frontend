FROM 042469170563.dkr.ecr.us-east-1.amazonaws.com/node:10-alpine
WORKDIR /app
COPY . .
RUN npm install .
ENV PORT 4005
ENV API_URL http://127.0.0.1:8888/api
EXPOSE 4005
CMD [ "npm", "start" ]