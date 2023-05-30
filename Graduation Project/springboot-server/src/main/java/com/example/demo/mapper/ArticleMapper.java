package com.example.demo.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Article;
import com.example.demo.entity.DTO.ArticleDTO;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface ArticleMapper extends BaseMapper<Article> {

    int deleteArticleByAid(Integer aid);

    ArticleDTO getContentByAid(Integer aid);

}
