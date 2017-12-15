const env = process.env.NODE_ENV === 'dev' ? require('./env.dev') : require('./env.prod')

export default env
