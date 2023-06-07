package com.yjq.programmer.enums;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-20 11:25
 */
public enum ArticleQueryTypeEnum {

    ALL(1,"全部文章"),

    BLOG(2,"博客文章"),

    FORUM(3,"问答文章"),

    LIKE(4,"点赞文章"),

    COLLECT(5,"收藏文章"),

    ;

    Integer code;

    String desc;

    ArticleQueryTypeEnum(Integer code, String desc) {
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
