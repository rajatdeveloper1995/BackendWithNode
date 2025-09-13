class ApiErrorHandler extends Error {
   constructor(status,error,stack,message="something went wrong"){

    super(message)
    this.status = status,
    this.error = error,
    this.success= false,
    this.data = null
    

    if(stack){
    this.stack = stack
    }else{
      Error.captureStackTrace(this, this.constructor)
    }

   }
}

export {ApiErrorHandler}