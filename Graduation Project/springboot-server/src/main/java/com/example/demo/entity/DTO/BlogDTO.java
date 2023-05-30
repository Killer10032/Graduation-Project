package com.example.demo.entity.DTO;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;


@Data
@TableName("blog")
public class BlogDTO {

    @TableId
    private Integer articleId;
    private Integer userId;
    private Integer sortId;
    private String cover;
    private String title;
    private String intro;
    private String content;
    private String copyFrom;
    private Integer hits;
    private Integer LikedNum;
    private Integer post_num;
    private Integer onTop;
    private String createTime;


}
