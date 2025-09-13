const asyncHandler = (requestHandler) => {
  return (req, res, next) => 
    Promise.resolve(requestHandler(req, res, next))
     .catch((err) => {
       console.log(`Error in async handler:${err}`)
       res.status(err.statusCode || 500).json({
        success: false,
        message:`Failed to send data due to ${err}`
       })
    });
};

export { asyncHandler };
