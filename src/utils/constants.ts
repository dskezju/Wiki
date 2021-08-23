let login_url = process.env.DEV ? 'http://localhost:8000/login': "",
      back_url = process.env.DEV ? 'http://localhost:8080' : '',
      base_url = process.env.BASE_URL

export const VUE_APP_LOGIN_URL = login_url + '?redirect=' + base_url
export const VUE_APP_BACK_URL = back_url
