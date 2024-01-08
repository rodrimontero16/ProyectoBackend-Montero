import EnumsError from "../utils/EnumsError.js"

export default (error, req, res, next) => {
    switch (error.code) {
        case EnumsError.ROUTING_ERROR:
        case EnumsError.DATA_BASE_ERROR:
            res.status(500).json({ status: 'error', message: error.message})
            break;
        case EnumsError.INVALID_TYPE_ERROR:
        case EnumsError.INVALID_PARAMS_ERROR:
            res.status(400).json({ status: 'error', message: error.message})
        break;
        default:
            res.status(500).json({ status: 'error', message: 'Error desconocido'})
            break;
    }
    console.error(error.cause);
}