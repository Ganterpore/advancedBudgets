export type User = {
  id: number
  username: string
}

export type Settings = {
  id: number,
  user: number,
  theme?: 'default' | 'earthy'
}

export type Theme = {
  background: string
  primary: string
  secondary: string
  tertiary: string
  highlight: string
  text: string
  'secondary-text': string
  alert: string
  plain: string
}

export const themes: {[name: string]: Theme} = {
  default: {
    background: '#161c91',
    primary: '#4a4de7',
    secondary: '#7ea6f4',
    tertiary: '#060c81',
    highlight: '#a0e4f1',
    text: '#a0e4f1',
    'secondary-text': '#161c91',
    alert: '#ff6700',
    plain: '#3e66b4',
  },
  earthy: {
    background: '#B3907A',
    primary: '#7B5343',
    secondary: '#86A376',
    tertiary: '#B3907A',
    highlight: '#86C57C',
    text: '#86A376',
    'secondary-text': '#68423D',
    plain: '#87624A',
    alert: '#9F091B',
  }
}
