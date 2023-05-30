package com.example.demo.controller;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import com.baomidou.mybatisplus.core.toolkit.support.SFunction;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.common.Result;
import com.example.demo.entity.Article;
import com.example.demo.entity.DTO.ArticleDTO;
import com.example.demo.entity.News;
import com.example.demo.mapper.ArticleDTOMapper;
import com.example.demo.mapper.ArticleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;


@RestController
@RequestMapping("/blog")
public class ArticleController {

    @Autowired
    private ArticleDTOMapper articleDTOMapper;

    @Autowired
    private ArticleMapper articleMapper;

    @PostMapping("/article")
    public Result<?> saveArticle(@RequestBody Article article) {
        article.setAuthor("admin");
        return Result.success(articleMapper.insert(article));
    }

    @PostMapping("/update")
    public Result<?> updateArticle(@RequestBody Article article) {
        articleMapper.updateById(article);
        return Result.success();
    }

    @GetMapping("/select")
    public Result<?> selectAllArticle() {
        return Result.success(articleDTOMapper.getAllArticleInfo());
    }

    @GetMapping("/articlePage")
    public Result<?> findPage(@RequestParam(defaultValue = "1") Integer pageNum,
                              @RequestParam(defaultValue = "10") Integer pageSize,
                              @RequestParam(defaultValue = "") String search) {
        LambdaQueryWrapper<ArticleDTO> wrapper = Wrappers.<ArticleDTO>lambdaQuery();
        wrapper.orderByDesc(ArticleDTO::getCreateTime);
        if (StrUtil.isNotBlank(search)) {
            wrapper.like(ArticleDTO::getTitle, search);
        }
        Page<ArticleDTO> newsPage = articleDTOMapper.selectPage(new Page<>(pageNum, pageSize), wrapper);

        return Result.success(newsPage);
    }

    @GetMapping("/getArticleById")
    public Result<?> getArticleById(Long aid) {
        return Result.success(articleMapper.selectById(aid));
    }

    @DeleteMapping("/deleteArticle/{aid}")
    public Result<?> deleteArticle(@PathVariable Integer aid) {
        articleMapper.deleteById(aid);
        return Result.success();
    }

    @GetMapping("/getContentByAid/{aid}")
    public Result<?> getContentByAid(@PathVariable Integer aid) {
        Article articleDTO = articleMapper.selectById(aid);
        return Result.success(articleDTO);
    }

}
