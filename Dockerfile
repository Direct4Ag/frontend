# ----------------------------------------------------------------------
# Build application using node
# ----------------------------------------------------------------------

FROM node:16-alpine AS builder

WORKDIR /usr/src/app

ARG REACT_APP_ENV=""
ENV REACT_APP_ENV=${REACT_APP_ENV}

COPY package.json package-lock.json ./
RUN npm install

COPY public ./public/
COPY .eslintrc ./
COPY src ./src/
COPY tsconfig.json ./

ENV PATH="./node_modules/.bin:$PATH"

RUN npm run build

# ----------------------------------------------------------------------
# Include nginx web server and host the build
# ----------------------------------------------------------------------

FROM nginx:1.21-alpine

COPY --from=builder /usr/src/app/build/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

#CMD ["/bin/sh", "-c", "envsubst < /etc/nginx/nginx.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

