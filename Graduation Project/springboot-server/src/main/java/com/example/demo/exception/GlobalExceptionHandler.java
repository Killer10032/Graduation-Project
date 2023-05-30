package com.example.demo.exception;

import com.alibaba.fastjson.JSONObject;
import com.example.demo.common.Result;
import com.example.demo.entity.Enum.ErrorEnum;
import org.apache.shiro.authz.UnauthenticatedException;
import org.apache.shiro.authz.UnauthorizedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public Result<?> customExceptionHandler(CustomException e) {
        return Result.error(e.getCode(),e.getMsg());
    }

    @ExceptionHandler(Exception.class)
    public Result<?> defaultErrorHandler(Exception e) {
        String errorPosition = "";
        //如果错误堆栈信息存在
        if (e.getStackTrace().length > 0) {
            StackTraceElement element = e.getStackTrace()[0];
            String fileName = element.getFileName() == null ? "未找到错误文件" : element.getFileName();
            int lineNumber = element.getLineNumber();
            errorPosition = fileName + ":" + lineNumber;
        }
        JSONObject errorObject = new JSONObject();
        errorObject.put("errorLocation", e.toString() + "     错误位置：" + errorPosition);
        return Result.error(ErrorEnum.E_400, errorObject);
    }

    /**
     * GET/POST请求方法错误的拦截器
     * 因为开发时可能比较常用，而且发生在进入controller之前，上面的拦截器拦截不到这个错误
     * 所以定义了这个拦截器
     * @return
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public Result<?> httpRequestMethodHandler() {
        return Result.error(ErrorEnum.E_500);
    }

    /**
     * 权限不足报错拦截
     * @return
     */
    @ExceptionHandler(UnauthorizedException.class)
    public Result<?> unauthorizedExceptionHandler() {
        return Result.error(ErrorEnum.E_502);
    }

    /**
     * 未登录报错拦截
     * 在请求需要权限的接口，而连登录都还没登录的时候，会报此错
     * @return
     */
    @ExceptionHandler(UnauthenticatedException.class)
    public Result<?> unauthenticatedException() {
        return Result.error(ErrorEnum.E_20011);
    }

}
