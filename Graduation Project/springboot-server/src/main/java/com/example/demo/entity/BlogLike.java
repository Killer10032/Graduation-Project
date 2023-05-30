package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.example.demo.entity.Enum.LikeStatusEnum;
import lombok.Data;


@Data
@TableName("blog_like")
public class BlogLike {

    @TableId(type = IdType.AUTO)
    private Integer id;
    private Integer userId;
    private Integer articleId;
    private Integer status = LikeStatusEnum.UNLIKE.getCode();

    public BlogLike() {}

    public BlogLike(Integer userId, Integer articleId, Integer status) {
        this.userId = userId;
        this.articleId = articleId;
        this.status = status;
    }
}
