import config from '../config/config.js';

export let UserDao;

switch (config.presistence) {
    case 'mongodb':
        UserDao = (await import('./user.dao.js')).default;
    break;
    default:
        UserDao = (await import('./user.dao.js')).default;
    break;
}