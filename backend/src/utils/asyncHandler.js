/**
 * Async Handler Wrapper
 * Eliminates the need for try-catch blocks in async route handlers
 * Automatically passes errors to the error handling middleware
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export default asyncHandler;
