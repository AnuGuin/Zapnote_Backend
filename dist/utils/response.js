export function successResponse(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}
export function errorResponse(res, message, statusCode = 500, errors) {
    return res.status(statusCode).json({
        success: false,
        message,
        ...(errors && { errors }),
    });
}
export function paginatedResponse(res, data, page, limit, total) {
    return res.status(200).json({
        success: true,
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
}
//# sourceMappingURL=response.js.map