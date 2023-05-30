package com.example.demo.exception;

import com.example.demo.entity.Enum.ErrorEnum;
import lombok.Getter;


@Getter
public class CustomException extends RuntimeException{

    private String code;
    private String msg;

    public CustomException(ErrorEnum errorEnum) {
        this.code = errorEnum.getErrorCode();
        this.msg = errorEnum.getErrorMsg();
    }


}
