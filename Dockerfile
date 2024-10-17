# ----------------------------------------------------------------------
# First stage, build application using node
# ----------------------------------------------------------------------

FROM node:18-alpine AS builder

WORKDIR /usr/src/app

ARG REACT_APP_ENV=""
ENV REACT_APP_ENV=${REACT_APP_ENV}

COPY package.json package-lock.json ./
RUN npm install

COPY .eslintrc .huskyrc .prettierrc *.js ./
COPY src ./src/
COPY tsconfig.json babel.config.json typedoc.json ./

RUN npm run build

# ----------------------------------------------------------------------
# Second stage, include nginx web server and host the build
# ----------------------------------------------------------------------

FROM nginx:alpine

COPY --from=builder /usr/src/app/build/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
