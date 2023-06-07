package com.yjq.programmer.enums;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-17 9:38
 */
public enum  ArticleStateEnum {

    WAIT(1,"待审核"),

    NOT_SOLVE(2,"未解决"),

    SOLVE(3,"已解决"),

    SUCCESS(4,"审核通过"),

    FAIL(5,"审核不通过"),

    DRAFT(6,"草稿"),

    ;

    Integer code;

    String desc;

    ArticleStateEnum(Integer code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }
}
