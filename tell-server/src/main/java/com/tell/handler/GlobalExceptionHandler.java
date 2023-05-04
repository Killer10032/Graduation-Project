package com.tell.handler;

import com.tell.bean.Result;
import com.tell.exception.ApiException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 全局接口异常处理
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 捕获接口ApiException异常，并返回自定义的异常信息和格式的json
     * @param e
     * @return
     */
    @ExceptionHandler(value = ApiException.class)
    @ResponseBody
    public Result jsonErrorHandler(ApiException e){
        Result result = new Result();
        result.setCode(e.getCode());
        result.setDescription(e.getMessage());
        return result;
    }
}
