package com.example.demo.entity.Enum;

import lombok.Getter;


@Getter
public enum LikeStatusEnum {

    LIKE(1, "点赞"),
    UNLIKE(0, "取消点赞/未点赞"),
    ;

    private Integer code;
    private String msg;

    LikeStatusEnum(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }
}
