export const debug = () => {
    return process.env.MIX_APP_ENV === 'testing'
}