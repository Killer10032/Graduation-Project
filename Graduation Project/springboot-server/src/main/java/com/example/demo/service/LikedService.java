package com.example.demo.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.example.demo.entity.BlogLike;


import java.util.List;


public interface LikedService {

    /**
     * 保存点赞记录
     * @param blogLike
     * @return
     */
    void save(BlogLike blogLike);

    /**
     * 批量保存或修改
     * @param list
     * @return
     */
    void saveAll(List<BlogLike> list);

    /**
     * 根据被点赞文章的id查询点赞列表
     * @param articleId
     * @return
     */
    Page<BlogLike> getLikedListByLikedArticle(Integer articleId);

    /**
     * 根据用户id查询点赞列表
     * @param userId
     * @return
     */
    Page<BlogLike> getLikedListByLikedUserId(Integer userId);

    /**
     * 通过文章id和用户id查询是否存在点赞记录
     * @param articleId
     * @param userId
     * @return
     */
    BlogLike getByLikedArticleIdAndUserId(Integer articleId, Integer userId);

    /**
     * 将Redis里的点赞数据存入数据库中
     */
    void transLikedFromRedis2DB();

    /**
     * 将Redis中的点赞数量数据存入数据库
     */
    void transLikedCountFromRedis2DB();
}
