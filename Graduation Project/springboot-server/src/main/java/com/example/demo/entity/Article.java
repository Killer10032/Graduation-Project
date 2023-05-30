package com.example.demo.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

@Data
public class Article {

    @TableId(type = IdType.AUTO)
    private Long aid;
    private String author;
    private String title;
    private String content;
    private String createTime;
}
