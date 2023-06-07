package com.yjq.programmer.controller.web;

import com.yjq.programmer.dto.ArticleDTO;
import com.yjq.programmer.dto.PageDTO;
import com.yjq.programmer.dto.ResponseDTO;
import com.yjq.programmer.service.IArticleService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;
import java.util.List;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-16 16:00
 */
@RestController("WebArticleController")
@RequestMapping("/web/article")
public class ArticleController {

    @Resource
    private IArticleService articleService;

    /**
     * 保存文章信息
     * @param articleDTO
     * @return
     */
    @PostMapping("/save")
    public ResponseDTO<ArticleDTO> saveArticle(@RequestBody ArticleDTO articleDTO){
        return articleService.saveArticle(articleDTO);
    }

    /**
     * 分页获取文章数据
     * @param pageDTO
     * @return
     */
    @PostMapping("/list")
    public ResponseDTO<PageDTO<ArticleDTO>> getArticleList(@RequestBody PageDTO<ArticleDTO> pageDTO){
        return articleService.getArticleList(pageDTO);
    }

    /**
     * 浏览文章详情信息
     * @param articleDTO
     * @return
     */
    @PostMapping("/view")
    public ResponseDTO<ArticleDTO> viewArticle(@RequestBody ArticleDTO articleDTO){
        return articleService.viewArticle(articleDTO);
    }

    /**
     * 获取文章详情信息
     * @param articleDTO
     * @return
     */
    @PostMapping("/get")
    public ResponseDTO<ArticleDTO> getArticleDetail(@RequestBody ArticleDTO articleDTO){
        return articleService.getArticleById(articleDTO);
    }

    /**
     * 查询热门文章
     * @param articleDTO
     * @return
     */
    @PostMapping("/hot")
    public ResponseDTO<List<ArticleDTO>> getHotArticleList(@RequestBody ArticleDTO articleDTO){
        return articleService.getHotArticleList(articleDTO);
    }

    /**
     * 查询作者的其他文章
     * @param articleDTO
     * @return
     */
    @PostMapping("/author")
    public ResponseDTO<List<ArticleDTO>> getAuthorArticleList(@RequestBody ArticleDTO articleDTO){
        return articleService.getAuthorArticleList(articleDTO);
    }

}
