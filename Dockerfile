FROM node:10-alpine
WORKDIR /app
COPY . .
RUN npm install
ENV PORT 4005
EXPOSE 4005
CMD [ "npm", "start" ]