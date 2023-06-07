package com.yjq.programmer.service;

import com.yjq.programmer.dto.ArticleDTO;
import com.yjq.programmer.dto.PageDTO;
import com.yjq.programmer.dto.ResponseDTO;

import java.util.List;

/**
 * @author 杨杨吖
 * @QQ 823208782
 * @WX yjqi12345678
 * @create 2023-02-16 16:01
 */
public interface IArticleService {

    // 保存文章信息
    ResponseDTO<ArticleDTO> saveArticle(ArticleDTO articleDTO);

    // 分页获取文章数据
    ResponseDTO<PageDTO<ArticleDTO>> getArticleList(PageDTO<ArticleDTO> pageDTO);

    // 根据文章id获取文章信息
    ResponseDTO<ArticleDTO> getArticleById(ArticleDTO articleDTO);

    // 浏览文章详情信息
    ResponseDTO<ArticleDTO> viewArticle(ArticleDTO articleDTO);

    // 查询热门文章
    ResponseDTO<List<ArticleDTO>> getHotArticleList(ArticleDTO articleDTO);

    // 修改文章信息
    ResponseDTO<Boolean> updateArticleInfo(ArticleDTO articleDTO);

    // 删除文章信息
    ResponseDTO<Boolean> deleteArticle(ArticleDTO articleDTO);

    // 查询作者的其他文章
    ResponseDTO<List<ArticleDTO>> getAuthorArticleList(ArticleDTO articleDTO);

    // 获取文章总数
    ResponseDTO<Integer> getArticleTotal(ArticleDTO articleDTO);

    // 根据日期时间获取文章总数
    ResponseDTO<List<Integer>> getArticleTotalByDay();
}
