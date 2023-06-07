package com.yjq.programmer.dto;

import com.yjq.programmer.annotation.ValidateEntity;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-16 10:59
 */
public class CategoryDTO {

    private String id;

    @ValidateEntity(required=true,requiredMaxLength=true,requiredMinLength=true,maxLength=16,minLength=1,errorRequiredMsg="文章分类名称不能为空！",errorMaxLengthMsg="文章分类名称长度不能大于16！",errorMinLengthMsg="文章分类名称不能为空！")
    private String name;

    @ValidateEntity(required=true,requiredMaxValue=true,requiredMinValue=true,maxValue=10000,minValue=0,errorRequiredMsg="文章分类排序不能为空！",errorMaxValueMsg="文章分类排序不能大于10000！",errorMinValueMsg="文章分类排序不能小于0！")
    private Integer sort;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", id=").append(id);
        sb.append(", name=").append(name);
        sb.append(", sort=").append(sort);
        sb.append("]");
        return sb.toString();
    }
}
