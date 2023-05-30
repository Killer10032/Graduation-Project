package com.example.demo.entity.DTO;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;


@Data
@TableName("article")
public class ArticleDTO {

    @TableId
    private Long aid;
    private String title;
    private String createTime;
    private String content;
    private String author;

}
