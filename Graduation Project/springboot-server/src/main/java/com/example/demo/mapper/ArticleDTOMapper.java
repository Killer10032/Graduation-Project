package com.example.demo.mapper;

import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.demo.entity.Article;
import com.example.demo.entity.DTO.ArticleDTO;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleDTOMapper extends BaseMapper<ArticleDTO> {

    List<ArticleDTO> getAllArticleInfo();
}
