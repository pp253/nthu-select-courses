# nthu-select-courses

I'm working on `dev` branch. Please go there and get the latest commits.
The goal of the NTHU SELECT COURSES is to make courses selecting an easy, intuitive, and pleasure journey.

The server side repository is at [nthu-select-course-server](https://github.com/pp253/nthu-select-courses-server)

## Architecture

- secret (ignored)
  - private.key
  - certificate.crt
- src
  - api
    - select-course.js
    - scores.js
  - lib
- routes
  - index.js
- public (ignored)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

## Main Dependencies

- Vue
- Vuex
- Vuetify
- vue-i18n
- vue-router
- vuedraggable
- axios
- chart.js

## Main Dev Dependencies

- Babel
- Webpack
