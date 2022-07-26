# OurSpace

## Project setup
1. Install all dependencies
```
yarn install
```
2. Provision the environment variables
```
cp .env.example .env
```
In all URLs, always use the `/` at the end of the URL. This is to avoid problems with the trailing slash. For example, `https://ourspace.ng/` should be the base URL, not `https://ourspace.ng`.

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
